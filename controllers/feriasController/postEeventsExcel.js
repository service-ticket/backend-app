const FeriaModel = require('../../model/feriaModel');
const XLSX = require('xlsx');

// ✅ Carga masiva de eventos desde un Excel subido desde cualquier PC usando multer
const bulkUploadEventsWithMulter = async (req, res) => {
  try {
    // 📌 Validar que exista un archivo
    if (!req.file) {
      return res.status(400).json({ message: "No se envió ningún archivo Excel." });
    }

    // 📌 Leer Excel desde buffer
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet);

    let successCount = 0;
    let errorRows = [];

    for (const [index, row] of rows.entries()) {
      const {
        nombreFeria,
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
        imgUrlEvent,
        imgPublicIdEvent,
        imgUrlMap,
        imgPublicIdMap,
        zona1, precio1,
        zona2, precio2,
        zona3, precio3,
        zona4, precio4,
        zona5, precio5
      } = row;

      // 📌 Validar solo lo indispensable (modelo solo requiere artista)
      if (!nombreFeria || !artista) {
        errorRows.push(index + 2); // +2 porque Excel empieza en fila 2
        continue;
      }

      // 📌 Crear array de zonas
      const zonas = [];
      if (zona1 && precio1) zonas.push({ zona: zona1, precio: Number(precio1) });
      if (zona2 && precio2) zonas.push({ zona: zona2, precio: Number(precio2) });
      if (zona3 && precio3) zonas.push({ zona: zona3, precio: Number(precio3) });
      if (zona4 && precio4) zonas.push({ zona: zona4, precio: Number(precio4) });
      if (zona5 && precio5) zonas.push({ zona: zona5, precio: Number(precio5) });

      // 📌 Buscar feria por nombre
      const feria = await FeriaModel.findOne({ nombre: nombreFeria });
      if (!feria) {
        errorRows.push(index + 2);
        continue;
      }

      // 📌 Crear objeto del evento
      const newEvent = {
        artista: artista.toString().trim(),
        fecha: fecha ? fecha.toString().trim() : '',
        hora: hora ? hora.toString().trim() : '',
        plaza: plaza || '',
        lugar: lugar || '',
        direccion: direccion || '',
        descripcion1: descripcion1 || '',
        descripcion2: descripcion2 || '',
        disponibilidad: disponibilidad || '',
        tipoPayment: tipoPayment
          ? tipoPayment.split(',').map(p => p.trim().toLowerCase())
          : [],
        zonas,
        imgUrlEvent: imgUrlEvent || '',
        imgPublicIdEvent: imgPublicIdEvent || '',
        imgUrlMap: imgUrlMap || '',
        imgPublicIdMap: imgPublicIdMap || ''
      };

      // 📌 Insertar evento en la feria
      feria.eventos.push(newEvent);
      await feria.save();
      successCount++;
    }

    res.status(201).json({
      message: "Carga masiva completada",
      eventosAgregados: successCount,
      filasConError: errorRows
    });

  } catch (error) {
    console.error("❌ Error en carga masiva:", error);
    res.status(500).json({ message: "Error en carga masiva", error: error.message });
  }
};

module.exports = bulkUploadEventsWithMulter;
