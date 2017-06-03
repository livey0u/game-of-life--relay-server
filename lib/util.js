'use strict';


const jsondiffpatch = require('jsondiffpatch');
const randomcolor = require('randomcolor');
const averageColor = require('average-color');

exports.ipToColor = function ipToColor(ipAddress) {
	return randomcolor({
	   luminosity: 'bright',
	   format: 'hsl',
	   seed: ipAddress
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

exports.jsonDiffToCells = function diffToCells(diff) {
	
	let cells = [];

	if(!diff) {
		return cells;
	}

	for(let k in diff) {

		let map = diff[k];

		for(let ik in map) {
			let obj = map[ik];
			if(typeof obj !== 'object') {
				continue;
			}
			cells.push({y: +k, x: +ik, state: obj.state[1], color: obj.color[1]});

		}

	}

	return cells;

};

exports.cellsDiff = function cellsDiff(layoutOne, layoutTwo) {
	
	let diff = jsondiffpatch.diff(layoutOne, layoutTwo);

	return exports.jsonDiffToCells(diff);

};