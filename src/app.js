const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", async (request, response) => {
  return await response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const repository = request.body;
  repository.id = uuid();
  repository.likes = 0;
  repositories.push(repository);
  return response.send(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({ message: "Invalid uuid" });
  }
  if(request.body.likes) {
    return response.status(400).json({ likes: 0 })
  }
  const newRepository = request.body;
  const targetRepository = repositories.find((repository) => {
    return repository.id === id;
  })
  if (!targetRepository) {
    return response.status(400).json({ message: "Repository not found" });
  }
  const updatedRepository = Object.assign(targetRepository, newRepository);

  return response.json(updatedRepository)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({ message: "Invalid uuid" });
  }
 
  const repositoryExist = repositories.findIndex((repository) => {
    return repository.id === id;
  })

  if (repositoryExist < 0) {
    return response.status(400).json({ message: "Repository not found" });
  }

  repositories.splice(repositoryExist, 1);

  return response.status(204).json([]);
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({ message: "Invalid uuid" });
  }
  const targetRepository = repositories.find((repository) => {
    return repository.id === id;
  })
  if (!targetRepository) {
    return response.status(400).json({ message: "Repository not found" });
  }
  targetRepository.likes += 1;

  return response.json({ likes: targetRepository.likes})
});

module.exports = app;
