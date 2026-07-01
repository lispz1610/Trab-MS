import { useEffect, useState } from "react";
import "./Ressuprimento.css";


export default function Replenishment() {


    const [produtos, setProdutos] = useState([]);


    async function carregarProdutos() {


        const resposta = await fetch(
            "http://localhost:3000/produtos"
        );


        const dados = await resposta.json();


        const produtosReposicao = dados.filter(

            produto =>

                Number(produto.quantidade) ===
                Number(produto.pontoRessuprimento)

        );


        setProdutos(produtosReposicao);

    }



    useEffect(() => {

        carregarProdutos();

    }, []);




    return (

        <div className="reposicao-container">


            <h1>
                Produtos para Reposição
            </h1>


            {

                produtos.length === 0 ?

                    (

                        <div className="nenhum">

                            <h2>
                                Nenhum produto precisa de reposição
                            </h2>

                        </div>

                    )


                    :

                    (

                        <table className="tabela-reposicao">
                            <thead>
                                <tr>
                                    <th>
                                        Produto
                                    </th>
                                    <th>
                                        Quantidade Atual
                                    </th>
                                    <th>
                                        Ponto de Ressuprimento
                                    </th>
                                    <th>
                                        Estoque Máximo
                                    </th>
                                    <th>
                                        Comprar
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
                                                {produto.quantidade}
                                            </td>
                                            <td>
                                                {produto.pontoRessuprimento}
                                            </td>
                                            <td>
                                                {produto.estoqueMaximo}
                                            </td>
                                            <td>

                                                {

                                                    Number(produto.estoqueMaximo)
                                                    -
                                                    Number(produto.quantidade)

                                                }
                                            </td>
                                        </tr>


                                    ))

                                }
                            </tbody>
                        </table>


                    )

            }


        </div>

    );

}