const { Router } = require("express");
const path = require("path");
const multer = require("multer");
const db = require("../db/database");
const { autenticar, autorizar } = require("../middleware/auth");
const { validarCampos } = require("../middleware/validacao");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `produto-${unique}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const tipos = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (tipos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Apenas imagens JPEG, PNG, WebP e GIF são permitidas"));
    }
  }
});

const router = Router();

router.get("/", autenticar, (_req, res) => {
  const produtos = db.prepare(`
    SELECT p.*,
           (SELECT e.data FROM entradas e WHERE e.produtoId = p.id ORDER BY e.data DESC LIMIT 1) AS ultimaEntrada,
           (SELECT e.codigoBarras FROM entradas e WHERE e.produtoId = p.id ORDER BY e.data DESC LIMIT 1) AS ultimoCodigoBarras
    FROM produtos p
  `).all();
  res.json(produtos);
});

router.post("/", autenticar, upload.single("foto"), (req, res) => {
  const { nome, descricao, unidadeComprada, quantidade, estoqueMaximo, estoqueMinimo, pontoRessuprimento, tempoGiro } = req.body;

  if (!nome || !descricao || !unidadeComprada) {
    return res.status(400).json({ mensagem: "Campos obrigatórios: nome, descricao, unidadeComprada" });
  }

  const foto = req.file ? `/uploads/${req.file.filename}` : "";

  const info = db.prepare(
    `INSERT INTO produtos (nome, descricao, foto, unidadeComprada, quantidade, estoqueMaximo, estoqueMinimo, pontoRessuprimento, tempoGiro)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    nome,
    descricao,
    foto,
    unidadeComprada,
    Number(quantidade) || 0,
    Number(estoqueMaximo) || 0,
    Number(estoqueMinimo) || 0,
    Number(pontoRessuprimento) || 0,
    Number(tempoGiro) || 0
  );

  const produto = db.prepare("SELECT * FROM produtos WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json(produto);
});

router.put("/:id", autenticar, upload.single("foto"), (req, res) => {
  const existente = db.prepare("SELECT * FROM produtos WHERE id = ?").get(Number(req.params.id));
  if (!existente) {
    return res.status(404).json({ mensagem: "Produto não encontrado" });
  }

  const foto = req.file ? `/uploads/${req.file.filename}` : existente.foto;
  const { nome, descricao, unidadeComprada, quantidade, estoqueMaximo, estoqueMinimo, pontoRessuprimento, tempoGiro } = req.body;

  db.prepare(
    `UPDATE produtos SET nome=?, descricao=?, foto=?, unidadeComprada=?, quantidade=?, estoqueMaximo=?, estoqueMinimo=?, pontoRessuprimento=?, tempoGiro=?
     WHERE id=?`
  ).run(
    nome || existente.nome,
    descricao || existente.descricao,
    foto,
    unidadeComprada || existente.unidadeComprada,
    Number(quantidade) || 0,
    Number(estoqueMaximo) || 0,
    Number(estoqueMinimo) || 0,
    Number(pontoRessuprimento) || 0,
    Number(tempoGiro) || 0,
    Number(req.params.id)
  );

  const produto = db.prepare("SELECT * FROM produtos WHERE id = ?").get(Number(req.params.id));
  res.json(produto);
});

router.delete("/:id", autenticar, autorizar("gerente"), (req, res) => {
  const existente = db.prepare("SELECT id FROM produtos WHERE id = ?").get(Number(req.params.id));
  if (!existente) {
    return res.status(404).json({ mensagem: "Produto não encontrado" });
  }

  db.prepare("DELETE FROM produtos WHERE id = ?").run(Number(req.params.id));
  res.json({ sucesso: true });
});

module.exports = router;