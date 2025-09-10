const express = require("express");
const app = express();
const methodOverride = require("method-override");


app.use(express.json()) // Permite a interpretação em JSON
app.use(express.urlencoded({ extended: true })); //Permite a interpretação no padrão HTML
app.use(methodOverride("_method")); //Habilita o método para PUT e DELETE

//Relacionado a pasta public (onde está o HTML) "libera os arquivos"
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

//Tarefas já estabelecidas
const tarefas = [
    {id: 1, nome: "Dormir", feito: "false"},
    {id: 2, nome: "Arrumar a máquina", feito: "false"},
    {id: 3, nome: "Entrar em reunião", feito: "true"},
    {id: 4, nome: "Ficar de boa", feito: "true"},
];

//Adicionar nova tarefa
app.post("/tarefas", (req, res) => {
    // ---- Função para atribuir ids em ordem
    let t = 1;
    let id = tarefas.length + 1;
    for(var i = 0; i<tarefas.length;i++){
        if(tarefas[i].id != t){
            id = t;
            break;
        }
        t++;
    }

    const nova = {id: id, ...req.body, feito: false}
    tarefas.push(nova);
    tarefas.sort((a,b)=>a.id - b.id); //Ordena em ordem crescente pelo id.
    res.json(tarefas);
});

//Mostrar todas as tarefas
app.get("/sobre", function(req,res){
    res.json(tarefas);
})

app.get("/buscar", (req, res) => {
    const {feito} = req.query; // Armazena a requisição(o que foi passado).
    // {feito} -> significa que a variável guarda o valor do nome "feito" no json enviado

    if (!feito) { 
        return res.status(400).json({erro: "informe 'true' ou 'false' no query string (consulta na url) para verficar as tarefas"})
    } // status(400) -> indica que o servidor não processará a requisição 
      //!feito -> Verifica se feito é 'falsy'(null, undefined, 0, string vazia, false, NaN)

    const resultado = tarefas.filter(p => {return p.feito === feito.toLowerCase()})

    if (resultado.length === 0){ // Verifica se a lista está vazia (resultados sempre retorna uma lista)
        res.status(400).json("Nenhuma Tarefa encontrada com essas especificações");
    }

    return res.json(resultado); //Caso nenhuma condição anterior seja verdadeira (erros)
})

//PUT MUDAR
app.put("/sobre", (req,res) => {
    const {id, nome, feito} = req.body // Guarda o valor das requisições enviadas pelo formulário
    
    //Iteração para mudar o nome e o feito de acordo com o id
    for(var i = 0; i < tarefas.length; i++){
        if (tarefas[i].id == id){
            tarefas[i].nome = nome;
            tarefas[i].feito = feito;
            break;
        }
    }
    res.json(tarefas);
});

app.delete("/sobre", (req,res) =>{
    const {id} = req.body;
    for(var i = 0; i < tarefas.length; i++){
        if (tarefas[i].id == id){
            tarefas.splice(i,1);
            break;
        } 
    }
    res.json(tarefas);
})

app.listen(3000, () => {
    console.log("Servidor Aberto")
});