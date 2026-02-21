require("dotenv").config();
const express = require("express");
const db = require("./src/database/connect");

const app = express();
app.use(express.json());

//Home
app.get("/home", (req, res) => {
    res.status(200).send("<h1>Home Page</h1>");
});


//Criar Usuário
app.post("/users", async (req, res) => {
   try{
    const docRef = await db.collection("users").add(req.body)

    res.status(201).json({
        id: docRef.id
    })
   } catch(error)
   {
    res.status(500).json({
        error: "Ocorreu um erro ao criar o usuário"
    })
   }
})


//Listar Usuários 

app.get("/users", async(req, res) =>{
    try{
        const list = await db.collection("users").get();
    const users = list.docs.map(doc =>({
        id: doc.id,
        ...doc.data()
    
    }))
    res.json(users)

    } catch (error){
 res.status(500).json({ error: error.message });
    }
})

const port = 6969;

app.listen(port, () => {
    console.log(`Server rodando na porta http://localhost:${port} !`);
});