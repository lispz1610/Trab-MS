import React, { useState } from 'react';
import { UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import './UserRegister.css';

export default function UserRegister() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    perfil: '' // 'Gerente' ou 'Funcionário'
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // (teste flx alt 1)
  const emailsCadastradosSimulados = ['admin@rabisco.com', 'gerente@rabisco.com'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');
    setSuccess('');


    if (
      !formData.nome ||
      !formData.email ||
      !formData.senha ||
      !formData.perfil
    ) {

      setError(
        'Erro: Todos os campos obrigatórios devem ser preenchidos.'
      );

      return;
    }



    if (formData.senha.length < 6) {

      setError(
        'Erro: A senha temporária deve conter no mínimo 6 caracteres.'
      );

      return;
    }




    try {


      const resposta = await fetch(
        "http://localhost:3000/usuarios",
        {

          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },


          body: JSON.stringify({

            nome: formData.nome,

            email: formData.email,

            senha: formData.senha,


            // transforma o valor do rádio
            tipo:
              formData.perfil === "Gerente"
                ? "gerente"
                : "funcionario"


          })

        }
      );


      const dados = await resposta.json();


      console.log(
        "Usuário salvo:",
        dados
      );


      setSuccess(
        "Usuário cadastrado com sucesso!"
      );


      setFormData({

        nome: '',
        email: '',
        senha: '',
        perfil: ''

      });



    } catch (erro) {


      console.log(erro);


      setError(
        "Erro ao conectar com servidor"
      );


    }

  };
  return (
    <div className="register-container">
      <div className="register-card">
        <div className="card-header">
          <UserPlus size={32} className="icon-header" />
          <h2>Cadastro de Funcionários </h2>
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

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label>Nome Completo*</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Digite o nome"
            />
          </div>

          <div className="form-group">
            <label>E-mail*</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="exemplo@rabisco.com"
            />
          </div>

          <div className="form-group">
            <label>Senha Temporária*</label>
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div className="form-group">
            <label>Perfil do Usuário*</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="perfil"
                  value="Funcionário"
                  checked={formData.perfil === 'Funcionário'}
                  onChange={handleChange}
                />
                Funcionário
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="perfil"
                  value="Gerente"
                  checked={formData.perfil === 'Gerente'}
                  onChange={handleChange}
                />
                Gerente
              </label>
            </div>
          </div>

          <button type="submit" className="btn-submit">Confirmar Cadastro</button>
        </form>
      </div>
    </div>
  );
}