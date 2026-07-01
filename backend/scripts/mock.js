const bcrypt = require("bcryptjs");
const db = require("../db/database");

console.log("=== Populando banco com dados mock ===\n");

// --- Usuarios ---
const usuarios = [
  { nome: "Maria Fernanda Gomes", email: "admin@email.com", senha: "123123", tipo: "gerente" },
  { nome: "João Silva", email: "joao@rabisco.com", senha: "123123", tipo: "funcionario" },
  { nome: "Ana Oliveira", email: "ana@rabisco.com", senha: "123123", tipo: "funcionario" },
];
const insUser = db.prepare("INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)");
for (const u of usuarios) {
  insUser.run(u.nome, u.email, bcrypt.hashSync(u.senha, 10), u.tipo);
}
console.log(`  ${usuarios.length} usuarios criados`);

// --- Fornecedores ---
const fornecedores = [
  { nome: "Borracharia Nacional Ltda", cnpj: "11222333000144", telefone: "1133334444" },
  { nome: "Papelaria Central S.A.", cnpj: "22333444000155", telefone: "1144445555" },
  { nome: "Distribuidora Escolar ME", cnpj: "33444555000166", telefone: "1155556666" },
  { nome: "Importadora Grafite Ltda", cnpj: "44555666000177", telefone: "1166667777" },
];
const insForn = db.prepare("INSERT INTO fornecedores (nome, cnpj, telefone) VALUES (?, ?, ?)");
for (const f of fornecedores) {
  insForn.run(f.nome, f.cnpj, f.telefone);
}
console.log(`  ${fornecedores.length} fornecedores criados`);

// --- Produtos ---
const produtos = [
  { nome: "Borracha Branca Pequena", descricao: "Borracha escolar branca tamanho pequeno", codigoBarras: "7891000000100", unidadeComprada: "Unidade", quantidade: 500, estoqueMaximo: 1000, estoqueMinimo: 50, pontoRessuprimento: 100, tempoGiro: 30 },
  { nome: "Borracha Branca Grande", descricao: "Borracha escolar branca tamanho grande", codigoBarras: "7891000000200", unidadeComprada: "Unidade", quantidade: 300, estoqueMaximo: 800, estoqueMinimo: 40, pontoRessuprimento: 80, tempoGiro: 45 },
  { nome: "Lápis Preto HB nº2", descricao: "Lápis preto HB nº2 hexagonal", codigoBarras: "7892000000100", unidadeComprada: "Caixa c/ 12", quantidade: 200, estoqueMaximo: 500, estoqueMinimo: 30, pontoRessuprimento: 60, tempoGiro: 20 },
  { nome: "Caneta Esferográfica Azul", descricao: "Caneta esferográfica azul ponta fina", codigoBarras: "7893000000100", unidadeComprada: "Caixa c/ 50", quantidade: 150, estoqueMaximo: 400, estoqueMinimo: 25, pontoRessuprimento: 50, tempoGiro: 25 },
  { nome: "Caneta Esferográfica Preta", descricao: "Caneta esferográfica preta ponta fina", codigoBarras: "7893000000200", unidadeComprada: "Caixa c/ 50", quantidade: 180, estoqueMaximo: 400, estoqueMinimo: 25, pontoRessuprimento: 50, tempoGiro: 25 },
  { nome: "Caderno Universitário 10 Matérias", descricao: "Caderno espiral capa dura 10 matérias", codigoBarras: "7894000000100", unidadeComprada: "Unidade", quantidade: 80, estoqueMaximo: 200, estoqueMinimo: 10, pontoRessuprimento: 20, tempoGiro: 60 },
  { nome: "Caderno Brochura 96 Folhas", descricao: "Caderno brochura 96 folhas pautado", codigoBarras: "7894000000200", unidadeComprada: "Unidade", quantidade: 120, estoqueMaximo: 300, estoqueMinimo: 15, pontoRessuprimento: 30, tempoGiro: 40 },
  { nome: "Apontador com Depósito", descricao: "Apontador plástico com depósito", codigoBarras: "7895000000100", unidadeComprada: "Unidade", quantidade: 400, estoqueMaximo: 800, estoqueMinimo: 60, pontoRessuprimento: 100, tempoGiro: 35 },
  { nome: "Régua 30cm Acrílica", descricao: "Régua acrílica transparente 30cm", codigoBarras: "7896000000100", unidadeComprada: "Unidade", quantidade: 250, estoqueMaximo: 500, estoqueMinimo: 30, pontoRessuprimento: 60, tempoGiro: 50 },
  { nome: "Cola Branca 90g", descricao: "Cola branca escolar lavável 90g", codigoBarras: "7897000000100", unidadeComprada: "Unidade", quantidade: 350, estoqueMaximo: 700, estoqueMinimo: 40, pontoRessuprimento: 80, tempoGiro: 30 },
];
const insProd = db.prepare(
  "INSERT INTO produtos (nome, descricao, codigoBarras, unidadeComprada, quantidade, estoqueMaximo, estoqueMinimo, pontoRessuprimento, tempoGiro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
);
for (const p of produtos) {
  insProd.run(p.nome, p.descricao, p.codigoBarras, p.unidadeComprada, p.quantidade, p.estoqueMaximo, p.estoqueMinimo, p.pontoRessuprimento, p.tempoGiro);
}
console.log(`  ${produtos.length} produtos criados`);

