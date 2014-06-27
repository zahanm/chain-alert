
'use strict';

var Browser = require('zombie');

var invariant = require('./invariant');

var CHAINLOVE_DOT_COM = 'http://www.chainlove.com/';
var SELECTOR_TITLE = '#item_title';
var SELECTOR_DESCRIPTION = '#item_description p';
var SELECTOR_USE = "#features dl > *";

var ChainLove = {

  /**
   * Return {
   *   product: '..',
   *   description: '..',
   *   use: '..',
   * }
   */
  fetchCurrentDeal: function(callback) {
    Browser.visit(
      CHAINLOVE_DOT_COM,
      { debug: false, runScripts: false },
      function(err, browser) {
        if (err) {
          callback(err);
          return;
        }
        var feature_pairs = browser.queryAll(SELECTOR_USE);
        var ii, use = null;
        for (ii = 0; ii < feature_pairs.length; ii++) {
          if(/Recommended Use/i.exec(feature_pairs[ii].textContent)) {
            invariant(
              ii + 1 < feature_pairs.length,
              'The webpage structure has changed.'
            );
            use = feature_pairs[ii + 1].textContent;
          }
        }
        var deal = {
          title: browser.text(SELECTOR_TITLE),
          description: browser.text(SELECTOR_DESCRIPTION),
          use: use
        };
        callback(null, deal);
      }
    );
  }

};

module.exports = ChainLove;