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

module.exports = {
	meta: {
		name: "summon",
		description: "commands.summon.description",
		usage: "commands.summon.usage",
		aliases: ["joinvoice", "join"]
	},
	action: function(client, msg, e){
		if(msg.member.voiceState && msg.member.voiceState.channelID){
			if(e.player.channelID === msg.member.voiceState.channelID){
				msg.channel.createMessage(e.lang.getLocalizedString("commands.summon.alreadyjoined").format({channel: msg.channel.guild.channels.find(c=>c.id == msg.member.voiceState.channelID).name}));
				return;
			}
			client.joinVoiceChannel(msg.member.voiceState.channelID).then(voiceConnection => {
				msg.channel.createMessage(e.lang.getLocalizedString("commands.summon.joined").format({channel: msg.channel.guild.channels.find(c=>c.id == msg.member.voiceState.channelID).name}));
				e.player.setVoiceConnection(voiceConnection);

			}).catch(joinError => {
				msg.channel.createMessage(e.lang.getLocalizedString("commands.summon.joinfail"));
				console.log(joinError);
				return;
			});

		}else{
			msg.channel.createMessage(e.lang.getLocalizedString("commands.summon.novoice"));
			return;
		}
	}
}