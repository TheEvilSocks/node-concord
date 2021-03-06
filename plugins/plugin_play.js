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
		name: "play",
		description: "commands.play.description",
		usage: "commands.play.usage"
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

		if(!e.args[0])
			return;

		if(!e.args[0].match(/^https?:\/\//))
			e.args[0] = 'ytsearch:' + e.args.join(" ");

		
		var size = 0, pos = 0, lastEdit = new Date().getTime();
		msg.channel.createMessage(e.lang.getLocalizedString("commands.play.lookingup")).then(_msg => {
			e.player.ytdl.getInfo(e.args[0], (err, info) => {
				if(err){
					_msg.edit(e.lang.getLocalizedString("commands.play.failinfo"));
					return;
				}
				if(info){
					e.player.addSong({
						url: info.webpage_url,
						title: info.title,
						addedBy: msg.author.id,
						textChannel: msg.channel.id,
						duration:  Math.floor(e.util.formatTime(info.duration) / 10),
						path: "./cache/" + info._filename
					});
					_msg.edit(e.lang.getLocalizedString("commands.play.add").format({
						song: info.title,
						timeleft: "NYI"//e.util.timeFormat(e.player.estimatedTime).toString()
					}));
				}
			});
		})
	}
}