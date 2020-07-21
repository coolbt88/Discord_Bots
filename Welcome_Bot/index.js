const Discord = require('discord.js')
const { OpusEncoder } = require('@discordjs/opus');
const client = new Discord.Client();

bot_secret_token = "NzE4MjAzOTI3NzQ4OTM1Njkx.Xtldvg.odly2AICCdcXeOeL492n8wJdenw";
client.login(bot_secret_token)

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', (message) => {
    const channel = client.channels.cache.get("400055961663832065");
    if(message.content == 'cams here'){
        channel.join().then(connection => {
            const dispatcher = connection.play('D:/Discord_bots/Welcome_bot/Audio/camshere.mp3')});
    }
    if(message.content == 'liors here'){
        channel.join().then(connection => {
            const dispatcher = connection.play('D:/Discord_bots/Welcome_bot/Audio/liorshere.mp3')});
    }
    if(message.content == 'piros here'){
        channel.join().then(connection => {
            const dispatcher = connection.play('D:/Discord_bots/Welcome_bot/Audio/piroshere.mp3')});
    }
    if(message.content == 'coops here'){
        channel.join().then(connection => {
            const dispatcher = connection.play('D:/Discord_bots/Welcome_bot/Audio/coopshere.mp3')});
    }
    if(message.content == 'jordans here'){
        channel.join().then(connection => {
            const dispatcher = connection.play('D:/Discord_bots/Welcome_bot/Audio/jordanshere.mp3')});
    }
  });