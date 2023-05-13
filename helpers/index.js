const nodemailer = require("nodemailer")
function sendEmail(email) {

    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.MAILTREP_USER,
            pass: process.env.MAILTREP_PASS
        }
    });
    return transport.sendMail({...email, from:"kolac300@gmail.com"})
        .then(res => console.error(res))
        .catch(error => console.log(error))


}
module.exports = { sendEmail }
