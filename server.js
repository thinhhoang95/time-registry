import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import defaultRoute from './route';

mongoose.connect('mongodb://root:Thinh24051995@103.7.41.173:27017/workregistry?authSource=admin', { useNewUrlParser: true });

let app = express();
let urlencodedParser = bodyParser.text();
//app.use(bodyParser.json());
app.use(urlencodedParser);

app.use(defaultRoute);

app.listen(3002, () => {
    console.log('Time Registry is currently running on port 3002');
});