const express = require("express");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const helmet = require("helmet");
const app = express();
const port = 3000;

// Middlewares de seguridad
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(helmet()); // Agrega encabezados de seguridad
const csrfProtection = csrf({ cookie: true });

// 1. SQL Injection (consulta parametrizada simulada)
app.get("/user", (req, res) => {
  const username = req.query.username;
  // Simulación segura (usualmente usarías algún ORM o librería como pg, mysql2)
  const safeQuery = {
    text: "SELECT * FROM users WHERE username = ?",
    values: [username],
  };
  console.log("Consulta segura:", safeQuery);
  res.send("Consulta segura ejecutada.");
});

// 2. XSS (escapar contenido o usar templates)
app.get("/greet", (req, res) => {
  const name = req.query.name?.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  res.send(`<h1>Hola, ${name}</h1>`);
});

// 3. CSRF con token
app.post("/update-password", csrfProtection, (req, res) => {
 
  // Solo continúa si el token CSRF es válido
  res.send("Contraseña actualizada de manera segura.");
});

// 4. Cookie segura
app.get("/set-cookie", (req, res) => {
  res.cookie("token", "abc123", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  res.send("Cookie segura seteada");
});

// 5. No exponer información sensible
app.get("/debug", (req, res) => {
  res.status(403).send("Acceso denegado");
});

app.listen(port, () => {
  console.log(`Servidor seguro en http://localhost:${port}`);
});
