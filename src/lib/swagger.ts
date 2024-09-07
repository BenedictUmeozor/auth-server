import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Authentication API",
      version: "1.0.0",
      description: "API documentation for the authentication server",
    },
  },
  apis: [
    process.env.NODE_ENV === "development"
      ? "./src/routes/*.ts"
      : "./dist/routes/*.js",
  ],
});

export default swaggerUi.setup(swaggerSpec);
