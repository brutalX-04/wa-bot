const querystring = require('querystring');
const request = require('request');
const cheerio = require('cheerio');
const https = require('https');
const axios = require('axios');
const fs = require('fs');


function Ytdown (url, socket, msg) {
  async function download(token, vid) {
    const headers = {
      'authority': 'www.y2mate.com',
      'accept': '*/*',
      'accept-language': 'en-US,en;q=0.9,id;q=0.8',
      'cache-control': 'no-cache',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'origin': 'https://www.y2mate.com',
      'pragma': 'no-cache',
      'referer': 'https://www.y2mate.com/id/youtube-mp3/dB6BwXnonWc',
      'sec-ch-ua': '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
      'x-requested-with': 'XMLHttpRequest',
    };

    const data = querystring.stringify({
      'vid': vid,
      'k': token,
    });

    try {
      const response = await axios.post('https://www.y2mate.com/mates/convertV2/index', data, {
        headers: headers,
      });

      const url = response.data.dlink;
      //console.log(url);
      const urldown = await axios.get(url, {
            responseType: 'stream',
          });

          const fileStream = fs.createWriteStream('src/media/youtube.mp3');
          urldown.data.pipe(fileStream);

          fileStream.on('finish', () => {
            console.log('Download Success');
            socket.sendMessage(msg.key.remoteJid, { audio: { url: "src/media/youtube.mp3" }, mimetype: 'audio/mpeg' });
            
          });

          fileStream.on('error', (error) => {
            console.log('Download Failed');
            socket.sendMessage(msg.key.remoteJid, {text: '_Program Failled_'}, {quoted: msg});
          });

    } catch (error) {
      console.error('Error:', error);
    }
  }


  async function convert(url) {
      const headers = {
          'authority': 'www.y2mate.com',
          'accept': '*/*',
          'accept-language': 'en-US,en;q=0.9,id;q=0.8',
          'cache-control': 'no-cache',
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'origin': 'https://www.y2mate.com',
          'pragma': 'no-cache',
          'referer': 'https://www.y2mate.com/id744/youtube-mp3',
          'sec-ch-ua': '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
          'x-requested-with': 'XMLHttpRequest',
      };

      const data = querystring.stringify({
        'k_query': url,
        'k_page': 'mp3',
        'hl': 'id',
        'q_auto': '0',
      });

      try {
          const response = await axios.post('https://www.y2mate.com/mates/analyzeV2/ajax', data, { headers });
          const vid = response.data.vid;
          const token = response.data.links.mp3.mp3128.k;
          download(token, vid);

      } catch (error) {
          console.error('An error occurred:', error.message);
      }
  }

  convert(url);

};


module.exports = { Ytdown };