import { useEffect, useState } from "react";
import "./ProductList.css";

function ProductList() {

    const [produtos, setProdutos] = useState([]);
    const [pesquisa, setPesquisa] = useState("");

    async function carregarProdutos() {

        const resposta = await fetch(
            "http://localhost:3000/produtos"
        );

        const dados = await resposta.json();
        setProdutos(dados);

    }

    useEffect(() => {

        carregarProdutos();

    }, []);

    function tempoNoEstoque(id) {

        const dataCadastro = new Date(id);

        const hoje = new Date();


        const diferenca = hoje - dataCadastro;


        const dias = Math.floor(
            diferenca / (1000 * 60 * 60 * 24)
        );


        if (dias === 0) {

            return "Hoje";

        }


        if (dias === 1) {

            return "1 dia";

        }


        return `${dias} dias`;

    }

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
                            <th className="th">Produto</th>
                            <th className="th">Descrição</th>
                            <th className="th">Unidade</th>
                            <th className="th">Estoque Máximo</th>
                            <th className="th">Estoque Mínimo</th>
                            <th className="th">Ponto Ressuprimento</th>
                            <th className="th">Tempo no Estoque</th>
                            <th className="th">Preço da unidade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtosFiltrados.map(produto => (
                            <tr key={produto.id}>
                                <td className="td">
                                    {produto.nome}
                                </td>
                                <td className="td">
                                    {produto.descricao}
                                </td>
                                <td className="td">
                                    {produto.unidadeComprada}
                                </td>
                                <td className="td">
                                    {produto.estoqueMaximo}
                                </td>
                                <td className="td">
                                    {produto.estoqueMinimo}
                                </td>
                                <td className="td">
                                    {produto.pontoRessuprimento}
                                </td>
                                <td className="td">
                                    {tempoNoEstoque(produto.id)}
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