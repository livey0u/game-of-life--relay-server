'use strict';

const should = require('should');
const World = require('lib/world');
const constants = require('lib/constants');

describe('World unit tests', function fn() {

	describe('#constructor', function fn() {
		
		it('Should create world object for given configuration', function fn() {
			
			let config = {size: 3, interval: 100};
			let world = new World(config);

			should.exist(world);
			should.exist(world.size);
			should.equal(world.size, config.size);
			should.exist(world.refreshInterval);
			should.equal(world.refreshInterval, config.interval);

		});

	});

	describe('#setup', function fn() {

		let config = {size: 3, interval: 100};
		let world;

		before(function fn() {
			world = new World(config);
		});
		
		it('Should setup layout based on configured size', function fn() {

			world.setup();

			should.exist(world.layout);
			should.equal(world.layout.length, config.size);
			should.exist(world.layout[0].length);
			should.equal(world.layout[0].length, config.size);

		});

	});

	describe('#getSurroundingCells', function fn() {

		let config = {size: 3, interval: 100};
		let world;

		before(function fn() {
			world = new World(config);
		});
		
		it('Should return 8 surrounding cells for a middle cell', function fn() {

			let surroundingCells = world.getSurroundingCells({x: 1, y: 1});

			should.exist(surroundingCells);
			should.exist(surroundingCells.length);
			should.equal(surroundingCells.length, Math.pow(2, config.size));

			should.equal(surroundingCells[0].x, 1);
			should.equal(surroundingCells[0].y, 0);

			should.equal(surroundingCells[1].x, 2);
			should.equal(surroundingCells[1].y, 0);

			should.equal(surroundingCells[2].x, 2);
			should.equal(surroundingCells[2].y, 1);

			should.equal(surroundingCells[3].x, 2);
			should.equal(surroundingCells[3].y, 2);

			should.equal(surroundingCells[4].x, 1);
			should.equal(surroundingCells[4].y, 2);

			should.equal(surroundingCells[5].x, 0);
			should.equal(surroundingCells[5].y, 2);

			should.equal(surroundingCells[6].x, 0);
			should.equal(surroundingCells[6].y, 1);

			should.equal(surroundingCells[7].x, 0);
			should.equal(surroundingCells[7].y, 0);

		});

		it('Should return 6 surrounding cells for a cell with 6 adjacent cells', function fn() {

			let surroundingCells = world.getSurroundingCells({x: 0, y: 1});

			should.exist(surroundingCells);
			should.exist(surroundingCells.length);
			should.equal(surroundingCells.length, Math.pow(2, config.size));

			should.exist(surroundingCells[0]);
			should.exist(surroundingCells[1]);
			should.exist(surroundingCells[2]);
			should.exist(surroundingCells[3]);
			should.exist(surroundingCells[4]);
			should.not.exist(surroundingCells[5]);
			should.not.exist(surroundingCells[6]);
			should.not.exist(surroundingCells[7]);

		});

	});

	describe('#setCell', function fn() {

		let config = {size: 3, interval: 100};
		let world;

		before(function fn() {
			world = new World(config);
		});
		
		it('Should throw INVALID_CELL error for invalid parameter', function fn() {

			world.setCell.should.throw(Error, {message: 'INVALID_CELL'});

		});

		it('Should throw INVALID_X_VALUE error for invalid x value in cell', function fn() {

			world.setCell.bind(world, {}).should.throw(Error, {message: 'INVALID_X_VALUE'});

		});

		it('Should throw INVALID_Y_VALUE error for invalid y value in cell', function fn() {

			world.setCell.bind(world, {x: 0}).should.throw(Error, {message: 'INVALID_Y_VALUE'});

		});

		it('Should throw INVALID_STATE_VALUE error for invalid state value in cell', function fn() {

			world.setCell.bind(world, {x: 0, y: 0}).should.throw(Error, {message: 'INVALID_STATE_VALUE'});

		});

		it('Should throw INVALID_COLOR_VALUE error for invalid color in cell', function fn() {

			world.setCell.bind(world, {x: 0, y: 0, state: 1, color: [1234, 1232, null]}).should.throw(Error, {message: 'INVALID_COLOR_VALUE'});

		});

		it('Should set cell on layout if a valid cell passed in', function fn() {

			let cell = {x: 0, y: 0, state: 1, color: [123, 45, 67]};

			world.setCell(cell);

			should.exist(world.layout);
			should.exist(world.layout[0]);
			should.exist(world.layout[0][0]);
			should.exist(world.layout[0][0].state);
			should.equal(world.layout[0][0].state, cell.state);
			should.exist(world.layout[0][0].color);
			should.equal(world.layout[0][0].color, cell.color);
			

		});

	});

	describe('#getLiveNeighbours', function fn() {

		let config = {size: 3, interval: 100};
		let world;

		before(function fn() {
			world = new World(config);
		});
		
		it('Should return 0 live neighbours when there are no live neighbours around the given cell', function fn() {

			let liveNeighbours = world.getLiveNeighbours({x: 1, y: 1});

			should.exist(liveNeighbours);
			should.exist(liveNeighbours.length);
			should.equal(liveNeighbours.length, 0);

		});

		it('Should return 1 live neighbours where there is one live neighbours around the given cell', function fn() {

			world.setCell({x: 0, y: 0, state: 1, color: [123, 45, 67]});

			let liveNeighbours = world.getLiveNeighbours({x: 1, y: 1});

			should.exist(liveNeighbours);
			should.exist(liveNeighbours.length);
			should.equal(liveNeighbours.length, 1);

		});

		it('Should return 2 live neighbours where there are 2 live neighbours around the given cell', function fn() {

			world.setCell({x: 0, y: 0, state: 1, color: [123, 45, 67]});
			world.setCell({x: 2, y: 0, state: 1, color: [123, 45, 67]});

			let liveNeighbours = world.getLiveNeighbours({x: 1, y: 1});

			should.exist(liveNeighbours);
			should.exist(liveNeighbours.length);
			should.equal(liveNeighbours.length, 2);

		});

	});

	describe('#evolveCell', function fn() {

		let config = {size: 3, interval: 100};
		let world;

		before(function fn() {
			world = new World(config);
		});
		
		it('Should evolve to dead cell, if a cell has fewer than two live neighbours.', function fn() {

			let aliveCell = {x: 1, y: 1, state: 1, color: [123, 45, 67]};
			world.setCell(aliveCell);
			world.setCell({x: 0, y: 0, state: 1, color: [123, 45, 67]});
			let evolvedCell = world.evolveCell(aliveCell);

			should.exist(evolvedCell);
			should.exist(evolvedCell.state);
			should.equal(evolvedCell.state, 0);

		});

		it('Should evolve to dead cell, if a cell has more than three live neighbours.', function fn() {

			let aliveCell = {x: 1, y: 1, state: 1, color: [123, 45, 67]};
			world.setCell(aliveCell);
			world.setCell({x: 0, y: 0, state: 1, color: [123, 45, 67]});
			world.setCell({x: 1, y: 0, state: 1, color: [123, 45, 67]});
			world.setCell({x: 2, y: 0, state: 1, color: [123, 45, 67]});
			world.setCell({x: 0, y: 1, state: 1, color: [123, 45, 67]});
			let evolvedCell = world.evolveCell(aliveCell);

			should.exist(evolvedCell);
			should.exist(evolvedCell.state);
			should.equal(evolvedCell.state, 0);

		});

		it('Should evolve to next generation alive, if a cell has two live neighbours.', function fn() {

			let aliveCell = {x: 1, y: 1, state: 1, color: [123, 45, 67]};
			world.setCell(aliveCell);
			world.setCell({x: 0, y: 0, state: 1, color: [123, 45, 67]});
			world.setCell({x: 1, y: 0, state: 1, color: [123, 45, 67]});
			let evolvedCell = world.evolveCell(aliveCell);

			should.exist(evolvedCell);
			should.exist(evolvedCell.state);
			should.equal(evolvedCell.state, 0);

		});

		it('Should evolve to next generation alive, if a cell has three live neighbours.', function fn() {

			let aliveCell = {x: 1, y: 1, state: 1, color: [123, 45, 67]};
			world.setCell(aliveCell);
			world.setCell({x: 0, y: 0, state: 1, color: [123, 45, 67]});
			world.setCell({x: 1, y: 0, state: 1, color: [123, 45, 67]});
			world.setCell({x: 2, y: 0, state: 1, color: [123, 45, 67]});
			let evolvedCell = world.evolveCell(aliveCell);

			should.exist(evolvedCell);
			should.exist(evolvedCell.state);
			should.equal(evolvedCell.state, 0);

		});

		it('Should evolve to live cell, if a cell has three live neighbours.', function fn() {

			let deadCell = {x: 1, y: 1, state: 0, color: [123, 45, 67]};
			world.setCell(deadCell);
			world.setCell({x: 0, y: 0, state: 1, color: [123, 45, 67]});
			world.setCell({x: 1, y: 0, state: 1, color: [123, 45, 67]});
			world.setCell({x: 2, y: 0, state: 1, color: [123, 45, 67]});
			let evolvedCell = world.evolveCell(deadCell);

			should.exist(evolvedCell);
			should.exist(evolvedCell.state);
			should.equal(evolvedCell.state, 0);

		});

	});

	describe('#evolve', function fn() {

		let config = {size: 3, interval: 100};
		let world;

		before(function fn() {
			world = new World(config);
		});

		it('Should evolve world to next generation.', function fn() {

			let deadCell = {x: 1, y: 1, state: 0, color: [123, 45, 67]};
			world.setCell(deadCell);
			world.setCell({x: 0, y: 0, state: 1, color: [123, 45, 67]});
			world.setCell({x: 1, y: 0, state: 1, color: [123, 45, 67]});
			world.setCell({x: 2, y: 0, state: 1, color: [123, 45, 67]});
			world.evolve();

			// dead cell evolved into to living cell
			should.exist(world.layout);
			should.exist(world.layout[1]);
			should.exist(world.layout[1][1]);
			should.exist(world.layout[1][1].state);
			should.equal(world.layout[1][1].state, 1);

			//living cells dies based on other criterias
			should.exist(world.layout[0]);
			should.exist(world.layout[0][0]);
			should.exist(world.layout[0][0].state);
			should.equal(world.layout[0][0].state, 0);

			should.exist(world.layout[0]);
			should.exist(world.layout[0][1]);
			should.exist(world.layout[0][1].state);
			should.equal(world.layout[0][1].state, 1);

			should.exist(world.layout[0]);
			should.exist(world.layout[0][2]);
			should.exist(world.layout[0][2].state);
			should.equal(world.layout[0][2].state, 0);

		});
		
		it(`Should emit ${constants.EVOLUTION_EVENT} upon completion of evolution`, function fn(done) {

			world.on(constants.EVOLUTION_EVENT, function fn(layout) {
				should.exist(layout);
				should.equal(layout.length, config.size);
				should.exist(layout[0].length);
				should.equal(layout[0].length, config.size);
				done();
			});

			world.evolve();

		});

	});

});