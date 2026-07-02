import { useState } from "react";
import { apiFetch } from "../api";

export default function RelatorioGeral() {

    const [filtros, setFiltros] = useState({ inicio: "", fim: "" });
    const [relatorio, setRelatorio] = useState(null);
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    function handleChange(e) {
        setFiltros({ ...filtros, [e.target.name]: e.target.value });
    }

    async function emitirRelatorio(e) {
        e.preventDefault();
        setErro("");

        if (!filtros.inicio || !filtros.fim) {
            setErro("Selecione o período de início e fim.");
            return;
        }

        setCarregando(true);

        try {
            const params = new URLSearchParams();
            params.append("inicio", filtros.inicio);
            params.append("fim", filtros.fim);

            const resposta = await apiFetch(`/relatorio-geral?${params}`);
            if (!resposta.ok) {
                setErro("Erro ao gerar relatório");
                setCarregando(false);
                return;
            }
            const dados = await resposta.json();
            setRelatorio(dados);
        } catch {
            setErro("Erro ao conectar com o servidor");
        }

        setCarregando(false);
    }

    return (
        <div className="formulario-container">
            <h1>Relatório Geral do Estoque</h1>

            {erro && <p className="erro">{erro}</p>}

            <form onSubmit={emitirRelatorio}>
                <label>Data início *</label>
                <input
                    type="date"
                    name="inicio"
                    value={filtros.inicio}
                    onChange={handleChange}
                    required
                />

                <label>Data fim *</label>
                <input
                    type="date"
                    name="fim"
                    value={filtros.fim}
                    onChange={handleChange}
                    required
                />

                <button type="submit" disabled={carregando}>
                    {carregando ? "Gerando..." : "Emitir relatório"}
                </button>
            </form>

            {relatorio && (
                <div style={{ marginTop: "2rem" }}>

                    <h2>Situação Geral</h2>
                    <p><strong>Período:</strong> {relatorio.periodo.inicio} a {relatorio.periodo.fim}</p>
                    <p><strong>Total de entradas no período:</strong> {relatorio.totais.entradas.total} ({relatorio.totais.entradas.unidades} unidades)</p>
                    <p><strong>Total de saídas no período:</strong> {relatorio.totais.saidas.total} ({relatorio.totais.saidas.unidades} unidades)</p>

                    <h2 style={{ marginTop: "2rem" }}>Produtos em Estoque</h2>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Unidade</th>
                                <th>Quantidade</th>
                                <th>Código de Barras</th>
                                <th>Est. Máx</th>
                                <th>Est. Mín</th>
                                <th>Data Última Entrada</th>
                                <th>Data Última Saída</th>
                            </tr>
                        </thead>
                        <tbody>
                            {relatorio.produtos.map(p => (
                                <tr key={p.id}>
                                    <td>{p.nome}</td>
                                    <td>{p.unidadeComprada}</td>
                                    <td>{p.quantidade}</td>
                                    <td>{p.ultimoCodigoBarras || "-"}</td>
                                    <td>{p.estoqueMaximo}</td>
                                    <td>{p.estoqueMinimo}</td>
                                    <td>{p.ultimaEntrada || "-"}</td>
                                    <td>{p.ultimaSaida || "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h2 style={{ marginTop: "2rem" }}>Movimentações no Período</h2>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th>Data e Hora</th>
                                <th>Tipo</th>
                                <th>Produto</th>
                                <th>Código de Barras</th>
                                <th>Quantidade</th>
                                <th>Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {relatorio.movimentacoes.map(m => (
                                <tr key={m.tipo + "-" + m.id}>
                                    <td>{m.data}</td>
                                    <td>{m.tipo === "entrada" ? "Entrada" : "Saída"}</td>
                                    <td>{m.produtoNome}</td>
                                    <td>{m.codigoBarras || "-"}</td>
                                    <td>{m.quantidade}</td>
                                    <td>R$ {Number(m.valor).toFixed(2)}</td>
                                </tr>
                            ))}
                            {relatorio.movimentacoes.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center" }}>
                                        Nenhuma movimentação no período
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}