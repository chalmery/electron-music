import { ipcMain } from "electron";
import { eventName } from "../../lib/metadata/event";
import { save, access, readdirSync, statSync } from "../../lib/fs";
import { fileName, fileTypeList, getPath } from "../../lib/metadata/metadata";
import path from "path";
import mime from "mime-types";
import { CharConstants } from "../../constants/constant";
import { formatTime, getMd5Value } from "../../lib/util/utils";
import { parseFile } from "music-metadata";
import { fileTypeFromBuffer } from "file-type";

function readDir(dir, fileList) {
  try {
    let files = readdirSync(dir);
    if (!files) return;
    files.forEach((file) => {
      let filePath = path.join(dir, file);
      let info = statSync(filePath);
      if (info.isFile()) {
        fileList.push({ dir, filePath, hashCode: getMd5Value(filePath) });
      } else {
        readDir(filePath, fileList);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

function batchReadDir(dirs) {
  let fileList = [];
  dirs.forEach((dir) => readDir(dir, fileList));
  return fileList;
}

async function savePicture(data, metadata, hashCode) {
  const picture = data.common.picture[0].data;
  const fileInfo = await fileTypeFromBuffer(picture);
  if (fileInfo) {
    metadata.pictureMime = fileInfo.mime;
    metadata.pictureExt = fileInfo.ext;
  }

  const imageMimeType = data.common.picture[0].format;
  const format = mime.extension(imageMimeType) || metadata.pictureExt || 'png';
  const pictureName = hashCode + CharConstants.DOT + format;
  const picturePath = getPath(pictureName);
  metadata.picture = picturePath;

  access(picturePath, (err) => {
    if (err) save(pictureName, picture);
  });
}

function parseMetaData(fileList, callback, event) {
  if (fileList.length === 0) {
    callback(fileList, event);
    return;
  }
  let metaList = [];
  let remaining = fileList.length;
  let key = 1;

  fileList.forEach((value) => {
    parseFile(value.filePath)
      .then(async (data) => {
        if (data && fileTypeList.includes(data.format.container)) {
          let metadata = {
            key: key,
            title: data.common.title,
            artist: data.common.artist,
            album: data.common.album,
            parentPath: value.dir,
            picture: null,
            pictureExt: 'png',
            pictureMime: 'image/png',
            path: value.filePath,
            duration: formatTime(data.format.duration),
            type: data.format.container ? data.format.container.toLowerCase() : 'mp3',
            mime: data.format.container ? 'audio/' + data.format.container.toLowerCase() : 'audio/mp3',
            hashCode: value.hashCode,
          };

          if (data.common.picture?.length) {
            await savePicture(data, metadata, value.hashCode);
          }
          metaList.push({ key: value.dir, value: metadata });
        }
      })
      .catch((err) => {
        console.log(value.filePath, err.message);
      })
      .finally(() => {
        key += 1;
        remaining -= 1;
        if (remaining === 0) callback(metaList, event);
      });
  });
}

function call(fileList, event) {
  if (fileList.length === 0) {
    event.reply(eventName.SYNC_DATA_CALLBACK.value, eventName.SYNC_DATA_CALLBACK.value);
    return;
  }
  const groupedArray = Object.values(
    fileList.reduce((acc, obj) => {
      const { key, value } = obj;
      if (!acc[key]) {
        acc[key] = { key, label: path.basename(key), value: [] };
      }
      acc[key].value.push(value);
      return acc;
    }, {})
  );
  groupedArray.sort((a, b) => a.label.localeCompare(b.label));

  save(fileName.META_DATA.value, JSON.stringify(groupedArray), () => {
    event.reply(eventName.SYNC_DATA_CALLBACK.value, eventName.SYNC_DATA_CALLBACK.value);
  });
}

const dataSyncAction = () => {
  ipcMain.on(eventName.SYNC_DATA.value, (event, data) => {
    if (!data) {
      event.reply(eventName.SYNC_DATA_CALLBACK.value, null);
      return;
    }
    let fileList = batchReadDir(data);
    parseMetaData(fileList, call, event);
  });
};

export { dataSyncAction };
