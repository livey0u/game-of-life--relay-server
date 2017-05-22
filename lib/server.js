'use strict';

const WebSocket = require('ws');
const config = require('config');
const logger = require('logger');

const World = require('lib/world');
const constants = require('lib/constants');
const util = require('lib/util');

const world = new World(config.world);
const gameOfLifeServer = new WebSocket.Server(config.world.server);

gameOfLifeServer.on('connection', function connection(ws, req) {

  ws.on('message', function incoming(message) {
    
    let payload = JSON.parse(message);

    if(payload.type === constants.NEW_CLIENT) {
    	return send(ws, {layout: world.layout, color: util.ipToColor(payload.address)});
    }

  });

});

world.on(constants.EVOLUTION_EVENT, function fn(worldLayout) {

	gameOfLifeServer.clients.forEach(function each(client) {
    if(client.readyState === WebSocket.OPEN) {
      client.send(worldLayout);
    }
  });

});

world.begin();