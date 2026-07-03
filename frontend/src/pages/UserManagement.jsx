import { useEffect, useState } from "react";
import { apiFetch } from "../api";

function UserManagement() {

    const [usuarios, setUsuarios] = useState([]);
    const [editando, setEditando] = useState(null);

    async function carregarUsuarios() {
        const resposta = await apiFetch("/usuarios");
        const dados = await resposta.json();
        setUsuarios(dados);
    }

    useEffect(() => {
        carregarUsuarios();
    }, []);

    async function excluir(id) {
        await apiFetch(`/usuarios/${id}`, { method: "DELETE" });
        carregarUsuarios();
    }

    async function salvarEdicao(usuario) {
        await apiFetch(`/usuarios/${usuario.id}`, {
            method: "PUT",
            body: JSON.stringify(usuario)
        });
        setEditando(null);
        carregarUsuarios();
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>Gerenciar usuários</h1>

            <table style={{ width: "100%", maxWidth: "900px", borderCollapse: "collapse", marginTop: "20px", textAlign: "left" }}>
                <thead>
                    <tr style={{ borderBottom: "2px solid #ccc" }}>
                        <th style={{ padding: "12px", width: "40%" }}>Email</th>
                        <th style={{ padding: "12px", width: "30%" }}>Tipo</th>
                        <th style={{ padding: "12px", width: "30%" }}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map(usuario => (
                        <tr key={usuario.id} style={{ borderBottom: "1px solid #eee" }}>
                            <td style={{ padding: "12px" }}>
                                {editando?.id === usuario.id ? (
                                    <input
                                        style={{ padding: "5px", width: "90%" }}
                                        value={editando.email}
                                        onChange={e => setEditando({ ...editando, email: e.target.value })}
                                    />
                                ) : (
                                    usuario.email
                                )}
                            </td>
                            <td style={{ padding: "12px" }}>
                                {editando?.id === usuario.id ? (
                                    <select
                                        style={{ padding: "5px", width: "90%" }}
                                        value={editando.tipo}
                                        onChange={e => setEditando({ ...editando, tipo: e.target.value })}
                                    >
                                        <option value="gerente">Gerente</option>
                                        <option value="funcionario">Funcionário</option>
                                    </select>
                                ) : (
                                    usuario.tipo
                                )}
                            </td>
                            <td style={{ padding: "12px" }}>
                                {editando?.id === usuario.id ? (
                                    <button style={{ marginRight: "5px", padding: "5px 10px" }} onClick={() => salvarEdicao(editando)}>
                                        Salvar
                                    </button>
                                ) : (
                                    <button style={{ marginRight: "5px", padding: "5px 10px" }} onClick={() => setEditando(usuario)}>
                                        Editar
                                    </button>
                                )}
                                <button style={{ padding: "5px 10px" }} onClick={() => excluir(usuario.id)}>
                                    Excluir
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default UserManagement;