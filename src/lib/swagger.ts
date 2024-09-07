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
        url:
          process.env.NODE_ENV === "development"
            ? "http://localhost:8080"
            : process.env.BASE_URL,
        description:
          process.env.NODE_ENV === "development"
            ? "Development server"
            : "Production server",
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
