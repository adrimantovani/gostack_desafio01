const express = require("express");
const server = express();
const port = 3333;

server.use(express.json());

let count_req = 0;

server.use((req, res, next) => {
  count_req++;
  console.log(`Requisições feitas até o momento: ${count_req}`);

  return next();
});

const projects = [];

function checkProjectExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find((p) => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "Projeto inexistente" });
  }

  return next();
}

server.get("/projects", (req, res) => {
  return res.json(projects);
});

let id_count = 0;

server.post("/projects", (req, res) => {
  const { title } = req.body;
  const tasks = [];

  //projects.push({ id_count, title, tasks });
  projects.push({ id: id_count, title: title, tasks: tasks });

  id_count++;
  return res.json(projects);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const index = projects.findIndex((p) => p.id == id);

  projects[index].title = title;

  return res.json(projects);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex((p) => p.id == id);

  projects.splice(index, 1);

  return res.json({ id });
});

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const index = projects.findIndex((p) => p.id == id);

  projects[index].tasks.push(title);

  return res.json(projects[index]);
});

server.listen(port);
console.log(`Servidor iniciado na porta ${port}`);
