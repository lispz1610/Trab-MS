function GerenteHome() {

    const usuario = JSON.parse(
        localStorage.getItem("usuario")
    );

    function fazerLogout() {

        localStorage.removeItem("usuario");

        window.location.href = "/";

    }

    return (

        <div className="home-container">

            <h2>
                Bem-vindo(a), {usuario.nome || "gerente"}
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
                    window.location.href = "/gerenciar-produtos"
                }}
            >
                Gerenciar produtos
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
                    window.location.href = "/relatorio-entradas"
                }}
            >
                Relatório de entradas
            </button>

            <button
                onClick={() => {
                    window.location.href = "/relatorio-saidas"
                }}
            >
                Relatório de saídas
            </button>

            <button
                onClick={() => {
                    window.location.href = "/relatorio-geral"
                }}
            >
                Relatório geral do estoque
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
                    window.location.href = "/consulta-codigo-barras"
                }}
            >
                Consultar código de barras
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