const express = require("express");
const { exec } = require("child_process");
const { sum } = require("./utils");

const app = express();
const port = 3000;

// ⚠️ Clave hardcodeada (no hacer esto en producción)
const API_SECRET = "my_super_secret_key";

// ❌ Ruta con eval (ejecución arbitraria)
app.get("/eval", (req, res) => {
  const input = req.query.input;
  if (!input) return res.send("Please provide input");

  try {
    const result = eval(input); // 🚨 Vulnerabilidad crítica
    res.send(`Result: ${result}`);
  } catch (err) {
    res.status(500).send("Error while evaluating input");
  }
});

// ❌ XSS: respuesta sin sanitizar
app.get("/xss", (req, res) => {
  const name = req.query.name || "guest";
  res.send(`<h1>Welcome ${name}</h1>`); // 🚨 Si envían <script>alert(1)</script>
});

// ❌ Inyección de comandos
app.get("/ping", (req, res) => {
  const host = req.query.host;
  exec(`ping -c 1 ${host}`, (error, stdout, stderr) => {
    // 🚨 Inyección
    if (error) {
      return res.status(500).send(`Error: ${error.message}`);
    }
    res.send(`<pre>${stdout}</pre>`);
  });
});

// ❌ Código vulnerable a DoS
app.get("/slow", (req, res) => {
  const count = parseInt(req.query.count) || 1e9;
  let sum = 0;
  for (let i = 0; i < count; i++) {
    sum += i;
  }
  res.send(`Sum is ${sum}`);
});

// ❌ Ruta que puede mostrar errores al cliente
app.get("/crash", (_req, res) => {
  try {
    throw new Error("Something went wrong!");
  } catch (err) {
    res.status(500).send(`Internal error: ${err.message}`); // 🚨 Fuga de info
  }
});

// ✅ Ruta "segura"
app.get("/sum", (req, res) => {
  const a = parseInt(req.query.a || "0");
  const b = parseInt(req.query.b || "0");
  const result = sum(a, b);
  res.send(`The sum is ${result}`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
