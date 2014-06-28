
'use strict';

var nodemailer = require('nodemailer');
var fs = require('promised-io/fs');

var invariant = require('./invariant');

var SMS_MAX_LENGTH = 160;
var ATT_SMS_GATEWAY = 'txt.att.net';

/**
 * [EmailAddress] to { address: '..' }
 * [String] subject
 * [String] body
 */
function sendEmail(to, subject, body) {
  invariant(
    /.+@.+\..+/.exec(to.address), // stupidly simple validation
    'Invalid email address provided'
  );
  fs.readFile('./blob.json')
  .then(function(buf) {
    var from = JSON.parse(buf).from;
    invariant(
      from.service && from.user && from.pass,
      'You need a service, user and pass specified'
    );
    // email setup
    var gmailSMTP = nodemailer.createTransport('SMTP', {
      debug: false,
      service: from.service,
      auth: {
        user: from.user,
        pass: from.pass
      }
    });
    var mail = {
      from: from.user,
      to: [to.address],
      subject: subject,
      text: body
    };
    gmailSMTP.sendMail(mail, function(err, resp) {
      invariant(!err, 'Error in sending message %s', err);
      console.log("Message sent: " + resp.message);
      gmailSMTP.close();
    });
  });
}

/**
 * [PhoneNumber] to { carrier: '..', number: '..' }
 * [String] body
 */
function sendSMS(to, body) {
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
  sendEmail({ address: sms_gateway }, '', body);
}

var Channels = {
  sendEmail: sendEmail,
  sendSMS: sendSMS
};

module.exports = Channels;
