const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pedidos",
});

db.connect();
app.use(express.json());

app.post("/crear-pedido", (req, res) => {
  try {
    console.log(req.body);
    const pedido = JSON.parse(req.body.json);
    const { order, cliente } = pedido;
    io.emit("nuevoPedido", pedido);
    db.query(
      "INSERT INTO detalle_pedidos (idPedido, idCuenta, product, amount, value, total, name, email, telephone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? )",
      [
        order.idPedido,
        order.idCuenta,
        order.product,
        order.amount,
        order.value,
        order.total,
        cliente.name,
        cliente.email,
        cliente.telephone,
      ],
      (err, result) => {
        if (err) throw err;
        console.log("Información del pedido almacenada en la base de datos");
      }
    );
    res.status(200).send("Pedido recibido y procesado");
  } catch (error) {
    console.log("ERROR", error);
    res.status(400).send("Error al procesar el pedido");
  }
});

io.on("connection", (socket) => {
  console.log("Cliente conectado al servidor WebSocket");
});

http.listen(3030, () => {
  console.log("Servidor WebSocket escuchando en el puerto 3030");
});
