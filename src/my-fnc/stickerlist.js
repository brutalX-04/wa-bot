const path = require('path');
const fs = require('fs');


async function stickerlist(socket, msg, jumlah) {
  for ( i = 0; i < jumlah; i++) {
    const list = ['1.webp', '10.webp', '100.webp', '101.webp', '102.webp', '103.webp', '104.webp', '105.webp', '106.webp', '107.webp', '108.webp', '109.webp', '11.webp', '110.webp', '111.webp', '112.webp', '113.webp', '114.webp', '115.webp', '116.webp', '117.webp', '118.webp', '119.webp', '12.webp', '13.webp', '14.webp', '15.webp', '16.webp', '17.webp', '18.webp', '19.webp', '2.webp', '20.webp', '21.webp', '22.webp', '220.webp', '221.webp', '222.webp', '225.webp', '227.webp', '229.webp', '23.webp', '236.webp', '239.webp', '24.webp', '240.webp', '242.webp', '244.webp', '247.webp', '248.webp', '25.webp', '26.webp', '27.webp', '28.webp', '29.webp', '3.webp', '30.webp', '31.webp', '32.webp', '33.webp', '34.webp', '35.webp', '36.webp', '37.webp', '38.webp', '39.webp', '4.webp', '40.webp', '41.webp', '42.webp', '43.webp', '44.webp', '45.webp', '46.webp', '47.webp', '48.webp', '49.webp', '5.webp', '50.webp', '51.webp', '52.webp', '53.webp', '54.webp', '55.webp', '56.webp', '57.webp', '58.webp', '59.webp', '6.webp', '60.webp', '61.webp', '62.webp', '63.webp', '64.webp', '65.webp', '66.webp', '67.webp', '68.webp', '69.webp', '7.webp', '70.webp', '71.webp', '72.webp', '73.webp', '74.webp', '75.webp', '76.webp', '77.webp', '78.webp', '79.webp', '8.webp', '80.webp', '81.webp', '82.webp', '83.webp', '84.webp', '85.webp', '86.webp', '87.webp', '88.webp', '89.webp', '9.webp', '90.webp', '91.webp', '92.webp', '93.webp', '94.webp', '95.webp', '96.webp', '97.webp', '98.webp', '99.webp'];
    const random = Math.floor(Math.random() * list.length);
    (async() => {
      console.log('Sending Sticker');
      const lokasi = 'src/media/sticker/'+list[random];
      await socket.sendMessage(
        msg.key.remoteJid,
        {
        sticker:  fs.readFileSync(lokasi),
        mimetype: 'image/webp'
        }
      );
    })();
  };
};



module.exports = { stickerlist };