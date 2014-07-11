var fs = require('fs');
var tls = require('tls');
var MumbleConnection = require('../lib/MumbleConnection');

var options = {
	key: fs.readFileSync( '../certs/node.key' ),
	cert: fs.readFileSync( '../certs/node.crt' ),
	rejectUnauthorized: false
};


var userIndex = 1;

var id = setInterval(function() {
	if(userIndex > 1) { clearInterval(id); return; }
	var socket = tls.connect( 32051, '50.22.63.228', options, function ( err ) {
		// TODO Remove the certificate buffers from the options.
		// MumbleConnection doesn't need to hold onto them.
		var connection = new MumbleConnection( socket, options );
		console.log( 'Connected' );
		connection.authenticate( 'Username'+userIndex++,'gamevox' );
		connection.on( 'authenticated', function(message) {
			if(message.success == "1") {
				connection.activate(1);
			} else  {
				console.log("We were not able to authenticate.");
			}
		});
		connection.on( 'activated', function() {
			connection.joinServer('rJRB3Ce73kvr');
		});
		connection.on( 'connectedToVS', function(message) {
			console.log("We're connected to to the voice server: " + message.serverName);
			connection.serverSync();
		});
		connection.on( 'serverSync', function(message) {
			connection.generateSound();
			setInterval(function() {
				connection.disperse();
				setTimeout(function() {
					connection.assemble();
				},2000);
			},5000);
		});
	});
},1000);




/*
var mumble = require('../');


var options = {
	key: fs.readFileSync( '../certs/node.key' ),
	cert: fs.readFileSync( '../certs/node.crt' )
};

mumble.connect( '50.22.63.228:32051' , options, function ( error, connection ) {
	if( error ) { throw new Error( error ); }

	console.log( 'Connected' );
	connection.authenticate( 'dustin','cats' );
	connection.on( 'authenticated', function(message) {
		if(message.success == "1") {
			connection.activate(1);
		} else  {
			console.log("We were not able to authenticate.");
		}
	});
	connection.on( 'activated', function() {
		connection.joinServer('rJRB3Ce73kvr');
	});
	connection.on( 'connectedToVS', function(message) {
		console.log("We're connected to to the voice server: " + message.serverName);
		connection.serverSync();
	});
	connection.on( 'serverSync', function(message) {
		connection.generateSound();
		setInterval(function() {
			connection.disperse();
			setTimeout(function() {
				connection.assemble();
			},2000);
		},5000);
	});
	connection.on( 'voice', onVoice );
});

var authenticated = function(message) {
	//console.log("We're authenticated!");
	//mumble.joinServer('rJRB3Ce73kvr');
};

var onVoice = function( voice ) {
	console.log( 'Mixed voice' );
	var pcmData = voice.data;
};
*/