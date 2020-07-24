const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('d:/Discord/JSON_files/Mov_bot-config.json');
const pre = config.prefix;
const mod = config.modprefix;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var guildArray = [guildObject = {
    guildID: 0,
    guildAdmin: '',
    guildChannel: ''
}];
var index;

client.on('ready', () => {
    console.log('ready fool');
});


var checkChannel;
var admin;

client.on('message', message =>{
    if (message.author.bot) return;

    if(message.content.startsWith(`${pre}${mod}setup`)){
        checkArray();
        setAdmin();
        return;
    }

    if(message.content.startsWith(`${pre}${mod}set-channel`)){
        checkArray();
        setupChannel();
        return;
    }

    /* Need to get reaciton working.
    if(message.content.startsWith(`${pre}${mod}reminders`)){
        sendReminder();
        return;
    }
    */
    
    function setupChannel(){
        let foundChannel = false;

        if(guildArray[index].guildAdmin === undefined){
            message.channel.send("Need to initialize bot first. type 'm/?setup' to set up Movie Bot")
        }
        else if(!message.member.roles.cache.some(r => r.name.toLowerCase() === guildArray[index].guildAdmin)){
            message.channel.send("You don't have permission to modify my settings.");
        }
        else{
            message.channel.send('Copy the ID of the channel you want me to send my announcements to: ');
            const filter = m => m.author.id === message.author.id;
            const collector = message.channel.createMessageCollector(filter, {max: 1, time: 30000});
            collector.on('collect', m => {
                client.channels.cache.forEach((channel) => {
                    if(m.content === channel.id){
                        guildArray[index].guildChannel = m.content.replace(/\D/g,'');
                        foundChannel = true;
                    }
                })
                if(foundChannel){
                    message.channel.send(('Ok. I\'ll send my reminders to <#' + guildArray[index].guildChannel + '>.'));
                }
                else{
                    message.channel.send("I couldn't find that channel...");
                }
                return;
        })}
    }

    function checkArray(){
        if(guildArray.some(guild => guild.guildID === message.guild.id)){
            index = guildArray.findIndex(guild => guild.guildID === message.guild.id)
            console.log(index)
            console.log(guildArray)
        }
        else{
            let newGuild = guildArray.push({
                guildID: message.guild.id,
                guildAdmin: '',
                guildChannel: ''
            })
        }
    }

    function setAdmin(){
        message.channel.send('Which role would you like to be able to edit my settings?');
        const filter = m => m.author.id === message.author.id;
        const collector = message.channel.createMessageCollector(filter, {max: 1, time: 30000});
        collector.on('collect', m => {
                let args = m.content.toLowerCase();
                let { cache } = m.guild.roles;
                let role = cache.find(role => role.name.toLowerCase() === args);
                if(role){
                    guildArray[index].guildAdmin = args;
                    message.channel.send(`${role} can now modify my settings`);
                }
                else{
                    message.channel.send('Could not find that role...');
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

           console.log(message);
            if(checkChannel === undefined){
            message.channel.send(m)
                .then(messageReaction => {
                    messageReaction.react('🎥')

                    .then( message => {
                        const filter = (reaction, user) => {
                            return ['🎥'].includes(reaction.emoji.name) && user.id === message.author.id;
                        };
                        const collector = message.createReactionCollector(filter, {time: 6000});
                        collector.on('collect', (reaction, user) => {
                            var role = message.guild.role.find(role => role.name === "Moviegoers")
                            message.member.addRole(role);
                        })
                    }) 
                });
        }
        else{
            console.log(message);
            client.channels.cache.get(checkChannel).send(m)
                .then(messageReaction => {
                    messageReaction.react('🎥');
                });
                const filter = (reaction, user) => {
                    return ['🎥'].includes(reaction.emoji.name) && user.id === message.author.id;
                };
                const collector = message.channel.createReactionCollector(filter, {time: 6000});
                collector.on('collect', r => {
                    var role = guild.role.find(role => role.name === "Moviegoers")
                    message.member.addRole(role);
                })
        }
    }
    
    if(message.content.startsWith(`${pre}`)){
        checkArray();
        if(message.content.startsWith(`${pre}${mod}`)) return;
        searchMovie();
        return;
    }

    function searchMovie(){
        var tempTitle1 = (message.content).split("/");
        var tempmovieTitle = tempTitle1[1].split(' ');
        var movieTitle = "";
        for(i = 0; i< tempmovieTitle.length; i++){
            movieTitle+= tempmovieTitle[i];
            if(i !== tempmovieTitle.length-1 && tempmovieTitle[i] !== ''){movieTitle += "+"}
        }
        var movieYear = tempTitle1[2];
        var movieUrl = 'http://www.omdbapi.com/?apikey=472eaa45&t=' +movieTitle+ '&y=' +movieYear;
        
        let request = new XMLHttpRequest();
        request.open('GET', movieUrl);
        request.send();
        request.onload = () => {
            if(request.status === 200){
                let info = JSON.parse(request.responseText);
                var m = {embed: {
                    color: 3447003,
                    title: info.Title,
                    description: "Hey guys! This is the movie we're going to be watching tonight!",
                    fields: [{
                        name: 'Info:',
                        value: `Description: ${info.Plot}
                                Starring: ${info.Actors}`
                    }
                ],
                timestamp: new Date(),
                }}
                    if(info.Title === undefined){
                        message.channel.send("I couldn't find a movie that matched that description...")
                    }

                    else if(index === undefined || guildArray[index].guildChannel === ''){
                        message.channel.send(m);
                    }
                    else{
                        client.channels.cache.get(guildArray[index].guildChannel).send(m);
                    }}
            else{
                console.log(`error ${request.status} ${request.statusText}`);
            }
        }
    }
});

client.login(config.token);