const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
        user: emailConfig.user, // generated ethereal user
        pass: emailConfig.pass, // generated ethereal password
    },
});

const generarHtml = (templateEmail, opciones = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/emails/${templateEmail}.pug`, opciones);
    return juice(html);
}


exports.enviar = async(opciones) => {
    const html = generarHtml(opciones.archivo, opciones);
    const text = htmlToText.fromString(html);
    let mailOptions = {
        from: '"UpTask" <no-reply@uptask.com>', // sender address
        to: opciones.usuario.email, // list of receivers
        subject: opciones.subject, // Subject line
        text,
        html
    }


    // send mail with defined transport object
    return await transport.sendMail(mailOptions);
}