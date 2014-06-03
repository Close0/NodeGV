
"use strict";

var mumble = require('../');
var fs = require('fs');

var options = {
    key: fs.readFileSync( '../certs/node.key' ),
    cert: fs.readFileSync( '../certs/node.crt' )
}

mumble.connect( '184.173.118.34:3127' , options, function ( error, connection ) {
    if( error ) { throw new Error( error ); }

    console.log( 'Connected' );
    connection.authenticate( 'stephen','gamevox' );
    connection.on( 'initialized', onInit );
    connection.on( 'voice', onVoice );
});

var onInit = function() {
    // Connection is authenticated and usable.
};

var onVoice = function( voice ) {
    console.log( 'Mixed voice' );
    var pcmData = voice.data;
}
