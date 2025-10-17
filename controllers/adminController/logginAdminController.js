
const User = require('../../model/userAdminModel');
const generateToken = require('../../utils/generateToken');

const loginUserController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ message: 'Usuario no encontrado' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Contraseña incorrecta' });
    const token = generateToken({ id: user._id, role: user.role });
    res.json({
      message: 'Login exitoso ✅',
      token, 
      user: { id: user._id, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = loginUserController;
