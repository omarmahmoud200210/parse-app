const API_URL = "";

const httpFilesData = async (data) => {
  try {
    const res = await fetch(`${API_URL}/files`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error(`Server responded ${res.status}`);
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const httpDownloadExcelSheet = async (anchor, id) => {
  try {
    const response = await fetch(`${API_URL}/download?id=${id}`, {
      method: "get",
    });

    if (!response.ok) throw new Error("Download failed!!");

    const arrBuffer = await response.arrayBuffer();
    const blob = new Blob([arrBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    anchor.download = "bulk_process.xlsx";
    anchor.href = url;
    anchor.click();

    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }
  catch (err) {
    console.log(err);
  }
};

const httpGetExcelFileSize = async (id) => {
  try {
    const resp = await fetch(`${API_URL}/files?id=${id}`, { method: "get" });
    const body = await resp.json();

    return body.length;
  } catch (err) {
    console.log(err);
  }
};

const httpClearServer = async (id) => {
  try {
    await fetch(`${API_URL}/files?id=${id}`, { method: "delete" });
  } catch (err) {
    console.log(err);
  }
};

export {
  httpFilesData,
  httpGetExcelFileSize,
  httpClearServer,
  httpDownloadExcelSheet,
};
