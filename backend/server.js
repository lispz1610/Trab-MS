const express = require("express");
const cors = require("cors");
const fs = require("fs");


const app = express();


app.use(cors());
app.use(express.json());


//ler json
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



//teste
app.get("/", (req, res) => {

    res.json({
        mensagem: "Sistema Rabisco funcionando"
    })

})



//listar produtos
app.get("/produtos", (req, res) => {

    const produtos = lerArquivo("produtos");

    res.json(produtos);

})

//cadastrar usuário
app.post("/usuarios", (req, res) => {


    const usuarios = lerArquivo("usuarios");


    const novoUsuario = {

        id: Date.now(),

        nome: req.body.nome,

        email: req.body.email,

        senha: req.body.senha,

        tipo: req.body.tipo

    };


    usuarios.push(novoUsuario);


    salvarArquivo(
        "usuarios",
        usuarios
    );


    res.json(novoUsuario);


});


//cadastrar produto
app.post("/produtos", (req, res) => {


    const produtos = lerArquivo("produtos");


    const novoProduto = {


        id: Date.now(),

        nome: req.body.nome,

        descricao: req.body.descricao,

        unidadeComprada: req.body.unidadeComprada,

        estoqueMaximo: req.body.estoqueMaximo,

        estoqueMinimo: req.body.estoqueMinimo,

        pontoRessuprimento: req.body.pontoRessuprimento,

        tempoGiro: req.body.tempoGiro

    };


    produtos.push(novoProduto);


    salvarArquivo(
        "produtos",
        produtos
    );


    res.json(novoProduto);


})

// listar fornecedores
app.get("/fornecedores", (req, res) => {

    const fornecedores = lerArquivo("fornecedores");

    res.json(fornecedores);

});




// cadastrar fornecedor
app.post("/fornecedores", (req, res) => {


    const fornecedores = lerArquivo("fornecedores");


    const novoFornecedor = {


        id: Date.now(),

        nome: req.body.nome,

        cnpj: req.body.cnpj,

        telefone: req.body.telefone,

    };


    fornecedores.push(novoFornecedor);


    salvarArquivo(
        "fornecedores",
        fornecedores
    );


    res.json(novoFornecedor);


});

//listar users
app.get("/usuarios", (req, res) => {


    const usuarios = lerArquivo("usuarios");


    res.json(usuarios);


});

//editar users
app.put("/usuarios/:id", (req, res) => {


    const usuarios = lerArquivo("usuarios");


    const id = Number(req.params.id);


    const usuario = usuarios.find(
        u => u.id === id
    );


    if (!usuario) {

        return res.status(404).json({
            mensagem: "Usuário não encontrado"
        });

    }



    usuario.email = req.body.email;

    usuario.tipo = req.body.tipo;


    if (req.body.senha) {

        usuario.senha = req.body.senha;

    }



    salvarArquivo(
        "usuarios",
        usuarios
    );


    res.json(usuario);


});

//excluir user
app.delete("/usuarios/:id", (req, res) => {


    let usuarios = lerArquivo("usuarios");


    const id = Number(req.params.id);



    usuarios = usuarios.filter(
        u => u.id !== id
    );



    salvarArquivo(
        "usuarios",
        usuarios
    );



    res.json({
        sucesso: true
    });


});

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

app.put("/trocar-senha", (req, res) => {


    const usuarios = lerArquivo("usuarios");


    const {
        id,
        senhaAntiga,
        novaSenha
    } = req.body;



    const usuario = usuarios.find(
        u => u.id === id
    );



    if (!usuario) {

        return res.status(404).json({

            sucesso: false,

            mensagem: "Usuário não encontrado"

        });

    }



    if (usuario.senha !== senhaAntiga) {

        return res.status(401).json({

            sucesso: false,

            mensagem: "Senha antiga incorreta"

        });

    }



    usuario.senha = novaSenha;



    salvarArquivo(
        "usuarios",
        usuarios
    );



    res.json({

        sucesso: true

    });


});


app.listen(3000, () => {

    console.log(
        "Servidor rodando na porta 3000"
    )

})