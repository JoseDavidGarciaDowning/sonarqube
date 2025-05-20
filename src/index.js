const express = require("express");
const { execFile } = require("child_process");
const { evaluate } = require("mathjs");
const { sum } = require("./utils");
const helmet = require("helmet"); // Protección adicional

const app = express();
const port = 3000;

// ✅ Usa variables de entorno para secretos
const API_SECRET = process.env.API_SECRET || "default_secret"; // Cargar desde `.env`

// ✅ Middleware de seguridad
app.use(helmet());

// ✅ Ruta con evaluación segura de expresiones matemáticas
app.get("/eval", (req, res) => {
  const input = req.query.input;
  if (!input) return res.status(400).send("Please provide input");

  try {
    const result = evaluate(input); // evalúa solo expresiones válidas
    res.send(`Result: ${result}`);
  } catch (err) {
    console.error(err);
    res.status(400).send("Invalid expression.");
  }
});

// ✅ Previene XSS (codificando el contenido)
const escapeHtml = (str) =>
  str.replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[char])
  );

app.get("/xss", (req, res) => {
  const name = escapeHtml(req.query.name || "guest");
  res.send(`<h1>Welcome ${name}</h1>`);
});

// ✅ Prevención de inyección de comandos
app.get("/ping", (req, res) => {
  const host = req.query.host;

  if (!/^[a-zA-Z0-9.\-]+$/.test(host)) {
    return res.status(400).send("Invalid host format");
  }

  // Usa execFile en lugar de exec para evitar inyecciones
  execFile("ping", ["-c", "1", host], (error, stdout) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Failed to ping host");
    }
    res.send(`<pre>${stdout}</pre>`);
  });
});

// ✅ Prevención de DoS (limitando la carga)
app.get("/slow", (req, res) => {
  const count = Math.min(parseInt(req.query.count) || 1e6, 1e6); // Limita el valor

  let total = 0;
  for (let i = 0; i < count; i++) {
    total += i;
  }

  res.send(`Sum is ${total}`);
});

// ✅ No mostrar errores internos al usuario
app.get("/crash", (_req, res) => {
  try {
    throw new Error("Something went wrong!");
  } catch (err) {
    console.error(err); // Log interno
    res.status(500).send("Internal server error."); // No se filtra el mensaje
  }
});

// ✅ Ruta segura con validación
app.get("/sum", (req, res) => {
  const a = parseInt(req.query.a || "0");
  const b = parseInt(req.query.b || "0");

  if (isNaN(a) || isNaN(b)) {
    return res.status(400).send("Invalid numbers");
  }

  const result = sum(a, b);
  res.send(`The sum is ${result}`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
