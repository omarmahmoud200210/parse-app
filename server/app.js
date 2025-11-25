import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import {filesRouter, excelRouter} from "./routes/files.router.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json()); //"../client/index.html"

app.use("/files", filesRouter);
app.use("/download", excelRouter);

app.use(express.static(path.join(__dirname, "..", "client")));

export default app;