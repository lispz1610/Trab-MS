function FuncionarioHome() {

    const usuario = JSON.parse(
        localStorage.getItem("usuario")
    );

    function fazerLogout() {

        localStorage.removeItem("usuario");

        window.location.href = "/";

    }
    return (

        <div className="home-container">
            <h2 className="home-welcome">
                Bem-vindo, {usuario.nome || "funcionário"} 
            </h2>


            <p>
                Usuário: {usuario.email}
            </p>


            <hr />


            <h3>
                Menu do funcionário
            </h3>

            <button
                onClick={() => {
                    window.location.href = "/cadastro-produto";
                }}>
                Cadastrar produtos
            </button>

            <button
                onClick={() => {
                    window.location.href = "/estoque";
                }}
            >
                Ver estoque
            </button>


            <button
                onClick={() => {
                    window.location.href = "/entrada"
                }}
            >
                Registrar entrada
            </button>


            <button
                onClick={() => {
                    window.location.href = "/saida"
                }}
            >
                Registrar saída
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
                    window.location.href = "/consulta-codigo-barras"
                }}
            >
                Consultar código de barras
            </button>

            <button
                onClick={() => {
                    window.location.href = "/trocar-senha";
                }}
            >
                Trocar senha
            </button>

            <button
                onClick={() => {
                    window.location.href = "/relatorio-geral"
                }}
            >
                Relatório geral do estoque
            </button>

            <button onClick={fazerLogout}>
                Sair
            </button>

        </div>

    )

}


export default FuncionarioHome;