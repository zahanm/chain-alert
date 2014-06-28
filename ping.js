
var fs = require('promised-io/fs');

var ChainLove = require('./chainlove.js');
var Channels = require('./channels.js');

var invariant = require('./invariant.js');

if (false) {
  ChainLove.fetchCurrentDeal()
  .then(function(deal) {
    console.log(deal);
  });
} else {
  fs.readFile('./blob.json')
  .then(function(buf) {
    var data = JSON.parse(buf);
    data.recipients.forEach(function(r) {
      Channels.sendSMS(r, 'hello out there');
    });
    // data.searches
    // Channels.sendSMS()
  });
}
