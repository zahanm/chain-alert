
var fs = require('promised-io/fs');
var path = require('path');
var util = require('util');

var ChainLove = require('./chainlove.js');
var Channels = require('./channels.js');

var invariant = require('./invariant.js');

ChainLove.fetchCurrentDeal()
.then(ChainLove.doesMatchInterests)
.then(function(results) {
  results.forEach(function(result) {
    if (result) {
      var deal = result.deal;
      var search = result.search;
      invariant(deal && search, 'Need deal and search info.');
      var recipient = search.recipient;
      var body = search.alerttext;
      invariant(recipient && body, 'Need recipient and deal label.');
      fs.readFile(path.join(path.dirname(module.filename), 'blob.json'))
      .then(function(buf) {
        var recipients = JSON.parse(buf).recipients;
        invariant(
          recipients[recipient],
          'Your recipient %s is not present in the recipients store',
          recipient
        );
        var r = recipients[recipient];
        util.log(util.format('Sending an alert about %s to %j', body, to));
        switch(r.type) {
          case 'SMS':
            Channels.sendSMS(r, body);
            break;
          case 'email':
            Channels.sendEmail(r, 'Chainlove deal match!', body);
            break;
          default:
            invariant(false, 'Invalid type provided');
        }
      });
    }
  });
});
