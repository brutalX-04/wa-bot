const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');
const { downloadMediaMessage, Mimetype, MessageType  } = require('@whiskeysockets/baileys');
const tiktok = require('./src/my-fnc/tiktok.js');
const youtube = require('./src/my-fnc/youtube.js');
const rmvbg = require('./src/my-fnc/rmvbg.js');
const sticker = require('./src/my-fnc/sticker.js');
const sticker1 = require('./src/my-fnc/stickerlist.js');
const cheerio = require('cheerio');
const axios = require('axios');
const pino = require('pino');
const fs = require('fs');
const write = require('fs/promises');


const logger = pino();

async function connectToWhatsapp() {
    const { state, saveCreds } = await useMultiFileAuthState("auth");
    const socket = makeWASocket({
        printQRInTerminal: true,
        browser: ["brutalID", 'Chrome', "1.0.0"],
        auth: state,
        logger: pino({ level: "silent" })
    });
    await socket.ev.on("creds.update", saveCreds);
    await socket.ev.on("connection.update", ({ connection }) => {
            if(connection === "open") console.log("Connet to : " + socket.user.id.split(':')[0]);
            if(connection === "close") connectToWhatsapp();
        });

    // Parsing Message
    await socket.ev.on("messages.upsert", ({ messages }) => {
        const msg = messages[0];
        try {
            //console.log(msg);

            // Reading Message
            function read() {
                const key = {
                    remoteJid: msg.key.remoteJid,
                    id: msg.key.id
                };
                socket.readMessages([key]);
            };

            // Message
           function sendmsg(text) {
                socket.sendMessage(id, { text: text });
            };

            // Reply Message
            function reply(text) {
                socket.sendMessage(msg.key.remoteJid, {text: text}, {quoted: msg}
                );
            };

            // Panggil Orang
            function mention(text) {
                socket.sendMessage(msg.key.remoteJid, {text: text, mentions:[msg.key.remoteJid]});
            };


            const messageType = Object.keys (msg.message)[0];


            if (messageType === 'conversation') {
                read();
                const pesan = msg.message.conversation.toLowerCase();
                if (msg.key.fromMe === true) {
                    console.log('pesan masuk : from me');

                } else if (pesan === ".menu") {
                    (async () => {
                        console.log('pesan masuk : ' + pesan);
                        await reply("╔═════ [ *MENU BOT* ] ⇒\n║\n╠═ [ *DOWNLOADER* ]\n║\n╠═ *TIKTOK :*\n║     ( *1* ) .mp3 link [ _untuk download mp3_ ]\n║     ( *2* ) .mp4 link [ _untuk download mp4_ ]\n║\n║\n╠═ *YOUTUBE :*\n║     ( *1* ) paste link [ _untuk download mp3_ ]\n║\n║\n╠═ [ *EDITING* ]\n║\n╠═ *HAPUS BACKGROUND :*\n║     ( *1* ) _kirim photo dengan caption :_ \n║             *.removebg*\n║\n║\n╠═ *STIKER :*\n║     ( *1* ) _kirim photo dengan caption_ :\n║             *.stiker* [ _untuk photo crop_ ]\n║             *.stiker.FULL* [ _untuk photo FULL_ ]\n║     ( *2* ) *.sticker-random-1* [ _untuk random 1-133 sticker_ ]\n║\n║\n╚═ [ _Thanks for using_ ] ♥");  
                    })();
                    

                } else if (pesan.includes(".sticker-random-")) {
                    (async () => {
                        console.log('pesan masuk : ' + pesan);
                        const jumlah = pesan.split('-')[2]
                        await sticker1.stickerlist(socket, msg, jumlah);
                    })();
                    

                } else if (pesan.includes("vt.tiktok")) {
                    (async () => {
                        if (pesan.includes('.mp')) {
                            console.log('pesan masuk : ' + pesan);
                            await reply('_Bentar ngab lagi proses..._');
                            const type = pesan.split(' ')[0];
                            const urls = msg.message.conversation.split(' ')[1];
                            const headers = {
                              'user-agent':'Mozilla/5.0 (Linux; Android 12; M2004J19C Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/115.0.5790.163 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/426.0.0.26.50;]'
                            };
                            try {
                                const response = await axios.get(urls, { headers });
                                const html = response.data;

                                const $ = cheerio.load(html);

                                const videoLinks = [];
                                $('link').each((index, element) => {
                                    const link = $(element).attr('href');
                                    if (link.includes('video')) {
                                        videoLinks.push(link);
                                    }
                                });

                                const url = videoLinks[0]
                                await tiktok.Tikdown(url, type, socket, msg);
                            } catch (error) {
                                console.error('Error:', error.message);
                            }
                        } else {
                            await reply('_mohon gunakan awalan .mp3/mp4_');
                        };
                    })();


                } else if (pesan.includes("youtu.be")) {
                    (async () => {
                        if (pesan.includes('.mp')) {
                            await reply('_Bentar ngab lagi proses..._');
                            const m = msg.message.conversation.split(' ')[1]
                            const text = m.split('/')[3]
                            const url = 'https://www.youtube.com/watch?v='+text
                            console.log('pesan masuk : ' + pesan);
                            await youtube.Ytdown(url, socket, msg);

                        } else {
                            await reply('_mohon gunakan awalan .mp3/mp4_');
                        };
                    })();


                } else {
                    (async () => {
                        console.log('pesan masuk : ' + pesan);
                        const name = msg.pushName;
                        const text = `Hi @${msg.key.remoteJid.split('@')[0]},\nmohon maaf *BOT* tidak mengerti pesan anda\nkirim pesan [ .menu ] untuk melihat menu *BOT*\n\n*#sendbyBOT*`;
                        await mention(text);
                    })();

                };

            } else if (messageType === 'extendedTextMessage') {
                read();
                (async () => {
                    const url_pesan = msg.message.extendedTextMessage.text;
                    const url = msg.message.extendedTextMessage.canonicalUrl;

                    if (url_pesan.includes('.mp')) {
                        const type = url_pesan.split(' ')[0];

                        if (msg.key.fromMe === true) {
                            console.log('pesan masuk : from me');

                        } else if (url_pesan.includes("tiktok")) {
                            (async () => {
                                console.log('pesan masuk : ' + url_pesan);
                                await reply('_Bentar ngab lagi proses..._');
                                await tiktok.Tikdown(url, type, socket, msg);
                            })();
                            

                        } else if (url_pesan.includes("youtu.be")) {
                            (async () => {
                                console.log('pesan masuk : ' + url_pesan);
                                await reply('_Bentar ngab lagi proses..._');
                                await youtube.Ytdown(url, socket, msg);
                            })();

                        } else {
                            (async () => {
                                console.log('pesan masuk : ' + url_pesan);
                                const name = msg.pushName;
                                const text = `Hi @${msg.key.remoteJid.split('@')[0]},\nmohon maaf *BOT* tidak mengerti pesan anda\nkirim pesan [ .menu ] untuk melihat menu *BOT*\n\n*#sendbyBOT*`;
                                await mention(text);
                            })();

                        };
                    };
                        
                })();

            } else if (messageType === 'imageMessage') {
                read();
                (async () => {
                    try {
                        caption = msg.message.imageMessage.caption;
                        
                        if (msg.key.fromMe === true) {
                            console.log('pesan masuk : from me');

                        } else if (caption === '.removebg') {
                            const buffer = await downloadMediaMessage(
                                msg,
                                'buffer',
                                { },
                                { 
                                    logger,
                                    reuploadRequest: socket.updateMediaMessage
                                }
                            );
                            try {
                                await write.writeFile('src/media/download.jpg', buffer);
                                console.log('Succes download media');
                                await reply('_Bentar ngab lagi proses..._');
                                await rmvbg.rmvbg(socket, msg);
                            } catch (error) {
                                await reply('_Mohon maaf program gagal mendownload file_');
                            }


                        } else if (caption.includes('.sticker')) {
                            if (caption === '.sticker') {
                                typ = StickerTypes.CROPPED;
                            } else if (caption === '.sticker.FULL') {
                                typ = StickerTypes.FULL;
                            };
                            const buffer = await downloadMediaMessage(
                                msg,
                                'buffer',
                                { },
                                { 
                                    logger,
                                    reuploadRequest: socket.updateMediaMessage
                                }
                            );
                            try {
                                await write.writeFile('src/media/sticker.png', buffer);
                                console.log('Succes download media');
                                await reply('_Bentar ngab lagi proses..._');
                                await sticker.stickercreat(socket, msg, typ);
                            } catch (error) {
                                await reply('_Mohon maaf program gagal mendownload file_');
                                console.log(error)
                            }

                        } else {
                            await reply('_Mohon di cek kembali captionnya_');
                        };

                    } catch (error) {
                        console.log('Eror handling');
                    };
                })();
                
            } else if (messageType === 'videoMessage') {
                console.log('pesan video');
                
            } else if (msg.key.remoteJid === 'status@broadcast') {
                console.log('ada status terbaru');

            } else if (msg.key.fromMe === true) {
                    console.log('pesan masuk : from me');

            } else {
                (async () => {
                    const name = msg.pushName;
                    const text = `Hi @${msg.key.remoteJid.split('@')[0]},\nmohon maaf *BOT* tidak mengerti pesan anda\nkirim pesan [ .menu ] untuk melihat menu *BOT*\n\n*#sendbyBOT*`;
                    await mention(text);
                })();

            };
        } catch (error) {
            console.log('Pesan dari nomor baru');
            (async () => {
                const name = msg.pushName;
                const text = `Hi @${msg.key.remoteJid.split('@')[0]},\nmohon maaf *BOT* tidak mengerti pesan anda\nkirim pesan [ .menu ] untuk melihat menu *BOT*\n\n*#sendbyBOT*`;
                await mention(text);
            })();
        };
    });

};


connectToWhatsapp()