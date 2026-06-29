import { useState } from "react";

function Login({ onLoginSucesso }) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");

    async function fazerLogin(e) {
        e.preventDefault();
        console.log("CLIQUEI NO LOGINNNN");

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
                setMensagem("Login realizado com sucesso!");
                localStorage.setItem(
                    "usuario",
                    JSON.stringify(dados.usuario)
                );
                console.log("Usuário:", dados.usuario);
                onLoginSucesso(dados.usuario);
            } else {
                setMensagem("Email ou senha inválidos");
            }

        } catch (erro) {
            setMensagem("Erro ao conectar com servidor");
        }
    }

    return (
        <div style={styles.container}>
            <form onSubmit={fazerLogin} style={styles.card}>
                
                <h1 style={styles.title}>
                    Sistema Rabisco
                </h1>

                <p style={styles.subtitle}>
                    Controle de estoque
                </p>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                />

                <input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    style={styles.input}
                />

                <button type="submit" style={styles.button}>
                    Entrar
                </button>

                {mensagem && (
                    <p style={styles.message}>
                        {mensagem}
                    </p>
                )}

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
        background: "#f8fafc", 
        fontFamily: "system-ui, -apple-system, sans-serif"
    },

    card: {
        background: "white",
        padding: "40px",
        borderRadius: "16px", 
        width: "320px",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)", 
        display: "flex",
        flexDirection: "column",
        gap: "20px"
    },

    title: {
        fontSize: "28px",
        fontWeight: "700",
        color: "#1e293b", 
        margin: "0",
        textAlign: "center",
        letterSpacing: "-0.5px"
    },

    subtitle: {
        fontSize: "14px",
        color: "#64748b", 
        marginTop: "-10px",
        marginBottom: "5px",
        textAlign: "center",
        fontWeight: "500"
    },

    input: {
        padding: "12px 14px",
        fontSize: "15px",
        borderRadius: "8px", 
        border: "1px solid #cbd5e1",
        outline: "none",
        backgroundColor: "#f8fafc",
        fontFamily: "inherit",
        transition: "border-color 0.2s"
    },

    button: {
        padding: "14px",
        background: "#2563eb", 
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        fontFamily: "inherit",
        marginTop: "5px",
        boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)"
    },

    message: {
        fontSize: "14px",
        color: "#dc2626", 
        textAlign: "center",
        margin: "5px 0 0 0",
        fontWeight: "500"
    }
};

export default Login;
