import {fileTypeEnum} from "@/enums/enums";

const fs = window.fs;


/**
 * 根据入参的元数据，获取文件blob数据
 * @param metadata
 * @param fileType
 * @param callback
 */
function getFileBlobByMetaData(metadata, fileType, callback) {
  //根据类型区分文件路径
  let path ;
  if (fileType === fileTypeEnum.picture){
    path = metadata.picture
  }else {
    path = metadata.path
  }
  fs.readFile(path, (error, data) => {
    if (error) {
      console.error("Error reading file:", error);
      return;
    }
    let mimeType = 'application/octet-stream';
    if (fileType === fileTypeEnum.picture){
      mimeType = metadata.pictureMime
    }else {
      mimeType = metadata.mime
    }
    const blob = new Blob([data], {type: mimeType});
    callback(URL.createObjectURL(blob));
  });
}

export {
  getFileBlobByMetaData
}