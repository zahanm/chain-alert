
var ChainLove = require('./chainlove.js');

var invariant = require('./invariant');

ChainLove.fetchCurrentDeal(function(err, deal) {
  invariant(!err, 'Problem fetching deal: %s', err);
  console.log(deal);
});
