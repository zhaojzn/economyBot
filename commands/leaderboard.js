
const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { db } = require('../main.js');
module.exports.run = async(bot, message, args) => {
    

    db.query(`select *from users_data order by balance DESC;`, (err,rows) =>{
        output = ""
        for(let s in rows){
            if(s < 5){
                output += "\n" +"<@" + bot.users.cache.get(`${rows[s].idusers_data}`) + ">" + " - $" + rows[s].balance
            }
            
        }
        const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Balance Leaderboard (TOP 5)')
        .setDescription(output)
        message.channel.send({embeds: [embed]});
    
    })
}


module.exports.config = {
    name: "leaderboard",
    aliases: ["lb"]
}