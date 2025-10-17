require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/dbConnect');

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  });
});