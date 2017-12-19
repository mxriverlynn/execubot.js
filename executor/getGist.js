import https from 'https';

function getGist(codeUrl) {
  return new Promise((resolve, reject) => {
    const req = https.get(codeUrl, (res) => {
      res.setEncoding('utf8');

      const results = [];
      res.on('data', (data) => {
        results.push(data); 
      });

      res.on("end", () => {
        const output = results.join('');

        console.log("Get Gist Results:");
        console.log(output);

        resolve(output);
      });
    });

    req.on('error', (e) => {
      console.log('Problem Getting GIST Code: ' + e.message);
      reject(e);
    });
  });
}

export default getGist;
