const User = require('../../model/userAdminModel');
const generateToken = require('../../utils/generateToken');

const registerUserController = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email ya registrado' });    }

    const user = new User({ name, email, password, role });
    await user.save();
   
    const token = generateToken({ id: user._id, role: user.role });
    res.status(201).json({
      message: 'Usuario registrado ✅',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('❌ Error en registro:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

module.exports = registerUserController;