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

        <div>

            <h1>
                Gerenciar usuários
            </h1>

            <table style={styles.table}>

                <thead>

                    <tr>

                        <th> Email </th>
                        <th> Tipo </th>
                        <th>Ações</th>

                    </tr>

                </thead>

                <tbody>

                    {
                        usuarios.map(usuario => (

                            <tr key={usuario.id}>

                                <td>

                                    {
                                        editando?.id === usuario.id ?

                                            <input
                                                value={editando.email}
                                                onChange={
                                                    e => setEditando({
                                                        ...editando,
                                                        email: e.target.value
                                                    })
                                                }
                                            />

                                            :

                                            usuario.email

                                    }

                                </td>

                                <td>

                                    {
                                        editando?.id === usuario.id ?

                                            <select
                                                value={editando.tipo}
                                                onChange={
                                                    e => setEditando({
                                                        ...editando,
                                                        tipo: e.target.value
                                                    })
                                                }
                                            >

                                                <option value="gerente">
                                                    Gerente
                                                </option>

                                                <option value="funcionario">
                                                    Funcionário
                                                </option>

                                            </select>

                                            :

                                            usuario.tipo

                                    }

                                </td>

                                <td>

                                    {
                                        editando?.id === usuario.id ?

                                            <button
                                                onClick={() => salvarEdicao(editando)}
                                            >
                                                Salvar
                                            </button>

                                            :

                                            <button
                                                onClick={() => setEditando(usuario)}
                                            >
                                                Editar
                                            </button>

                                    }

                                    <button
                                        onClick={() => excluir(usuario.id)}
                                    >
                                        Excluir
                                    </button>

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    )

}

const styles = {

    table: {
        width: "100%",
        borderCollapse: "collapse"
    }

}

export default UserManagement;
