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

const fs = require('fs');

function Lang(){
	this.localization = null;
	this.localizationStrings = {};
}

/**
 * Set the localization of the bot.
 * @param {string} localization - The localization code, for example en-GB
 */
Lang.prototype.setLocalization = function(localization){
	try{

	}catch(langError){
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
	}
	let isLang = fs.statSync("./lang/" + localization + ".lang").isFile();
	if(!isLang)
		throw new Error(localization + " does not have a language file.");
	this.localization = localization;
	let strings = fs.readFileSync("./lang/" + localization + ".lang", 'utf8').split("\n");
	for(let i = 0; i < strings.length; i++)
		this.localizationStrings[strings[i].substring(0,strings[i].indexOf("="))] = strings[i].substring(strings[i].indexOf("=") + 1).replace(/\\n/g, "\n");
}

/**
 * Get a localized version of a string.
 * @param {string} stringName - The stringname
 * @returns {string} - The localized string.
 */
Lang.prototype.getLocalizedString = function(stringName){
	return this.localizationStrings[stringName] || stringName;
}

module.exports = Lang;