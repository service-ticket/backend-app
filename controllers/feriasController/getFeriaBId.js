const FeriaModel = require('../../model/feriaModel'); // ajusta la ruta según tu proyecto

// ✅ Obtener una feria por ID
const getFeriaById = async (req, res) => {
  try {
    const { id } = req.params;
    const feria = await FeriaModel.findById(id).lean();

    if (!feria) {
      return res.status(404).json({ message: "Feria no encontrada" });
    }

    res.status(200).json(feria);
  } catch (error) {
    console.error("❌ Error al obtener la feria:", error);
    res.status(500).json({ message: "Error al obtener la feria", error: error.message });
  }
};

module.exports = getFeriaById;
