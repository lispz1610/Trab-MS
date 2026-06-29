import React, { useState } from 'react';
import { Truck, AlertCircle, CheckCircle2 } from 'lucide-react';
import './SupplierRegister.css';

export default function SupplierRegister() {
  const [supplierData, setSupplierData] = useState({
    cnpj: '',
    nome: '',
    telefone: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fornecedoresSimulados = ['12345678000199']; // teste

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplierData({ ...supplierData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
//flx alt 1
    if (!supplierData.cnpj || !supplierData.nome || !supplierData.telefone) {
      setError('Erro: Todos os campos obrigatórios (CNPJ, Nome e Telefone) devem ser preenchidos.');
      return;
    }
//limpeza caracteres
    const cnpjLimpo = supplierData.cnpj.replace(/\D/g, '');
    const telefoneLimpo = supplierData.telefone.replace(/\D/g, '');
//cnpj invalido
    if (cnpjLimpo.length !== 14) {
      setError('Erro: CNPJ inválido. Certifique-se de que possui 14 dígitos.');
      return;
    }

    if (fornecedoresSimulados.includes(cnpjLimpo)) {
      setError('Erro: Fornecedor já cadastrado com este CNPJ.');
      return;
    }

    if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
      setError('Erro: Telefone inválido. Deve conter DDD + Número (10 ou 11 dígitos).');
      return;
    }

    setSuccess('Fornecedor cadastrado com sucesso no sistema!');
    setSupplierData({ cnpj: '', nome: '', telefone: '' });
  };

  return (
    <div className="supplier-container">
      <div className="supplier-card">
        <div className="card-header">
          <Truck size={32} className="icon-header-supp" />
          <h2>Cadastro de Fornecedores</h2>
        </div>

        {error && (
          <div className="alert-message error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert-message success">
            <CheckCircle2 size={20} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="supplier-form">
          <div className="form-group">
            <label>CNPJ do Fornecedor*</label>
            <input
              type="text"
              name="cnpj"
              value={supplierData.cnpj}
              onChange={handleChange}
              placeholder="00.000.000/0000-00 (Apenas números)"
            />
          </div>

          <div className="form-group">
            <label>Nome do Fornecedor*</label>
            <input
              type="text"
              name="nome"
              value={supplierData.nome}
              onChange={handleChange}
              placeholder="Razão Social ou Nome Fantasia"
            />
          </div>

          <div className="form-group">
            <label>Telefone*</label>
            <input
              type="text"
              name="telefone"
              value={supplierData.telefone}
              onChange={handleChange}
              placeholder="(32) 99999-9999"
            />
          </div>

          <button type="submit" className="btn-submit-supp">Cadastrar Fornecedor</button>
        </form>
      </div>
    </div>
  );
}