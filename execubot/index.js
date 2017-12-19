'use latest';

import express from 'express';
import { fromExpress } from 'webtask-tools';
import bodyParser from 'body-parser';
import https from 'https';

import getGist from '../lib/getGist';
import postSlackMessage from '../lib/postSlackMessage';

var secrets;
const app = express();

app.use(bodyParser.json());

const eventHandlers = {
  "link_shared": linkShared
};

app.post('/', (req, res) => {
  const type = req.body.type;

  if (type === "url_verification") {
    return urlVerification(req, res);
  }

  const eventType = req.body.event.type;
  const handler = eventHandlers[eventType];
  if (handler){ return handler(req, res); } 

  res.status(200).send();
});

function urlVerification(req, res){
  const code = req.body.challenge;
  res
  .set("content-type", "application/json")
  .status(200)
  .send({ challenge: code });
}

function linkShared(req, res){
  const { event } = req.body;
  const { url } = event.links[0];

  console.log(event);
  getGist(url)
    .then((code) => {
      postCode(code, url)
    })
    .then(() => {
      res.status(200).send();
    })
    .catch((ex) => {
      console.log("ERROR Handling Shared Link!");
      console.log(ex.stack);
      res.status(500).send(ex.message);
    });
}

function postCode(code, codeUrl){
  const message = {
    channel: secrets.slackChannel,
    text: "Here's that wonder gist code you posted!",
    attachments: [
      {
        title: "The Code:",
        text: code
      },
      {
        title: "Want to run it?",
        callback_id: "exec",
        style: "primary",
        attachment_type: "default",
        actions: [{
          name: "exec",
          text: "Run The Code >>",
          type: "button",
          value: codeUrl
        }]
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
