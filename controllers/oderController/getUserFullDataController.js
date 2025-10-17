const User = require("../../model/userOrder");

const getUserFullDataController = async (req, res) => {
  try {
    const correo = req.user?.correo; // viene del token validado

    if (!correo) {
      return res.status(400).json({ message: "❌ Correo no encontrado en el token." });
    }

    const user = await User.findOne({ correo });
    if (!user) {
      return res.status(404).json({ message: "❌ Usuario no encontrado." });
    }

    res.status(200).json({
      message: "✅ Usuario encontrado correctamente.",
      userDataFull: user
    });

    console.log(`✅ Usuario encontrado: ${correo}`);
  } catch (error) {
    console.error("❌ Error en getUserFullDataController:", error);
    res.status(500).json({
      message: "❌ Error al obtener la información del usuario.",
      error: error.message || error
    });
  }
};

module.exports = getUserFullDataController;
