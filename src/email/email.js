const mail = require('nodemailer');

const transporter = mail.createTransport({
    service: "gmail",
    auth: {
        user: "nodemailer3333e3@gmail.com",
        pass: "V2t5kovice"
    }
});

const emailSend = (to, subject, text, cb) => {
    transporter.sendMail({
        from: "nodemailer3333e3@gmail.com",
        to: to,
        subject: subject,
        text: text
    }, (err, info) => {
        if(err){
            return cb(err, undefined);
        }
        console.log(`info: ${info.response}`)
        return cb(undefined, 'OK');
    });
}

module.exports = emailSend;