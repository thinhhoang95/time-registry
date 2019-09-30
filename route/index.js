import express from 'express';
import Subject from '../model/subject';
import Registry from '../model/registry';
import nodemailer from 'nodemailer';

let router = express.Router();

// Create new registry
// PLAIN TEXT BODY
router.post('/registry', async (req, res) => {
    let cardId = req.body;
    let registry = new Registry({
        date: new Date(),
        cardId: cardId
    });
    await registry.save();
    await mailer(cardId);
    res.status(200).send("OK");
});

const mailer = async (cardId) => {
    let sj = await Subject.findOne({cardId: cardId});
    let subject = sj.subjectName;
    let description = sj.description;
    let transport = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        auth: {
            user: 'thinhhoangdinh95@hotmail.com',
            pass: 'AndromedaArrandale'
        }
    });
    const message = {
        from: 'thinhhoangdinh95@hotmail.com', // Sender address
        to: 'hoangdinhthinh@live.com',         // List of recipients
        subject: 'New task event registered', // Subject line
        text: 'Hello Thinh. \n A new task has been registered with the following information: \n Card ID: ' + cardId + ' \n Subject: ' + subject + '\n Description: ' + description + '\n' // Plain text body
    };
    transport.sendMail(message, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log(info);
        }
    });
}


export default router;