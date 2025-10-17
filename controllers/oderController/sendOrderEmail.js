const nodemailer = require('nodemailer');

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

module.exports = transporter;
const sendOrderEmail = async ({ email, nombre, pedido }) => {

    const itemsHTML = pedido.items.map(item => `
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-bottom: 1px solid #ccc;">
  <tr>
    <td width="80" valign="middle" style="padding:8px 0;">
      <div style="width:62px; height:62px; border:1px solid #ccc; border-radius:5px; overflow:hidden; display:block; margin:auto;">
        <img src="${item.img}" width="62" style="display:block; border-radius:5px; object-fit:cover;">
      </div>
    </td>

    <td style="padding:0 10px; vertical-align:middle; max-width:20%;">
      <span style="display:block; color: #555555; font-size: 16px; font-weight:600 line-height: 1.4; ">${item.artista} - ${item.fecha} x ${item.cantidad}</span>
      <span style="display:block; color: #999; font-size: 14px; font-weight:400">${item.zona}</span>
    </td>

    <td align="right" valign="middle" style="white-space:nowrap; font-weight:bold;">
      <span style="display:block; color: #555555; font-size: 16px; font-weight:600 line-height: 150%;">$ ${item.subtotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </td>
  </tr>
</table>



`).join('');


    const mailOptions = {
        from: `Total Ticket <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Pedido pendiente # ${pedido.numeroOrden}`,
        html: `
        <html>
        
    <body>

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
    <p style="font-size: 16px; color: #777777;">Tu(s) boleto(s) han sido <strong style="color: #555555;">reservados por
        los próximos 10 minutos.</strong> Para completar tu compra, por favor realiza el depósito a la siguiente cuenta:
    </p>
    <hr style="width: 100%; margin: auto; border-bottom: .8px solid gray;">
    <h3 style="font-size: 20px; color:#222222; font-weight: 400; ">💳 DATOS PARA EL DEPÓSITO BANCARIO:</h3>
    <ul style="margin:.5rem 1rem; padding:0;">
      <li style="margin:0; padding:0;"><strong style="color: #555555; font-size: 16px;">CLABE Interbancaria: </strong> <span
          style="font-size: 13px; color: #222222;">${pedido.acountBank}</span></li>
      <li style="margin:0; padding:0;"><strong style="color: #555555; font-size: 16px;">Banco:</strong> <span
          style="font-size: 13px; color: #222222;">STP</span></li>
      <li style="margin:0; padding:0;"><strong style="color: #555555; font-size: 16px;">Beneficiario:</strong> <span
          style="font-size: 13px; color: #222222;">TOTAL TICKET SA</span></li>
      <li style="margin:0; padding:0;"><strong style="color: #555555; font-size: 16px;">Monto exacto:</strong> <span
          style="font-size: 13px; color: #222222;">$ ${pedido.total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></li>
    </ul>
    <hr style="width: 100%; margin: auto; border-bottom: .8px solid gray;">

    <h3 style="font-size: 20px; color:#222222; font-weight: 400; ">🔔 IMPORTANTE:</h3>
    <p style="font-size: 16px; color: #777777;">El pago debe realizarse dentro de los próximos <strong
        style="color: #555555;">10 minutos</strong> para garantizar tu lugar. Si no se recibe el pago a tiempo,
      la reserva puede ser liberada automáticamente.</p>

    <p style="font-size: 16px; color: #777777;">Después de confirmar tu pago, te enviaremos un <strong
        style="color: #555555;">segundo correo con:</strong></p>
    <ul  style=" margin:.5rem 1rem; padding:0 ;">
      <li style="margin:0; padding:0;"><span style="font-size: 13px; color: #222222;">✅ Confirmación del pago</span></li>
      <li style="margin:0; padding:0;"><span style="font-size: 13px; color: #222222;">✅ Instrucciones para el canje de tus boletos</span></li>
      <li style="margin:0; padding:0;"><span style="font-size: 13px; color: #222222;">✅ Información del evento y recomendaciones</span></li>
    </ul>
    <p style="font-size: 16px; color: #777777;">Para cualquier duda, contáctanos por WhatsApp o correo. ¡Gracias por
      elegir <strong style="color: #555555;">TOTAL TICKET!</strong></p>
    <div style="display: flex; align-items: center; margin-top: 1rem;">
      <a href="http://localhost:173/loading/${pedido.numeroOrden}"
        style="padding: 16px 20px; background-color: #1990c6; border: none; color: #fff; border-radius: 5px; margin-right: 1rem; text-decoration: none; display: inline-block;">
        Ver tu pedido
      </a>
      o <a href="http://localhost:173/" style="color: #1990c6; margin-left: 1rem;"> Visita nuestra tienda</a>
    </div>
    <div id="pedido" style="margin-top: 3rem;">
    <h3 style="color: #222222; font-size: 20px; font-weight: 400;">Resumen del pedido</h3> 
    ${itemsHTML}       
  </div>

  <table width="560px" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td align="right" style="padding:0;">
      <table border="0" cellspacing="0" cellpadding="0" width="100%" style="max-width:50%; width:560;">
        <tr>
          <td align="left" style="padding:8px 0;">
            <span style="color: #777777; font-size: 16px; line-height: 1.2em;">Subtotal</span>
          </td>
          <td align="right" style="padding:8px 0;">
            <strong style="color: #555555; font-size: 16px;">$ ${pedido.sub.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
          </td>
        </tr>
        <tr>
          <td align="left" style="padding:8px 0;">
            <span style="color: #777777; font-size: 16px; line-height: 1.2em;">Envío</span>
          </td>
          <td align="right" style="padding:8px 0;">
            <strong style="color: #555555; font-size: 16px;">$ 0.00</strong>
          </td>
        </tr>

        <tr >
          <td align="left" style="padding:8px 0; border-bottom:1px solid #ccc;">
            <span style="color: #777777; font-size: 16px; line-height: 1.2em;">Impuestos</span>
          </td>
          <td align="right" style="padding:8px 0; padding:8px 0; border-bottom:1px solid #ccc;">
            <strong style="color: #555555; font-size: 16px;">$ ${pedido.iva.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
          </td>
        </tr>

         <tr >
          <td align="left" style="padding:8px 0;">
            <span style="color: #777777; font-size: 16px; line-height: 1.2em;">Total</span>
          </td>
          <td align="right" style="padding:8px 0; padding:8px 0; ">
            <strong style="color: #555555; font-size: 24px;">$ ${pedido.total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN</strong>
          </td>
        </tr>

         <tr >
          <td align="left" style="padding:8px 0; border-bottom:2px solid #ccc;">
            <span style="color: #777777; font-size: 16px; line-height: 1.2em;">Total pagado hoy</span>
          </td>
          <td align="right" style="padding:8px 0; padding:8px 0; border-bottom:2px solid #ccc;">
            <strong style="color: #555555; font-size: 16px;">$ 0.00 MXN</strong>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
  </div>

  <style>
  @media screen and (max-width:768px) {
    .two-column .column {
      display:block !important;
      width:100% !important;
      
    }
  }
</style>
<h3 style="color: #222222; font-size: 20px; font-weight: 400; margin-bottom: 2rem;">Información del cliente</h3>    

<table width="100%" border="0" cellspacing="0" cellpadding="0" class="two-column">
  <tr>
    <!-- Dirección de envío -->
    <td class="column" width="50%" valign="top" style="padding:10px;">
      <h4 style="font-size:16px; color:#555; margin:0 0 5px 0; font-weight:600;">Dirección de envío</h4>
      <p style="font-size:14px; color:#777777; line-height:1.5; margin:0;">
        ${nombre || email}<br>
        ${pedido.direcciones[0].calle} ${pedido.direcciones[0].casa}<br>
        ${pedido.direcciones[0].cp} ${pedido.direcciones[0].ciudad}<br>
        México
      </p>
    </td>

    <!-- Dirección de facturación -->
    <td class="column" width="50%" valign="top" style="padding:10px;">
      <h3 style="font-size:16px; color:#555; margin:0 0 5px 0; font-weight:600;">Dirección de facturación</h3>
      <p style="font-size:14px; color:#777777; line-height:1.5; margin:0;">
        ${nombre || email}<br>
         ${pedido.direcciones[1]?.calle || pedido.direcciones[0].calle} ${pedido.direcciones[1]?.casa || pedido.direcciones[0].casa}<br>
         ${pedido.direcciones[1]?.cp || pedido.direcciones[0].cp} ${pedido.direcciones[1]?.ciudad || pedido.direcciones[0].ciudad}<br>
        México
      </p>
    </td>
  </tr>
</table>

<!-- Método de envío -->
<table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td style="padding:10px;">
      <h4 style="font-size:16px; color:#555; margin:0 0 5px 0; font-weight:600;">Método de envío</h4>
      <p style="font-size:14px; color:#777777; margin:0;">Standard</p>
    </td>
  </tr>
</table>
<hr style="width: 100%; margin: auto; border-bottom: .8px solid gray;">
<h4 style="font-size:14px; color:#555; margin:0 0 5px 0; font-weight:400;">Si tienes alguna pregunta, responde este correo electrónico o contáctanos a través de 
<a>sah86qw@gmail.com</a></h4>
  </div>
  
  </body>
    </html>`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Correo enviado a ${email}`);
};

module.exports = sendOrderEmail;
