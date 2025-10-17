const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendOrderEmail = async ({ email, nombre, pedido }) => {
  try {
    const itemsHTML = pedido.items.map(item => `
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-bottom: 1px solid #ccc;">
        <tr>
          <td width="80" valign="middle" style="padding:8px 0;">
            <div style="width:62px; height:62px; border:1px solid #ccc; border-radius:5px; overflow:hidden; display:block; margin:auto;">
              <img src="${item.img}" width="62" style="display:block; border-radius:5px; object-fit:cover;">
            </div>
          </td>
          <td style="padding:0 10px; vertical-align:middle; max-width:20%;">
            <span style="display:block; color: #555555; font-size: 16px; font-weight:600 line-height: 1.4;">${item.artista} - ${item.fecha} x ${item.cantidad}</span>
            <span style="display:block; color: #999; font-size: 14px; font-weight:400">${item.zona}</span>
          </td>
          <td align="right" valign="middle" style="white-space:nowrap; font-weight:bold;">
            <span style="display:block; color: #555555; font-size: 16px; font-weight:600 line-height: 150%;">$ ${item.subtotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </td>
        </tr>
      </table>
    `).join('');

    const msg = {
      to: email,
      from: `Total Ticket <${process.env.EMAIL_USER}>`,
      subject: `Pedido pendiente # ${pedido.numeroOrden}`,
      html: `
        <html>
          <body>
            <!-- TODO: todo tu HTML -->
            ${itemsHTML}
          </body>
        </html>
      `,
    };

    await sgMail.send(msg);
    console.log(`✅ Correo enviado a ${email}`);
  } catch (error) {
    // Aquí imprimimos toda la info del error de SendGrid
    if (error.response && error.response.body) {
      console.error('SendGrid error:', error.response.body);
    } else {
      console.error('Error general:', error);
    }
    throw new Error('No se pudo enviar el correo');
  }
};

module.exports = sendOrderEmail;
