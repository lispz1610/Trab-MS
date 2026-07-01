import { useEffect, useState } from "react";
import "./GiroEstoque.css";


export default function GiroEstoque() {


    const [produtos, setProdutos] = useState([]);



    function calcularDiasNoEstoque(id) {


        const dataCadastro = new Date(id);

        const hoje = new Date();


        const diferenca = hoje - dataCadastro;


        return Math.floor(
            diferenca / (1000 * 60 * 60 * 24)
        );

    }





    async function carregarProdutos() {


        const resposta = await fetch(
            "http://localhost:3000/produtos"
        );


        const dados = await resposta.json();



        const atrasados = dados.filter(

            produto =>

                calcularDiasNoEstoque(produto.id)
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
                                    Dias no estoque
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

                                            {
                                                calcularDiasNoEstoque(produto.id)
                                            }

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