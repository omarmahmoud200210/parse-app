import express from "express";
import {
  uploadFiles,
  getFilesSize,
  downloadFile,
  clearSession,
} from "../controllers/files.controller.js";

const excelRouter = express.Router();
const filesRouter = express.Router();

filesRouter.post("/", uploadFiles);
filesRouter.get("/", getFilesSize);
filesRouter.delete("/", clearSession);

excelRouter.get("/", downloadFile);

export { filesRouter, excelRouter };

