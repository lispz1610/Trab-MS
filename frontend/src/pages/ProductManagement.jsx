import { useEffect, useState } from "react";
import { apiFetch } from "../api";

export default function ProductManagement() {

    const [produtos, setProdutos] = useState([]);
    const [editando, setEditando] = useState(null);
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");

    async function carregarProdutos() {
        const res = await apiFetch("/produtos");
        setProdutos(await res.json());
    }

    useEffect(() => {
        carregarProdutos();
    }, []);

    async function excluir(id) {
        if (!confirm("Tem certeza que deseja excluir este produto?")) return;

        const res = await apiFetch(`/produtos/${id}`, { method: "DELETE" });
        if (res.ok) {
            setMensagem("Produto excluído com sucesso!");
            carregarProdutos();
        } else {
            const dados = await res.json();
            setErro(dados.mensagem);
        }
    }

    async function salvarEdicao(e) {
        e.preventDefault();
        setErro("");
        setMensagem("");

        const formData = new FormData(e.target);

        const res = await apiFetch(`/produtos/${editando.id}`, {
            method: "PUT",
            body: formData
        });

        if (res.ok) {
            setMensagem("Produto atualizado com sucesso!");
            setEditando(null);
            carregarProdutos();
        } else {
            const dados = await res.json();
            setErro(dados.mensagem);
        }
    }

    return (
        <div>
            <h1>Gerenciar Produtos</h1>

            {mensagem && <p style={{ color: "green" }}>{mensagem}</p>}
            {erro && <p style={{ color: "red" }}>{erro}</p>}

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Descrição</th>
                        <th>Unidade</th>
                        <th>Quantidade</th>
                        <th>Est. Máx</th>
                        <th>Est. Mín</th>
                        <th>Ponto Ressup.</th>
                        <th>Tempo Giro</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {produtos.map(p => (
                        <tr key={p.id}>
                            <td>{p.nome}</td>
                            <td>{p.descricao}</td>
                            <td>{p.unidadeComprada}</td>
                            <td>{p.quantidade}</td>
                            <td>{p.estoqueMaximo}</td>
                            <td>{p.estoqueMinimo}</td>
                            <td>{p.pontoRessuprimento}</td>
                            <td>{p.tempoGiro}</td>
                            <td>
                                <button onClick={() => setEditando(p)}>Editar</button>
                                <button onClick={() => excluir(p.id)}>Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editando && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(0,0,0,0.5)", display: "flex",
                    justifyContent: "center", alignItems: "center", zIndex: 1000
                }}>
                    <div style={{
                        background: "#fff", padding: "2rem", borderRadius: "8px",
                        width: "500px", maxHeight: "90vh", overflowY: "auto"
                    }}>
                        <h2>Editar Produto</h2>
                        <form onSubmit={salvarEdicao}>
                            <label>Nome</label>
                            <input name="nome" defaultValue={editando.nome} required style={{ width: "100%", marginBottom: "0.5rem" }} />

                            <label>Descrição</label>
                            <input name="descricao" defaultValue={editando.descricao} required style={{ width: "100%", marginBottom: "0.5rem" }} />

                            <label>Unidade Comprada</label>
                            <input name="unidadeComprada" defaultValue={editando.unidadeComprada} required style={{ width: "100%", marginBottom: "0.5rem" }} />

                            <label>Quantidade</label>
                            <input name="quantidade" type="number" defaultValue={editando.quantidade} style={{ width: "100%", marginBottom: "0.5rem" }} />

                            <label>Estoque Máximo</label>
                            <input name="estoqueMaximo" type="number" defaultValue={editando.estoqueMaximo} style={{ width: "100%", marginBottom: "0.5rem" }} />

                            <label>Estoque Mínimo</label>
                            <input name="estoqueMinimo" type="number" defaultValue={editando.estoqueMinimo} style={{ width: "100%", marginBottom: "0.5rem" }} />

                            <label>Ponto de Ressuprimento</label>
                            <input name="pontoRessuprimento" type="number" defaultValue={editando.pontoRessuprimento} style={{ width: "100%", marginBottom: "0.5rem" }} />

                            <label>Tempo de Giro (dias)</label>
                            <input name="tempoGiro" type="number" defaultValue={editando.tempoGiro} style={{ width: "100%", marginBottom: "0.5rem" }} />

                            <label>Foto do produto</label>
                            <input name="foto" type="file" accept="image/*" style={{ width: "100%", marginBottom: "1rem" }} />

                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                <button type="submit">Salvar</button>
                                <button type="button" onClick={() => setEditando(null)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}