const { Router } = require("express");
const db = require("../db/database");
const { autenticar } = require("../middleware/auth");
const { validarCampos } = require("../middleware/validacao");

const router = Router();

router.get("/", autenticar, (_req, res) => {
  const entradas = db.prepare(
    `SELECT e.*, p.nome AS produtoNome, f.nome AS fornecedorNome
     FROM entradas e
     LEFT JOIN produtos p ON p.id = e.produtoId
     LEFT JOIN fornecedores f ON f.id = e.fornecedorId
     ORDER BY e.data DESC`
  ).all();
  res.json(entradas);
});

router.post("/", autenticar, validarCampos(["produtoId", "quantidade", "precoEntrada"]), (req, res) => {
  const produto = db.prepare("SELECT id FROM produtos WHERE id = ?").get(Number(req.body.produtoId));
  if (!produto) {
    return res.status(400).json({ mensagem: "Produto não encontrado" });
  }

  const quantidade = Number(req.body.quantidade);
  if (quantidade <= 0) {
    return res.status(400).json({ mensagem: "Quantidade deve ser maior que zero" });
  }

  if (req.body.fornecedorId) {
    const fornecedor = db.prepare("SELECT id FROM fornecedores WHERE id = ?").get(Number(req.body.fornecedorId));
    if (!fornecedor) {
      return res.status(400).json({ mensagem: "Fornecedor não encontrado" });
    }
  }

  const info = db.prepare(
    "INSERT INTO entradas (produtoId, quantidade, codigoBarras, precoEntrada, fornecedorId) VALUES (?, ?, ?, ?, ?)"
  ).run(
    Number(req.body.produtoId),
    quantidade,
    req.body.codigoBarras || "",
    Number(req.body.precoEntrada) || 0,
    req.body.fornecedorId ? Number(req.body.fornecedorId) : null
  );

  db.prepare("UPDATE produtos SET quantidade = quantidade + ? WHERE id = ?").run(
    quantidade, Number(req.body.produtoId)
  );

  const entrada = db.prepare("SELECT * FROM entradas WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json(entrada);
});

// GET /entradas/relatorio?inicio=YYYY-MM-DD&fim=YYYY-MM-DD&produtoId=X
router.get("/relatorio", autenticar, (req, res) => {
  let where = [];
  let params = [];

  if (req.query.inicio) {
    where.push("e.data >= ?");
    params.push(req.query.inicio);
  }
  if (req.query.fim) {
    where.push("e.data <= ?");
    params.push(req.query.fim + " 23:59:59");
  }
  if (req.query.produtoId) {
    where.push("e.produtoId = ?");
    params.push(Number(req.query.produtoId));
  }

  const clausula = where.length ? "WHERE " + where.join(" AND ") : "";

  const entradas = db.prepare(
    `SELECT e.id, e.data, e.codigoBarras, e.quantidade, e.precoEntrada,
            e.fornecedorId, f.nome AS fornecedorNome,
            p.id AS produtoId, p.nome AS produtoNome
     FROM entradas e
     LEFT JOIN produtos p ON p.id = e.produtoId
     LEFT JOIN fornecedores f ON f.id = e.fornecedorId
     ${clausula}
     ORDER BY e.data DESC`
  ).all(...params);

  const totais = db.prepare(
    `SELECT COUNT(*) AS totalEntradas, COALESCE(SUM(quantidade), 0) AS totalUnidades
     FROM entradas e
     ${clausula}`
  ).get(...params);

  res.json({
    periodo: { inicio: req.query.inicio || null, fim: req.query.fim || null },
    totais,
    entradas
  });
});

module.exports = router;