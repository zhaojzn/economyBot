const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
module.exports.run = async(bot, message, args) => {
    message.channel.send("pong")

}


module.exports.config = {
    name: "ping",
    aliases: []
}