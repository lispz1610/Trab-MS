//router -> qual tela inicial vai abrir?

import GerenteHome from "./GerenteHome";
import FuncionarioHome from "./FuncionarioHome";


function Home() {


    const usuario = JSON.parse(
        localStorage.getItem("usuario")
    );


    if (!usuario) {

        return (
            <h1>
                Usuário não logado
            </h1>
        )

    }


    if (usuario.tipo === "gerente") {

        return <GerenteHome />

    }


    return <FuncionarioHome />;


}


export default Home;