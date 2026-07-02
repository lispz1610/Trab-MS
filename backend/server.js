const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const app = express();

app.use(cors());
app.use(express.json());

// Cria pasta uploads se nao existir
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Servir arquivos estaticos da pasta uploads
app.use("/uploads", express.static(uploadsDir));

// Importa rotas
const authRoutes = require("./routes/auth");
const trocarSenhaRoutes = require("./routes/trocar-senha");
const usuarioRoutes = require("./routes/usuarios");
const produtoRoutes = require("./routes/produtos");
const fornecedorRoutes = require("./routes/fornecedores");
const entradaRoutes = require("./routes/entradas");
const saidaRoutes = require("./routes/saidas");
const relatorioGeralRoutes = require("./routes/relatorio-geral");

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
app.use("/relatorio-geral", relatorioGeralRoutes);

// Error handler global
app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ mensagem: `Erro no upload: ${err.message}` });
  }
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ mensagem: "Arquivo muito grande. Máximo 5MB." });
  }
  console.error("Erro nao tratado:", err.message);
  res.status(500).json({ mensagem: "Erro interno do servidor" });
});

const porta = process.env.PORT || 3000;
app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
});
