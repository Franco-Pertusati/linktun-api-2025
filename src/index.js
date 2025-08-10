const express = require("express");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const OpenApiValidator = require("express-openapi-validator");

const app = express();
const port = 3000;

swaggerDocument = YAML.load("./openapi.yaml");

app.use(express.json());

app.use(
  OpenApiValidator.middleware({
    apiSpec: swaggerDocument,
    validateRequests: true,
    validateResponses: true,
    ignorePaths: /.*\/docs.*/,
  })
);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.get("/status", (req, res) => {
  res.json({ message: "Api running succesfuly" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post("/users", (req, res) => {
  const { name, age, email } = req.body;
  const newUser = {
    id: Date.now().toString(),
    name,
    age,
    email
  }
  res.status(201).json(newUser)
});
