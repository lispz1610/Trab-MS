import { useEffect, useState } from "react";


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




    const produtosFiltrados = produtos.filter(
        produto =>
            produto.nome
                .toLowerCase()
                .includes(
                    pesquisa.toLowerCase()
                )
    );



    return (

        <div style={styles.container}>


            <h1>
                Estoque de Produtos
            </h1>



            <input

                style={styles.input}

                placeholder="Pesquisar produto..."

                value={pesquisa}

                onChange={
                    e => setPesquisa(e.target.value)
                }

            />



            <table style={styles.tabela}>


                <thead>

                    <tr>

                        <th style={styles.th}>Produto</th>

                        <th style={styles.th}>Descrição</th>

                        <th style={styles.th}>Unidade</th>

                        <th style={styles.th}>Estoque Máximo</th>

                        <th style={styles.th}>Estoque Mínimo</th>

                        <th style={styles.th}>Ponto Ressuprimento</th>

                    </tr>

                </thead>



                <tbody>


                    {
                        produtosFiltrados.map(
                            produto => (

                                <tr key={produto.id}>


                                    <td style={styles.td}>
                                        {produto.nome}
                                    </td>


                                    <td style={styles.td}>
                                        {produto.descricao}
                                    </td>


                                    <td style={styles.td}>
                                        {produto.unidadeComprada}
                                    </td>


                                    <td style={styles.td}>
                                        {produto.estoqueMaximo}
                                    </td>


                                    <td style={styles.td}>
                                        {produto.estoqueMinimo}
                                    </td>


                                    <td style={styles.td}>
                                        {produto.pontoRessuprimento}
                                    </td>


                                </tr>

                            ))

                    }


                </tbody>


            </table>


        </div>

    );


}



const styles = {


    container: {

        padding: "30px"

    },


    input: {

        width: "300px",

        padding: "10px",

        marginBottom: "20px"

    },


    tabela: {

        width: "100%",

        borderCollapse: "collapse"

    },

    th: {

        border: "1px solid #ccc",

        padding: "10px",

        textAlign: "left"

    },


    td: {

        border: "1px solid #ccc",

        padding: "10px"

    }


};


export default ProductList;