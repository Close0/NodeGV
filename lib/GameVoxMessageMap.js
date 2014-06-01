
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

var xmlMap = {
    'Authenticate': {
        constant: 0x7101,
        structure: {
            username: 'string',
            password: 'string',
            protocolVersion: 'int',
            version: 'string'
        }
    }
};

var gamevox = new Schema(fs.readFileSync( __dirname + '/gamevox.desc'));
var messages = {};

var getSchema = function (name) {
    var schema = gamevox['GamevoxProto.' + name];
    messages[name] = schema;
    return schema;
};

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
