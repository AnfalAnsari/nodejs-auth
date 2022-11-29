const nodemailer = require('nodemailer'); 
const dotenv = require('dotenv');

//ACCESSING THE ENVIRONMENT VARIABLES
dotenv.config();

let mailTransporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    }
});
 
let mailDetails = {
    from: process.env.EMAIL,
    to: '',
    subject: 'Registration Confirmation Mail',
    text: 'Dear User, you are now registered with us'
};

module.exports.mailTransporter = mailTransporter;
module.exports.mailDetails = mailDetails;