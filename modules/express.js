require("dotenv").config();
const express = require("express");
const db = require("../src/database/connect"); // ajuste o caminho se precisar

const app = express();
app.use(express.json()); // importante para ler JSON

// 🔥 Criar usuário
app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name e email são obrigatórios" });
    }

    const userRef = await db.collection("users").add({
      name,
      email,
      createdAt: new Date()
    });

    res.status(201).json({
      message: "Usuário criado com sucesso",
      id: userRef.id
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




const port = 6969;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});