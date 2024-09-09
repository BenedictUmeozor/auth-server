import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import { errorHandler, logger, notFound } from "../middleware";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../lib/swagger";
import authRoutes from "../routes/auth";
import userRoutes from "../routes/user";

const createServer = () => {
  const app: express.Express = express();

  app.use(cors());
  app.use(compression());
  app.use(helmet());
  app.use(express.json());
  app.use(express.static("public"));
  app.use(logger);

  app.get("/", (req: express.Request, res: express.Response) => {
    res.sendFile("public/index.html");
  });
  app.use("/api-docs", swaggerUi.serve, swaggerSpec);

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

export default createServer;
