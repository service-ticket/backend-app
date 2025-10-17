// controllers/sendCodeController.js
const User = require('../../model/userOrder');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Validar formato de correo
const isValidCorreo = (correo) =>
  typeof correo === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

const sendCode = async (req, res) => {
  try {
    const { correo } = req.body;

    if (!correo || !isValidCorreo(correo)) {
      return res.status(400).json({ message: 'Se requiere un correo válido' });
    }

    // Generar código de 6 dígitos
    const codeToken = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const update = {
      $set: {
        correo,
        'codigoAutenticacion.code': codeToken,
        'codigoAutenticacion.expiresAt': expiresAt,
        'codigoAutenticacion.used': false,
      },
    };

    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    await User.findOneAndUpdate({ correo }, update, options);

    // 📧 Correo con código dinámico
    const mailOptions = {
      to: correo,
      from: {
        email: process.env.EMAIL_FROM || process.env.SENDGRID_VERIFIED_EMAIL,
        name: 'Total Ticket',
      },
      subject: `Tu código es ${codeToken}`,
      html: `
        <div
        style="font-family:Arial, Helvetica, sans-serif; text-align: center; width: 40%; margin: auto; background:#fff; padding: 0 100px; margin-top: 50px;">
        <img src="https://res.cloudinary.com/dmohnbwpo/image/upload/v1760656035/logo_app_igzhbw.jpg"
            alt="Logo de la empresa" style="width: 100%; max-width: 400px; display: block; margin: 0 auto;">
        <h1
            style="text-align: center; color: #202223; font-size: 15px; font-weight: 400; width: 100%; margin: 30px auto;">
            Tu código de verificación:</h1>
        <span style="font-size: 21px; font-weight: 600; color: #202223; padding: 10px 20px; letter-spacing: 8px; ">
            ${codeToken}
        </span>
        <h1
            style="text-align: center; color: #202223; font-size: 14px; font-weight: 400; width: 100%; margin-top: 20px; margin-bottom: 40px;">
            Este código solo se puede usar una vez. Vencerá en 15 minutos.</h1>
        <span style="color: #6d7175; font-size: 12px;">© Total Ticket</span>
        <div style="display: flex; text-align: center; margin: auto; gap:2rem; margin-top: 30px; width: auto; max-width: 400%;">
            <a href="" style="color: #2c6ecb; font-size: 12px; text-align: center; text-decoration: none; "> Política de privacidad</a>
            <a href="" style="color: #2c6ecb; font-size: 12px; text-align: center; text-decoration: none; margin-left:2rem;">Términos del servicio</a>
        </div>
    </div>
      `,
    };

    try {
      await sgMail.send(mailOptions);
      return res.json({ message: 'Código enviado al correo' });
    } catch (mailErr) {
      console.error('SendGrid error:', mailErr.response?.body || mailErr);
      await User.updateOne({ correo }, { $unset: { codigoAutenticacion: "" } }).catch(() => {});
      return res.status(500).json({ message: 'Error al enviar el correo' });
    }
  } catch (err) {
    console.error('Error en sendCode:', err);
    return res.status(500).json({ message: 'Error al procesar la solicitud' });
  }
};

module.exports = sendCode;
