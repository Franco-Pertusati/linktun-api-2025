const express = require("express");
const swaggerUI = require("swagger-ui-express");
const OpenApiValidator = require("express-openapi-validator");
const routes = require("./routes");
const cors = require("cors")

const YAML = require("yamljs");
swaggerDocument = YAML.load("./openapi.yaml");

const app = express();

app.use(express.json());
app.use(cors())

app.use(
  OpenApiValidator.middleware({
    apiSpec: swaggerDocument,
    validateRequests: true,
    validateResponses: true,
    ignorePaths: /.*\/docs.*/,
  })
);

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use("/", routes);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

module.exports = app;
