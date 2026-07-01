const { Router } = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db/database");
const { autenticar } = require("../middleware/auth");
const { validarCampos } = require("../middleware/validacao");

const router = Router();

// GET /usuarios
router.get("/", autenticar, (_req, res) => {
  const usuarios = db.prepare("SELECT id, nome, email, tipo FROM usuarios").all();
  res.json(usuarios);
});

// POST /usuarios
router.post("/", autenticar, validarCampos(["nome", "email", "senha", "tipo"]), (req, res) => {
  const existe = db.prepare("SELECT id FROM usuarios WHERE email = ?").get(req.body.email);
  if (existe) {
    return res.status(400).json({ mensagem: "Email já cadastrado" });
  }

  const senhaHash = bcrypt.hashSync(req.body.senha, 10);

  const info = db.prepare("INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)").run(
    req.body.nome, req.body.email, senhaHash, req.body.tipo
  );

  const usuario = db.prepare("SELECT id, nome, email, tipo FROM usuarios WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json(usuario);
});

// PUT /usuarios/:id
router.put("/:id", autenticar, validarCampos(["email", "tipo"]), (req, res) => {
  const usuario = db.prepare("SELECT * FROM usuarios WHERE id = ?").get(Number(req.params.id));
  if (!usuario) {
    return res.status(404).json({ mensagem: "Usuário não encontrado" });
  }

  let senhaAtualizada = usuario.senha;
  if (req.body.senha) {
    senhaAtualizada = bcrypt.hashSync(req.body.senha, 10);
  }

  db.prepare("UPDATE usuarios SET email = ?, tipo = ?, senha = ? WHERE id = ?").run(
    req.body.email, req.body.tipo, senhaAtualizada, usuario.id
  );

  res.json({ id: usuario.id, nome: usuario.nome, email: req.body.email, tipo: req.body.tipo });
});

// DELETE /usuarios/:id
router.delete("/:id", autenticar, (req, res) => {
  db.prepare("DELETE FROM usuarios WHERE id = ?").run(Number(req.params.id));
  res.json({ sucesso: true });
});

module.exports = router;