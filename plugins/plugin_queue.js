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
		name: "queue",
		description: "commands.queue.description",
		usage: "commands.queue.usage",
		aliases: ["list"]
	},
	action: function(client, msg, e){
		var page = 1;
		if(e.args[0] && e.args[0] == parseInt(e.args[0]))
			page = parseInt(e.args[0]);
		var playlist = e.player.getPlaylist();
		var _slicedList = playlist.splice((page-1) * 5, 5);
		let fields = [];
		for(let i = 0; i < _slicedList.length; i++){
			fields.push({
				name: (i+1 + (page-1)*5) + ".", 
				value: e.lang.getLocalizedString("commands.queue.item").format({
					song: _slicedList[i].title,
					user: "<@" + _slicedList[i].addedBy + ">"
				})
			});
		}


		let currentlyPlaying = e.player.currentSong ? e.lang.getLocalizedString("commands.queue.current").format({song: e.player.currentSong.title}) : e.lang.getLocalizedString("commands.queue.empty").format({prefix: e.config.Bot.Prefix});
		
		msg.channel.createMessage({
			content: "",
			embed: {
				title: e.lang.getLocalizedString("commands.queue.title").format({
					page: page,
					pages: Math.ceil((playlist.length+_slicedList.length)/5)
				}),
				description: currentlyPlaying,
				fields: fields
			}
		});
	}
}