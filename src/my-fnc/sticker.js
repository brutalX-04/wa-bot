const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');
const path = require('path');
const fs = require('fs');


async function stickercreat(socket, msg, typ) {
  try {
    const sticker = new Sticker('src/media/sticker.png', {
        pack: 'xMOD',
        author: 'brutal',
        type: typ,
        categories: ['😎', '😉', '😝'],
        quality: 100
    })

    const buffer = sticker.toBuffer()

    await sticker.toFile('src/media/sticker.webp')

    await socket.sendMessage(
      msg.key.remoteJid,
      {
      sticker:  fs.readFileSync("src/media/sticker.webp"),
      mimetype: 'image/webp'
      }
    );
  } catch (error) {
    console.log('Create Sticker Failled')
    await socket.sendMessage(msg.key.remoteJid, { text: 'Mohon maaf program failled' })
  }

};


module.exports = { stickercreat };