import { useState, useEffect } from "react";
import { apiFetch } from "../api";

export default function EntradaRegister() {

    const [produtos, setProdutos] = useState([]);
    const [fornecedores, setFornecedores] = useState([]);
    const [formData, setFormData] = useState({
        codigoBarras: "",
        produtoId: "",
        quantidade: "",
        precoEntrada: "",
        fornecedorId: ""
    });
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function carregarDados() {
            const resProdutos = await apiFetch("/produtos");
            setProdutos(await resProdutos.json());

            const resFornecedores = await apiFetch("/fornecedores");
            setFornecedores(await resFornecedores.json());
        }
        carregarDados();
    }, []);

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMensagem("");
        setErro("");

        if (!formData.produtoId || !formData.quantidade || !formData.precoEntrada) {
            setErro("Preencha todos os campos obrigatórios.");
            return;
        }

        try {
            const body = {
                produtoId: Number(formData.produtoId),
                quantidade: Number(formData.quantidade),
                precoEntrada: Number(formData.precoEntrada),
                codigoBarras: formData.codigoBarras
            };

            if (formData.fornecedorId) {
                body.fornecedorId = Number(formData.fornecedorId);
            }

            const resposta = await apiFetch("/entradas", {
                method: "POST",
                body: JSON.stringify(body)
            });

            if (!resposta.ok) {
                const dados = await resposta.json();
                setErro(dados.mensagem);
                return;
            }

            setMensagem("Entrada registrada com sucesso!");
            setFormData({
                codigoBarras: "",
                produtoId: "",
                quantidade: "",
                precoEntrada: "",
                fornecedorId: ""
            });

        } catch (err) {
            setErro("Erro ao registrar entrada.");
        }
    }

    return (
        <div className="formulario-container">
            <h1>Registrar Entrada</h1>

            {mensagem && <p className="sucesso">{mensagem}</p>}
            {erro && <p className="erro">{erro}</p>}

            <form onSubmit={handleSubmit}>

                <label>Código de barras do pacote</label>
                <input
                    type="text"
                    name="codigoBarras"
                    placeholder="Código de barras"
                    value={formData.codigoBarras}
                    onChange={handleChange}
                />

                <label>Produto *</label>
                <select
                    name="produtoId"
                    value={formData.produtoId}
                    onChange={handleChange}
                    required
                >
                    <option value="">Selecione um produto</option>
                    {produtos.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.nome}
                        </option>
                    ))}
                </select>

                <label>Quantidade de unidades *</label>
                <input
                    type="number"
                    name="quantidade"
                    min="1"
                    placeholder="Quantidade"
                    value={formData.quantidade}
                    onChange={handleChange}
                    required
                />

                <label>Preço da entrada *</label>
                <input
                    type="number"
                    name="precoEntrada"
                    min="0"
                    step="0.01"
                    placeholder="Preço"
                    value={formData.precoEntrada}
                    onChange={handleChange}
                    required
                />

                <label>Fornecedor</label>
                <select
                    name="fornecedorId"
                    value={formData.fornecedorId}
                    onChange={handleChange}
                >
                    <option value="">Selecione um fornecedor</option>
                    {fornecedores.map(f => (
                        <option key={f.id} value={f.id}>
                            {f.nome}
                        </option>
                    ))}
                </select>

                <button type="submit">Registrar entrada</button>

            </form>
        </div>
    );
}
