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
		name: "ping",
		description: "commands.ping.description",
		usage: "commands.ping.usage",
		aliases: ["pong"]
	},
	action: function(client, msg, e){
		let pingBegin = new Date().getTime();
		msg.channel.createMessage(e.lang.getLocalizedString("commands.ping.response1")).then(_msg => {
			_msg.edit(e.lang.getLocalizedString("commands.ping.response2").format({delay: (new Date() - pingBegin)}));
		});
	}
}