'use strict';

const randomcolor = require('randomcolor');

exports.ipToColor = function ipToColor(ipAddress) {
	return randomcolor({
	   luminosity: 'bright',
	   format: 'hsl' // e.g. 'rgb(225,200,20)' 
	});
};