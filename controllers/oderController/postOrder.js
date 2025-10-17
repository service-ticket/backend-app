const User = require('../../model/userOrder');
const sendOrderEmail = require('./sendOrderEmail'); // 👈 función externa para enviar correo

// Crear o inyectar una orden
const crearPedido = async (req, res) => {
  try {
    const { correo, nombre, idPerfil, telefonos, direcciones, pedido } = req.body;

    if (!correo || !pedido) {
      return res.status(400).json({ error: 'Correo y datos del pedido son obligatorios' });
    }

    // Buscar si el usuario ya existe
    let usuario = await User.findOne({ correo });

    if (!usuario) {
      // Crear usuario nuevo si no existe
      usuario = new User({
        correo,        
        nombre: nombre || 'Sin nombre',
        idPerfil: idPerfil,
        telefonos: telefonos || [],
        direcciones: direcciones || [],
        pedidos: [pedido]
      });
    } else {
      // Si existe, agregar el pedido al array de pedidos
      usuario.pedidos.push(pedido);
    }

    await usuario.save();

    // 👇 Enviar correo de confirmación sin modificar el flujo
    try {
      await sendOrderEmail({ email: correo, nombre, pedido });
    } catch (error) {
      console.error('Error al enviar correo de confirmación:', error);
    }

    res.status(201).json({ message: 'Pedido registrado correctamente', usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar pedido' });
  }
};

module.exports = crearPedido;
