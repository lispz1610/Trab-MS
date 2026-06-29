import React, { useState } from 'react';
import UserRegister from './UserRegister';
import ProductRegister from './ProductRegister';
import SupplierRegister from './SupplierRegister';
import logoRabisco from '../assets/images/logo.png';
import '../App.css'; 

function Home({ usuario, onLogout }) {
  const [activeTab, setActiveTab] = useState('RF1');

  return (
    <div className="app-layout">
      <header className="app-navbar">
        <div className="usuario-info">
          <span>Olá, <strong>{usuario?.nome || "Usuário"}</strong>!</span>
          <button onClick={onLogout} className="btn-sair">Sair</button>
        </div>
        
        <div className="brand-area">
          <img 
            src={logoRabisco}
            alt="Logo Sistema Rabisco" 
            className="app-logo" 
          />
          <h1 className="app-title">Sistema Rabisco</h1>
        </div>

        <nav className="nav-tabs">
          <button 
            className={activeTab === 'RF1' ? 'tab-btn active' : 'tab-btn'} 
            onClick={() => setActiveTab('RF1')}
          >
            Cadastrar funcionário
          </button>
          <button 
            className={activeTab === 'RF2' ? 'tab-btn active' : 'tab-btn'} 
            onClick={() => setActiveTab('RF2')}
          >
            Cadastrar produto
          </button>
          <button 
            className={activeTab === 'RF3' ? 'tab-btn active' : 'tab-btn'} 
            onClick={() => setActiveTab('RF3')}
          >
            Cadastrar fornecedor
          </button>
        </nav>
      </header>

      <main className="app-content">
        {activeTab === 'RF1' && <UserRegister />}
        {activeTab === 'RF2' && <ProductRegister />}
        {activeTab === 'RF3' && <SupplierRegister />}
      </main>
    </div>
  );
}

export default Home;
