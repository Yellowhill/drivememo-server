import nodemailer from 'nodemailer';
import pug from 'pug';
import juice from 'juice';
//import htmlToText from 'html-to-text';
import promisify from 'es6-promisify';

require('dotenv').config({ path: __dirname + '/../variables.env' });

console.log('environment variables', process.env.MAIL_HOST);
console.log('environment variables', process.env.MAIL_USER);
const transport = nodemailer.createTransport({
	host: process.env.MAIL_HOST,
	port: 2525,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS,
	},
});

const generateHTML = (filename, options = {}) => {
	const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options);
	const inlined = juice(html);
	return inlined;
};

const send = async options => {
	console.log('mail.send options', options);
	const html = generateHTML(options.filename, options);
	//const text = htmlToText.fromString(html);

	const mailOptions = {
		from: options.sender,
		to: options.recipient.email,
		subject: options.subject,
		html,
		// text
	};
	const sendMail = promisify(transport.sendMail, transport);
	return sendMail(mailOptions);
};

export default {
	send,
};

//test send when you import this file in one of the files that are running
// transport.sendMail({
//     from: 'Jere <jerekeltamaki@gmail.com',
//     to: 'randy@example.com',
//     subject: 'Testin this shit++',
//     html: 'Hey <strong>dude</strong>',
//     text: 'Hey dude in text'
// });
