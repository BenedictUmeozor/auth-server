import swaggerUi from "swagger-ui-express";
import swaggerJsdoc, { Options } from "swagger-jsdoc";
import dotenv from "dotenv";

dotenv.config();

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Authentication API",
      version: "1.0.0",
      description: "API documentation for the authentication server",
    },
    servers: [
      {
        url: "http://localhost:8080",
        description: "Development server",
      },
    ],
  },
  apis: [
    process.env.NODE_ENV === "development"
      ? "./src/routes/*.ts"
      : "./dist/routes/*.js",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerUi.setup(swaggerSpec);
