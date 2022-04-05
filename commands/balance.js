const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { db } = require('../main.js');
module.exports.run = async(bot, message, args) => {
    db.query(`SELECT balance FROM users_data WHERE idusers_data = '${message.author.id}'`, (err,rows) =>{
        let balance = 0
        if(err) throw err;
        if(rows[0].balance >= 0){
            balance = rows[0].balance
        }else{
            balance = 0;
        }
        message.channel.send("You have: $" + balance);
    })
        
    

}


module.exports.config = {
    name: "balance",
    aliases: ["bal"]
}