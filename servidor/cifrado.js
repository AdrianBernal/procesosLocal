
// Part of https://github.com/chris-rock/node-crypto-examples

// Nodejs encryption with CTR
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'procesos';

module.exports.encrypt = function(text){
  if (text) {
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
  } else {
    var crypted = text;
  }
  return crypted;
}
 
module.exports.decrypt = function(text){
  if (text) {
    var decipher = crypto.createDecipher(algorithm,password)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
  } else {
    var dec = text;
  }
  return dec;
}