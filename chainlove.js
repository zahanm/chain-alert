
'use strict';

var Browser = require('zombie');
var Promise = require('node-promise').Promise;

var fs = require('promised-io/fs');
var path = require('path');

var invariant = require('./invariant');

var CHAINLOVE_DOT_COM = 'http://www.chainlove.com/';
var SELECTOR_TITLE = '#item_title';
var SELECTOR_DESCRIPTION = '#item_description p';
var SELECTOR_USE = "#features dl > *";
var FIELDS = ['title', 'description', 'use'];

var ChainLove = {

  /**
   * Return {
   *   product: '..',
   *   description: '..',
   *   use: '..',
   * }
   */
  fetchCurrentDeal: function() {
    var promise = new Promise();
    Browser.visit(
      CHAINLOVE_DOT_COM,
      { debug: false, runScripts: false },
      function(err, browser) {
        if (err) {
          promise.emitError(err);
          return;
        }
        var feature_pairs = browser.queryAll(SELECTOR_USE);
        var ii, use = null;
        for (ii = 0; ii < feature_pairs.length; ii++) {
          if(/Recommended Use/i.test(feature_pairs[ii].textContent)) {
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
        promise.emitSuccess(deal);
      }
    );
    return promise;
  },

  doesMatchInterests: function(deal) {
    var promise = new Promise();
    fs.readFile(path.join(path.dirname(module.filename), './blob.json'))
    .then(function(buf) {
      var results = JSON.parse(buf).searches.map(function(search) {
        invariant(
          search.recipient,
          'Your search needs a recipient'
        );
        var found = FIELDS.reduce(function(already_found, f) {
          return already_found || f in search;
        }, false);
        invariant(
          found,
          'Your search needs some query terms'
        );
        // Note: all conditions are required. I'll figure out optional later
        var match = true;
        function checkForQuery(found_so_far, field) {
          if (!found_so_far) {
            // quick optimization to not check if one query already didn't match
            return false;
          }
          invariant(
            search[field].reduce,
            'Query needs to be an array %s',
            search[field]
          );
          return search[field].reduce(function(match_so_far, q) {
            // ignore case
            return match_so_far && (new RegExp(q, 'i')).test(deal[field]);
          }, true);
        }
        if (FIELDS.reduce(checkForQuery, true)) {
          return {
            deal: deal,
            search: search
          };
        } else {
          return false;
        }
      });
      promise.emitSuccess(results);
    });
    return promise;
  }

};

module.exports = ChainLove;