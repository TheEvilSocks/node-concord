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

const ytdl = require("youtube-dl"),
	fs = require("fs");


function Player(client, config, lang){
	this.discordClient = client;
	this.config = config;
	this.langManager = lang;

	this.ytdl = ytdl;

	this.currentSong = null;
	this.playlist = [];

	this.voiceConnection = null;
	this.channelID = null;
}

Player.prototype.lookupSong = function(songname) {
	let _this = this;
	return new Promise(function (fulfill, reject){
		_this.ytdl.getInfo([songname, songname], function(err, res){
			if(err)
				reject(err);
			fulfill(res);
		});
	});
};

Player.prototype.addSong = function(songObj) {
	this.playlist.push(songObj);
	this._update();
};


Player.prototype.setVoiceConnection = function(voiceconnection) {
	this.voiceConnection = voiceconnection;
	this.channelID = voiceconnection.channelID;

	this.voiceConnection.on('end', () => {
		this.currentSong = null;
		this._update();
	});
};

Player.prototype.setVolume = function(volume){
	if(this.voiceConnection === null)
		return false;
	if(volume > 2)
		volume = 2;
	if(volume < 0)
		volume = 0;

	this.voiceConnection.setVolume(volume);
	return this.voiceConnection.volume;
}


Player.prototype.getVolume = function(){
	return this.voiceConnection.volume;
}


Player.prototype.addVolume = function(volume){
	if(this.voiceConnection === null)
		return false;

	if(this.voiceConnection.volume + volume > 2)
		volume = 2;
	if(volume + this.voiceConnection.volume < 0)
		volume = 0;

	this.voiceConnection.setVolume(volume + this.voiceConnection.volume);
	return this.voiceConnection.volume;
}


Player.prototype.pause = function() {
	if(this.voiceConnection !== null && this.voiceConnection.playing && !this.voiceConnection.paused){
		this.voiceConnection.pause();
	}
};

Player.prototype.resume = function() {
	if(this.voiceConnection !== null && this.voiceConnection.playing && !this.voiceConnection.paused){
		this.voiceConnection.pause();
	}
};



Player.prototype._update = function(){
	if(this.currentSong === null && this.playlist.length > 0 && !this.voiceConnection.playing){
		if(this.playlist[0].isReady){
			this.currentSong = this.playlist.splice(0, 1)[0];
			this.voiceConnection.play(this.currentSong.path, {
				inlineVolume: true
			});
		}
	}

	for(let i = 0; i < this.config.Bot.FutureDownload; i++){
		if(this.playlist[i] && !this.playlist[i].isReady && !this.playlist[i].isChecking){
			this.playlist[i].isChecking = true;
			fs.stat(this.playlist[i].path, (err, stats) => {
				if(err){
					if(!this.playlist[i].isDownloading){
						this._downloadSong(this.playlist[i]);
					}
				}

				if(stats){
					if(!this.playlist[i].isDownloading){
						this.playlist[i].isReady = true;
						this.playlist[i].isChecking = false;
						this._update();
					}
				}
			});

		}
	}
}


Player.prototype.getPlaylist = function(){
	return this.playlist.slice();
}



module.exports = Player;


Player.prototype._downloadSong = function(song){
	song.isDownloading = true;
	let video = this.ytdl(song.url, ["--ignore-errors"]);
	video.pipe(fs.createWriteStream(song.path));
	let _this = this;
	video.on('end', function(){
		song.isReady = true;
		song.isDownloading = false;
		song.isChecking = false;
		_this._update();
	});

	if(this.config.Bot.AnnounceDownload === true){
		var downloaded = 0, size = 0;

		video.on('info', info => {
			size = info.size
		});

		video.on('data', data => {
			if(!song.lastEdit)
				song.lastEdit = 0;
			if(new Date().getTime() >= song.lastEdit + 1000 && !song.isPosting && size){
				song.lastEdit = new Date().getTime();
				song.isPosting = true;

				downloaded += data.length;
				let percent = (downloaded / size);
				let progressbar = "                    ";

				for(let i = 0; i < Math.ceil(percent * 20); i++)
					progressbar = "=" + progressbar;
				progressbar = progressbar.substring(0, 20);

				if(!song.progressMessage){
					let _this = this;
					this.discordClient.createMessage(song.textChannel, this.langManager.getLocalizedString("commands.play.dlprogress").format({
						song: song.title,
						progressbar: progressbar,
						percent: Math.ceil(percent * 100).toString()
					})).then(_msg => {
						song.progressMessage = _msg.id;
						song.isPosting = false;
					});
				}else{
					this.discordClient.editMessage(song.textChannel, song.progressMessage, this.langManager.getLocalizedString("commands.play.dlprogress").format({
						song: song.title,
						progressbar: progressbar,
						percent: Math.ceil(percent * 100).toString()
					})).then(_msg => {
						song.isPosting = false;
					});
				}

			}
		});

		video.on('end', () => {
			if(song.progressMessage){
				this.discordClient.editMessage(song.textChannel, song.progressMessage, this.langManager.getLocalizedString("commands.play.dlprogress").format({
					song: song.title,
					progressbar: "====================",
					percent: "100"
				}));
			}
		});
	}
}