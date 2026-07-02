import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import "./GiroEstoque.css";

export default function GiroEstoque() {

    const [produtos, setProdutos] = useState([]);

    function calcularDiasNoEstoque(ultimaEntrada) {

        if (!ultimaEntrada) return null;

        const dataCadastro = new Date(ultimaEntrada);

        const hoje = new Date();

        const diferenca = hoje - dataCadastro;

        return Math.floor(
            diferenca / (1000 * 60 * 60 * 24)
        );

    }

    async function carregarProdutos() {

        const resposta = await apiFetch("/produtos");

        const dados = await resposta.json();

        const atrasados = dados.filter(

            produto =>

                Number(produto.tempoGiro) > 0 &&
                produto.ultimaEntrada &&
                calcularDiasNoEstoque(produto.ultimaEntrada)
                >
                Number(produto.tempoGiro)

        );

        setProdutos(atrasados);

    }

    useEffect(() => {

        carregarProdutos();

    }, []);

    return (

        <div className="giro-container">

            <h1>
                Produtos com Giro Excedido
            </h1>

            {

                produtos.length === 0 ?

                    <div className="nenhum">

                        <h2>
                            Nenhum produto ultrapassou o tempo de giro
                        </h2>

                    </div>

                    :

                    <table className="tabela-giro">

                        <thead>

                            <tr>

                                <th>
                                    Produto
                                </th>

                                <th>
                                    Código de Barras
                                </th>

                                <th>
                                    Dias no estoque
                                </th>

                                <th>
                                    Data e Hora de Entrada
                                </th>

                                <th>
                                    Tempo de giro permitido
                                </th>

                                <th>
                                    Quantidade atual
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                produtos.map(produto => (

                                    <tr key={produto.id}>

                                        <td>
                                            {produto.nome}
                                        </td>

                                        <td>
                                            {produto.ultimoCodigoBarras || "-"}
                                        </td>

                                        <td>

                                            {
                                                calcularDiasNoEstoque(produto.ultimaEntrada)
                                            }

                                        </td>

                                        <td>
                                            {produto.ultimaEntrada || "-"}
                                        </td>

                                        <td>

                                            {produto.tempoGiro}

                                        </td>

                                        <td>

                                            {produto.quantidade}

                                        </td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>

            }

        </div>

    );

}
