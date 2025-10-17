const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,           // STARTTLS
  secure: false,       // false para STARTTLS
  auth: {
    user: "apikey",    // literal "apikey"
    pass: process.env.SENDGRID_API_KEY
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendOrderEmail = async ({ email, nombre, pedido }) => {
  try {
    if (!email) throw new Error("No se proporcionó correo");
    if (!pedido || !pedido.items || pedido.items.length === 0) {
      throw new Error("El pedido no tiene items");
    }

    // Aseguramos que existan campos opcionales
    pedido.acountBank = pedido.acountBank || "N/A";
    pedido.sub = pedido.sub || 0;
    pedido.iva = pedido.iva || 0;
    pedido.total = pedido.total || 0;
    pedido.direcciones = pedido.direcciones || [{ calle:"N/A", casa:"", cp:"", ciudad:"" }];

    const itemsHTML = pedido.items.map(item => `
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-bottom: 1px solid #ccc;">
      <tr>
        <td width="80" valign="middle" style="padding:8px 0;">
          <div style="width:62px; height:62px; border:1px solid #ccc; border-radius:5px; overflow:hidden; display:block; margin:auto;">
            <img src="${item.img || ""}" width="62" style="display:block; border-radius:5px; object-fit:cover;">
          </div>
        </td>
        <td style="padding:0 10px; vertical-align:middle; max-width:20%;">
          <span style="display:block; color: #555555; font-size: 16px; font-weight:600 line-height: 1.4; ">${item.artista || ""} - ${item.fecha || ""} x ${item.cantidad || 0}</span>
          <span style="display:block; color: #999; font-size: 14px; font-weight:400">${item.zona || ""}</span>
        </td>
        <td align="right" valign="middle" style="white-space:nowrap; font-weight:bold;">
          <span style="display:block; color: #555555; font-size: 16px; font-weight:600 line-height: 150%;">$ ${item.subtotal?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}</span>
        </td>
      </tr>
    </table>
    `).join('');

    const mailOptions = {
      from: `Total Ticket <${process.env.EMAIL_USER}>`, // debe ser correo verificado
      to: email,
      subject: `Pedido pendiente # ${pedido.numeroOrden || ""}`,
      html: `<!-- HTML ORIGINAL AQUÍ -->` // tu HTML completo sin cambios
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Correo enviado a ${email}`);
    } catch (err) {
      console.error("Error enviando correo:", err);
      throw new Error("No se pudo enviar el correo");
    }

  } catch (err) {
    console.error("Error en sendOrderEmail:", err.message);
    throw err; // Re-lanzamos para manejarlo donde se llame
  }
};

module.exports = sendOrderEmail;
