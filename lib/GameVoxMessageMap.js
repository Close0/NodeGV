
"use strict";

var Schema = require('protobuf').Schema;
var fs = require('fs');

var protoBuffMap = {
    0: 'UDPTunnel',
    1: 'Ping',
    2: 'ServerSync',
    3: 'ChannelRemove',
    4: 'ChannelState',
    5: 'UserRemove',
    6: 'UserState',
    7: 'BanList',
    8: 'TextMessage',
    9: 'PermissionDenied',
    10: 'ACL',
    11: 'CryptSetup',
    12: 'ContextActionAdd',
    13: 'ContextAction',
    14: 'UserList',
    15: 'VoiceTarget',
    16: 'PermissionQuery',
    17: 'CodecVersion',
    18: 'UserStats',
    19: 'RequestBlob',
    20: 'ServerSettings',
    21: 'ServerTheme',
    22: 'RequestConversation',
    23: 'Permissions'
};


var xmlMessageStructure = {
    'MTYPE_CONNECT_AUTHENTICATE': {
            username: 'string',
            password: 'string',
            protocolVersion: 'int',
            version: 'string'
            //systemID
            //clientID
            //sessionID (used to kick off duplicate connections)
    },
    'MTYPE_CONNECTION_ACTIVATE': {
        needAccountData: 'boolean'
    },

    //Server -> Client
    'MTYPE_CONN_friendUpdate': {
        SID: 'gvid',
        UID: 'gvid',
        isOnline: 'boolean',
        sequence: null,
    }
}
var xmlMap = {
    0x7101: 'MTYPE_CONNECT_AUTHENTICATE',
    0x7102: 'MTYPE_CONNECT_AUTHENTICATED',
    0x7103: 'MTYPE_CONNECTION_CLOSING',
    0x7104: 'MTYPE_CONNECTION_ACTIVATE',
    0x7105: 'MTYPE_CONNECTION_DEACTIVATED',
    0x7108: 'MTYPE_CONNECTION_DEACTIVATE',
    0x7109: 'MTYPE_CONNECTION_PING',
    0x7110: 'MTYPE_CONNECTION_NETWAIT_WAITING',
    0x7111: 'MTYPE_CONNECTION_NETWAIT_NORMAL',
    0x7112: 'MTYPE_TICKET_INDICATOR_SET',
    0x7113: 'MTYPE_TICKET_INDICATOR_CLEAR',
    0x7114: 'MTYPE_CONNECTION_KEEP_ALIVE',
    0x7400: 'MTYPE_CLIENT_BILLBOARD_NOTIFICATIONS',

    //Connection control messages
    0x7703: 'MTYPE_CONN_avatar',
    0x7705: 'MTYPE_CONN_favoriteServers',
    0x7709: 'MTYPE_CONN_friends',
    0x770a: 'MTYPE_CONN_friendUpdate',
    0x7719: 'MTYPE_CONN_disconnectedFromVS',
};

var gamevox = new Schema(fs.readFileSync( __dirname + '/gamevox.desc'));
var messages = {};

var getSchema = function (name) {
    var schema = gamevox['GamevoxProto.' + name];
    messages[name] = schema;
    return schema;
};

module.exports.isXMLMessage = function(id){
    return (xmlMap[id]) ? true : false;
}
module.exports.getXMLStructure = function(name){
    return xmlMessageStructure[name];
}


var parseXML = require('xml2js').parseString;
module.exports.xmlToStructure = function(id, xmlString, callback){
    //Some ghetto function to convert parsed xml into
    var compiledMessage = {};
    if(xmlString === '') return null;
    parseXML(xmlString, {async: true}, function(err, xml){
        if(err){ console.log(err); return callback(null); }
        if(!xml) return callback(null);

        //Try and parse it into the expected structure
        var structure = xmlMessageStructure[xmlMap[id]];
        if(!structure) return callback(null); //No schema for this message..

        xml.value.struct[0].member.forEach(function(element){
            if(null === structure[element.name]){ //sequence Id is just value, no inner type
                compiledMessage[element.name] = element.value[0]
            } else {
                compiledMessage[element.name] = element.value[0][structure[element.name]][0]
            }
        });
        callback(compiledMessage);
    })
}

module.exports.schemaById = {};
module.exports.schemaByName = {};
module.exports.idByName = {};
module.exports.nameById = {};


for (var k in protoBuffMap) {
    var schema = getSchema(protoBuffMap[k]);
    module.exports.schemaById[k] = schema;
    module.exports.schemaByName[protoBuffMap[k]] = schema;
    module.exports.idByName[protoBuffMap[k]] = k * 1;
    module.exports.nameById[k] = protoBuffMap[k];
}

for (var k in xmlMap) {
    module.exports.idByName[xmlMap[k]] = k;
    module.exports.nameById[k] = xmlMap[k];
}