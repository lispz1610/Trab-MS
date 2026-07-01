//router -> qual tela inicial vai abrir?

import GerenteHome from "./GerenteHome";
import FuncionarioHome from "./FuncionarioHome";
import Login from "./Login";
import "./Home.css";

function Home() {


    const usuario = JSON.parse(
        localStorage.getItem("usuario")
    );


    if (!usuario) {

        return (
            <div class="container">
                <h2>Usuário não logado</h2>
            </div>
        )

    }


    if (usuario.tipo === "gerente") {

        return <GerenteHome />

    }


    return <FuncionarioHome />;


}


export default Home;
