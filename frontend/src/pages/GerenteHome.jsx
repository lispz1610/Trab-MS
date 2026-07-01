function GerenteHome() {

    const usuario = JSON.parse(
        localStorage.getItem("usuario")
    );

    function fazerLogout() {

        localStorage.removeItem("usuario");

        window.location.href = "/";

    }

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


            <button
                onClick={() => {
                    window.location.href = "/cadastro-produto";
                }}>
                Cadastrar produtos
            </button>


            <button
                onClick={() => {
                    window.location.href = "/cadastro-fornecedor";
                }}>
                Cadastrar fornecedores
            </button>

            <button
                onClick={() => {
                    window.location.href = "/cadastro-funcionario";
                }}>
                Cadastrar funcionários
            </button>


            <button
                onClick={() => {
                    window.location.href = "/estoque";
                }}
            >
                Ver estoque
            </button>

            <button>
                Relatórios
            </button>

            <button
                onClick={() => {
                    window.location.href = "/giro"
                }}
            >
                Produtos com giro excedido
            </button>

            <button
                onClick={() => {
                    window.location.href = "/usuarios";
                }}
            >
                Gerenciar usuários
            </button>

            <button
                onClick={() => {
                    window.location.href = "/reposicao"
                }}
            >
                Produtos para reposição
            </button>

            <button
                onClick={() => {
                    window.location.href = "/trocar-senha";
                }}
            >
                Trocar senha
            </button>

            <button onClick={fazerLogout}>
                Sair
            </button>

        </div>

    )

}


export default GerenteHome;