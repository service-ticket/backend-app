const mongoose = require('mongoose');

// 🔹 Zonas de cada evento
const zoneSchema = new mongoose.Schema({
  zona: { type: String, required: true },
  precio: { type: Number, required: true },
}, { _id: false });

// 🔹 Eventos dentro de una feria
const eventSchema = new mongoose.Schema({         
  artista: { type: String, required: true },       
  fecha: { type: String, default: ''}, 
  hora:{type: String, default: ''},        
  plaza: { type: String, default: '' },
  lugar: { type: String, default: '' },
  direccion:{type: String, default: ''},
  descripcion1: { type: String, default: '' },
  descripcion2: { type: String, default: '' }, 
  imgUrlEvent: { type: String, default: '' },
  imgPublicIdEvent: { type: String, default: '' },
  imgUrlMap: { type: String, default: '' },
  imgPublicIdMap: { type: String, default: '' },
  disponibilidad: { type: String, default: '' },
  tipoPayment: {
    type: [String],
    enum: ["tarjeta", "transferencia"],
    default: []
  },
  zonas: { type: [zoneSchema], default: [] }      
}, { _id: true });

// 🔹 Feria principal
const feriaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },    
  estado: { type: String, required: true },
  fechaInicio: { type: String, required: true },
  fechaFin: { type: String, required: true },
  flayerPrincipal:{type: String, default: ''},
  flayerPrincipalPublic:{type: String, default: ''},
  flayerSecundario:{type: String, default: ''},
  flayerSecundarioPublic:{type: String, default: ''},  
  eventos: { type: [eventSchema], default: [] }   
}, { 
  collection: 'ferias',
  timestamps: true 
});

// 🧹 Middleware limpieza
feriaSchema.pre('save', function(next) {
  const doc = this;
  Object.keys(doc.toObject()).forEach((key) => {
    if (typeof doc[key] === 'string') {
      doc[key] = doc[key].trim();
    }
  });
  next();
});

feriaSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update && update.$set) {
    Object.keys(update.$set).forEach((key) => {
      if (typeof update.$set[key] === 'string') {
        update.$set[key] = update.$set[key].trim();
      }
    });
  }
  next();
});

const FeriaModel = mongoose.model('Feria', feriaSchema);

module.exports = FeriaModel;
