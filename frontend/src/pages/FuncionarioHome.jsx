function FuncionarioHome() {

    const usuario = JSON.parse(
        localStorage.getItem("usuario")
    );


    return (

        <div>

            <h1>
                Sistema Rabisco
            </h1>


            <h2>
                Bem-vindo, funcionário
            </h2>


            <p>
                Usuário: {usuario.email}
            </p>


            <hr />


            <h3>
                Menu do funcionário
            </h3>


            <button>
                Consultar estoque
            </button>


            <button>
                Registrar entrada
            </button>


            <button>
                Registrar saída
            </button>


        </div>

    )

}


export default FuncionarioHome;