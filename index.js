'use strict'
/*
* Copyright 2017 TheEvilSocks
*
* Licensed under the EUPL, Version 1.1 only (the
 "Licence"); 
* You may not use this work except in compliance with the
Licence.
* You may obtain a copy of the Licence at:
*
* https://joinup.ec.europa.eu/software/page/eupl
*
* Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
* See the Licence for the specific language governing
permissions and limitations under the Licence.
*/ 

const fs = require('fs'),
	ini = require('ini'),
	Util = require('./lib/util.js'),
	util = new Util(),
	Lang = new require("./lib/lang.js"),
	lang = new Lang(),
	Player = new require("./lib/player.js"),
	Eris = require('eris');

var config, permissions;
var players = {};
var commands = {};

//Read config
try{
	let statConf = fs.statSync('./config/config.ini');
	config = ini.parse(fs.readFileSync('./config/config.ini', 'utf8'));

	if(!config.Bot || typeof config.Bot !== 'object')
		throw new Error("Section 'Bot' was not found in the configuration file.");
		if(config.Bot.Language === undefined)
			throw new Error("Variable 'Language' was not found in the configuration file.");

	//Set language so the rest of the errors are in the correct language.
	lang.setLocalization(config.Bot.Language);

		if(config.Bot.Prefix === undefined)
				throw new Error(lang.getLocalizedString("config.error.variable").format("Prefix"));

	if(!config.Discord || typeof config.Discord !== 'object')
		throw new Error(lang.getLocalizedString("config.error.section").format("Discord"));
		
		if(config.Discord.Token === undefined)
			throw new Error(lang.getLocalizedString("config.error.variable").format("Token"));



}catch(configError){
	switch(configError.code){
		default:
			console.log("There was an error reading the configuration file.");
			console.log(configError.message);
			break;
		case "ENOENT":
			console.log("There was no configuration file found.\nDid you read the installation instructions?");
			console.log(configError.message);
			break;
	}
	process.exit(1);
}

//Read permissions
try{
	let statPerm = fs.statSync('./config/permissions.ini');
	permissions = ini.parse(fs.readFileSync('./config/permissions.ini', 'utf8'));

	//Validate config file
	if(!permissions.Default || typeof config.Discord !== 'object')
		throw new Error(lang.getLocalizedString("permissions.error.nodefault"));






	

}catch(configError){
	switch(configError.code){
		default:
			console.log("There was an error reading the permissions file.");
			console.log(configError.message);
			break;
		case "ENOENT":
			console.log("There was no permissions file found.\nDid you read the installation instructions?");
			console.log(configError.message);
			break;
	}
	process.exit(1);
}






//Load all commands from plugins directory
var pluginFiles = fs.readdirSync("./plugins/").filter(f => f.startsWith("plugin_") && f.endsWith(".js"));
for(let i = 0; i < pluginFiles.length; i++){
	try{	
		let _cmd = require("./plugins/" + pluginFiles[i]);
		commands[_cmd.meta.name] = Object.assign({}, _cmd);
		if(_cmd.meta.aliases && _cmd.meta.aliases.length > 0){
			for(let j = 0; j < _cmd.meta.aliases.length; j++)
				commands[_cmd.meta.aliases[j]] = Object.assign({}, _cmd);
		}
	}catch(pluginError){
		throw new Error(lang.getLocalizedString("plugin.error.loading").format({plugin: pluginFiles[i], stack: pluginError.stack}));
	}
}



var client = new Eris(config.Discord.Token);
//rip out token for security
config.Discord.Token = undefined;

client.on('ready', () => {
	console.log(lang.getLocalizedString("bot.ready.identify").format({username: client.user.username, id: client.user.id}));
	console.log(lang.getLocalizedString("bot.ready.guilds").format({guildcount: client.guilds.size, guilds: client.guilds.map(g => {
		return `${g.id} - ${g.name}\n`
	})}));
});


client.on('messageCreate', msg => {
	if((config.Bot.IgnoreBots == "yes" && msg.author.bot) || msg.author.id == client.user.id || !msg.content.startsWith(config.Bot.Prefix))
		return;

	let _cmd = msg.content.indexOf(' ') > -1 ? msg.content.substring(config.Bot.Prefix.length, msg.content.indexOf(' ')) : msg.content.substring(config.Bot.Prefix.length);
	if(commands[_cmd]){
		let cmd = commands[_cmd];

		if(!('guild' in msg.channel)){
			msg.channel.messageCreate(lang.getLocalizedString("bot.nodm"));
			return;
		}
		if(!players[msg.channel.guild.id])
			players[msg.channel.guild.id] = new Player();
		
		let e = {
			args: msg.content.indexOf(' ') > -1 ? msg.content.substring(msg.content.indexOf(' ') + 1).split(" ") : [],
			lang: lang,
			util: util,
			permissions, permissions,
			config: config,
			player: players[msg.channel.guild.id]
		}
		//TODO: check permissions
		if(cmd.subcommands && cmd.subcommands[msg.content.substring(msg.content.indexOf(" ") + 1, msg.content.substring(msg.content.indexOf(" ") + 1).indexOf(" "))]){
			e.args = e.args.splice(1);
			cmd = cmd.subcommands[msg.content.substring(msg.content.indexOf(" ") + 1, msg.content.substring(msg.content.indexOf(" ") + 1).indexOf(" "))];
		}

		cmd.action(client, msg, e);
	}

});

client.connect();

process.on('SIGINT', () => {
	client.disconnect({reconnect: false});
	setTimeout(function(){
		process.exit();
	}, 1500);

});
