import { useState } from "react";


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


        const usuario = JSON.parse(
            localStorage.getItem("usuario")
        );


        const resposta = await fetch(
            "http://localhost:3000/trocar-senha",
            {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    id: usuario.id,

                    senhaAntiga,

                    novaSenha

                })

            }
        );


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

        <div>


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


            <p>
                {mensagem}
            </p>


        </div>

    );

}


export default ChangePassword;