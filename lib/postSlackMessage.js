import https from 'https';

function postSlackMessage(slackToken, message) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'slack.com',
      port: 443,
      path: '/api/chat.postMessage',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        "Authorization": `Bearer ${slackToken}`
      }
    };

    const req = https.request(options, function(res) {
      res.setEncoding('utf8');

      const results = [];
      res.on('data', (body) => {
        results.push(body);
      });

      res.on('end', () => {
        const output = results.join('');

        console.log("Post Slack Message Results:");
        console.log(output);

        resolve(output);
      });
    });

    req.on('error', function(e) {
      console.log('Error Posting Message To Slack: ' + e.message);
      reject(e);
    });

    req.write(JSON.stringify(message));
    req.end();
  });
}

export default postSlackMessage;
