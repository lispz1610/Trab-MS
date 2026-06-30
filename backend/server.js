const express = require("express");
const cors = require("cors");
const fs = require("fs");


const app = express();


app.use(cors());
app.use(express.json());


// ler json
function lerArquivo(nome) {

    const dados = fs.readFileSync(
        `./dados/${nome}.json`
    );

    return JSON.parse(dados);

}

function salvarArquivo(nome, dados) {

    fs.writeFileSync(
        `./dados/${nome}.json`,
        JSON.stringify(dados, null, 2)
    );

}



// teste
app.get("/", (req, res) => {

    res.json({
        mensagem: "Sistema Rabisco funcionando"
    })

})



// listar produtos
app.get("/produtos", (req, res) => {

    const produtos = lerArquivo("produtos");

    res.json(produtos);

})



// cadastrar produto
app.post("/produtos", (req, res) => {


    const produtos = lerArquivo("produtos");


    const novoProduto = {

        id: Date.now(),

        nome: req.body.nome,

        descricao: req.body.descricao,

        estoque: req.body.estoque

    };


    produtos.push(novoProduto);


    salvarArquivo(
        "produtos",
        produtos
    );


    res.json(novoProduto);


})

app.post("/login", (req, res) => {

    const usuarios = lerArquivo("usuarios");

    const { email, senha } = req.body;

    const usuario = usuarios.find(
        u => u.email === email &&
            u.senha === senha
    );


    if (usuario) {

        res.json({
            sucesso: true,
            usuario
        });

    } else {

        res.status(401).json({
            sucesso: false,
            mensagem: "Email ou senha inválidos"
        });

    }

});


app.listen(3000, () => {

    console.log(
        "Servidor rodando na porta 3000"
    )

})