const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "admin123",
  database: "testdb",
});

app.post("/create-user", (req, res) => {
  const { username, email } = req.body;

  const query = `INSERT INTO users (username, email) VALUES ('${username}', '${email}')`; // Inseguro

  db.query(query, (err, result) => {
    if (err) return res.status(500).send("Error al crear usuario");
    res.send("Usuario creado correctamente");
  });
});

app.listen(4000, () => console.log("Servidor corriendgito en puerto 4000"));
