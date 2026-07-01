const bcrypt = require("bcryptjs");
const db = require("./database");

function migrar() {
  const fs = require("fs");
  const path = require("path");

  const dadosDir = path.join(__dirname, "..", "dados");

  // Verifica se ja existem dados no banco
  const count = db.prepare("SELECT COUNT(*) as total FROM usuarios").get();
  if (count.total > 0) {
    console.log("Banco ja possui dados — migracao ignorada.");
    return;
  }

  // --- usuarios ---
  try {
    const usuarios = JSON.parse(
      fs.readFileSync(path.join(dadosDir, "usuarios.json"), "utf-8")
    );
    const insertUsuario = db.prepare(
      "INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)"
    );
    for (const u of usuarios) {
      const senha = u.senha.startsWith("$2")
        ? u.senha
        : bcrypt.hashSync(u.senha, 10);
      insertUsuario.run(u.nome, u.email, senha, u.tipo);
    }
    console.log(`  ${usuarios.length} usuarios migrados`);
  } catch (e) {
    console.log("  nenhum usuario para migrar");
  }

  // --- produtos ---
  try {
    const produtos = JSON.parse(
      fs.readFileSync(path.join(dadosDir, "produtos.json"), "utf-8")
    );
    const insertProduto = db.prepare(
      "INSERT INTO produtos (nome, descricao, codigoBarras, unidadeComprada, quantidade, estoqueMaximo, estoqueMinimo, pontoRessuprimento, tempoGiro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    for (const p of produtos) {
      insertProduto.run(
        p.nome,
        p.descricao || "",
        p.codigoBarras || "",
        p.unidadeComprada || "Unidade",
        Number(p.quantidade) || 0,
        Number(p.estoqueMaximo) || 0,
        Number(p.estoqueMinimo) || 0,
        Number(p.pontoRessuprimento) || 0,
        Number(p.tempoGiro) || 0
      );
    }
    console.log(`  ${produtos.length} produtos migrados`);
  } catch (e) {
    console.log("  nenhum produto para migrar");
  }

  // --- fornecedores ---
  try {
    const fornecedores = JSON.parse(
      fs.readFileSync(path.join(dadosDir, "fornecedores.json"), "utf-8")
    );
    const insertFornecedor = db.prepare(
      "INSERT INTO fornecedores (nome, cnpj, telefone) VALUES (?, ?, ?)"
    );
    for (const f of fornecedores) {
      insertFornecedor.run(f.nome, f.cnpj, f.telefone);
    }
    console.log(`  ${fornecedores.length} fornecedores migrados`);
  } catch (e) {
    console.log("  nenhum fornecedor para migrar");
  }

  console.log("Migracao concluida.");
}

migrar();