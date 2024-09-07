import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import compression from "compression";
import helmet from "helmet";
import { errorHandler, logger, notFound } from "./middleware";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./lib/swagger";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";

dotenv.config();

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
app.use("/api/user", userRoutes);

app.use(notFound);
app.use(errorHandler);

mongoose.connect(process.env.MONGO_URI!).then(() => {
  app.listen(process.env.PORT || 8080, () =>
    console.log("Connected to DB and listening on port " + process.env.PORT)
  );
});
