const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const pre = config.prefix;

client.on('ready', () => {
    console.log('ready fool');
});




client.on('message', message =>{
    if (message.author.bot) return;

    if(message.content.startsWith(`${pre}sotd`)){
        message.reply('SOOP');
    }

    if(message.content.startsWith(`${pre}wallet`)){
        CheckWallet();
    }

});

function CheckWallet(){

}


client.login(config.token);