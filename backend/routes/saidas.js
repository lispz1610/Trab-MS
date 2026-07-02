const { Router } = require("express");
const db = require("../db/database");
const { autenticar, autorizar } = require("../middleware/auth");
const { validarCampos } = require("../middleware/validacao");

const router = Router();

router.get("/", autenticar, (_req, res) => {
  const saidas = db.prepare(
    `SELECT s.*, p.nome AS produtoNome
     FROM saidas s
     LEFT JOIN produtos p ON p.id = s.produtoId
     ORDER BY s.data DESC`
  ).all();
  res.json(saidas);
});

router.post("/", autenticar, validarCampos(["produtoId", "quantidade", "precoSaida", "tipoSaida"]), (req, res) => {
  const produto = db.prepare("SELECT id, quantidade FROM produtos WHERE id = ?").get(Number(req.body.produtoId));
  if (!produto) {
    return res.status(400).json({ mensagem: "Produto não encontrado" });
  }

  const quantidade = Number(req.body.quantidade);
  if (quantidade <= 0) {
    return res.status(400).json({ mensagem: "Quantidade deve ser maior que zero" });
  }

  if (produto.quantidade < quantidade) {
    return res.status(400).json({ mensagem: "Estoque insuficiente" });
  }

  const tipoSaida = req.body.tipoSaida;
  if (tipoSaida !== "venda" && tipoSaida !== "perda") {
    return res.status(400).json({ mensagem: "tipoSaida deve ser 'venda' ou 'perda'" });
  }

  if (tipoSaida === "perda" && !req.body.tipoPerda) {
    return res.status(400).json({ mensagem: "tipoPerda é obrigatório quando tipoSaida é 'perda'" });
  }

  const info = db.prepare(
    "INSERT INTO saidas (produtoId, quantidade, codigoBarras, precoSaida, tipoSaida, tipoPerda, cpfCliente) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(
    Number(req.body.produtoId),
    quantidade,
    req.body.codigoBarras || "",
    Number(req.body.precoSaida) || 0,
    tipoSaida,
    req.body.tipoPerda || "",
    req.body.cpfCliente || ""
  );

  db.prepare("UPDATE produtos SET quantidade = quantidade - ? WHERE id = ?").run(
    quantidade, Number(req.body.produtoId)
  );

  const saida = db.prepare("SELECT * FROM saidas WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json(saida);
});

// GET /saidas/relatorio?inicio=YYYY-MM-DD&fim=YYYY-MM-DD&produtoId=X
router.get("/relatorio", autenticar, autorizar("gerente"), (req, res) => {
  let where = [];
  let params = [];

  if (req.query.inicio) {
    where.push("s.data >= ?");
    params.push(req.query.inicio);
  }
  if (req.query.fim) {
    where.push("s.data <= ?");
    params.push(req.query.fim + " 23:59:59");
  }
  if (req.query.produtoId) {
    where.push("s.produtoId = ?");
    params.push(Number(req.query.produtoId));
  }

  const clausula = where.length ? "WHERE " + where.join(" AND ") : "";

  const saidas = db.prepare(
    `SELECT s.id, s.data, s.codigoBarras, s.quantidade, s.precoSaida,
            s.tipoSaida, s.tipoPerda, s.cpfCliente,
            p.id AS produtoId, p.nome AS produtoNome
     FROM saidas s
     LEFT JOIN produtos p ON p.id = s.produtoId
     ${clausula}
     ORDER BY s.data DESC`
  ).all(...params);

  const totais = db.prepare(
    `SELECT COUNT(*) AS totalSaidas, COALESCE(SUM(quantidade), 0) AS totalUnidades
     FROM saidas s
     ${clausula}`
  ).get(...params);

  res.json({
    periodo: { inicio: req.query.inicio || null, fim: req.query.fim || null },
    totais,
    saidas
  });
});

module.exports = router;