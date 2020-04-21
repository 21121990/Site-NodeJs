const express = require("express"); // Importando o express
const app = express(); // Iniciando o express
const bodyParser = require("body-parser") //requisições post
const connection = require("./database/database"); //Instanciando database
const Pergunta = require("./database/Pergunta");
const Responsta = require("./database/Resposta");
//database

connection
    .authenticate()
    .then(()=>{
         console.log("conexão feita com o banco de dados")
    })
    .catch((msgErro)=>{
        console.log(msgErro);
    })


//Express utiliza ejs como view engine
app.set('view engine','ejs');
app.use(express.static('public'));
//Body parser para requisição post
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//Rotas
app.get("/",(req,res)=>{
    Pergunta.findAll({raw:true, order:[
      ['id','desc'] //ordenar findAll asc= crescente || desc= decrescente  
    ]}).then(perguntas =>{
        res.render("index",{
            perguntas: perguntas
        });
    });
  
});

app.get("/pergunta",(req,res)=>{
    res.render("pergunta")
});

app.post("/salvarpergunta",(req,res)=>{
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() =>{
        res.redirect("/");
    });
});
//pesquisar pergunta por id
app.get("/pergunta_id/:id",(req,res)=>{
    var id=req.params.id;
    Pergunta.findOne({
        where:{id: id}
    }).then(pergunta=>{
        if(pergunta != undefined){ //achou a pergunta
            res.render("pergunta_id",{
                pergunta: pergunta
            });
        }else{// não encontrou
            res.redirect("/");
        }
    });
})


//iniciando servidor
app.listen(4000,()=>
{
    console.log("Servidor online");
});