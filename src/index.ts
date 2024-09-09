import dotenv from "dotenv";
import createServer from "./utils/server";
import mongoose from "mongoose";

dotenv.config();

const app = createServer();

mongoose.connect(process.env.MONGO_URI!).then(() => {
  app.listen(process.env.PORT || 8080, () =>
    console.log("Connected to DB and listening on port " + process.env.PORT)
  );
});
