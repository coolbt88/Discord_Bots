const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('d:/Discord/JSON_files/Mov_bot-config.json');
const pre = config.prefix;
const mod = config.modprefix;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

client.on('ready', () => {
    console.log('ready fool');
});


var checkChannel;

client.on('message', message =>{
    if (message.author.bot) return;

    if(message.content.startsWith(`${pre}${mod}start`)){
        setupChannel();
        return;
    }

    function setupChannel(){
        let channel = message.channel.id;
        let foundChannel = false;

        client.channels.cache.get(channel).send('Alright. What channel would you like me to send my reminders to?');
        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
        collector.on('collect', message => {
            client.channels.cache.forEach((channel) => {
                if(message.content === channel.id){
                    checkChannel = message.content.replace(/\D/g,'');
                    foundChannel = true;
                }
            })
            if(foundChannel){
                client.channels.cache.get(channel).send(('Ok. I\'ll send my reminders to <#' + checkChannel + '>.'));
            }
            else{
                client.channels.cache.get(channel).send('Error.');
            }
            return;
        })
    }
    
    if(message.content.startsWith(`${pre}`)){
        if(message.content.startsWith(`${pre}${mod}`)) return;
        let channel = message.channel.id;
        var tempTitle1 = (message.content).split("/");
        var movieTitle = encodeURIComponent(tempTitle1[1]);
        var movieUrl = 'http://www.omdbapi.com/?apikey=472eaa45&t=' +movieTitle;

        let request = new XMLHttpRequest();
        request.open('GET', movieUrl);
        request.send();
        request.onload = () => {
            if(request.status === 200){
                let info = JSON.parse(request.responseText);
                var message = `We're going to be watching ${info.Title} soon!
                Description: ${info.Plot}
                Starring: ${info.Actors}
                `
                if(checkChannel === undefined){
                    client.channels.cache.get(channel).send(message);
                }
                else{
                    client.channels.cache.get(checkChannel).send(message);
                }
               
            }
            else{
                console.log(`error ${request.status} ${request.statusText}`);
            }
        }
        return;
    }

});

client.login(config.token);