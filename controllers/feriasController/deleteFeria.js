const FeriaModel = require('../../model/feriaModel'); // Ajusta la ruta según tu proyecto

// ✅ Eliminar feria completa o eventos específicos
const deleteFeria = async (req, res) => {
  try {
    const { idFeria } = req.params; // ID de la feria
    const { eventoId } = req.body || {};   // ID del evento a eliminar (opcional)

    // Buscar la feria
    const feria = await FeriaModel.findById(idFeria);
    if (!feria) {
      return res.status(404).json({ message: 'Feria no encontrada' });
    }

    if (eventoId) {
      // Eliminar un evento específico
      const index = feria.eventos.findIndex(e => e._id.toString() === eventoId);
      if (index === -1) {
        return res.status(404).json({ message: 'Evento no encontrado' });
      }
      feria.eventos.splice(index, 1);
      await feria.save();
      return res.status(200).json({
        message: 'Evento eliminado correctamente',
        feria
      });
    } else {
      // Si no se envía eventoId, eliminar la feria completa
      await FeriaModel.findByIdAndDelete(idFeria);
      return res.status(200).json({ message: 'Feria eliminada correctamente' });
    }

  } catch (error) {
    console.error('❌ Error al eliminar feria/evento:', error);
    res.status(500).json({ message: 'Error al eliminar feria/evento', error: error.message });
  }
};

module.exports = deleteFeria;
