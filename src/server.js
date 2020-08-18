const express = require("express")

const server = express()

// pegar o BD

const db = require("./database/db")

// Configurar pasta public
server.use(express.static("public"))


// Habilitar o uso do req.body na nossa aplicação
server.use(express.urlencoded({extended: true}))


// Utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
      express: server,
      noCache: true
})


// Configurar caminhos da aplicação
// página inicial
server.get("/", (req, res) => {
    return res.render("index.html", {title: "Um título"})
})

server.get("/create-point", (req, res) => {

    // req.query: Query Strings da nossa url
    //  console.log(req.query)
    
    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {
    
    // req.body: O corpo da nosso form
    // console.log(req.body)

    // inserir dados no BD

    const query = `
        INSERT INTO places (
                     image,
                     name,
                     address,
                     address2,
                     state,
                     city,
                     items
                 ) VALUES (?,?,?,?,?,?,?);


    `
    
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if (err) {
            console.log(err)
            return res.send("Erro no Cadastro!")
        }

        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("create-point.html", {saved: true})
    }

    
   
    db.run(query, values, afterInsertData)

    
})

server.get("/search", (req, res) => {

    const search = req.query.search

    if(search == "") {
        // pesquisa vazia
        return res.render("search-results.html", { total: 0 })
    }

    // pegar os dados do BD

    db.all(`SELECT * FROM places WHERE  city LIKE '%${search}%'`, function(err, rows) {
        if(err) {
            return console.log(err)
        }


        const total = rows.length
            
        // mostrar a pág HTML com os dados do BD
        return res.render("search-results.html", {places: rows, total: total})
    })
    
})





    // pesquisa vazia

// pegar os dados do BD

// Mostrar a pág html com os dados do BD

// Ligar server
server.listen(3000)



// Assistindo a aula 5. Parei com com faltando 47 mim pra acabar

// A idéia é assistir mas configurar um BD diferente 

// precisa ficar salvando o documento mais de uma vez



