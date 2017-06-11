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

relayServer.on('error', logError.bind(null, 'Relay server error'));
relayServer.on('connection', onConnection.bind(null, gameOfLifeWorldClient));

gameOfLifeWorldClient.on('error', logError.bind(null, 'World server client connection error'));
gameOfLifeWorldClient.on('message', broadcast.bind(null, relayServer));

gameOfLifeWorldClient.once('connect', handleWorldServerConnection.bind(null, logger));

function handleWorldServerConnection(logger) {
  server.listen(wsServerConfig.port, wsServerConfig.host, function onListen(error) {
    if(error) {
      return logger.error('Unable to listen to server', error);
    } 
    logger.info(`GameOfLife Relay Server running on ws://${wsServerConfig.host}:${wsServerConfig.port}`);
  });
}

function broadcast(relayServer, data) {
  relayServer.clients.forEach(function each(client) {
    send(client, data);
  });
}

function logError(msg, error) {
  logger.info(msg, error);
}

function onConnection(gameOfLifeWorldClient, ws, req) {

  let address = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'] : req.connection.remoteAddress;
  
  gameOfLifeWorldClient.emit(constants.NEW_CLIENT_EVENT, {address: address}, function onResponse(error, data) {
    send(ws, data);
  });

  ws.on('message', handleClientMessage.bind(null, gameOfLifeWorldClient, ws));

  ws.on('close', function onClose() {
    logger.info('Web Client disonnected');
  });

  ws.on('error', function onError(error) {
    logger.info('Web Client error', error);
  });

  logger.info('Web Client Connected. Relaying data to world server.', {event: constants.NEW_CLIENT_EVENT, data: {address: address}});

}

function handleClientMessage(gameOfLifeWorldClient, ws, message) {
    
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

}

function sendError(client, data) {
	send(client, data);
}

function send(client, data) {
  if(client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(data));
  }
}
