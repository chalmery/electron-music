import { fileTypeEnum } from "@/enums/enums";

async function getFileBlobByMetaData(metadata, fileType, callback) {
  const filePath = fileType === fileTypeEnum.picture ? metadata.picture : metadata.path;
  try {
    const data = await window.electronAPI.readFile(filePath);
    const mimeType = fileType === fileTypeEnum.picture ? metadata.pictureMime : metadata.mime;
    const blob = new Blob([data], { type: mimeType });
    callback(URL.createObjectURL(blob));
  } catch (error) {
    console.error("Error reading file:", error);
  }
}

async function resolvePictureToBase64(filePath, callback) {
  if (!filePath) return;
  try {
    const data = await window.electronAPI.readFile(filePath);
    const base64String = Buffer.from(data).toString('base64');
    callback(`data:image/*;base64,${base64String}`);
  } catch (error) {
    console.error("Error reading picture:", error);
  }
}

export { getFileBlobByMetaData, resolvePictureToBase64 };
