const { Router } = require("express");
const db = require("../db/database");
const { autenticar } = require("../middleware/auth");
const { validarCampos } = require("../middleware/validacao");

const router = Router();

router.get("/", autenticar, (_req, res) => {
  const produtos = db.prepare("SELECT * FROM produtos").all();
  res.json(produtos);
});

router.post("/", autenticar, validarCampos(["nome", "descricao", "unidadeComprada"]), (req, res) => {
  const info = db.prepare(
    `INSERT INTO produtos (nome, descricao, unidadeComprada, quantidade, estoqueMaximo, estoqueMinimo, pontoRessuprimento, tempoGiro)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    req.body.nome,
    req.body.descricao,
    req.body.unidadeComprada,
    Number(req.body.quantidade) || 0,
    Number(req.body.estoqueMaximo) || 0,
    Number(req.body.estoqueMinimo) || 0,
    Number(req.body.pontoRessuprimento) || 0,
    Number(req.body.tempoGiro) || 0
  );

  const produto = db.prepare("SELECT * FROM produtos WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json(produto);
});

router.put("/:id", autenticar, validarCampos(["nome", "descricao", "unidadeComprada"]), (req, res) => {
  const existente = db.prepare("SELECT id FROM produtos WHERE id = ?").get(Number(req.params.id));
  if (!existente) {
    return res.status(404).json({ mensagem: "Produto não encontrado" });
  }

  db.prepare(
    `UPDATE produtos SET nome=?, descricao=?, unidadeComprada=?, quantidade=?, estoqueMaximo=?, estoqueMinimo=?, pontoRessuprimento=?, tempoGiro=?
     WHERE id=?`
  ).run(
    req.body.nome,
    req.body.descricao,
    req.body.unidadeComprada,
    Number(req.body.quantidade) || 0,
    Number(req.body.estoqueMaximo) || 0,
    Number(req.body.estoqueMinimo) || 0,
    Number(req.body.pontoRessuprimento) || 0,
    Number(req.body.tempoGiro) || 0,
    Number(req.params.id)
  );

  const produto = db.prepare("SELECT * FROM produtos WHERE id = ?").get(Number(req.params.id));
  res.json(produto);
});

router.delete("/:id", autenticar, (req, res) => {
  const existente = db.prepare("SELECT id FROM produtos WHERE id = ?").get(Number(req.params.id));
  if (!existente) {
    return res.status(404).json({ mensagem: "Produto não encontrado" });
  }

  db.prepare("DELETE FROM produtos WHERE id = ?").run(Number(req.params.id));
  res.json({ sucesso: true });
});

module.exports = router;