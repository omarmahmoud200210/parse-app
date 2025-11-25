import {
  httpFilesData,
  httpGetExcelFileSize,
  httpClearServer,
  httpDownloadExcelSheet,
} from "./request.js";

const selectBtn = document.getElementById("fileInput");
const selectedDiv = document.querySelector(".selected");
const parsedDiv = document.querySelector(".parsed");
const progressDiv = document.querySelector(".progress");
const filesView = document.querySelector(".file-grid");
const fileHeading = document.querySelector(".file-h3 span");
const uploadSection = document.querySelector(".upload-section");
const btnSelectFiles = document.querySelector(".btn-select");
const submitData = document.querySelector(".submit");
const downloadAnchor = document.querySelector(".download");
const downloadBtn = document.querySelector(".btn-download");
const clearBtn = document.querySelector(".btn-clear");
const filesData = [];

const openDesktop = () => selectBtn.click();
uploadSection.addEventListener("click", openDesktop);
btnSelectFiles.addEventListener("click", (e) => {
  openDesktop();
  e.stopPropagation();
});

// 1. Select the data from the user and handle the UI to show the data
const statusBar = document.querySelector(".stats-bar");
const fileInfoSec = document.querySelector(".file-info");

const handleFiles = (e) => {
  const fileList = e.target.files;

  for (let file of fileList) {
    let extension = file.name.split(".").pop().toLowerCase();
    filesData.push({ name: file.name, type: extension });
  }

  selectedDiv.innerText = `${filesData.length}`;
  fileHeading.innerText = `(${filesData.length})`;

  filesData.forEach((file) => {
    const fileItem = document.createElement("div");
    const fileIcon = document.createElement("div");
    const fileName = document.createElement("div");

    fileItem.classList.add("file-item");
    fileIcon.classList.add("file-icon");
    fileIcon.classList.add("file-name");
    fileIcon.innerText = "📄";
    fileName.innerText = file.name;

    fileItem.append(fileIcon);
    fileItem.append(fileName);

    filesView.append(fileItem);
  });

  statusBar.classList.remove("none");
  fileInfoSec.classList.remove("none");
};

selectBtn.addEventListener("change", handleFiles);

const excelPreview = document.querySelector(".excel-preview");
const actionBtns = document.querySelector(".action-buttons");
const records = document.querySelector(".records");
const size = document.querySelector(".size");

// 2. Send the files to the server side for parse process
const submitFilesData = async () => {
  await httpFilesData({ filesData });
  excelPreview.classList.remove("none");
  actionBtns.classList.remove("none");

  records.innerText = `${filesView.children.length}`;

  const length = await httpGetExcelFileSize();
  if (!length) {
    size.innerText = "0 KB";
    return;
  }

  if (typeof length === "number") {
    size.innerText = `${Math.round(length / 1024)} KB`;
  }
  parsedDiv.innerText = records.innerText;
  progressDiv.innerText = "100%";
};

submitData.addEventListener("click", submitFilesData);

// 3. Clear the server side and the client side to start over.
const clearAll = async () => {
  // 1. delete from the server side
  await httpClearServer();
  // 2. delete from the client side
  filesData.length = 0;
  selectBtn.value = "";
  filesView.innerHTML = "";
  records.innerText = `0`;
  size.innerText = "0 KB";
  fileHeading.innerText = `0`;
  selectedDiv.innerText = `0`;
  progressDiv.innerText = "0%";
  excelPreview.classList.add("none");
  actionBtns.classList.add("none");
  statusBar.classList.add("none");
  fileInfoSec.classList.add("none");
  downloadBtn.disabled = false;
  downloadAnchor.style.pointerEvents = "";

  const info = document.querySelector(".process-info");
  if (info) info.remove();

  downloadBtn.removeEventListener("click", clickToDownload);
  downloadBtn.addEventListener("click", clickToDownload, { once: true });
};

clearBtn.addEventListener("click", clearAll);

// 4. Make the user able to download the file just once.
const clickToDownload = async (e) => {
    e.preventDefault();
  downloadBtn.disabled = true;
  downloadAnchor.style.pointerEvents = "none";

  try {
    await httpDownloadExcelSheet(downloadAnchor);

    const downloadInfo = document.createElement("div");
    downloadInfo.classList.add("process-info");

    const downlaodInfoIcon = document.createElement("div");
    downlaodInfoIcon.classList.add("process-info-icon");
    downlaodInfoIcon.innerText = `✅`;

    const downlaodInfoText = document.createElement("div");
    downlaodInfoText.classList.add("process-info-text");
    downlaodInfoText.innerText = `The file downloaded successfully.`;

    downloadInfo.append(downlaodInfoIcon);
    downloadInfo.append(downlaodInfoText);

    document.querySelector(".main-content").append(downloadInfo);
  } catch (err) {
    downloadBtn.disabled = false;
    downloadAnchor.style.pointerEvents = "";
    console.log(err);
  }
};

downloadBtn.addEventListener("click", clickToDownload, { once: true });
