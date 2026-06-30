import React, { useState } from 'react';
import UserRegister from './UserRegister';
import ProductRegister from './ProductRegister';
import SupplierRegister from './SupplierRegister';
import logoRabisco from '../assets/images/logo.png';
import './Cadastro.css'; // Importação do CSS global

export default function Cadastro() {
  const [activeTab, setActiveTab] = useState('RF1');

  return (
    <div className="app-layout">
      <header className="app-navbar">
        <div className="brand-area">
          <img 
            src={logoRabisco} // Corrigido: usando a variável
            alt="Logo Sistema Rabisco" 
            className="app-logo"
          />
          <h1 className="app-title">Sistema Rabisco</h1>
        </div>
        <nav className="nav-tabs">
          <button 
            className={activeTab === 'RF1' ? 'tab-btn tab-btn-active' : 'tab-btn'} 
            onClick={() => setActiveTab('RF1')}
          >
            Cadastro de funcionários
          </button>
          <button 
            className={activeTab === 'RF2' ? 'tab-btn tab-btn-active' : 'tab-btn'} 
            onClick={() => setActiveTab('RF2')}
          >
            Cadastro de produtos {/* Texto corrigido */}
          </button>
          <button 
            className={activeTab === 'RF3' ? 'tab-btn tab-btn-active' : 'tab-btn'} 
            onClick={() => setActiveTab('RF3')}
          >
            Cadastro de fornecedores
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