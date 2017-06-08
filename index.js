'use strict';

const http = require('http');
const WebSocket = require('ws');
const SocketIOClient = require('socket.io-client');
const config = require('config');
const logger = require('logger');
const constants = require('./constants');

const server = http.createServer();
const wsServerConfig = {port: process.env.PORT || config.server.port, host: config.server.host};
const relayServer = new WebSocket.Server({server: server});
const gameOfLifeWorldURL = config.world.url;
const gameOfLifeWorldClient = new SocketIOClient(gameOfLifeWorldURL);

relayServer.on('error', function onError(error) {
  logger.info('Relay server error', error);
});

relayServer.on('connection', function onConnection(ws, req) {

	let address = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'] : req.connection.remoteAddress;
  
	gameOfLifeWorldClient.emit(constants.NEW_CLIENT, {address: address}, function onResponse(error, data) {
		send(ws, data);
	});

  ws.on('message', function onIncoming(message) {
    
    let payload;

    try {
    	payload = JSON.parse(message);
    }
    catch(ex) {
    	return logger.error('message error', {message: message});
    }

    return gameOfLifeWorldClient.emit(payload.event, payload.data, function onResponse(error, data) {
    	if(error) {
    		return sendError(ws, error);
    	}
    	send(ws, data);
    });

  });

  ws.on('close', function onClose() {
    logger.info('Web Client disonnected');
  });

  ws.on('error', function onError(error) {
    logger.info('Web Client error', error);
  });

  logger.info('Web Client Connected. Relaying data to world server.', {event: constants.NEW_CLIENT, data: {address: address}});

});

function sendError(client, data) {
	send(client, data);
}

function send(client, data) {
  if(client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(data));
  }
}

gameOfLifeWorldClient.on('message', function onMessage(data) {
	relayServer.clients.forEach(function each(client) {
    send(client, data);
  });
});

gameOfLifeWorldClient.on('error', function onError(error) {
	logger.error('World server client connection error', error);
});

logger.info('Connecting to game of life world server ', gameOfLifeWorldURL);
gameOfLifeWorldClient.on('connect', function onConnect(data) {
  logger.info('Connected to game of life world server ', gameOfLifeWorldURL);
  server.listen(wsServerConfig.port, wsServerConfig.host, function onListen(error) {
    if(error) {
      return logger.error('Unable to listen to server', error);
    } 
    logger.info(`GameOfLife Relay Server running on ws://${wsServerConfig.host}:${wsServerConfig.port}`);
  });
});