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
var admin;

client.on('message', message =>{
    if (message.author.bot) return;

    if(message.content.startsWith(`${pre}${mod}setup`)){
        setAdmin();
        return;
    }

    if(message.content.startsWith(`${pre}${mod}set-channel`)){
        setupChannel();
        return;
    }

    if(message.content.startsWith(`${pre}${mod}reminders`)){
        sendReminder();
        return;
    }
    
    function setupChannel(){
        let foundChannel = false;

        if(admin === undefined){
            message.channel.send("Need to initialize bot first. type 'm/?setup' to set up Movie Bot")
        }
        else{
            message.channel.send('Copy the ID of the channel you want me to send my announcements to: ');
            const filter = m => m.author.id === message.author.id;
            const collector = message.channel.createMessageCollector(filter, {max: 1, time: 30000});
            collector.on('collect', m => {
                client.channels.cache.forEach((channel) => {
                    if(m.content === channel.id){
                        checkChannel = m.content.replace(/\D/g,'');
                        foundChannel = true;
                    }
                })
                if(foundChannel){
                    message.channel.send(('Ok. I\'ll send my reminders to <#' + checkChannel + '>.'));
                }
                else{
                    message.channel.send('Error.');
                }
                return;
        })}
    }

    function setAdmin(){
        console.log(admin);
        message.channel.send('Which role would you like to be able to edit my settings?');
        const filter = m => m.author.id === message.author.id;
        const collector = message.channel.createMessageCollector(filter, {max: 1, time: 30000});
        collector.on('collect', m => {
                let args = m.content.toLowerCase();
                let { cache } = m.guild.roles;
                let role = cache.find(role => role.name.toLowerCase() === args);
                if(role){
                    admin = args;
                    message.channel.send(`${m} can now modify my settings`);
                }
                else{
                    message.channel.send('Error.');
                }
        })
    }

    function sendReminder(){
        let m = "Hey guys! Interact with this messsage if you want to be pinged when we're watching a movie!"
        
        /*client.guild.roles.create({
            data:{
                name: 'Moviegoers',
                color: 'BLUE',
            },
            reason: 'to ping people who want to watch movies'
        })
            .then(console.log);
            */

        if(checkChannel === undefined){
            message.channel.send(m)
                .then(messageReaction => {
                    messageReaction.react('🎥');
                })
                .then(async function (message){
                    await message.react('🎥')
                })
                const filter = (reaction, user) => {
                    return ['🎥'].includes(reaction.emoji.name) && user.id === message.author.id;
                };

                const collector = message.createReactionCollector(filter, {time: 60000});

                collector.on('collect', (reaction, reactionCollector) => {
                    if (reaction.emoji.name === '🎥') {
                        var role = message.guild.role.find(role => role.name === "Moviegoers")
                        message.member.addRole(role);
                    }
                });
        }
        else{
            checkChannel.send(m)
                .then(messageReaction => {
                    messageReaction.react('🎥');
                });
                message.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                .then(collected => {
                    const reaction = collected.first();
            
                    if (reaction.emoji.name === '🎥') {
                        var role = message.guild.role.find(role => role.name === "Moviegoers")
                        message.member.addRole(role);
                    }
                })
                .catch(collected => {
                    message.reply('you reacted with neither a thumbs up, nor a thumbs down.');
                });
    
        }
    }
    
    if(message.content.startsWith(`${pre}`)){
        if(message.content.startsWith(`${pre}${mod}`)) return;
        var tempTitle1 = (message.content).split("/");
        var movieTitle = encodeURIComponent(tempTitle1[1]);
        var movieUrl = 'http://www.omdbapi.com/?apikey=472eaa45&t=' +movieTitle;

        let request = new XMLHttpRequest();
        request.open('GET', movieUrl);
        request.send();
        request.onload = () => {
            if(request.status === 200){
                let info = JSON.parse(request.responseText);
                var m = `We're going to be watching ${info.Title} soon!
                Description: ${info.Plot}
                Starring: ${info.Actors}
                `
                if(info.Title === undefined){
                    message.channel.send("I couldn't find a movie that matched that description...")
                }
                
                else if(checkChannel === undefined){
                    message.channel.send(m);
                }
                else{
                    checkChannel.send(m);
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