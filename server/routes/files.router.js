import express from "express";
import Exceljs from "exceljs";
import { handleParsing } from "../models/parse.js";

const excelRouter = express.Router();
const filesRouter = express.Router();

let filesParsed = {};

filesRouter.post("/", async (req, res) => {
  const workbook = new Exceljs.Workbook();
  const sheet = workbook.addWorksheet("bulk");
  const { filesData } = req.body;
  const parsedData = handleParsing(filesData);
  const filename = "bulk_process.xlsx";

  sheet.columns = [
    { header: "Document No.", key: "documentNo" },
    { header: "Revision", key: "revision" },
    { header: "Type", key: "typeDWG" },
    { header: "Status", key: "statusDWG" },
    { header: "Discipline", key: "diciplineDWG" },
    { header: "Project Stage", key: "projectStage" },
    { header: "Project", key: "project" },
    { header: "Required for Handover?", key: "" },
    { header: "Work Package", key: "workingPackage" },
    { header: "Zone", key: "zone" },
    { header: "Level", key: "level" },
    { header: "File", key: "" },
    { header: "Date Created", key: "dateCreated" },
    { header: "Revision Date", key: "revDate" },
    { header: "Plan Date", key: "" },
    { header: "Created By", key: "createdBy" },
    { header: "Comments", key: "extension" },
    { header: "Supersede", key: "" },
  ];

  sheet.getRow(1).font = { bold: true };

  Object.values(parsedData).forEach((item) => sheet.addRow(item));

  const buffer = await workbook.xlsx.writeBuffer();

  filesParsed = { buffer, filename };

  return res.json({ ok: true, length: buffer.length });
});

filesRouter.get("/", (req, res) => {
  const { buffer } = filesParsed;
  if (!buffer) res.status(404).json({ length: 0 });
  return res.json({ length: buffer.length });
});

excelRouter.get("/", (req, res) => {
  const { buffer, filename } = filesParsed;

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Content-Length", buffer.length);

  res.send(buffer);
});

filesRouter.delete("/", (req, res) => {
  filesParsed = {};
  return res.json({ ok: true, message: "Buffer Cleared" });
});

export { filesRouter, excelRouter };
