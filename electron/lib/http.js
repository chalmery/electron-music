import {CharConstants,BizConstants} from "../constants/constant";

const https = require("https")

function makeGetRequest(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let data = CharConstants.STRING_EMPTY;
      res.on(BizConstants.DATA, (chunk) => {
        data += chunk;
      });
      res.on(BizConstants.END, () => {
        try {
          let jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          resolve(data);
        }
      });
    });

    req.on(BizConstants.ERROR, (error) => {
      reject(error);
    });

    req.end();
  });
}

export {
  makeGetRequest
}