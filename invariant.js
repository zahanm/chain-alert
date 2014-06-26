
module.exports = function() {
  var args = Array.prototype.slice.call(arguments, 0);
  var condition = args.shift();
  if (!condition) {
    throw new Error('Invariant violation: ' + util.format.apply(util, args));
  }
}
