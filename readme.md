# Execubot: A Gist Executing Slack-Bot

Built using Webtask.io and serverless code, this Slack-bot will
read JavaScript code from a github gist file that was linked
in a Slack channel, ask you if you want to execute it, and then
post the results into the slack channel when the code has completed.

## Getting Started

## Deploy The Bots

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

# Legalese

Copyright &copy; 2017 Muted Solutions, LLC. All Rights Reserved.

Distributed freely under [MIT License](http://mutedsolutions.mit-license.org).
