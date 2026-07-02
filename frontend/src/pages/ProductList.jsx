import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import "./ProductList.css";

function ProductList() {

    const [produtos, setProdutos] = useState([]);
    const [pesquisa, setPesquisa] = useState("");

    async function carregarProdutos() {

        const resposta = await apiFetch("/produtos");

        const dados = await resposta.json();
        setProdutos(dados);

    }

    useEffect(() => {

        carregarProdutos();

    }, []);

    const produtosFiltrados = produtos.filter(
        produto =>
            produto.nome
                .toLowerCase()
                .includes(
                    pesquisa.toLowerCase()
                )
    );

    return (
        <>
            <div className="header-fixo">
                <h1>
                    Estoque de Produtos
                </h1>

                <input
                    className="search-input"
                    placeholder="Pesquisar produto..."
                    value={pesquisa}
                    onChange={
                        e => setPesquisa(e.target.value)
                    }
                />
            </div>

            <div className="tabela-container">
                <table className="tabela">
                    <thead>
                        <tr>
                            <th className="th">Código de Barras</th>
                            <th className="th">Produto</th>
                            <th className="th">Unidade</th>
                            <th className="th">Saldo em Estoque</th>
                            <th className="th">Estoque Máximo</th>
                            <th className="th">Estoque Mínimo</th>
                            <th className="th">Data e Hora da Última Entrada</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtosFiltrados.map(produto => (
                            <tr key={produto.id}>
                                <td className="td">
                                    {produto.ultimoCodigoBarras || "-"}
                                </td>
                                <td className="td">
                                    {produto.nome}
                                </td>
                                <td className="td">
                                    {produto.unidadeComprada}
                                </td>
                                <td className="td">
                                    {produto.quantidade}
                                </td>
                                <td className="td">
                                    {produto.estoqueMaximo}
                                </td>
                                <td className="td">
                                    {produto.estoqueMinimo}
                                </td>
                                <td className="td">
                                    {produto.ultimaEntrada || "-"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
export default ProductList;