
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
      switch(r.type) {
        case 'SMS':
          Channels.sendSMS(r, 'hello out there');
          break;
        case 'email':
          Channels.sendEmail(r, 'test', 'hello out there');
          break;
        default:
          invariant(false, 'Invalid type provided');
      }
    });
    // data.searches
  });
}
