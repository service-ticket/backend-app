const VerifyCode = require('../../model/userOrder');
const generateToken = require('../../utils/generateToken'); // ajusta la ruta

const verifyCode = async (req, res) => {
  try {
    const { correo, codigoAutenticacion } = req.body;

    if (!correo || !codigoAutenticacion) {
      return res.status(400).json({ message: 'Correo y código son requeridos' });
    }

    // Buscar usuario que tenga ese código válido y no usado
    const auth = await VerifyCode.findOne({ 
      correo, 
      'codigoAutenticacion.code': codigoAutenticacion,
      'codigoAutenticacion.used': false
    });

    if (!auth) return res.status(400).json({ message: 'Código inválido' });

    // Revisar expiración
    if (auth.codigoAutenticacion.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Código expirado' });
    }

    // Marcar código como usado
    auth.codigoAutenticacion.used = true;
    await auth.save();

    // 🔹 Generar token usando tu función
    const token = generateToken({ correo: auth.correo });

    // Enviar token al frontend
     res.json({
      message: 'Código válido',
      token,
      user: {
        id: auth._id,
        nombre: auth.nombre,
        correo: auth.correo,
        idPerfil: auth.idPerfil,
        telefonos: auth.telefonos,
        pedidos: auth.pedidos        
      }
    });
  } catch (err) {
    console.error('Error en verifyCode:', err);
    res.status(500).json({ message: 'Error al verificar el código', error: err.message });
  }
};

module.exports = verifyCode;
