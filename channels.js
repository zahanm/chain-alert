
'use strict';

var invariant = require('./invariant');

var SMS_MAX_LENGTH = 160;
var ATT_SMS_GATEWAY = 'txt.att.net';

var Channels = {

  sendEmail: function(to, subject, body) {
    invariant(false, 'Sending emails is not implemented yet');
  },

  /**
   * [PhoneNumber] to { carrier: '..', number: '..' }
   * [String] body
   */
  sendSMS: function(to, body) {
    invariant(
      body.length <= SMS_MAX_LENGTH,
      'You cannot have a SMS %d characters long',
      body.length
    );
    invariant(
      to.carrier === 'AT&T',
      'We do not support the %s carrier for now',
      to.carrier
    );
    invariant(
      /^\d{10}$/.exec(to.number),
      '%s is not a valid phone number',
      to.number
    );
    var sms_gateway = to.number + '@' + ATT_SMS_GATEWAY;
    console.log('Sending', '"' + body + '"', 'to', sms_gateway);
  }

};

module.exports = Channels;
