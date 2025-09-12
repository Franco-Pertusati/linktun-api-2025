const express = require("express");
const swaggerUI = require("swagger-ui-express");
const OpenApiValidator = require("express-openapi-validator");
const routes = require("./routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const YAML = require("yamljs");
swaggerDocument = YAML.load("./openapi.yaml");

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "https://linktun25.vercel.app/",
    credentials: true,
  })
);

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
