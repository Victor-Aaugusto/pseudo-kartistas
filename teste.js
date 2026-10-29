const vendas = [
  { vendedorId: 1, produto: "Teclado", valor: 150 },
  { vendedorId: 2, produto: "Mouse", valor: 80 },
  { vendedorId: 1, produto: "Monitor", valor: 900 },
  { vendedorId: 3, produto: "Mouse", valor: 80 },
  { vendedorId: 2, produto: "Teclado", valor: 150 },
  { vendedorId: 1, produto: "Mouse", valor: 80 },
  { vendedorId: 3, produto: "Monitor", valor: 900 },
];


function totalPorVendedor (vendas){
    
   const totalVendedor = vendas.reduce((acc, vendedor) => {
        const idVendedor = vendedor.vendedorId

        if(!acc[idVendedor]){
            acc[idVendedor] = {
                vendedorId: idVendedor,
                totalVendido: vendedor.valor,
            } 
        } else {
            acc[idVendedor].totalVendido += vendedor.valor
        }

        return acc
    }, {})

    const totalOrdenado = Object.values(totalVendedor || {}).sort((a, b) => {
        return b.totalVendido - a.totalVendido
    })

    return {totalVendedor, totalOrdenado}
}

function qtdProduto (vendas){
    const totalProduto = vendas.reduce((acc, produto) =>{
        const produtoNome = produto.produto

        if(!acc[produtoNome]){
            acc[produtoNome] = {
                produto: produto.produto,
                total: produto.valor,
                qtd: 1
            }
        } else {
            acc[produtoNome].total += produto.valor
            acc[produtoNome].qtd += 1
        }
        return acc
    }, {})

    return totalProduto
}

console.log(totalPorVendedor(vendas))
console.log(qtdProduto(vendas))