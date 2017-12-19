'use latest';

import express from 'express';
import { fromExpress } from 'webtask-tools';
import bodyParser from 'body-parser';
import https from 'https';

import executeCode from './executeCode';
import getGist from '../lib/getGist';
import postSlackMessage from '../lib/postSlackMessage';

var secrets;
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({extended: true}));

app.post('/', (req, res) => {
  const payload = JSON.parse(req.body.payload);
  const codeUrl = payload.actions[0].value;

  getGist(codeUrl)
    .then((code) => {
      return executeCode(secrets.webTaskAccountId, secrets.webTaskToken, code);
    })
    .then(postCodeAndResult)
    .then(() => {
      return res.status(200).send();
    })
    .catch((ex) => {
      console.log("ERRRRRRRRRRRRRRRRRRRR:");
      console.log(ex.stack);
      return res.status(500).send(ex.stack);
    });
});

function postCodeAndResult({code, output}){
  const message = {
    channel: secrets.slackChannel,
    text: "here's the code and result",
    attachments: [
      {
        title: "The Code:",
        text: code
      },
      {
        title: "The Output:",
        text: output
      }
    ]
  };

  return postSlackMessage(secrets.slackToken, message);
}

const expressWrapper = fromExpress(app);
module.exports = function(context, req, res) {
  secrets = context.secrets;
  return expressWrapper(context, req, res);
}
