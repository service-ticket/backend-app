const FeriaModel = require('../../model/feriaModel'); // Ajusta la ruta según tu proyecto

// ✅ Actualizar feria y/o eventos por ID de la feria
const updateFeria = async (req, res) => {
  try {
    const { idFeria } = req.params; // ID de la feria
    const { feria: feriaUpdates = {}, eventos: eventosUpdates = [] } = req.body;

    // Buscar la feria por ID
    const feria = await FeriaModel.findById(idFeria);
    if (!feria) {
      return res.status(404).json({ message: 'Feria no encontrada' });
    }

    // Actualizar campos de la feria
    Object.keys(feriaUpdates).forEach((key) => {
      if (key in feria && typeof feriaUpdates[key] !== 'undefined') {
        feria[key] = feriaUpdates[key];
      }
    });

    // Actualizar o agregar eventos
    for (const ev of eventosUpdates) {
      if (!ev._id) {
        // Nuevo evento
        feria.eventos.push(ev);
      } else {
        const index = feria.eventos.findIndex(e => e._id.toString() === ev._id);
        if (index !== -1) {
          Object.keys(ev).forEach((k) => {
            if (k !== '_id') feria.eventos[index][k] = ev[k];
          });
        } else {
          // Si no existe, agregar
          feria.eventos.push(ev);
        }
      }
    }

    // Guardar cambios
    await feria.save();

    res.status(200).json({
      message: 'Feria y eventos actualizados correctamente',
      feria
    });

  } catch (error) {
    console.error('❌ Error al actualizar feria:', error);
    res.status(500).json({ message: 'Error al actualizar feria', error: error.message });
  }
};

module.exports = updateFeria;
