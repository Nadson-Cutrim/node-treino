require("dotenv").config();
const express = require("express");
const db = require("./src/database/connect");
const z = require("zod");

const userSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().refine(
    (value) => {
      return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
    },
    {
      message: "Email inválido",
    },
  ),
  tel: z.string().min(10).max(11),
});

const app = express();
app.use(express.json());

const saveDatBase = async (data) => {
  try {
    const validateData = userSchema.parse(data);
    await db.collection("users").add(validateData);
    console.log("Dados salvos com sucesso!");
  } catch (error) {
    console.log("Erro de Schema", error.errors);
  }
};

//Home
app.get("/home", (req, res) => {
  res.status(200).send("<h1>Home Page</h1>");
});

//Criar Usuário
app.post("/users", async (req, res) => {
  try {
    const validateData = userSchema.parse(req.body);
    const { name, email, tel } = validateData;

    const docRef = await db
      .collection("users")
      .add({ ...validateData});

    res.status(201).json({
      id: docRef.id,
      message: "Usuário criado com sucesso",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error); // Mostra o erro real no terminal
    res.status(500).json({
      error: "Ocorreu um erro ao criar o usuário",
    });
  }
});

//Listar Usuários

app.get("/users", async (req, res) => {
  try {
    const list = await db.collection("users").get();
    const users = list.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = 6969;

app.listen(port, () => {
  console.log(`🚀🔥Server rodando na porta http://localhost:${port} !`);
});
