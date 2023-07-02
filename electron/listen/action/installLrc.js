import { ipcMain } from "electron";
import localSetting from "../../lib/event";
import path from "path";
import { makeGetRequest } from "../../lib/http";
import { save, read } from "../../lib/fs";
import dataName from "../../lib/dataName";

/**
 * 如果歌曲有live 去掉live
 * @param {*} title
 * @returns
 */
const replactTitle = (title) => {
  if (!title) {
    return null;
  }
  let data = title.replace(/\（live\）/g, "");
  return data.replace(/\(live\)/g, "");
};

const executeRequests = (musicList, index, callback) => {
  console.log(`调用接口开始 ${index}`);
  if (index >= musicList.length) {
    // 所有请求已执行完毕
    console.log(`所有请求已执行完毕`);
    callback();
    return;
  }
  const metadata = musicList[index];
  let title = replactTitle(metadata.title);
  makeGetRequest(`https://music.163.com/api/search/get?s=${title}-${metadata.artist}&type=1&limit=10`)
    .then((data) => {
      let songs = data?.result?.songs;
      let musicId = getMusicId(songs, metadata);
      console.log(`调用网易接口完成 musicId ${musicId}`);
      if (musicId) {
        //调用接口获取歌词
        makeGetRequest(`https://music.163.com/api/song/lyric?id=${musicId}&lv=1&kv=1&tv=-1`)
          .then((data) => {
            let lrc = data?.lrc?.lyric;
            if (lrc) {
              let fileName = metadata.hashCode + ".lrc";
              save(fileName, lrc, () => {
                console.log(`调用接口完成 ${index}`);
                // 递归调用，在指定的间隔后执行下一个请求
                setTimeout(() => {
                  executeRequests(musicList, index + 1, callback);
                }, 200);
              });
            } else {
              // 递归调用，在指定的间隔后执行下一个请求
              setTimeout(() => {
                executeRequests(musicList, index + 1, callback);
              }, 200);
            }
          })
          .catch((error) => {
            // 处理请求错误
            console.error(`Error executing request for URL: ${musicList}`, error);
            setTimeout(() => {
              executeRequests(musicList, index + 1, callback);
            }, 200);
          });
      } else {
        // 递归调用，在指定的间隔后执行下一个请求
        setTimeout(() => {
          executeRequests(musicList, index + 1, callback);
        }, 200);
      }
    })
    .catch((error) => {
      // TODO 调用接口失败
      callback();
    });
};

/**
 * 获取匹配度最高的一首歌的musicId
 * @param {*} songs 接口返回音乐信息
 * @param {*} metadata 歌曲元数据
 */
const getMusicId = (songs, metadata) => {
  if (!songs) {
    return null;
  }
  const foundSong = songs.find((song) => {
    if (song) {
      let name = song.name;
      let artist = song.artists[0]?.name;
      let album = song.album.name;
      let title = replactTitle(metadata.title);
      return (
        (name === title && artist === metadata.artist && album === metadata.album) ||
        (name === title && artist === metadata.artist) ||
        name === title
      );
    }
  });
  return foundSong ? foundSong.id : null;
};

const installLrc = () => {
  ipcMain.on(localSetting.INSTALL_LRC.value, (event, data) => {
    //1 获取全部歌曲信息
    read(dataName.META_DATA.value, (data) => {
      let metadataList = JSON.parse(data);
      const dataArray = metadataList.map((metadata) => metadata.value);
      const valueList = [].concat(...dataArray);
      //获取歌词
      executeRequests(valueList, 0, () => {
        console.log("回调开始");
        event.reply(localSetting.INSTALL_LRC_CALLBACK.value, localSetting.INSTALL_LRC_CALLBACK.value);
      });
    });
  });
};

export { installLrc };
