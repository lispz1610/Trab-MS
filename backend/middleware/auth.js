const jwt = require("jsonwebtoken");

const segredo = process.env.JWT_SECRET || "rabisco-segredo";

function gerarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, email: usuario.email, tipo: usuario.tipo },
    segredo,
    { expiresIn: "8h" }
  );
}

function autenticar(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ mensagem: "Token não informado" });
  }

  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ mensagem: "Token mal formatado" });
  }

  try {
    const payload = jwt.verify(token, segredo);
    req.usuario = payload;
    next();
  } catch (err) {
    return res.status(401).json({ mensagem: "Token inválido ou expirado" });
  }
}

function autorizar(...tipos) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ mensagem: "Não autenticado" });
    }
    if (!tipos.includes(req.usuario.tipo)) {
      return res.status(403).json({ mensagem: "Acesso negado: permissão insuficiente" });
    }
    next();
  };
}

module.exports = { gerarToken, autenticar, autorizar };
