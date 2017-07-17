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
		name: "volume",
		description: "commands.volume.description",
		usage: "commands.volume.usage"
	},
	action: function(client, msg, e){
		if(!msg.member.voiceState || !msg.member.voiceState.channelID){
			msg.channel.createMessage(e.lang.getLocalizedString("error.membernotinvoice"));
			return;
		}

		if(!e.player.voiceConnection || !e.player.channelID){
			msg.channel.createMessage(e.lang.getLocalizedString("error.botnotinvoice"));
			return;
		}

		if(!e.args[0]){
			msg.channel.createMessage(e.lang.getLocalizedString("commands.volume.get").format({volume: e.player.getVolume().toString()}));
			return;
		}

		if(e.args[0].startsWith("+") || e.args[0].startsWith("-")){
			msg.channel.createMessage(e.lang.getLocalizedString("commands.volume.set").format({volume: e.player.addVolume(parseInt(e.args[0])).toString()}));
			return;
		}else{
			msg.channel.createMessage(e.lang.getLocalizedString("commands.volume.set").format({volume: e.player.setVolume(parseInt(e.args[0])).toString()}));
			return;
		}


	}
}