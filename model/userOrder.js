// models/UserModel.js
const mongoose = require('mongoose');

// Esquema de pedidos
const PedidoSchema = new mongoose.Schema({
  numeroOrden: { type: String, required: true },
  statusPay: { type: String, default: 'pendiente' },
  registroPedido: { type: String, default: 'confirmado' },
  numeroConfirmacion:{ type: String, default: '0' },
  fechaCreacion: { type: Date, default: Date.now },
  metodoPago: { type: String, enum: ['transferencia', 'tarjeta', 'paypal'], default: 'transferencia' },
  total: { type: Number, required: true },
  iva:{type: String},
  sub:{type: String},
  acountBank: { type: String, required: true },
  slugPrincipal:{type: String},
  // idPerfil: {type: String},
  
  direcciones: [
  {
    calle: { type: String },
    casa: { type: String },
    ciudad: { type: String },
    cp: { type: String },
    estado: { type: String },
    tipo: { type: String },
    pais:{ type: String }, 
  }
],
  items: [
    {
      slug: { type: String},
      artista: { type: String, required: true },
      fecha: { type: String, required: true },
      zona: { type: String, required: true },
      precio: { type: Number, required: true },
      cantidad: { type: Number, required: true },
      subtotal: { type: Number, required: true },
      img: { type: String, required: true },
      feria:  {type: String},
    }
  ]
});

// Esquema de usuario
const UserSchema = new mongoose.Schema({
  correo: { type: String, required: true, unique: true },
  nombre: { type: String },
  telefonos: [{ type: String }],  
  idPerfil: {type: String },
  pedidos: [PedidoSchema],
  codigoAutenticacion: {
    code: { type: String },
    expiresAt: { type: Date },
    used: { type: Boolean, default: false }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

