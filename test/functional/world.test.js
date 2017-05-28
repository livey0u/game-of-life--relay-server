'use strict';

const should = require('should');
const World = require('lib/world');
const constants = require('lib/constants');

describe('World functional test', function fn() {
	
	describe('#evolveCell', function fn() {

		let layout = [
		  [
		    {
		      "x": 0,
		      "y": 0,
		      "state": 0,
		      "color": "hsl(360, 100%, 100%)"
		    },
		    {
		      "x": 1,
		      "y": 0,
		      "state": 0,
		      "color": "hsl(360, 100%, 100%)"
		    },
		    {
		      "x": 2,
		      "y": 0,
		      "state": 0,
		      "color": "hsl(360, 100%, 100%)"
		    },
		    {
		      "x": 3,
		      "y": 0,
		      "state": 1,
		      "color": "hsl(126, 88.68%, 36.57%)"
		    },
		    {
		      "x": 4,
		      "y": 0,
		      "state": 1,
		      "color": [
		        0,
		        null,
		        null
		      ]
		    },
		    {
		      "x": 5,
		      "y": 0,
		      "state": 0,
		      "color": "hsl(360, 100%, 100%)"
		    }
		  ],
		  [
		    {
		      "x": 0,
		      "y": 1,
		      "state": 0,
		      "color": "hsl(360, 100%, 100%)"
		    },
		    {
		      "x": 1,
		      "y": 1,
		      "state": 0,
		      "color": "hsl(360, 100%, 100%)"
		    },
		    {
		      "x": 2,
		      "y": 1,
		      "state": 1,
		      "color": [
		        0,
		        null,
		        null
		      ]
		    },
		    {
		      "x": 3,
		      "y": 1,
		      "state": 0,
		      "color": "hsl(360, 100%, 100%)"
		    },
		    {
		      "x": 4,
		      "y": 1,
		      "state": 1,
		      "color": [
		        0,
		        null,
		        null
		      ]
		    },
		    {
		      "x": 5,
		      "y": 1,
		      "state": 0,
		      "color": "hsl(360, 100%, 100%)"
		    }
		  ],
		  [
		    {
		      "x": 0,
		      "y": 2,
		      "state": 0,
		      "color": "hsl(360, 100%, 100%)"
		    },
		    {
		      "x": 1,
		      "y": 2,
		      "state": 0,
		      "color": "hsl(360, 100%, 100%)"
		    },
		    {
		      "x": 2,
		      "y": 2,
		      "state": 0,
		      "color": "hsl(360, 100%, 100%)"
		    },
		    {
		      "x": 3,
		      "y": 2,
		      "state": 1,
		      "color": [
		        0,
		        null,
		        null
		      ]
		    },
		    {
		      "x": 4,
		      "y": 2,
		      "state": 0,
		      "color": "hsl(360, 100%, 100%)"
		    },
		    {
		      "x": 5,
		      "y": 2,
		      "state": 0,
		      "color": "hsl(360, 100%, 100%)"
		    }
		  ],
		  [
		    {
		      "x": 0,
		      "y": 3,
		      "state": 0,
		      "color": "hsl(360, 100%, 100%)"
		    },
		    {
		      "x": 1,
		      "y": 3,
		      "state": 0,
		      "color": "hsl(360, 100%, 100%)"
		    },
		    {
		      "x": 2,
		      "y": 3,
		      "state": 0,
		      "color": "hsl(360, 100%, 100%)"
		    },
		    {
		      "x": 3,
		      "y": 3,
		      "state": 0,
		      "color": "hsl(360, 100%, 100%)"
		    },
		    {
		      "x": 4,
		      "y": 3,
		      "state": 0,
		      "color": "hsl(360, 100%, 100%)"
		    },
		    {
		      "x": 5,
		      "y": 3,
		      "state": 0,
		      "color": "hsl(360, 100%, 100%)"
		    }
		  ],
		  [
		    {
		      "x": 0,
		      "y": 4,
		      "state": 0,
		      "color": "hsl(360, 100%, 100%)"
		    },
		    {
		      "x": 1,
		      "y": 4,
		      "state": 0,
		      "color": "hsl(360, 100%, 100%)"
		    },
		    {
		      "x": 2,
		      "y": 4,
		      "state": 0,
		      "color": "hsl(360, 100%, 100%)"
		    },
		    {
		      "x": 3,
		      "y": 4,
		      "state": 0,
		      "color": "hsl(360, 100%, 100%)"
		    },
		    {
		      "x": 4,
		      "y": 4,
		      "state": 0,
		      "color": "hsl(360, 100%, 100%)"
		    },
		    {
		      "x": 5,
		      "y": 4,
		      "state": 0,
		      "color": "hsl(360, 100%, 100%)"
		    }
		  ],
		  [
		    {
		      "x": 0,
		      "y": 5,
		      "state": 0,
		      "color": "hsl(360, 100%, 100%)"
		    },
		    {
		      "x": 1,
		      "y": 5,
		      "state": 0,
		      "color": "hsl(360, 100%, 100%)"
		    },
		    {
		      "x": 2,
		      "y": 5,
		      "state": 0,
		      "color": "hsl(360, 100%, 100%)"
		    },
		    {
		      "x": 3,
		      "y": 5,
		      "state": 0,
		      "color": "hsl(360, 100%, 100%)"
		    },
		    {
		      "x": 4,
		      "y": 5,
		      "state": 0,
		      "color": "hsl(360, 100%, 100%)"
		    },
		    {
		      "x": 5,
		      "y": 5,
		      "state": 0,
		      "color": "hsl(360, 100%, 100%)"
		    }
		  ]
		];
		let config = {size: 3, interval: 100};
		let world;
		let data = {};
		
		before(function fn() {
			world = new World(config);
			world.layout = layout;
		});

	});

});