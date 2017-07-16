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


function Player(){
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
	if(volume > 200)
		volume = 200;
	if(volume < 0)
		volume = 0;

	this.voiceConnection.setVolume(volume);
	return this.voiceConnection.volume;
}

Player.prototype.addVolume = function(volume){
	if(this.voiceConnection === null)
		return false;

	if(this.voiceConnection.volume + volume > 200)
		volume = 200;
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
			this.voiceConnection.play(this.currentSong.path);
		}
	}

	if(this.playlist[0] && !this.playlist[0].isReady && !this.playlist[0].isChecking){
		this.playlist[0].isChecking = true;

		fs.stat(this.playlist[0].path, (err, stats) => {
			if(err){
				if(!this.playlist[0].isDownloading){
					this.playlist[0].isDownloading = true;
					let video = this.ytdl(this.playlist[0].url, ["--ignore-errors"]);
					video.pipe(fs.createWriteStream(this.playlist[0].path));
					let _this = this;
					video.on('end', function(){
						_this.playlist[0].isReady = true;
						_this.playlist[0].isDownloading = false;
						this.isChecking = false;
						_this._update();
					});
				}
			}

			if(stats){
				if(!this.playlist[0].isDownloading){
					this.playlist[0].isReady = true;
					this.playlist[0].isChecking = false;
					this._update();
				}
			}
		});

	}
}


Player.prototype.getPlaylist = function(){
	return this.playlist.slice();
}



module.exports = Player;