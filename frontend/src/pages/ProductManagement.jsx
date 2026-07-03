import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import './ProductManagement.css'

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
        <div className="container">
            <h1 className="title">Gerenciar Produtos</h1>

            {mensagem && <p className="msg-success">{mensagem}</p>}
            {erro && <p className="msg-error">{erro}</p>}

            <table className="product-table">
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
                        <th style={{ textAlign: "center" }}>Ações</th>
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
                            <td style={{ textAlign: "center" }}>
                                <div className="action-buttons">
                                <button className="btn-edit" onClick={() => setEditando(p)}>Editar</button>
                                <button className="btn-delete" onClick={() => excluir(p.id)}>Excluir</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editando && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(0,0,0,0.5)", display: "flex",
                    justifyContent: "center", alignItems: "center", zIndex: 1000}}>
                    <div className="modal-content"className="modal-content" style={{
                        background: "#fff", padding: "2rem", borderRadius: "8px",
                        width: "500px", maxHeight: "90vh", overflowY: "auto"
                    }}>
                        <h2>Editar Produto</h2>
                        <form onSubmit={salvarEdicao}>
                            <div className="form-group">
                                <label>Nome</label>
                                <input name="nome" defaultValue={editando.nome} required  />
                            </div>
                            <div className="form-group">
                            <label>Descrição</label>
                                <input name="descricao" defaultValue={editando.descricao} required  />
                            </div>

                            <div className="form-group">
                                <label>Unidade Comprada</label>
                                <input name="unidadeComprada" defaultValue={editando.unidadeComprada} required  />
                            </div>

                            <div className="form-group">
                                <label>Quantidade</label>
                                <input name="quantidade" type="number" defaultValue={editando.quantidade}  />
                            </div>

                            <div className="form-group">
                                <label>Estoque Máximo</label>
                                <input name="estoqueMaximo" type="number" defaultValue={editando.estoqueMaximo}  />
                            </div>

                            <div className="form-group">
                                <label>Estoque Mínimo</label>
                                <input name="estoqueMinimo" type="number" defaultValue={editando.estoqueMinimo}  />
                            </div>

                            <div className="form-group">
                                <label>Ponto de Ressuprimento</label>
                                <input name="pontoRessuprimento" type="number" defaultValue={editando.pontoRessuprimento}  />
                            </div>

                            <div className="form-group">
                                <label>Tempo de Giro (dias)</label>
                                <input name="tempoGiro" type="number" defaultValue={editando.tempoGiro}  />
                            </div>

                            <div className="form-group">
                                <label>Foto do produto</label>
                                <input name="foto" type="file" accept="image/*" style={{ width: "100%", marginBottom: "1rem" }} />
                            </div>

                            <div className="modal-actions">
                                <button type="submit" className="btn-save">Salvar</button>
                                <button type="button" className="btn-cancel" onClick={() => setEditando(null)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}