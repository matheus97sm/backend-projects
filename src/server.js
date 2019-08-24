const express = require("express");

const server = express();

let log = 0;
const projects = [];

server.use(express.json());

function idMiddleware(req, res, next) {
  const { id } = req.params;

  const project = projects.find(pro => pro.id === id);

  if (!project) {
    return res.status(404).json({ error: "This project does not exists." });
  }

  req.project = project;

  return next();
}

function logMiddleware(req, res, next) {
  log++;

  console.log(log);

  return next();
}

server.use(logMiddleware);

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.get("/projects/:id", idMiddleware, (req, res) => {
  return res.json(req.project);
});

server.post("/projects", (req, res) => {
  projects.push(req.body);

  return res.json(projects);
});

server.put("/projects/:id", idMiddleware, (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res
      .status(400)
      .json({ error: "You must have to send the new title." });
  }

  req.project.title = title;

  return res.json(req.project);
});

server.delete("/projects/:id", idMiddleware, (req, res) => {
  const projectIndex = projects.findIndex(pro => pro.id === req.project.id);

  projects.splice(projectIndex, 1);

  return res.json(projects);
});

server.post("/projects/:id/tasks", idMiddleware, (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res
      .status(400)
      .json({ error: "You must have to send the taks title" });
  }

  req.project.tasks.push(title);

  return res.json(req.project);
});

server.listen(4444);
