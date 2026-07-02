import { useState } from "react";
import { Search } from "lucide-react";
import { apiFetch } from "../api";

export default function ConsultaCodigoBarras() {

    const [codigo, setCodigo] = useState("");
    const [resultados, setResultados] = useState(null);
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function consultar(e) {
        e.preventDefault();
        setErro("");
        setResultados(null);

        if (!codigo.trim()) {
            setErro("Informe um código de barras");
            return;
        }

        setCarregando(true);

        try {
            const resposta = await apiFetch(`/entradas/codigo-barras/${encodeURIComponent(codigo.trim())}`);

            if (!resposta.ok) {
                const dados = await resposta.json();
                setErro(dados.mensagem);
                setCarregando(false);
                return;
            }

            const dados = await resposta.json();
            setResultados(dados);
        } catch {
            setErro("Erro ao conectar com o servidor");
        }

        setCarregando(false);
    }

    return (
        <div style={{ padding: "1rem" }}>
            <h1>Consulta por Código de Barras</h1>

            <form onSubmit={consultar} style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
                <input
                    type="text"
                    placeholder="Digite o código de barras..."
                    value={codigo}
                    onChange={e => setCodigo(e.target.value)}
                    style={{ flex: 1, padding: "0.5rem", fontSize: "1rem" }}
                />
                <button type="submit" disabled={carregando} style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <Search size={18} />
                    {carregando ? "Buscando..." : "Consultar"}
                </button>
            </form>

            {erro && <p style={{ color: "red" }}>{erro}</p>}

            {resultados && (
                <div>
                    <p><strong>{resultados.length}</strong> entrada(s) encontrada(s)</p>

                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Código de Barras</th>
                                <th>Data e Hora de Entrada</th>
                                <th>Quantidade</th>
                                <th>Tempo no Estoque</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultados.map(e => (
                                <tr key={e.id}>
                                    <td>{e.produtoNome}</td>
                                    <td>{e.codigoBarras}</td>
                                    <td>{e.dataEntrada}</td>
                                    <td>{e.quantidade}</td>
                                    <td>
                                        {e.diasNoEstoque === 0
                                            ? "Hoje"
                                            : e.diasNoEstoque === 1
                                                ? "1 dia"
                                                : `${e.diasNoEstoque} dias`}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}