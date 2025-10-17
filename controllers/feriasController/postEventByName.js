const FeriaModel = require('../../model/feriaModel');

// ✅ Crear un evento dentro de una feria usando el nombre de la feria
const postEventByName = async (req, res) => {
  try {
    const {
      nombreFeria,       // Nombre exacto de la feria
      artista,
      fecha,
      hora,
      plaza,
      lugar,
      direccion,
      descripcion1,
      descripcion2,
      disponibilidad,
      tipoPayment,
      zonas,
      imgUrlEvent,
      imgPublicIdEvent,
      imgUrlMap,
      imgPublicIdMap
    } = req.body;

    // 📌 Buscar la feria por nombre
    const feria = await FeriaModel.findOne({ nombre: nombreFeria });
    if (!feria) {
      return res.status(404).json({ message: "Feria no encontrada" });
    }

    // 📌 Crear el objeto del evento
    const newEvent = {
      artista,
      fecha,
      hora,
      plaza,
      lugar,
      direccion,
      descripcion1,
      descripcion2,
      disponibilidad,
      tipoPayment: tipoPayment || [],
      zonas: zonas || [],
      imgUrlEvent: imgUrlEvent || '',
      imgPublicIdEvent: imgPublicIdEvent || '',
      imgUrlMap: imgUrlMap || '',
      imgPublicIdMap: imgPublicIdMap || ''
    };

    // 📌 Insertar el evento en la feria
    feria.eventos.push(newEvent);
    await feria.save();

    res.status(201).json({ message: "Evento creado con éxito", evento: newEvent });

  } catch (error) {
    console.error("❌ Error al crear evento:", error);
    res.status(500).json({ message: "Error al crear evento", error: error.message });
  }
};

module.exports = postEventByName;
