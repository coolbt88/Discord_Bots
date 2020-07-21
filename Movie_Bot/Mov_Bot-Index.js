const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('d:/Discord/JSON_files/Mov_bot-config.json');
const pre = config.prefix;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

client.on('ready', () => {
    console.log('ready fool');
});


client.on('message', message =>{
    if (message.author.bot) return;

    if(message.content.startsWith(`${pre}`)){

        var tempTitle1 = (message.content).split("/");
        var movieTitle = encodeURIComponent(tempTitle1[1]);
        var movieUrl = 'http://www.omdbapi.com/?apikey=472eaa45&t=' +movieTitle;
        console.log(movieUrl);

        
        let request = new XMLHttpRequest();
        request.open('GET', movieUrl);
        request.send();
        request.onload = () => {
            console.log(request);
            if(request.status === 200){
                let info = JSON.parse(request.responseText);
                message.reply(info.Title);
            }
            else{
                console.log(`error ${request.status} ${request.statusText}`);
            }
        }
    }

});

client.login(config.token);