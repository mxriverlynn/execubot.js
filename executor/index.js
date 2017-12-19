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
    .then((jsonResult) => {
      const result = JSON.parse(jsonResult);
      postCodeAndResult(result);
    })
    .then(() => {
      return res.status(200).send();
    })
    .catch((ex) => {
      console.log("ERRRRRRRRRRRRRRRRRRRR:");
      console.log(ex.stack);
      return res.status(500).send(ex.stack);
    });
});

function postCodeAndResult(result){
  const attachments = [
    {
      title: "Direct Code Output:",
      text: result.output
    }
  ];

  const consoleData = result.consoleData;

  if (consoleData.log.length > 0) {
    attachments.push({
      title: "Console Log Output:",
      text: result.consoleData.log.join("\n")
    });
  }

  if (consoleData.info.length > 0) {
    attachments.push({
      title: "Console Info Output:",
      text: result.consoleData.info.join("\n")
    });
  }

  if (consoleData.warn.length > 0) {
    attachments.push({
      title: "Console Warn Output:",
      text: result.consoleData.warn.join("\n")
    });
  }

  if (consoleData.error.length > 0) {
    attachments.push({
      title: "Console Error Output:",
      text: result.consoleData.error.join("\n")
    });
  }

  const message = {
    channel: secrets.slackChannel,
    attachments
  };

  return postSlackMessage(secrets.slackToken, message);
}

const expressWrapper = fromExpress(app);
module.exports = function(context, req, res) {
  secrets = context.secrets;
  return expressWrapper(context, req, res);
}
