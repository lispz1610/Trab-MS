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
            <h2>
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


            <button>
                Registrar entrada
            </button>


            <button>
                Registrar saída
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


export default FuncionarioHome;