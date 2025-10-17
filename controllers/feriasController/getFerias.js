const FeriaModel = require('../../model/feriaModel'); // ajusta la ruta según tu proyecto

// ✅ Obtener todas las ferias
const getFerias = async (req, res) => {
  try {
    const ferias = await FeriaModel.find().lean(); // .lean() devuelve objetos planos
    res.status(200).json(ferias);
  } catch (error) {
    console.error("❌ Error al obtener ferias:", error);
    res.status(500).json({ message: "Error al obtener ferias", error: error.message });
  }
};

module.exports =  getFerias ;