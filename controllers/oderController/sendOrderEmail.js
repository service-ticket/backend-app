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
            <!-- TODO: Aquí va todo tu HTML completo tal como lo tenías, incluyendo ${itemsHTML} -->
            <div class="container" style="
              font-family: Arial, Helvetica, sans-serif;
              width: 100%;
              max-width: 560px;
              margin: 50px auto;
              background: #fff;
              padding: 0 0;
              box-sizing: border-box;
            ">
              <div style="display: flex; justify-content: space-between; margin: auto; width: 100%;">
                <a href="http://localhost:173/" style="text-decoration: none; color: #333333; font-size: 30px; width: 60%; margin:auto;"> Total Ticket</a>
                <span style="color: #999999; font-size: 16px; width: 40%; margin:auto; text-align: end;"># ${pedido.numeroOrden}</span>
              </div>
              <h2 style="font-size: 24px; color:#222222; font-weight: 400;">¡Boletos Reservados!</h2>
              <span style="color: #777777; width: 100%;">Hola ${nombre || email},</span>
              <p style="font-size: 16px; color: #777777;">Gracias por tu pedido para <strong style="color: #555555; text-transform: capitalize;">${pedido.items[0].artista} – ${pedido.items[0].fecha} 
              - ${pedido.items[0].zona}.</strong></p>
              <!-- Aquí sigue TODO tu HTML exactamente igual, incluyendo ${itemsHTML} y todas las secciones de pedido, cliente y métodos de envío -->
              ${itemsHTML}
            </div>
          </body>
        </html>
      `,
    };

    await sgMail.send(msg);
    console.log(`✅ Correo enviado a ${email}`);
  } catch (error) {
    console.error('Error enviando correo:', error);
    throw new Error('No se pudo enviar el correo');
  }
};

module.exports = sendOrderEmail;

