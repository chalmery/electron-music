import {fileTypeEnum} from "@/enums/enums";

const fs = window.fs;
import {fileTypeFromStream} from 'file-type';


function getFileBlobByPath(path, fileType, callback) {
  fs.readFile(path, (error, data) => {
    if (error) {
      console.error("Error reading file:", error);
      return;
    }
    fileTypeFromStream(data).then(result => {
      console.log(result)
      //默认mime类型
      let mimeType = 'application/octet-stream';
      if (fileType === fileTypeEnum.picture) {
        mimeType= 'image/jpeg';
      }else if (fileType === fileTypeEnum.music){
        mimeType= 'image/mp3';
      }
      if (result) {
        mimeType = result.mime;
      } else {
        // 如果file-type识别失败，可以根据文件扩展名猜测
        const extension = path.split('.').pop().toLowerCase();
        if (fileType === fileTypeEnum.picture) {
          switch (extension) {
            case 'jpg':
            case 'jpeg':
              mimeType = 'image/jpeg';
              break;
            case 'png':
              mimeType = 'image/png';
              break;
            case 'svg':
              mimeType = 'image/svg';
              break;
            case 'webp':
              mimeType = 'image/webp';
              break;
          }
        }else if (fileType === fileTypeEnum.music){
          switch (extension) {
            case 'mp3':
              mimeType = 'image/mp3';
              break;
            case 'flac':
              mimeType = 'image/flac';
              break;
            case 'wav':
              mimeType = 'image/wav';
              break;
            case 'aiff':
              mimeType = 'image/aiff';
              break;
            case 'ogg':
              mimeType = 'image/ogg';
              break;
            case 'aac':
              mimeType = 'image/aac';
              break;
          }
        }
      }
      const blob = new Blob([data], {type: mimeType});
      callback(URL.createObjectURL(blob));
    }).catch((error) => {
      console.error("Error reading file:", error);
      callback(null);
    })
  });
}

export {
  getFileBlobByPath
}