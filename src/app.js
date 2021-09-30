import express from "express";
import "dotenv/config";

import { connectDB } from "./ultils/databaseConnect";
import router from "./routes/index.route";

// App setting
const app = express();

connectDB();
// Set
app.set("port", process.env.PORT);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router(app);

export default app;
