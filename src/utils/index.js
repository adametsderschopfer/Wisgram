const async = require('async');
const nodemailer = require('nodemailer');
const { transportConfig } = require('./config');

function generateCode() {
  const num = () => parseInt(Math.random() * 9);
  const code = `${num()}${num()}${num()}${num()}`;

  return code;
}

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

async function senderMail(to,subject,  text, html = undefined) {
  const transporter = nodemailer.createTransport(transportConfig);
  const message = {
    from: 'no-reply@wisgram.com',
    to,
    subject,
    text,
    html
  };

  await transporter.sendMail(message);
  transporter.close();
}

module.exports = {
  generateCode,
  shortedEmail,
  senderMail
};
