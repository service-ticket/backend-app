const User = require("../../model/userOrder");

const getOrderBySlugController = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Buscar un usuario que tenga ese slugPrincipal en alguno de sus pedidos
    const user = await User.findOne({ "pedidos.numeroOrden": { $regex: orderId, $options: "i" } });

    if (!user) {
      return res.status(404).json({ message: "❌ Pedido no encontrado" });
    }

    // Buscar el pedido dentro del array del usuario
    const pedido = user.pedidos.find((p) => p.numeroOrden.includes(orderId));

    if (!pedido) {
      return res.status(404).json({ message: "❌ Pedido no encontrado" });
    }

    // Devolver un resumen limpio
    const resumen = {
      correo: user.correo,
      nombre: user.nombre,
      idPerfil: user.idPerfil,
      telefono: user.telefonos?.[0] || null,
      numeroOrden: pedido.numeroOrden,
      numeroConfirmacion: pedido.numeroConfirmacion,
      metodoPago: pedido.metodoPago,
      total: pedido.total,
      iva: pedido.iva,
      sub: pedido.sub,
      statusPay: pedido.statusPay,
      registroPedido: pedido.registroPedido,
      fechaCreacion: pedido.fechaCreacion,
      slugPrincipal: pedido.slugPrincipal,      
      account:pedido.acountBank,
      direcciones: pedido.direcciones.map((item) => ({
        calle: item.calle,
        casa: item.casa || '',
        ciudad: item.ciudad,
        cp: item.cp,
        estado: item.estado,
        tipo: item.tipo,
        pais: item.pais
      })),
      items: pedido.items.map((item) => ({
        artista: item.artista,
        fecha: item.fecha,
        zona: item.zona,
        cantidad: item.cantidad,
        precio: item.precio,
        subtotal: item.subtotal,
        img: item.img,
        feria:item.feria
        
      }))
    };

    res.status(200).json({
      message: "✅ Pedido encontrado correctamente",
      resumen,
      user
    });
    console.log('rsumen_____', user ,resumen)    
  } catch (error) {
    console.error("❌ getOrderBySlugController error:", error);
    res.status(500).json({
      message: "❌ Error al obtener el pedido",
      error: error.message || error
    });
  }
};

module.exports = getOrderBySlugController;
