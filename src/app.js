import express from "express";
import morgan from "morgan";
import "dotenv/config";
import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";

import { connectDB } from "./ultils/databaseConnect";
import router from "./routes/index.route";

// App setting
const app = express();

//Morgan log
app.use(morgan("dev"));

//connect Database
connectDB();

// Set
app.set("port", process.env.PORT);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//swagger
const swaggerJSDocs = YAML.load("./src/swagger/api.yaml");
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJSDocs));

router(app);

export default app;
