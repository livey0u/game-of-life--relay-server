'use strict';

const http = require('http');
const WebSocket = require('ws');
const SocketIOClient = require('socket.io-client');
const config = require('config');
const logger = require('logger');
const constants = require('lib/constants');

const server = http.createServer();
const wsServerConfig = {port: process.env.PORT || config.server.port, host: config.server.host};
const relayServer = new WebSocket.Server({server: server});
const gameOfLifeClientURL = `ws://${config.world.server.host}:${config.world.server.port}`;
const gameOfLifeClient = new SocketIOClient(gameOfLifeClientURL);

relayServer.on('connection', function connection(ws, req) {

	let address = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'] : req.connection.remoteAddress;

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

  ws.on('close', function f() {
    logger.info('Web Client disonnected');
  });

  ws.on('error', function f(error) {
    logger.info('Web Client error', error);
  });

  logger.info('Web Client Connected', {address: address, headers: req.headers, remoteAddress: req.connection.remoteAddress});

});

function sendError(client, data) {
	send(client, data);
}

function send(client, data) {
  if(client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(data));
  }
}

gameOfLifeClient.on('message', function fn(data) {
	relayServer.clients.forEach(function each(client) {
    send(client, data);
  });
});

gameOfLifeClient.on('error', function fn(error) {
	logger.error('World server client connection error', error);
});

server.listen(wsServerConfig.port, wsServerConfig.host, function f(error) {
  if(error) {
    return logger.error('Unable to listen to server', error);
  } 
  logger.info('GameOfLife Relay Server running on ' + wsServerConfig.port);
});