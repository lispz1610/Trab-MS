function validarCampos(camposObrigatorios) {
  return (req, res, next) => {
    for (const campo of camposObrigatorios) {
      if (req.body[campo] === undefined || req.body[campo] === null || req.body[campo] === "") {
        return res.status(400).json({
          mensagem: `Campo obrigatório não informado: ${campo}`
        });
      }
    }
    next();
  };
}

module.exports = { validarCampos };
