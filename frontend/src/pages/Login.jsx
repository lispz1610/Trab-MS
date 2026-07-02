import { useState } from "react";


function Login() {

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");


    async function fazerLogin(e) {

        e.preventDefault();

        try {

            const resposta = await fetch(
                "http://localhost:3000/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        senha
                    })
                }
            );


            const dados = await resposta.json();

            console.log("RESPOSTA DO SERVIDOR:", dados);

            if (dados.sucesso) {

                const usuarioComToken = {
                    ...dados.usuario,
                    token: dados.token
                };

                localStorage.setItem(
                    "usuario",
                    JSON.stringify(usuarioComToken)
                );


                console.log(
                    "Usuário:",
                    dados.usuario
                );


                if (dados.usuario.tipo === "gerente") {

                    window.location.href = "/home-gerente";

                } else {

                    window.location.href = "/";

                }


            }
        } catch (erro) {

            setMensagem(
                "Erro ao conectar com servidor"
            );

        }

    }



    return (

        <div style={styles.container}>


            <form
                onSubmit={fazerLogin}
                style={styles.card}
            >

                <h1 style={styles.titulo}>
                    Sistema Rabisco
                </h1>


                <p>
                    Controle de estoque
                </p>


                <input

                    type="email"

                    placeholder="Email"

                    value={email}

                    onChange={
                        (e) => setEmail(e.target.value)
                    }

                    style={styles.input}

                />


                <input

                    type="password"

                    placeholder="Senha"

                    value={senha}

                    onChange={
                        (e) => setSenha(e.target.value)
                    }

                    style={styles.input}

                />


                <button
                    type="submit"
                    style={styles.button}
                >

                    Entrar

                </button>


                {
                    mensagem &&
                    <p>
                        {mensagem}
                    </p>
                }


            </form>


        </div>

    );

}



const styles = {


    container: {

        height: "100vh",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        background: "#f2f2f2"

    },


    card: {

        background: "white",

        padding: "40px",

        borderRadius: "12px",

        width: "300px",

        boxShadow: "0 4px 15px #ccc",

        display: "flex",

        flexDirection: "column",

        gap: "15px"

    },

    titulo: {
        color: "#000000",
        textAlign: "center",
        margin: "0 0 10px 0"
    },

    subtitulo: {
        color: "#666666",
        textAlign: "center",
        margin: "0 0 20px 0"
    },
    input: {

        padding: "12px",

        fontSize: "16px"

    },


    button: {

        padding: "12px",

        background: "#2563eb",

        color: "white",

        border: "none",

        cursor: "pointer"

    }


};


export default Login;