import { useState } from "react";
import { apiFetch } from "../api";
import './ChangePassword.css';

function ChangePassword() {

    const [senhaAntiga, setSenhaAntiga] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [mensagem, setMensagem] = useState("");

    async function trocarSenha(e) {

        e.preventDefault();


        if (novaSenha !== confirmarSenha) {

            setMensagem(
                "A nova senha e a confirmação são diferentes"
            );

            return;
        }

        const resposta = await apiFetch("/trocar-senha", {
            method: "PUT",
            body: JSON.stringify({
                senhaAntiga,
                novaSenha
            })
        });

        const dados = await resposta.json();


        if (dados.sucesso) {

            setMensagem(
                "Senha alterada com sucesso!"
            );

            setSenhaAntiga("");
            setNovaSenha("");
            setConfirmarSenha("");

        } else {

            setMensagem(
                dados.mensagem
            );

        }

    }

    return (

        <div className="pagina-container">

            <div className="change-passw-card">

                <h1>
                    Trocar senha
                </h1>

                <form onSubmit={trocarSenha}>

                    <input

                        type="password"

                        placeholder="Senha antiga"

                        value={senhaAntiga}

                        onChange={
                            e => setSenhaAntiga(e.target.value)
                        }

                    />

                    <input

                        type="password"

                        placeholder="Nova senha"

                        value={novaSenha}

                        onChange={
                            e => setNovaSenha(e.target.value)
                        }

                    />

                    <input

                        type="password"

                        placeholder="Confirmar nova senha"

                        value={confirmarSenha}

                        onChange={
                            e => setConfirmarSenha(e.target.value)
                        }

                    />

                    <button>
                        Alterar senha
                    </button>

            </form>

            <p className="mensagem">
                {mensagem}
            </p>

        </div>
     </div>

    );

}


export default ChangePassword;