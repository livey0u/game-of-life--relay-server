'use strict';

const config = require('config');
const http = require('http');
const SocketIO = require('socket.io');

const logger = require('logger');
const World = require('lib/world');
const constants = require('lib/constants');
const util = require('lib/util');
logger.info('server', config);
const server = http.createServer();
const world = new World(config.world);
const io = SocketIO(server);


io.on('connection', function onConnection(client) {

  client.on(constants.NEW_CLIENT, function onClient(data, callback) {
  	callback(null, {event: constants.NEW_CLIENT + '_RESPONSE', success: true, data: {layout: world.layout, color: util.ipToColor(data.address)}});
  });

  client.on(constants.UPDATE_CELL, function onCellUpdate(data, callback) {
  	
  	try {
  		world.setCell(data);
  	}
  	catch(ex) {
  		logger.error('set cell exception', ex);
  		return callback({error: ex.toString(), event: constants.UPDATE_CELL + '_RESPONSE', success: false});
  	}
  	
  	callback(null, {event: constants.UPDATE_CELL + '_RESPONSE', success: true, data: data});

  });

  client.on('disconnect', function onDisconnect() {

  });

});

world.on(constants.EVOLUTION_EVENT, broadcast.bind(null, constants.EVOLUTION_EVENT));

world.on(constants.CELL_UPDATED_EVENT, broadcast.bind(null, constants.CELL_UPDATED_EVENT));

function broadcast(event, data) {
	io.sockets.send({event: event, data: data, success: true});
}

world.begin();
server.listen(config.world.server.port, function fn(error) {
	if(error) {
		return logger.error(error);
	}
	logger.info(`Game Of Life Server running on port ${config.world.server.port}`);
});