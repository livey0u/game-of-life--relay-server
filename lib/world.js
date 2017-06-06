'use strict';

const EventEmitter = require('events');

const isColor = require('is-color');

const constants = require('lib/constants');
const util = require('lib/util');

const WHITE_COLOR_HSL = 'hsl(360, 100%, 100%)';
const DEAD = 0;
const ALIVE = 1;


class World extends EventEmitter {

	constructor(config) {
		
		super();

		this.size = config.size;
		this.refreshInterval = config.interval;
		this.layout = null;
		this.evolvedAt = null;
		this.setup();

	}

	setup() {

		this.layout = [];

		for(let i = 0; i < this.size; i++) {
			this.layout[i] = [];
			for(let j = 0; j < this.size; j++) {
				this.layout[i][j] = {x: j, y: i, state: DEAD, color: WHITE_COLOR_HSL};
			}
		}

	}

	begin() {

		function loop() {
			this.evolve();
			setTimeout(loop.bind(this), this.refreshInterval);
		}

		loop.call(this);

	}

	evolve() {

		let nextGenerationLayout = [];

		for(let i = 0; i < this.size; i++) {
			nextGenerationLayout[i] = [];
			for(let j = 0; j < this.size; j++) {
				nextGenerationLayout[i][j] = this.evolveCell(this.layout[i][j]);
			}
		}

		let cells = util.cellsDiff(this.layout, nextGenerationLayout);

		this.layout = nextGenerationLayout;
		this.evolvedAt = Date.now();

		this.emit(constants.EVOLUTION_EVENT, {cells: cells, evolvedAt: this.evolvedAt});

	}

	evolveCell(cell) {

		let liveNeighbours = this.getLiveNeighbours(cell);
		let liveNeighboursCount = liveNeighbours.length;
		let nextGenCell = {x: cell.x, y: cell.y, state: DEAD, color: WHITE_COLOR_HSL};

		if(cell.state === DEAD) {
			if(liveNeighboursCount === 3) {
				nextGenCell.state = ALIVE;
				nextGenCell.color = util.colorAverage(liveNeighbours);
			}
		}
		else {
			if(liveNeighboursCount === 2 || liveNeighboursCount === 3) {
				nextGenCell.state = ALIVE;
				nextGenCell.color = cell.color;
			}
		}

		return nextGenCell;

	}

	getLiveNeighbours(cell) {

		let surroundingCells = this.getSurroundingCells(cell);
		let liveCells = [];

		for(let i = 0; i < 8; i++) {
			let nearbyCell = surroundingCells[i];
			if(!nearbyCell) {
				continue;
			}
			if(nearbyCell.state === ALIVE) {
				liveCells.push(nearbyCell);
			}
		}

		return liveCells;

	}

	getSurroundingCells(cell) {

		let top, right, bottom, left;
		let topLeft, topRight, bottomRight, bottomLeft;
		
		if(cell.y > 0) {
			// top = {x: cell.x, y: cell.y - 1};
			top = this.layout[cell.y - 1][cell.x];
		}

		if(cell.x < (this.size - 1)) {
			// right = {x: cell.x + 1, y: cell.y};
			right = this.layout[cell.y][cell.x + 1];
		}

		if(cell.y < (this.size - 1)) {
			// bottom = {x: cell.x, y: cell.y + 1};
			bottom = this.layout[cell.y + 1][cell.x];
		}

		if(cell.x > 0) {
			// left = {x: cell.x - 1, y: cell.y};
			left = this.layout[cell.y][cell.x - 1];
		}

		if(top && left) {
			// topLeft = {x: top.x - 1, y: left.y - 1};
			topLeft = this.layout[left.y - 1][top.x - 1];
		}

		if(top && right) {
			// topRight = {x: top.x + 1, y: right.y - 1};
			topRight = this.layout[right.y - 1][top.x + 1];
		}

		if(bottom && right) {
			// bottomRight = {x: bottom.x + 1, y: right.y + 1};
			bottomRight = this.layout[right.y + 1][bottom.x + 1];
		}

		if(bottom && left) {
			// bottomLeft = {x: bottom.x - 1, y: left.y + 1};
			bottomLeft = this.layout[left.y + 1][bottom.x - 1];
		}

		return [top, topRight, right, bottomRight, bottom, bottomLeft, left, topLeft];

	}

	setCell(cell) {
		
		if(!cell || typeof cell !== 'object') {
			throw new Error('INVALID_CELL');
		}
		if(typeof cell.x !== 'number' || (cell.x < 0 || cell.x >= this.size)) {
			throw new Error('INVALID_X_VALUE');
		}
		if(typeof cell.y !== 'number' || (cell.y < 0 || cell.y >= this.size)) {
			throw new Error('INVALID_Y_VALUE');
		}
		if(typeof cell.state !== 'number' || (cell.state !== DEAD && cell.state !== ALIVE)) {
			throw new Error('INVALID_STATE_VALUE');
		}
		if(!cell.color || !isColor(cell.color)) {
			throw new Error('INVALID_COLOR_VALUE');
		}
		
		this.layout[cell.y][cell.x] = cell;
		
	}

	setCells(data) {

		if(!data || typeof data !== 'object') {
			throw new Error('INVALID_DATA');
		}

		if(!Array.isArray(data.cells) || !data.cells.length) {
			throw new Error('INVALID_CELLS_ARRAY');
		}

		let cells = data.cells;
		let cellsLen = cells.length;

		for(let i = 0; i < cellsLen; i++) {
			this.setCell(cells[i]);
		}

		this.emit(constants.CELLS_UPDATED_EVENT, { cells: cells, evolvedAt: this.evolvedAt});

	}

}

module.exports = World;