import Login from "./pages/Login";
import GerenteHome from "./pages/GerenteHome";
import FuncionarioHome from "./pages/FuncionarioHome";
import Cadastro from "./pages/Cadastro";
import ProductRegister from "./pages/ProductRegister";
import SupplierRegister from "./pages/SupplierRegister";
import ChangePassword from "./pages/ChangePassword";
import ProductList from "./pages/ProductList";
import UserManagement from "./pages/UserManagement";

function App() {

  return <Cadastro />
/*
  const caminho = window.location.pathname;
  if (caminho === "/cadastro-produto") {
    return <ProductRegister />;
  } if (caminho === "/cadastro-fornecedor") {
    return <SupplierRegister />;
  } if (caminho === "/cadastro-funcionario") {
    return <Cadastro />;
  } if (caminho === "/trocar-senha") {
    return <ChangePassword />;
  } if (caminho === "/estoque") {
    return <ProductList />;
  } if (caminho === "/usuarios") {
    return <UserManagement />;
  }

  const usuario = JSON.parse(
    localStorage.getItem("usuario")
  );


  //ngm logado
  if (!usuario) {
    return <Login />;
  }


  //gerente
  if (usuario.tipo === "gerente") {

    return <GerenteHome />;

  }


  //funcionário
  if (usuario.tipo === "funcionario") {

    return <FuncionarioHome />;

  }

  //tirar isso dps
  return <Cadastro />;
*/

}


export default App;