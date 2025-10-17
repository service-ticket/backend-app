const FeriaModel = require('../../model/feriaModel');

// ✅ Crear una nueva feria
const postFerias = async (req, res) => {
  try {
    const {
      nombre,
      estado,
      fechaInicio,
      fechaFin,
      flayerPrincipal,
      flayerPrincipalPublic,
      flayerSecundario,
      flayerSecundarioPublic,
      boletera
    } = req.body;

    // 📌 Crear documento de feria
    const nuevaFeria = new FeriaModel({
      nombre,
      estado,
      fechaInicio,
      fechaFin,
      flayerPrincipal: flayerPrincipal || '',
      flayerPrincipalPublic: flayerPrincipalPublic || '',
      flayerSecundario: flayerSecundario || '',
      flayerSecundarioPublic: flayerSecundarioPublic || '',      
      eventos: [] // empieza vacía
    });

    await nuevaFeria.save();

    res.status(201).json({
      message: "Feria creada con éxito",
      feria: nuevaFeria
    });

  } catch (error) {
    console.error("❌ Error al crear feria:", error);
    res.status(500).json({ message: "Error al crear feria", error: error.message });
  }
};

module.exports = postFerias;
