'use strict';

const WebSocket = require('ws');
const SocketIOClient = require('socket.io-client');
const config = require('config');
const logger = require('logger');
logger.info('index', config);
const constants = require('lib/constants');

const relayServer = new WebSocket.Server(config.server);
const gameOfLifeClientURL = `ws://${config.world.server.host}:${config.world.server.port}`;
const gameOfLifeClient = new SocketIOClient(gameOfLifeClientURL);

relayServer.on('connection', function connection(ws, req) {

	let address = req.connection.remoteAddress;

	gameOfLifeClient.emit(constants.NEW_CLIENT, {address: address}, function fn(error, data) {
		send(ws, data);
	});

  ws.on('message', function incoming(message) {
    
    let payload;

    try {
    	payload = JSON.parse(message);
    }
    catch(ex) {
    	return logger.error('message error', {message: message});
    }
    logger.info('Incoming Message', payload);
    return gameOfLifeClient.emit(payload.event, payload.data, function fn(error, data) {
    	if(error) {
    		logger.error(message, error);
    		return sendError(ws, error);
    	}
    	send(ws, data);
    });

  });

});

function sendError(client, data) {
	send(client, data);
}

function send(client, data) {
	client.send(JSON.stringify(data));
}

gameOfLifeClient.on('message', function fn(data) {
	relayServer.clients.forEach(function each(client) {
    if(client.readyState === WebSocket.OPEN) {
      send(client, data);
    }
  });

});

gameOfLifeClient.on('error', function fn(error) {
	console.log(error);
});

logger.info('GameOfLife Relay Server running on ' + config.server.port);