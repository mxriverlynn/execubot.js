# Execubot: A Gist Executing Slack-Bot

Built using Webtask.io and serverless code, this Slack-bot will
read JavaScript code from a github gist file that was linked
in a Slack channel, ask you if you want to execute it, and then
post the results into the slack channel when the code has completed.

## A Demo

![](/assets/execubot-demo.gif)

## Getting Started

You'll need a Slack app, and 2 WebTask.io containers - one for the main bot script and one for the code execution bot script.

### 1. Webtasks

You'll need to [create 2 apps at WebTask.io](https://webtask.io).

The first will contain the `execubot` script, which is the primary bot that listens for events from Slack, and responds to the initial verification request.

The second will contain the `executor` script, which will take the code in question, execute it and post a response back to the slack channel.

### 2. Deploy The Bots

There are two bot scripts to deploy, the `execubot` and the
`executor`. 

To deploy the execubot:

```
wt update --bundle <webtask-name> execubot/index.js
```

To deploy the executor:

```
wt update --bundle <webtask-name> executor/index.js
```

### 3. Slack App

[Create a slack app](https://api.slack.com/apps) and give it the following...

Features:

* Enable Interactive Components
  * Add the `execubot` WebTask URL to the "Request URL"
* Event Subscriptions
  * Add the `executor`  WebTask URL to the "Request URL"
  * Workspace Events: `link\_shared`
  * App Unfurl Domains: `gist.githubusercontent.com`
* OAuth & Permissions
  * Get your OAuth Access Token
  * Scopes
    * `chat:write:bot`
    * `links:read`

### 4. Install Your Slack App

Once you have the Bot scripts deployed, and Slack is configured correctly, you need to install the app into your workspace. Do this through the "Settings" menu on the left side of your Slack App configuration page.

When installing, you will specify the Workspace (Slack team) and Channel in which your App will be usable for testing. It's best to create a new slack channel for
testing purposes, so you don't spam other people while working on the bot. Be sure to create the channel before installing the app, or it won't show up in the list.

### 5. Configure WebTask Secrets

Now that you have the Slack app and the WebTask containers, you need to configure some secrets in the WebTasks so the app is able to properly post messages to the
correct channel.

`execubot` WebTask

* `slackToken`
* `slackChannel`

`executor` WebTask

* `slackToken`
* `slackChannel`
* `webTaskAccountId`
* `webTaskToken`

# Legalese

Copyright &copy; 2017 Muted Solutions, LLC. All Rights Reserved.

Distributed freely under [MIT License](http://mutedsolutions.mit-license.org).
