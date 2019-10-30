import express from 'express';
import Subject from '../model/subject';
import Registry from '../model/registry';
import nodemailer from 'nodemailer';
import path from 'path';
import signal from './signal';

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
    let report = await queryReport();
    // await mailer(cardId, report);
    signal(report);
    res.status(200).send("OK");
});

router.get('/report2', async (req, res) => {
    let report = await queryReport();
    res.status(200).send(report);
});

router.get('/report3', async (req, res) => {
  let report = await queryReport('<br/>');
  res.status(200).send(report);
});

// viewed at http://localhost:8080
router.get('/subscribe', function (req, res) {
  res.sendFile(path.join(__dirname + '/subscribe.html'));
});

router.get('/report', async (req, res) => {
  let returnStr = '';
    let fromDate = new Date();
    fromDate.setUTCHours(0);
    fromDate.setMinutes(0);
    fromDate.setMilliseconds(0);
    let toDate = new Date(fromDate);
    toDate.setDate(toDate.getDate() + 1);
    
  let aggregateRules = [
    {
      '$match': {
        'date': { '$gte': fromDate, '$lte': toDate }
      }
    }, {
      '$lookup': {
        'from': 'subjects', 
        'localField': 'cardId', 
        'foreignField': 'cardId', 
        'as': 'subject'
      }
    }, {
      '$project': {
        '_id': '$_id', 
        'cardId': '$cardId', 
        'date': '$date', 
        'subject': {
          '$arrayElemAt': [
            '$subject', 0
          ]
        }
      }
    }, {
      '$sort': {
        'date': 1
      }
    }, {
      '$group': {
        '_id': '$cardId', 
        'subjectName': {
          '$first': '$subject.subjectName'
        },
        'description': {
          '$first': '$subject.description'
        },
        'time': {
          $push: '$date'
        },
        'countTime': {
          $sum: 1
        }
      }
    }
  ];
  let registries = await Registry.aggregate(aggregateRules);
  let report = await queryReport();
  await mailer(report);
  res.status(200).json(registries);
})

let queryReport = async(rowDelim) => {
    if (!rowDelim) rowDelim = '\n';
    let returnStr = '';
    let fromDate = new Date();
    fromDate.setUTCHours(0);
    fromDate.setMinutes(0);
    fromDate.setMilliseconds(0);
    let toDate = new Date(fromDate);
    toDate.setDate(toDate.getDate() + 1);
    let aggregateRules = [
      {
        '$match': {
          'date': { '$gte': fromDate, '$lte': toDate }
        }
      }, {
        '$lookup': {
          'from': 'subjects', 
          'localField': 'cardId', 
          'foreignField': 'cardId', 
          'as': 'subject'
        }
      }, {
        '$project': {
          '_id': '$_id', 
          'cardId': '$cardId', 
          'date': '$date', 
          'subject': {
            '$arrayElemAt': [
              '$subject', 0
            ]
          }
        }
      }, {
        '$sort': {
          'date': 1
        }
      }, {
        '$group': {
          '_id': '$cardId', 
          'subjectName': {
            '$first': '$subject.subjectName'
          }, 
          'description': {
            '$first': '$subject.description'
          }, 
          'time': {
            '$push': '$date'
          }
        }
      }
    ];
    let registries = await Registry.aggregate(aggregateRules);
    registries.forEach((registry) => {
        returnStr += '-----\n';
        returnStr += 'SUBJECT: ' + registry.subjectName + rowDelim;
        // returnStr += 'DESCRIPTION: ' + registry.description + rowDelim;
        let timeEntries = registry.time;
        let ongoing = false;
        let prevTime;
        let timeAccumulated = 0;
        let minutesAccumulated = 0;
        timeEntries.forEach((time) => {
            ongoing = !ongoing;
            if (ongoing)
            {
                prevTime = time;
            } else 
            {
                timeAccumulated += Math.abs(time-prevTime);
            }
        });
        console.log(timeAccumulated);
        minutesAccumulated = Math.ceil(timeAccumulated / (1000 * 60));
        returnStr += "ACCUMULATED: " + Number(minutesAccumulated).toFixed(2) + " minutes." + rowDelim;
        returnStr += "STATUS: " + (ongoing ? "Yes" : "No") + rowDelim;
    });
    return returnStr;
}

const mailer = async (report) => {
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
        text: 'Hello Thinh. \n Here is the summary of your day:' + '\n' + report // Plain text body
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