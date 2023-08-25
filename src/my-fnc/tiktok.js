const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const querystring = require('querystring');
const request = require('request');
const cheerio = require('cheerio');
const https = require('https');
const axios = require('axios');
const fs = require('fs');


function Tikdown (url, type, socket, msg) {

  const cookies = {
    '__cflb': '0H28v8EEysMCvTTqtu4kewtscz2STFoqGj1eYu1VRRX',
  };
  const headers = {
    'authority': 'ssstik.io',
    'accept': '*/*',
    'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
    'cache-control': 'no-cache',
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'hx-current-url': 'https://ssstik.io/en',
    'hx-request': 'true',
    'hx-target': 'target',
    'hx-trigger': '_gcaptcha_pt',
    'origin': 'https://ssstik.io',
    'referer': 'https://ssstik.io/en',
    'sec-ch-ua': '"Not)A;Brand";v="24", "Chromium";v="116"',
    'sec-ch-ua-mobile': '?1',
    'sec-ch-ua-platform': '"Android"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
  };

  const params = {
    'url': 'dl',
  };

  const data = new URLSearchParams({
    'id': url,
    'locale': 'en',
    'tt': 'ekNmOTg4',
  });

  (async () => {
    try {
      const response = await axios.post('https://ssstik.io/abc', data, {
        params: params,
        headers: headers,
        httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Ignore SSL certificate issues
        withCredentials: true,
        jar: true,
      });

      const $ = cheerio.load(response.data);

      links = [];
      $('a[href]').each((index, element) => {
        const link = $(element).attr('href');
        links.push(link);

      });

      const urlmp4 = links[0];
      const urlmp3 = links[2];


      if (type === '.mp4') {
        const urldown = await axios.get(urlmp4, {
          responseType: 'stream',
        });

        const fileStream = fs.createWriteStream('src/media/tiktok.mp4');
        urldown.data.pipe(fileStream);

        fileStream.on('finish', () => {
          console.log('Download Success');
          socket.sendMessage(
                msg.key.remoteJid,
                { 
                    video: fs.readFileSync("src/media/tiktok.mp4"), 
                    caption: "Program Succes!",
                }
            );
        });

        fileStream.on('error', (error) => {
          console.log('Download Failed');
          socket.sendMessage(msg.key.remoteJid, {text: '_Program Failled_'}, {quoted: msg});
        });

      } else if (type === '.mp3') {
        const urldown = await axios.get(urlmp3, {
          responseType: 'stream',
        });

        const fileStream = fs.createWriteStream('src/media/tiktok.mp3');
        urldown.data.pipe(fileStream);

        fileStream.on('finish', () => {
          console.log('Download Success');
          socket.sendMessage(msg.key.remoteJid, { audio: { url: "src/media/tiktok.mp3" }, mimetype: 'audio/mp4' });
        });

        fileStream.on('error', (error) => {
          console.log('Download Failed');
          socket.sendMessage(msg.key.remoteJid, {text: '_Program Failled_'}, {quoted: msg});
        });
      };

    } catch (error) {
      console.log('Error');
      socket.sendMessage(msg.key.remoteJid, {text: '_Program Failled, mohon tunggu 10 detik lalu ulangi_'}, {quoted: msg});
    }
  })();
};


module.exports = { Tikdown };