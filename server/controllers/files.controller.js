import Exceljs from "exceljs";
import { handleParsing } from "../models/parse.js";
import crypto from "crypto";

// Store sessions: Map<string, { buffer: Buffer, filename: string, createdAt: number }>
const filesStore = new Map();

// Cleanup old sessions every hour
const CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour
setInterval(() => {
  const now = Date.now();
  for (const [id, data] of filesStore.entries()) {
    if (now - data.createdAt > CLEANUP_INTERVAL) filesStore.delete(id);
  }
}, CLEANUP_INTERVAL);

const uploadFiles = async (req, res) => {
  try {
    const workbook = new Exceljs.Workbook();
    const sheet = workbook.addWorksheet("bulk");
    const parsedData = handleParsing(req.body.filesData);
    const filename = "bulk_process.xlsx";

    sheet.columns = [
      { header: "Document No.", key: "documentNo" },
      { header: "Revision", key: "revision" },
      { header: "Title", key: "title" },
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
    const id = crypto.randomUUID();

    filesStore.set(id, {
      buffer,
      filename,
      createdAt: Date.now(),
    });

    return res.json({ ok: true, length: buffer.length, id });
  } catch (error) {
    console.error("Error processing files:", error);
    return res
      .status(500)
      .json({ ok: false, message: "Internal Server Error" });
  }
};

const getFilesSize = (req, res) => {
  const { id } = req.query;
  if (!id || !filesStore.has(id)) {
    return res.status(404).json({ length: 0 });
  }

  const { buffer } = filesStore.get(id);
  return res.json({ length: buffer.length });
};

const downloadFile = (req, res) => {
  const { id } = req.query;

  if (!id || !filesStore.has(id)) {
    return res.status(404).send("File not found or session expired");
  }

  const { buffer, filename } = filesStore.get(id);

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Content-Length", buffer.length);

  res.send(buffer);
};

const clearSession = (req, res) => {
  const { id } = req.query;

  if (id && filesStore.has(id)) {
    filesStore.delete(id);
    return res.json({ ok: true, message: "Buffer Cleared" });
  }

  return res.status(404).json({ ok: false, message: "Session not found" });
};

export { uploadFiles, getFilesSize, downloadFile, clearSession };
