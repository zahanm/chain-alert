
var ChainLove = require('./chainlove.js');

var invariant = require('./invariant');

ChainLove.fetchCurrentDeal()
.then(function(deal) {
  console.log(deal);
});
