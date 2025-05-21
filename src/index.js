const express = require("express");
const mysql = require("mysql2");
const app = express();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "tu_password",
  database: "demo",
});

app.get("/user", (req, res) => {
  const username = req.query.username;

  const query = `SELECT * FROM users WHERE username = '${username}'`; // 

  db.query(query, (err, results) => {
    if (err) return res.status(500).send("Error en la base de datos");
    res.json(results);
  });
});

app.listen(3000, () => console.log("Servidor iniciado en puerto 3000"));
