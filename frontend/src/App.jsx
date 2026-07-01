import Login from "./pages/Login";
import GerenteHome from "./pages/GerenteHome";
import FuncionarioHome from "./pages/FuncionarioHome";
import Cadastro from "./pages/Cadastro";
import ProductRegister from "./pages/ProductRegister";
import SupplierRegister from "./pages/SupplierRegister";
import ChangePassword from "./pages/ChangePassword";
import ProductList from "./pages/ProductList";
import UserManagement from "./pages/UserManagement";
import AppLayout from "./pages/AppLayout";

function App() {

  const caminho = window.location.pathname;
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  
  if (!usuario) return <Login />;

  const renderizar = (Componente, showTabs = false) => (
    <AppLayout usuario={usuario} showTabs={showTabs}>
      <Componente />
    </AppLayout>
  );

  if (caminho === "/reposicao") return renderizar(Ressuprimento);
  if (caminho === "/giro") return renderizar(GiroEstoque);
  if (caminho === "/cadastro-produto") return renderizar(ProductRegister,true);
  if (caminho === "/trocar-senha") {
    return (
      <AppLayout usuario={usuario} showTabs={false}>
        <ChangePassword />
      </AppLayout>
    );
    }  
  if (caminho === "/estoque") {
    return (
      <AppLayout usuario={usuario} showTabs={false}>
        <ProductList />
      </AppLayout>
    );
    }  

    if (caminho === "/cadastro-funcionario") return renderizar(Cadastro,true);
    if (caminho === "/cadastro-fornecedor") return renderizar(SupplierRegister,true);
    if (caminho === "/usuarios") return renderizar(UserManagement);
    if (caminho === "/home-gerente" || caminho === "/") {
        return usuario.tipo === "gerente" ? renderizar(GerenteHome) : renderizar(FuncionarioHome);
    
  }
    return renderizar(usuario.tipo === "gerente" ? GerenteHome : FuncionarioHome);
}

export default App;