import { useState, useEffect } from "react";
import { apiFetch } from "../api";

export default function RelatorioSaidas() {

    const [produtos, setProdutos] = useState([]);
    const [filtros, setFiltros] = useState({
        inicio: "",
        fim: "",
        produtoId: ""
    });
    const [relatorio, setRelatorio] = useState(null);
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function carregar() {
            const res = await apiFetch("/produtos");
            setProdutos(await res.json());
        }
        carregar();
    }, []);

    function handleChange(e) {
        setFiltros({ ...filtros, [e.target.name]: e.target.value });
    }

    async function emitirRelatorio(e) {
        e.preventDefault();
        setErro("");

        const params = new URLSearchParams();
        if (filtros.inicio) params.append("inicio", filtros.inicio);
        if (filtros.fim) params.append("fim", filtros.fim);
        if (filtros.produtoId) params.append("produtoId", filtros.produtoId);

        try {
            const resposta = await apiFetch(`/saidas/relatorio?${params}`);
            if (!resposta.ok) {
                setErro("Erro ao gerar relatório");
                return;
            }
            const dados = await resposta.json();
            setRelatorio(dados);
        } catch {
            setErro("Erro ao conectar com o servidor");
        }
    }

    return (
        <div className="formulario-container">
            <h1>Relatório de Saídas</h1>

            {erro && <p className="erro">{erro}</p>}

            <form onSubmit={emitirRelatorio}>

                <label>Data início</label>
                <input
                    type="date"
                    name="inicio"
                    value={filtros.inicio}
                    onChange={handleChange}
                />

                <label>Data fim</label>
                <input
                    type="date"
                    name="fim"
                    value={filtros.fim}
                    onChange={handleChange}
                />

                <label>Produto (opcional)</label>
                <select name="produtoId" value={filtros.produtoId} onChange={handleChange}>
                    <option value="">Todos os produtos</option>
                    {produtos.map(p => (
                        <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                </select>

                <button type="submit">Emitir relatório</button>

            </form>

            {relatorio && (
                <div style={{ marginTop: "2rem" }}>
                    <h2>Resultado</h2>
                    <p><strong>Total de saídas:</strong> {relatorio.totais.totalSaidas}</p>
                    <p><strong>Total de unidades:</strong> {relatorio.totais.totalUnidades}</p>

                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Produto</th>
                                <th>Código de Barras</th>
                                <th>Quantidade</th>
                                <th>Preço</th>
                                <th>Tipo</th>
                                <th>Tipo de Perda</th>
                                <th>CPF Cliente</th>
                            </tr>
                        </thead>
                        <tbody>
                            {relatorio.saidas.map(s => (
                                <tr key={s.id}>
                                    <td>{s.data}</td>
                                    <td>{s.produtoNome}</td>
                                    <td>{s.codigoBarras}</td>
                                    <td>{s.quantidade}</td>
                                    <td>R$ {Number(s.precoSaida).toFixed(2)}</td>
                                    <td>{s.tipoSaida}</td>
                                    <td>{s.tipoPerda || "-"}</td>
                                    <td>{s.cpfCliente || "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}