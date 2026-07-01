// src/components/AppLayout.jsx
import logoRabisco from '../assets/images/logo.png';
import './Cadastro.css';

export default function AppLayout({ children, usuario, showTabs = true }) {
  const caminho = window.location.pathname;

  const irParaHome = () => {
    window.location.href = usuario?.tipo === 'gerente' ? '/home-gerente' : '/home-funcionario';
    };

  return (
    <div className="app-layout">
      <header className="app-navbar">
        <div className="brand-area" onClick={irParaHome} style={{ cursor: 'pointer'}}>
           <img 

           src={logoRabisco} 

           alt="Logo Sistema Rabisco" 

           className="app-logo" ></img>
          <span className="app-title">Sistema</span>
          <span className='scnd-app-title'>Rabisco</span>
        </div>
        
        {/* Só renderiza as tabs se showTabs for true */}
        {showTabs && (
          <nav className="nav-tabs">
            <button 
              className={caminho === '/cadastro-produto' ? 'tab-btn tab-btn-active' : 'tab-btn'}
              onClick={() => window.location.href = '/cadastro-produto'}
            >
              Cadastro de produtos
            </button>
            
            {usuario?.tipo === 'gerente' && (
              <>
                <button 
                  className={caminho === '/cadastro-funcionario' ? 'tab-btn tab-btn-active' : 'tab-btn'}
                  onClick={() => window.location.href = '/cadastro-funcionario'}
                >
                  Cadastro de funcionários
                </button>
                <button 
                  className={caminho === '/cadastro-fornecedor' ? 'tab-btn tab-btn-active' : 'tab-btn'}
                  onClick={() => window.location.href = '/cadastro-fornecedor'}
                >
                  Cadastro de fornecedores
                </button>
              </>
            )}
          </nav>
        )}
      </header>
      <main className="app-content">{children}</main>
    </div>
  );
}