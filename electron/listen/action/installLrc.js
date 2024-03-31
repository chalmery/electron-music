import { ipcMain } from "electron";
import {eventName} from "../../lib/metadata/event";
import { makeGetRequest } from "../../lib/util/http";
import { save, read } from "../../lib/fs";
import {fileName} from "../../lib/metadata/metadata";
import {replaceLive} from "../../lib/util/utils";

const executeRequests = (musicList, index, callback) => {
  console.log(`调用接口开始 ${index}`);
  if (index >= musicList.length) {
    // 所有请求已执行完毕
    console.log(`所有请求已执行完毕`);
    callback();
    return;
  }
  const metadata = musicList[index];
  let title = replaceLive(metadata.title);
  makeGetRequest(`https://music.163.com/api/search/get?s=${title}-${metadata.artist}&type=1&limit=10`)
    .then((data) => {
      let songs = data?.result?.songs;
      let musicId = matchHighLevelMusicId(songs, metadata);
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
 * 优先找，歌曲名称，专辑名称，歌手名称全部匹配的
 * @param {*} songs 接口返回音乐信息
 * @param {*} metadata 歌曲元数据
 */
const matchHighLevelMusicId = (songs, metadata) => {
  if (!songs) {
    return null;
  }
  const foundSong = songs.find((song) => {
    if (!song) {
      return false
    }
    let name = song.name;
    let artist = song.artists[0]?.name;
    let album = song.album.name;
    let title = replaceLive(metadata.title);
    if (name === title && artist === metadata.artist && album === metadata.album){
      return true
    }
    if (name === title && artist === metadata.artist){
      return true
    }
    if (name === title){
      return true
    }
  });
  return foundSong ? foundSong.id : null;
};

/**
 * 下载歌词
 */
const installLrc = () => {
  ipcMain.on(eventName.INSTALL_LRC.value, (event, data) => {
    //1 获取全部歌曲信息
    read(fileName.META_DATA.value, (data) => {
      let metadataList = JSON.parse(data);
      const dataArray = metadataList.map((metadata) => metadata.value);
      const valueList = [].concat(...dataArray);
      //获取歌词
      executeRequests(valueList, 0, () => {
        console.log("回调开始");
        event.reply(eventName.INSTALL_LRC_CALLBACK.value, eventName.INSTALL_LRC_CALLBACK.value);
      });
    });
  });
};

export { installLrc };
