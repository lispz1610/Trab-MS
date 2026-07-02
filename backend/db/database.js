const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "..", "dados", "rabisco.db");
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK(tipo IN ('gerente', 'funcionario'))
  );

  CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT NOT NULL DEFAULT '',
    codigoBarras TEXT NOT NULL DEFAULT '',
    unidadeComprada TEXT NOT NULL DEFAULT 'Unidade',
    quantidade INTEGER NOT NULL DEFAULT 0,
    estoqueMaximo INTEGER NOT NULL DEFAULT 0,
    estoqueMinimo INTEGER NOT NULL DEFAULT 0,
    pontoRessuprimento INTEGER NOT NULL DEFAULT 0,
    tempoGiro INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS fornecedores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    cnpj TEXT NOT NULL,
    telefone TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS entradas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produtoId INTEGER NOT NULL,
    quantidade INTEGER NOT NULL,
    codigoBarras TEXT NOT NULL DEFAULT '',
    precoEntrada REAL NOT NULL DEFAULT 0,
    fornecedorId INTEGER,
    data TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (produtoId) REFERENCES produtos(id) ON DELETE CASCADE,
    FOREIGN KEY (fornecedorId) REFERENCES fornecedores(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS saidas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produtoId INTEGER NOT NULL,
    quantidade INTEGER NOT NULL,
    codigoBarras TEXT NOT NULL DEFAULT '',
    precoSaida REAL NOT NULL DEFAULT 0,
    tipoSaida TEXT NOT NULL CHECK(tipoSaida IN ('venda', 'perda')),
    tipoPerda TEXT NOT NULL DEFAULT '',
    cpfCliente TEXT NOT NULL DEFAULT '',
    data TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (produtoId) REFERENCES produtos(id) ON DELETE CASCADE
  );
`);

// --- Migracao de schema em banco existente ---

function migrarSchema() {
  // Produtos: adiciona foto se nao existir
  try {
    db.exec("ALTER TABLE produtos ADD COLUMN foto TEXT NOT NULL DEFAULT ''");
    console.log("  coluna produtos.foto adicionada");
  } catch (e) { /* ja existe */ }

  // Produtos: adiciona codigoBarras se nao existir
  try {
    db.exec("ALTER TABLE produtos ADD COLUMN codigoBarras TEXT NOT NULL DEFAULT ''");
    console.log("  coluna produtos.codigoBarras adicionada");
  } catch (e) { /* ja existe */ }

  // Entradas: novas colunas
  for (const col of [
    "ALTER TABLE entradas ADD COLUMN codigoBarras TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE entradas ADD COLUMN precoEntrada REAL NOT NULL DEFAULT 0",
    "ALTER TABLE entradas ADD COLUMN fornecedorId INTEGER REFERENCES fornecedores(id) ON DELETE SET NULL",
  ]) {
    try { db.exec(col); console.log(`  coluna adicionada: ${col.split(' ')[3]}`); }
    catch (e) { /* ja existe */ }
  }

  // Saidas: novas colunas
  for (const col of [
    "ALTER TABLE saidas ADD COLUMN codigoBarras TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE saidas ADD COLUMN precoSaida REAL NOT NULL DEFAULT 0",
    "ALTER TABLE saidas ADD COLUMN tipoSaida TEXT NOT NULL DEFAULT 'venda' CHECK(tipoSaida IN ('venda', 'perda'))",
    "ALTER TABLE saidas ADD COLUMN tipoPerda TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE saidas ADD COLUMN cpfCliente TEXT NOT NULL DEFAULT ''",
  ]) {
    try { db.exec(col); console.log(`  coluna adicionada: ${col.split(' ')[3]}`); }
    catch (e) { /* ja existe */ }
  }
}

migrarSchema();

module.exports = db;