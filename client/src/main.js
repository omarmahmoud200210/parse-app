import {
  httpFilesData,
  httpGetExcelFileSize,
  httpClearServer,
  httpDownloadExcelSheet,
} from "./request.js";
import ui from "./ui.js";

const filesData = [];
let currentSessionId = null;

const openDesktop = () => ui.openFileDialog();
ui.elements.uploadSection.addEventListener("click", openDesktop);
ui.elements.btnSelectFiles.addEventListener("click", (e) => {
  openDesktop();
  e.stopPropagation();
});

// 1. Select the data from the user and handle the UI to show the data
const handleFiles = (e) => {
  const fileList = e.target.files;

  for (let file of fileList) {
    let extension = file.name.split(".").pop().toLowerCase();

    if (file.name.split("-").length !== 11) {
      alert("Invalid file format");
      return;
    }

    filesData.push({ name: file.name, type: extension });
  }

  if (filesData.length <= 500) {
    ui.updateFileStats(filesData.length);
    ui.renderFileList(filesData);
    ui.showFileSection();
  }
  else {
    ui.hideFileSection();
    filesData.length = 0;
  }
};

ui.elements.selectBtn.addEventListener("change", handleFiles);

// 2. Send the files to the server side for parse process
const submitFilesData = async () => {
  const response = await httpFilesData({ filesData });
  if (response && response.id) {
    currentSessionId = response.id;
  }

  const length = await httpGetExcelFileSize(currentSessionId);
  ui.showExcelPreview(ui.elements.filesView.children.length, length);
};

ui.elements.submitData.addEventListener("click", submitFilesData);

// 3. Clear the server side and the client side to start over.
const clearAll = async () => {
  // 1. delete from the server side
  if (currentSessionId) {
    await httpClearServer(currentSessionId);
    currentSessionId = null;
  }

  // 2. delete from the client side
  filesData.length = 0;
  ui.elements.selectBtn.value = "";
  ui.renderFileList([]);
  ui.resetStats();
  ui.hideExcelPreview();
  ui.hideFileSection();
  ui.enableDownload();
  ui.removeDownloadSuccess();

  ui.elements.downloadBtn.removeEventListener("click", clickToDownload);
  ui.elements.downloadBtn.addEventListener("click", clickToDownload, {
    once: true,
  });
};

ui.elements.clearBtn.addEventListener("click", clearAll);

// 4. Make the user able to download the file just once.
const clickToDownload = async (e) => {
  e.preventDefault();
  ui.disableDownload();

  try {
    await httpDownloadExcelSheet(ui.elements.downloadAnchor, currentSessionId);
    ui.showDownloadSuccess();
  } catch (err) {
    ui.enableDownload();
    console.log(err);
  }
};

ui.elements.downloadBtn.addEventListener("click", clickToDownload, {
  once: true,
});
