import express from "express";
import morgan from "morgan";
import "dotenv/config";

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

router(app);

export default app;
