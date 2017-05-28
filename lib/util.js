'use strict';

const randomcolor = require('randomcolor');
const averageColor = require('average-color');

exports.ipToColor = function ipToColor(ipAddress) {
	return randomcolor({
	   luminosity: 'bright',
	   format: 'hsl' // e.g. 'rgb(225,200,20)' 
	});
};


exports.colorAverage = function colorAverage(list) {
	
	let colors = list.map(function fn(cell) {
		return exports.hslStringToArray(cell.color);
	});

	return exports.hslArrayToString(averageColor(colors));

};

// hsl(360, 100%, 100%)
exports.hslStringToArray = function hslStringToArray(str) {
	return str.split(',').map(function toNumber(s) {
		return +s.replace(/hsl\(/, '').replace(/%/, '').replace(/\)/, '');
	});
};

exports.hslArrayToString = function hslArrayToString(hslArray) {
	return `hsl(${hslArray[0]}, ${hslArray[1]}%, ${hslArray[2]}%)`;
};