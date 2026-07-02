import { useState, useEffect } from "react";
import { apiFetch } from "../api";

export default function SaidaRegister() {

    const [produtos, setProdutos] = useState([]);
    const [formData, setFormData] = useState({
        codigoBarras: "",
        produtoId: "",
        precoSaida: "",
        quantidade: "",
        tipoSaida: "venda",
        tipoPerda: "",
        cpfCliente: ""
    });
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function carregarProdutos() {
            const res = await apiFetch("/produtos");
            setProdutos(await res.json());
        }
        carregarProdutos();
    }, []);

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMensagem("");
        setErro("");

        if (!formData.produtoId || !formData.quantidade || !formData.precoSaida) {
            setErro("Preencha todos os campos obrigatórios.");
            return;
        }

        try {
            const body = {
                produtoId: Number(formData.produtoId),
                quantidade: Number(formData.quantidade),
                precoSaida: Number(formData.precoSaida),
                tipoSaida: formData.tipoSaida,
                codigoBarras: formData.codigoBarras
            };

            if (formData.tipoSaida === "perda") {
                if (!formData.tipoPerda) {
                    setErro("Informe o tipo de perda.");
                    return;
                }
                body.tipoPerda = formData.tipoPerda;
            }

            if (formData.cpfCliente) {
                body.cpfCliente = formData.cpfCliente.replace(/\D/g, "");
            }

            const resposta = await apiFetch("/saidas", {
                method: "POST",
                body: JSON.stringify(body)
            });

            if (!resposta.ok) {
                const dados = await resposta.json();
                setErro(dados.mensagem);
                return;
            }

            setMensagem("Saída registrada com sucesso!");
            setFormData({
                codigoBarras: "",
                produtoId: "",
                precoSaida: "",
                quantidade: "",
                tipoSaida: "venda",
                tipoPerda: "",
                cpfCliente: ""
            });

        } catch (err) {
            setErro("Erro ao registrar saída.");
        }
    }

    return (
        <div className="formulario-container">
            <h1>Registrar Saída</h1>

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
                            {p.nome} (estoque: {p.quantidade})
                        </option>
                    ))}
                </select>

                <label>Preço da saída *</label>
                <input
                    type="number"
                    name="precoSaida"
                    min="0"
                    step="0.01"
                    placeholder="Preço"
                    value={formData.precoSaida}
                    onChange={handleChange}
                    required
                />

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

                <label>Tipo de saída *</label>
                <select
                    name="tipoSaida"
                    value={formData.tipoSaida}
                    onChange={handleChange}
                >
                    <option value="venda">Venda</option>
                    <option value="perda">Perda</option>
                </select>

                {formData.tipoSaida === "perda" && (
                    <>
                        <label>Tipo de perda *</label>
                        <select
                            name="tipoPerda"
                            value={formData.tipoPerda}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecione o tipo de perda</option>
                            <option value="quebra">Quebra</option>
                            <option value="vencimento">Vencimento</option>
                            <option value="extravio">Extravio</option>
                            <option value="outro">Outro</option>
                        </select>
                    </>
                )}

                <label>CPF do cliente</label>
                <input
                    type="text"
                    name="cpfCliente"
                    placeholder="CPF (opcional)"
                    value={formData.cpfCliente}
                    onChange={handleChange}
                />

                <button type="submit">Registrar saída</button>

            </form>
        </div>
    );
}
