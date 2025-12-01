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
const statusBar = document.querySelector(".stats-bar");
const fileInfoSec = document.querySelector(".file-info");
const excelPreview = document.querySelector(".excel-preview");
const actionBtns = document.querySelector(".action-buttons");
const records = document.querySelector(".records");
const size = document.querySelector(".size");

const ui = {
  elements: {
    selectBtn,
    uploadSection,
    btnSelectFiles,
    submitData,
    downloadBtn,
    clearBtn,
    downloadAnchor,
    filesView,
  },

  openFileDialog: () => selectBtn.click(),

  updateFileStats: (count) => {
    selectedDiv.innerText = `${count}`;
    fileHeading.innerText = `(${count})`;
  },

  renderFileList: (files) => {
    filesView.innerHTML = "";
    files.forEach((file) => {
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
  },

  showFileSection: () => {
    statusBar.classList.remove("none");
    fileInfoSec.classList.remove("none");
  },

  hideFileSection: () => {
    statusBar.classList.add("none");
    fileInfoSec.classList.add("none");
  },

  showExcelPreview: (recordCount, fileSize) => {
    excelPreview.classList.remove("none");
    actionBtns.classList.remove("none");
    records.innerText = `${recordCount}`;
    parsedDiv.innerText = `${recordCount}`;
    progressDiv.innerText = "100%";

    if (!fileSize) {
      size.innerText = "0 KB";
    } else if (typeof fileSize === "number") {
      size.innerText = `${Math.round(fileSize / 1024)} KB`;
    }
  },

  hideExcelPreview: () => {
    excelPreview.classList.add("none");
    actionBtns.classList.add("none");
  },

  resetStats: () => {
    records.innerText = `0`;
    size.innerText = "0 KB";
    parsedDiv.innerText = `0`;
    progressDiv.innerText = "0%";
    selectedDiv.innerText = `0`;
    fileHeading.innerText = `0`;
  },

  enableDownload: () => {
    downloadBtn.disabled = false;
    downloadAnchor.style.pointerEvents = "";
  },

  disableDownload: () => {
    downloadBtn.disabled = true;
    downloadAnchor.style.pointerEvents = "none";
  },

  showDownloadSuccess: () => {
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
  },

  removeDownloadSuccess: () => {
    const info = document.querySelector(".process-info");
    if (info) info.remove();
  },
};

export default ui;
