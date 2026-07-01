const { Router } = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db/database");
const { gerarToken } = require("../middleware/auth");
const { validarCampos } = require("../middleware/validacao");

const router = Router();

// POST /login
router.post("/", validarCampos(["email", "senha"]), (req, res) => {
  const { email, senha } = req.body;
  const usuario = db.prepare("SELECT * FROM usuarios WHERE email = ?").get(email);

  if (!usuario) {
    return res.status(401).json({ sucesso: false, mensagem: "Email ou senha inválidos" });
  }

  const senhaValida = bcrypt.compareSync(senha, usuario.senha);
  if (!senhaValida) {
    return res.status(401).json({ sucesso: false, mensagem: "Email ou senha inválidos" });
  }

  const token = gerarToken(usuario);

  res.json({
    sucesso: true,
    token,
    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo }
  });
});

module.exports = router;