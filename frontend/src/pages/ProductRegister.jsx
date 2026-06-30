import React, { useState } from 'react';
import { Package, AlertCircle, CheckCircle2 } from 'lucide-react';
import './ProductRegister.css';

export default function ProductRegister() {
  const [productData, setProductData] = useState({
    nome: '',
    foto: null,
    descricao: '',
    unidadeComprada: '',
    estoqueMaximo: '',
    estoqueMinimo: '',
    pontoRessuprimento: '',
    tempoGiro: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const produtosCadastradosSimulados = ['Caderno Moleskine', 'Caneta Gel Preta'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleFileChange = (e) => {
    setProductData({ ...productData, foto: e.target.files[0] });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');
    setSuccess('');


    if (
      !productData.nome ||
      !productData.descricao ||
      !productData.unidadeComprada ||
      !productData.estoqueMaximo ||
      !productData.estoqueMinimo ||
      !productData.pontoRessuprimento ||
      !productData.tempoGiro
    ) {

      setError(
        'Erro: Todos os campos obrigatórios devem ser preenchidos.'
      );

      return;
    }


    const max = Number(productData.estoqueMaximo);
    const min = Number(productData.estoqueMinimo);
    const ponto = Number(productData.pontoRessuprimento);


    if (min < 0 || max < 0 || ponto < 0) {

      setError(
        'Erro: Os valores não podem ser negativos.'
      );

      return;
    }


    if (min >= max) {

      setError(
        'Erro: O estoque mínimo não pode ser maior ou igual ao máximo.'
      );

      return;
    }


    if (
      productData.foto &&
      productData.foto.size > 5 * 1024 * 1024
    ) {

      setError(
        'Erro: A imagem deve ter no máximo 5MB.'
      );

      return;
    }



    try {


      const resposta = await fetch(
        "http://localhost:3000/produtos",
        {

          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },


          body: JSON.stringify({

            nome: productData.nome,

            descricao: productData.descricao,

            unidadeComprada: productData.unidadeComprada,

            estoqueMaximo: productData.estoqueMaximo,

            estoqueMinimo: productData.estoqueMinimo,

            pontoRessuprimento: productData.pontoRessuprimento,

            tempoGiro: productData.tempoGiro

          })

        }
      );


      const dados = await resposta.json();


      console.log(
        "Produto salvo:",
        dados
      );


      setSuccess(
        "Produto cadastrado com sucesso no sistema!"
      );


      setProductData({

        nome: '',
        foto: null,
        descricao: '',
        unidadeComprada: '',
        estoqueMaximo: '',
        estoqueMinimo: '',
        pontoRessuprimento: '',
        tempoGiro: ''

      });


      document.getElementById('file-input').value = '';


    } catch (erro) {


      console.log(erro);


      setError(
        "Erro ao conectar com servidor"
      );


    }

  };

  return (
    <div className="product-container">
      <div className="product-card">
        <div className="card-header">
          <Package size={32} className="icon-header-prod" />
          <h2>Cadastro de Produtos </h2>
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

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label>Nome do Produto*</label>
            <input type="text" name="nome" value={productData.nome} onChange={handleChange} placeholder="Ex: Borracha Mercur" />
          </div>

          <div className="form-group">
            <label>Descrição do Produto*</label>
            <textarea name="descricao" value={productData.descricao} onChange={handleChange} placeholder="Descreva os detalhes do produto..." rows="2" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Unidade Comprada*</label>
              <input type="text" name="unidadeComprada" value={productData.unidadeComprada} onChange={handleChange} placeholder="Ex: Caixa, Unidade, Pacote" />
            </div>
            <div className="form-group">
              <label>Tempo de Giro (Dias)*</label>
              <input type="number" name="tempoGiro" value={productData.tempoGiro} onChange={handleChange} placeholder="Dias em estoque" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Estoque Mínimo*</label>
              <input type="number" name="estoqueMinimo" value={productData.estoqueMinimo} onChange={handleChange} placeholder="Mínimo" />
            </div>
            <div className="form-group">
              <label>Estoque Máximo*</label>
              <input type="number" name="estoqueMaximo" value={productData.estoqueMaximo} onChange={handleChange} placeholder="Máximo" />
            </div>
          </div>

          <div className="form-group">
            <label>Ponto de Ressuprimento*</label>
            <input type="number" name="pontoRessuprimento" value={productData.pontoRessuprimento} onChange={handleChange} placeholder="Quantidade limite para alerta" />
          </div>

          <div className="form-group">
            <label>Foto do Produto (Opcional)</label>
            <input id="file-input" type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <button type="submit" className="btn-submit-prod">Cadastrar Produto</button>
        </form>
      </div>
    </div>
  );
}