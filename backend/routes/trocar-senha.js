const { Router } = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db/database");
const { autenticar } = require("../middleware/auth");
const { validarCampos } = require("../middleware/validacao");

const router = Router();

router.put("/", autenticar, validarCampos(["senhaAntiga", "novaSenha"]), (req, res) => {
  const usuario = db.prepare("SELECT * FROM usuarios WHERE id = ?").get(req.usuario.id);
  if (!usuario) {
    return res.status(404).json({ sucesso: false, mensagem: "Usuário não encontrado" });
  }

  const senhaOk = bcrypt.compareSync(req.body.senhaAntiga, usuario.senha);
  if (!senhaOk) {
    return res.status(401).json({ sucesso: false, mensagem: "Senha antiga incorreta" });
  }

  const novaHash = bcrypt.hashSync(req.body.novaSenha, 10);
  db.prepare("UPDATE usuarios SET senha = ? WHERE id = ?").run(novaHash, usuario.id);

  res.json({ sucesso: true });
});

module.exports = router;
