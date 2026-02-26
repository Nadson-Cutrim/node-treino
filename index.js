require("dotenv").config();
const express = require("express");
const db = require("./src/database/connect");
const {z} = require("zod");

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
    const docRef = await db.collection("users").add({ ...validateData });

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

//Atualizar Usuário


app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // 1. Valida os dados com o Zod
    const validateData = userSchema.parse(req.body);

    const userRef = db.collection("users").doc(id);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // 2. Atualiza no Firebase
    await userRef.update(validateData);
    
    res.status(200).json({ message: "Usuário atualizado com sucesso" });

  } catch (error) {
    // 3. TRATAMENTO SEGURO DE ERROS
    // Verifica se o erro veio do Zod (validação)
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        type: "Validation Error",
        details: error.errors.map(e => ({ campo: e.path[0], mensagem: e.message })) 
      });
    }

    // Se o erro for do Firebase ou qualquer outro
    console.error("Erro interno detectado:", error.message);
    res.status(500).json({ 
      error: "Erro ao processar atualização",
      details: error.message 
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

//Excluir Usuário po id
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Referência do documento
    const userRef = db.collection("users").doc(id);

    // 2. Checagem real: o documento existe?
    const doc = await userRef.get();

    if (!doc.exists) {
      console.log("❌ Documento não encontrado no Firebase.");
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // 3. Deleta de fato
    await userRef.delete();

    console.log(`✅ Documento ${id} apagado com sucesso.`);
    res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    console.error("💥 Erro ao deletar:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

//
const port = 6969;

app.listen(port, () => {
  console.log(`🚀🔥Server rodando na porta http://localhost:${port} !`);
});
