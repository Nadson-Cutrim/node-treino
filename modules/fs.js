const { error } = require("console");
const fs = require("fs");
const path = require("path");

//Criar uma pasta
// fs.mkdir(path.join(__dirname, '/test'),(error) =>{
//  if (error){
//      return console.log(error);
//  }
//  console.log('Pasta criada com sucesso');
// } )

//Criar um arquivo

fs.writeFile(
  path.join(__dirname, "/test", "hello.txt"),
  "hello node js",
  (error) => {
    if (error) {
      return console.log(error);
    }
    console.log("Arquivo criado com sucesso");
    //Adicionar ao arquivo
    fs.appendFile(
      path.join(__dirname, "/test", "hello.txt"),
      "\nOla mundo",
      (error) => {
        if (error) {
          return console.log(error);
        }
        console.log("Arquivo atualizado com sucesso");
      },
    );
    //Ler arquivo

    fs.readFile(
      path.join(__dirname, "/test", "hello.txt"),
      "utf8",
      (error, data) => {
        if (error) {
          return console.log(error);
        }

        console.log(data);
      },
    );
  },
);
