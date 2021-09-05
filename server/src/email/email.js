const mail = require('nodemailer');

const transporter = mail.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS
    }
});

const emailSend = (to, subject, text, cb) => {
    transporter.sendMail({
        from: process.env.EMAIL_ID,
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