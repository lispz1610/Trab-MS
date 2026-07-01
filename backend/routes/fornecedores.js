const { Router } = require("express");
const db = require("../db/database");
const { autenticar } = require("../middleware/auth");
const { validarCampos } = require("../middleware/validacao");

const router = Router();

router.get("/", autenticar, (_req, res) => {
  const fornecedores = db.prepare("SELECT * FROM fornecedores").all();
  res.json(fornecedores);
});

router.post("/", autenticar, validarCampos(["nome", "cnpj", "telefone"]), (req, res) => {
  const info = db.prepare("INSERT INTO fornecedores (nome, cnpj, telefone) VALUES (?, ?, ?)").run(
    req.body.nome, req.body.cnpj, req.body.telefone
  );

  const fornecedor = db.prepare("SELECT * FROM fornecedores WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json(fornecedor);
});

router.put("/:id", autenticar, validarCampos(["nome", "cnpj", "telefone"]), (req, res) => {
  const existente = db.prepare("SELECT id FROM fornecedores WHERE id = ?").get(Number(req.params.id));
  if (!existente) {
    return res.status(404).json({ mensagem: "Fornecedor não encontrado" });
  }

  db.prepare("UPDATE fornecedores SET nome=?, cnpj=?, telefone=? WHERE id=?").run(
    req.body.nome, req.body.cnpj, req.body.telefone, Number(req.params.id)
  );

  const fornecedor = db.prepare("SELECT * FROM fornecedores WHERE id = ?").get(Number(req.params.id));
  res.json(fornecedor);
});

router.delete("/:id", autenticar, (req, res) => {
  const existente = db.prepare("SELECT id FROM fornecedores WHERE id = ?").get(Number(req.params.id));
  if (!existente) {
    return res.status(404).json({ mensagem: "Fornecedor não encontrado" });
  }

  db.prepare("DELETE FROM fornecedores WHERE id = ?").run(Number(req.params.id));
  res.json({ sucesso: true });
});

module.exports = router;