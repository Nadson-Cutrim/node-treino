const http = require("http");
const port = 8080;
const server = http.createServer((req, res) => {
  if (req.url === "/home") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Home Page</h1>");
  }

  if (req.url === "/users") {
    const users = [
      {
        name: "John",
        email: "j@j.com",
      },
      {
        name: "Jane",
        email: "bruce@j.com",
      },
      {
        name:"Albert",
        email:"albert@j.com"
      }
    ];
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(users));
  }
});

server.listen(port, () => {
  console.log(`Server rodandona porta http://localhost:${port} !`);
});