// --- Entradas (simulando 10 entradas nos ultimos 30 dias) ---
const datasEntradas = [
  "2026-06-01", "2026-06-05", "2026-06-10", "2026-06-12", "2026-06-15",
  "2026-06-18", "2026-06-20", "2026-06-22", "2026-06-25", "2026-06-28",
];
const entradas = [
  { produtoId: 1, quantidade: 200, codigoBarras: "7891000000100", precoEntrada: 0.50, fornecedorId: 1, data: datasEntradas[0] },
  { produtoId: 2, quantidade: 150, codigoBarras: "7891000000200", precoEntrada: 0.80, fornecedorId: 1, data: datasEntradas[1] },
  { produtoId: 3, quantidade: 100, codigoBarras: "7892000000100", precoEntrada: 3.00, fornecedorId: 2, data: datasEntradas[2] },
  { produtoId: 4, quantidade: 80, codigoBarras: "7893000000100", precoEntrada: 8.50, fornecedorId: 3, data: datasEntradas[3] },
  { produtoId: 5, quantidade: 90, codigoBarras: "7893000000200", precoEntrada: 8.50, fornecedorId: 3, data: datasEntradas[4] },
  { produtoId: 6, quantidade: 50, codigoBarras: "7894000000100", precoEntrada: 12.00, fornecedorId: 4, data: datasEntradas[5] },
  { produtoId: 7, quantidade: 60, codigoBarras: "7894000000200", precoEntrada: 4.50, fornecedorId: 4, data: datasEntradas[6] },
  { produtoId: 8, quantidade: 200, codigoBarras: "7895000000100", precoEntrada: 1.20, fornecedorId: 2, data: datasEntradas[7] },
  { produtoId: 9, quantidade: 120, codigoBarras: "7896000000100", precoEntrada: 1.50, fornecedorId: 1, data: datasEntradas[8] },
  { produtoId: 10, quantidade: 150, codigoBarras: "7897000000100", precoEntrada: 2.00, fornecedorId: 3, data: datasEntradas[9] },
];
const insEnt = db.prepare(
  "INSERT INTO entradas (produtoId, quantidade, codigoBarras, precoEntrada, fornecedorId, data) VALUES (?, ?, ?, ?, ?, ?)"
);
for (const e of entradas) {
  insEnt.run(e.produtoId, e.quantidade, e.codigoBarras, e.precoEntrada, e.fornecedorId, e.data);
}
console.log(`  ${entradas.length} entradas criadas`);
// Atualiza estoque com as entradas
for (const e of entradas) {
  db.prepare("UPDATE produtos SET quantidade = quantidade + ? WHERE id = ?").run(e.quantidade, e.produtoId);
}

