const { Router } = require("express");
const db = require("../db/database");
const { autenticar, autorizar } = require("../middleware/auth");

const router = Router();

// GET /relatorio-geral?inicio=YYYY-MM-DD&fim=YYYY-MM-DD
router.get("/", autenticar, autorizar("gerente"), (req, res) => {
  let where = [];
  let params = [];

  if (req.query.inicio) {
    where.push("data >= ?");
    params.push(req.query.inicio);
  }
  if (req.query.fim) {
    where.push("data <= ?");
    params.push(req.query.fim + " 23:59:59");
  }

  const clausula = where.length ? "WHERE " + where.join(" AND ") : "";

  // Total de entradas no período
  const totalEntradas = db.prepare(
    `SELECT COUNT(*) AS total, COALESCE(SUM(quantidade), 0) AS unidades
     FROM entradas ${clausula}`
  ).get(...params);

  // Total de saídas no período
  const totalSaidas = db.prepare(
    `SELECT COUNT(*) AS total, COALESCE(SUM(quantidade), 0) AS unidades
     FROM saidas ${clausula}`
  ).get(...params);

  // Produtos com situação atual do estoque
  const produtos = db.prepare(`
    SELECT p.id, p.nome, p.quantidade, p.estoqueMaximo, p.estoqueMinimo,
           p.unidadeComprada,
           (SELECT e.data FROM entradas e WHERE e.produtoId = p.id ORDER BY e.data DESC LIMIT 1) AS ultimaEntrada,
           (SELECT e.codigoBarras FROM entradas e WHERE e.produtoId = p.id ORDER BY e.data DESC LIMIT 1) AS ultimoCodigoBarras,
           (SELECT s.data FROM saidas s WHERE s.produtoId = p.id ORDER BY s.data DESC LIMIT 1) AS ultimaSaida
    FROM produtos p
    ORDER BY p.nome
  `).all();

  // Movimentações no período
  const movimentacoes = db.prepare(`
    SELECT 'entrada' AS tipo, e.id, e.data, e.codigoBarras, e.quantidade, e.precoEntrada AS valor,
           p.nome AS produtoNome
    FROM entradas e
    LEFT JOIN produtos p ON p.id = e.produtoId
    ${clausula.replace(/data/g, "e.data")}
    UNION ALL
    SELECT 'saida' AS tipo, s.id, s.data, s.codigoBarras, s.quantidade, s.precoSaida AS valor,
           p.nome AS produtoNome
    FROM saidas s
    LEFT JOIN produtos p ON p.id = s.produtoId
    ${clausula.replace(/data/g, "s.data")}
    ORDER BY data DESC
  `).all(...params, ...params);

  res.json({
    periodo: {
      inicio: req.query.inicio || null,
      fim: req.query.fim || null
    },
    totais: {
      entradas: totalEntradas,
      saidas: totalSaidas
    },
    produtos,
    movimentacoes
  });
});

module.exports = router;