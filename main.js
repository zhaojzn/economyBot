const Discord = require('discord.js');
const intents = new Discord.Intents(32767);
const bot = new Discord.Client({intents});
const mysql = require('mysql');
const fs = require("fs");
const express = require('express');
const { token } = require('./token.json');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");
const http = require('http');
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "eco_db"
});

module.exports = {db};


const eco_prefix = "ECO_DB:"

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });

const app = express();
const port = 3000;
const server = http.createServer(app);

module.exports = {app};


const TEST = [
    {id: 0, userName: 'Test'}
]

app.get('/api/get/test', (req, res) =>{
    bot.channels.cache.get("918659190925426739").send("a post from http://127.0.0.1:3000/")
    res.json(TEST)
})
app.get('/', (req, res) => {
    fs.readFile('index.html', function(error, data){
        if(error){
            res.write(404)
            res.write('Error: File Not Found')
        }else{
            res.write(data)
            console.log("packet data")
        }
    })
  })
  
server.listen(port, () => {
    console.log(`Website app listening on port ${port}`)
    console.log( `http://127.0.0.1:${ port }` )
})

db.connect(err =>{
    if(err) throw err;
    console.log("Connected to database");
})





bot.on("ready", async () => {

    console.log(`${bot.user.username} is online on ${bot.guilds.cache.size} servers!`);
    setInterval(() =>{
        db.query(`SELECT * FROM users_data`, (err,rows) =>{
            if(err) throw err;
            bot.user.setActivity(`Users Data : ${rows.length} | *help`, {type: "PLAYING"});
        })
    }, 5000);
  
  });


fs.readdir("./commands/", (err, files) => {
    let count = 0;
    if(err) console.log(err);
     let jsfile = files.filter(f => f.split(".").pop() === "js")
     if(jsfile.length <= 0){
       console.log("Couldn't find commands.");
       return;
     }
   
     jsfile.forEach((f, i) => {
       let pull = require(`./commands/${f}`);
       console.log('Command loaded: %s', f);
       count++;
       bot.commands.set(pull.config.name, pull);
       pull.config.aliases.forEach(alias => {
           bot.aliases.set(alias, pull.config.name);
       });

     });
    console.log(`Commands loaded: ${count}`)
   }); 

bot.on("messageCreate", message =>{
    db.query(`select * from users_data where idusers_data = '${message.author.id}'`, (err,rows) =>{
        if(err) throw err;
        if(!rows[0]){
            sql = "INSERT INTO `eco_db`.`users_data` (`idusers_data`, `balance`) VALUES ('"+message.author+"', '0');";
            db.query(sql)
            console.log(eco_prefix + "User: " + message.author + " added to the database")
        }
    })
})

bot.on('messageCreate', message =>{
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    let prefix = "*";

    if(!message.content.startsWith(prefix)) return; 
    let commandfile = bot.commands.get(cmd.slice(prefix.length)) || bot.commands.get(bot.aliases.get(cmd.slice(prefix.length)));
    if(commandfile) commandfile.run(bot,message,args);
})

bot.on('messageCreate', async message =>{
    db.query(`select * from users_data where idusers_data = '${message.author.id}'`, (err,rows) =>{
        if(err) throw err;
        if(rows[0]){
            amount = parseInt(rows[0].balance);
            amount = amount+1;
            author = message.author.id;
            sql = "UPDATE `eco_db`.`users_data` SET `balance` = '"+amount+"' WHERE (`idusers_data` = '"+author+"');"
            db.query(sql);
            var currentdate = new Date(); 
            var datetime = "Date Time: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
            console.log(`UPDATE ${message.author.id} TO ${amount} : ` + datetime);

        }

    })
})

bot.login(token);
