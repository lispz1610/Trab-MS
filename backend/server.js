const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Importa rotas
const authRoutes = require("./routes/auth");
const trocarSenhaRoutes = require("./routes/trocar-senha");
const usuarioRoutes = require("./routes/usuarios");
const produtoRoutes = require("./routes/produtos");
const fornecedorRoutes = require("./routes/fornecedores");
const entradaRoutes = require("./routes/entradas");
const saidaRoutes = require("./routes/saidas");

// Rotas publicas
app.get("/", (_req, res) => {
  res.json({ mensagem: "Sistema Rabisco funcionando" });
});

app.use("/login", authRoutes);
app.use("/trocar-senha", trocarSenhaRoutes);

// Rotas protegidas
app.use("/usuarios", usuarioRoutes);
app.use("/produtos", produtoRoutes);
app.use("/fornecedores", fornecedorRoutes);
app.use("/entradas", entradaRoutes);
app.use("/saidas", saidaRoutes);

// Error handler global (Express 5)
app.use((err, _req, res, _next) => {
  console.error("Erro nao tratado:", err.message);
  res.status(500).json({ mensagem: "Erro interno do servidor" });
});

const porta = process.env.PORT || 3000;
app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
});
