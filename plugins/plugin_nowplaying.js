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
		name: "nowplaying",
		description: "commands.nowplaying.description",
		usage: "commands.nowplaying.usage",
		aliases: ["np"]
	},
	action: function(client, msg, e){
		if(!e.player.voiceConnection || !e.player.channelID){
			msg.channel.createMessage(e.lang.getLocalizedString("error.botnotinvoice"));
			return;
		}

		if(e.player.currentSong === null){
			msg.channel.createMessage(e.lang.getLocalizedString("commands.nowplaying.notplaying").format({prefix: e.config.Bot.Prefix}));
		}else{
			let speaker_emoji = "sound";
			if(e.player.getVolume() >= 0 && e.player.getVolume() <= (1/3)*2)
				speaker_emoji = "speaker";
			if(e.player.getVolume() >= (2/3)*2 && e.player.getVolume() <= 2)
				speaker_emoji = "loud_sound";

			msg.channel.createMessage(e.lang.getLocalizedString("commands.nowplaying.response").format({
				song: e.player.currentSong.title,
				play_emoji: (e.player.voiceConnection.playing ? "arrow_forward" : "pause_button"),
				speaker_emoji: speaker_emoji,
				progressbar: ":radio_button:────────────",
				time: "??:??/??:?? (NYI)"
			}));
		}
	}
}