// --- Saidas (simulando vendas e perdas) ---
const datasSaidas = [
  "2026-06-03", "2026-06-07", "2026-06-11", "2026-06-14", "2026-06-17",
  "2026-06-19", "2026-06-22", "2026-06-24", "2026-06-26", "2026-06-29",
  "2026-07-01", "2026-07-01",
];
const saidas = [
  { produtoId: 1, quantidade: 20, codigoBarras: "7891000000100", precoSaida: 1.50, tipoSaida: "venda", tipoPerda: "", cpfCliente: "11111111101", data: datasSaidas[0] },
  { produtoId: 3, quantidade: 15, codigoBarras: "7892000000100", precoSaida: 6.00, tipoSaida: "venda", tipoPerda: "", cpfCliente: "22222222202", data: datasSaidas[1] },
  { produtoId: 1, quantidade: 5, codigoBarras: "7891000000100", precoSaida: 0, tipoSaida: "perda", tipoPerda: "quebra", cpfCliente: "", data: datasSaidas[2] },
  { produtoId: 5, quantidade: 10, codigoBarras: "7893000000200", precoSaida: 15.00, tipoSaida: "venda", tipoPerda: "", cpfCliente: "33333333303", data: datasSaidas[3] },
  { produtoId: 8, quantidade: 30, codigoBarras: "7895000000100", precoSaida: 2.50, tipoSaida: "venda", tipoPerda: "", cpfCliente: "44444444404", data: datasSaidas[4] },
  { produtoId: 10, quantidade: 8, codigoBarras: "7897000000100", precoSaida: 4.00, tipoSaida: "venda", tipoPerda: "", cpfCliente: "55555555505", data: datasSaidas[5] },
  { produtoId: 4, quantidade: 5, codigoBarras: "7893000000100", precoSaida: 15.00, tipoSaida: "venda", tipoPerda: "", cpfCliente: "66666666606", data: datasSaidas[6] },
  { produtoId: 6, quantidade: 3, codigoBarras: "7894000000100", precoSaida: 18.00, tipoSaida: "venda", tipoPerda: "", cpfCliente: "77777777707", data: datasSaidas[7] },
  { produtoId: 9, quantidade: 15, codigoBarras: "7896000000100", precoSaida: 3.00, tipoSaida: "venda", tipoPerda: "", cpfCliente: "88888888808", data: datasSaidas[8] },
  { produtoId: 3, quantidade: 2, codigoBarras: "7892000000100", precoSaida: 0, tipoSaida: "perda", tipoPerda: "validade", cpfCliente: "", data: datasSaidas[9] },
  { produtoId: 2, quantidade: 10, codigoBarras: "7891000000200", precoSaida: 2.00, tipoSaida: "venda", tipoPerda: "", cpfCliente: "99999999909", data: datasSaidas[10] },
  { produtoId: 7, quantidade: 20, codigoBarras: "7894000000200", precoSaida: 8.00, tipoSaida: "venda", tipoPerda: "", cpfCliente: "12345678900", data: datasSaidas[11] },
];
const insSai = db.prepare(
  "INSERT INTO saidas (produtoId, quantidade, codigoBarras, precoSaida, tipoSaida, tipoPerda, cpfCliente, data) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
);
for (const s of saidas) {
  insSai.run(s.produtoId, s.quantidade, s.codigoBarras, s.precoSaida, s.tipoSaida, s.tipoPerda, s.cpfCliente, s.data);
}
console.log(`  ${saidas.length} saidas criadas`);
// Deduz estoque com as saidas
for (const s of saidas) {
  db.prepare("UPDATE produtos SET quantidade = quantidade - ? WHERE id = ?").run(s.quantidade, s.produtoId);
}

console.log("\n=== Mock concluido com sucesso! ===");
console.log("  3 usuarios (admin@email.com / 123123 eh gerente)");
console.log("  4 fornecedores");
console.log("  10 produtos");
console.log("  10 entradas (historico de 30 dias)");
console.log("  12 saidas (10 vendas + 2 perdas)");
console.log("\nEndpoints disponiveis para teste:");
console.log("  POST /login");
console.log("  GET/POST /produtos   PUT/DELETE /produtos/:id");
console.log("  GET/POST /entradas   GET /entradas/relatorio?inicio=...&fim=...&produtoId=...");
console.log("  GET/POST /saidas     GET /saidas/relatorio?inicio=...&fim=...&produtoId=...");
console.log("  GET/POST /fornecedores PUT/DELETE /fornecedores/:id");
console.log("  GET/POST /usuarios   PUT/DELETE /usuarios/:id   PUT /trocar-senha");