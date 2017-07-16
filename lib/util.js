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

String.prototype.format = function(formatObject) {
	if(typeof formatObject === "object" && !(formatObject instanceof Array)){
		let str = this;
		for(let i = 0; i < Object.keys(formatObject).length; i++){
			str = str.replace(
				new RegExp("(([^\\\\])?{" + Object.keys(formatObject)[i] + "})"), function(match, p1, p2){
					return (p2 || "") + formatObject[Object.keys(formatObject)[i]]
				}
			);
		}
		return str;
	}

	if(typeof formatObject === "object" && formatObject instanceof Array){
		let str = this;
		for(let i = 0; i < formatObject.length; i++)
			str = str.replace("%s", formatObject[i]);
		return str;
	}



	if(typeof arguments === "object"){
		let str = this;
		for(let i = 0; i < Object.keys(arguments).length; i++)
			str = str.replace("%s",	arguments[i.toString()]);
		return str;
	}

	throw new Error("Expected object, string or array, got " + typeof formatObject);
};


const timeValues = [60, 60, 24, 7];


function Util(){}


Util.prototype.timeFormat = function(timeInSeconds){
	let fase = 0;
	let str = "";
	let _str = "";
	while(timeInSeconds >= timeValues[fase]){
		_str = (timeInSeconds % timeValues[fase]).toString();
		if(_str.length == 0)
			_str = "00";
		if(_str.length == 1)
			str = "0" + _str;
		str = ":" + _str;
		timeInSeconds = timeInSeconds % timeValues[fase];
		fase++
	}

	if(str.length == 0)
		str = ":00:00";
	if(str.length == 1)
		str = ":00:0" + _str;
	return str.substring(1);
};

Util.prototype.formatTime = function(timeInFormat){
	let _int = "";
	for(let i = 0; i < timeInFormat.split(":").length; i++)
		_int += parseInt(timeInFormat.split(":")[i]) * timeValues[timeInFormat.split(":").length - i];
	
	return _int;
}


module.exports = Util;