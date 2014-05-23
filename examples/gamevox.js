
"use strict";

var mumble = require('../');
var fs = require('fs');

var options = {
    key: fs.readFileSync( '../certs/node.key' ),
    cert: fs.readFileSync( '../certs/node.crt' )
}

console.log( 'Connecting' );
mumble.connect( '216.127.64.49:4752' , options, function ( error, connection ) {
    if( error ) { throw new Error( error ); }

    console.log( 'Connected' );
    connection.authenticate( 'ExampleUser' );
    connection.on( 'initialized', onInit );
    connection.on( 'voice', onVoice );
});

var onInit = function() {
    console.log( 'Connection initialized' );
    // Connection is authenticated and usable.
};

var onVoice = function( voice ) {
    console.log( 'Mixed voice' );
    var pcmData = voice.data;
}
