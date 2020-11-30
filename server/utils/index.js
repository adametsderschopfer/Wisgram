const async = require('async');
const nodemailer = require('nodemailer');
const { transportConfig } = require('./config');

/**
 * A code is generated from four random numbers
 *
 * @return {number}
 */
function generateCode() {
  const num = () => parseInt(Math.random() * 9);
  const code = `${num()}${num()}${num()}${num()}`;

  return code;
}

/**
 * The function adds * to a random place to hide email
 *
 * @param {string} email
 * @return {string} shorted email
 */
function shortedEmail(email) {
  if (!email && !email.length) {
    throw Error('Email not found');
  }

  const e = email.match('.+?(?=@)');
  const name = e[0];

  let shortEmail = '';

  const rand = () => Math.random() * name.length;

  async.each(name, i => {
    if ((rand() % name.length) - 1 < name.length / 2) {
      return (shortEmail += '*');
    }

    return (shortEmail += i);
  });

  return shortEmail + email.split(name)[1];
}

/**
 * Accepts parameters for sending messages and then asynchronously sends a letter
 *
 * @param {string} to Email to whom to send
 * @param {string} subject Email header
 * @param {string} text Palintext letters
 * @param {string | undefined} html HTML markup for writing
 * @return { null | TypeError(Some params were not specified)}
 */
async function senderMail(to, subject, text, html = undefined) {
  if (!to || !subject || !text) {
    return TypeError('Some params were not specified');
  }

  const transporter = nodemailer.createTransport(transportConfig);

  const message = {
    from: 'no-reply@wisgram.com',
    to,
    subject,
    text,
    html,
  };

  await transporter.sendMail(message);
  transporter.close();

  return null;
}

module.exports = {
  generateCode,
  shortedEmail,
  senderMail,
};
