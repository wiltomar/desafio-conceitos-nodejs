const express = require('express');
const cors = require('cors');
const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (req, resp) => {
  return resp.status(200).json(repositories);
});

app.post("/repositories", (req, resp) => {
  const {title, url, techs} = req.body;
  const id = uuid();
  
  const repository = {
    id,
    title,
    url, 
    techs, 
    likes: 0,
  };

  repositories.push(repository);

  return resp.status(201).json(repository);
});

app.put("/repositories/:id", (req, resp) => {
  const { id } = req.params;
  const { title, url, techs, likes } = req.body;

  const repository = {
    id,
    title, 
    url,
    techs,
    likes,
  };

  repositoryIndex = repositories.findIndex((repository) => repository.id === id);

  if (repositoryIndex < 0) {
    return resp.status(400).json({error: 'Repository not found.'});
  }

  repositories[repositoryIndex] = repository;
  
  return resp.status(200).json(repository);
});

app.delete("/repositories/:id", (req, resp) => {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex((repository) => repository.id === id);

  if (repositoryIndex < 0) {
    return resp.status(400).json({error: 'Repository not found.'});
  }

  repositories.splice(repositoryIndex, 1);

  return resp.status(204).send();
});

app.post("/repositories/:id/like", (req, resp) => {
  const { id } = req.params;

  const repository = repositories.find((repository) => repository.id === id);

  if (!repository) {
    return resp.status(400).json({ error: 'Repository not found.'})
  }

  repository.likes += 1;

  return resp.status(200).json(repository);

});

module.exports = app;
