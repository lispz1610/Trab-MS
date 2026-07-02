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
import EntradaRegister from "./pages/EntradaRegister";
import SaidaRegister from "./pages/SaidaRegister";
import RelatorioEntradas from "./pages/RelatorioEntradas";
import RelatorioSaidas from "./pages/RelatorioSaidas";
import ProductManagement from "./pages/ProductManagement";
import ConsultaCodigoBarras from "./pages/ConsultaCodigoBarras";
import RelatorioGeral from "./pages/RelatorioGeral";
import GiroEstoque from "./pages/GiroEstoque";
import Ressuprimento from "./pages/Ressuprimento";

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
    if (caminho === "/entrada") return renderizar(EntradaRegister,true);
    if (caminho === "/saida") return renderizar(SaidaRegister,true);
    if (caminho === "/relatorio-entradas") return renderizar(RelatorioEntradas);
    if (caminho === "/relatorio-saidas") return renderizar(RelatorioSaidas);
    if (caminho === "/gerenciar-produtos") return renderizar(ProductManagement);
    if (caminho === "/consulta-codigo-barras") return renderizar(ConsultaCodigoBarras);
    if (caminho === "/relatorio-geral") return renderizar(RelatorioGeral);
    if (caminho === "/cadastro-fornecedor") return renderizar(SupplierRegister,true);
    if (caminho === "/usuarios") return renderizar(UserManagement);
    if (caminho === "/home-gerente" || caminho === "/") {
        return usuario.tipo === "gerente" ? renderizar(GerenteHome) : renderizar(FuncionarioHome);
    
  }
    return renderizar(usuario.tipo === "gerente" ? GerenteHome : FuncionarioHome);
}

export default App;