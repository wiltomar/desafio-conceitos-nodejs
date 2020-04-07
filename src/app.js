const express = require('express');
const cors = require('cors');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequests(req, resp, next) {
  const { method, url } = req;

  const logLabel = `[${method.toUpperCase()}] - ${url}`;

  console.time(logLabel);

  next();

  console.timeEnd(logLabel);
};

function validateRepositoryId(req, resp, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return resp.status(400).json({ error: 'Invalid repository ID.' })
  }

  return next();

};

app.use(logRequests);

app.get("/repositories", (req, resp) => {
  const { title } = req.query;

  const results = title
    ? repositories.filter(repository => repository.title.includes(title))
    : repositories;

  return resp.status(200).json(results);
});

app.post("/repositories", (req, resp) => {
  const {title, url, techs} = req.body;
  
  const repository = {
    id: uuid(),
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

  repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return resp.status(404).json({error: 'Repository not found.'});
  }

  const repository = {
    id,
    title, 
    url,
    techs,
    likes,
  };

  repositories[repositoryIndex] = repository;
  
  return resp.status(200).json(repository);
});

app.delete("/repositories/:id", (req, resp) => {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return resp.status(404).json({error: 'Repository not found.'});
  }

  repositories.splice(repositoryIndex, 1);

  return resp.status(204).send();
});

app.post("/repositories/:id/like", (req, resp) => {
  const { id } = req.params;

  const repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return resp.status(404).json({ error: 'Repository not found.'})
  }

  repository.likes += 1;

  return resp.status(200).json(repository);

});

module.exports = app;
