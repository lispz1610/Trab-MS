function GerenteHome() {

    const usuario = JSON.parse(
        localStorage.getItem("usuario")
    );


    return (

        <div>

            <h1>
                Sistema Rabisco
            </h1>

            <h2>
                Bem-vindo, gerente
            </h2>


            <p>
                Usuário: {usuario.email}
            </p>


            <hr />


            <h3>
                Menu do gerente
            </h3>


            <button>
                Cadastrar produtos
            </button>


            <button>
                Cadastrar fornecedores
            </button>


            <button>
                Ver estoque
            </button>


            <button>
                Relatórios
            </button>


            <button>
                Usuários
            </button>


        </div>

    )

}


export default GerenteHome;