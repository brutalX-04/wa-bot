const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');


async function rmvbg(socket, msg) {
  const inputPath = 'src/media/download.jpg';
  const formData = new FormData();
  formData.append('size', 'auto');
  formData.append('image_file', fs.createReadStream(inputPath), path.basename(inputPath));

  axios({
    method: 'post',
    url: 'https://api.remove.bg/v1.0/removebg',
    data: formData,
    responseType: 'arraybuffer',
    headers: {
      ...formData.getHeaders(),
      'X-Api-Key': '37FfGPeB6VE4NS8B4hi9XsQF',
    },
    encoding: null
  })
  .then((response) => {
    if(response.status != 200) return console.error('Error:', response.status, response.statusText);
    fs.writeFileSync("src/media/no-bg.png", response.data);
    console.log('Program Succes');
    socket.sendMessage(
      msg.key.remoteJid,
      { 
          image: fs.readFileSync("src/media/no-bg.png"), 
          caption: "Program Succes!",
      }
    );
  })
  .catch((error) => {
      return console.error('Request failed:', error);
  });

};

module.exports = { rmvbg };