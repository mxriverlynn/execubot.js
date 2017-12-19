import https from 'https'

function executeCode(webTaskAccountId, webTaskToken, code){
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'webtask.it.auth0.com',
      port: 443,
      path: `/api/run/${webTaskAccountId}`,
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${webTaskToken}`
      }
    };

    const req = https.request(options, function(res) {
      res.setEncoding('utf8');

      const results = [];
      res.on('data', (data) => {
        results.push(data); 
      });

      res.on("end", () => {
        const output = results.join('');

        console.log("Execute Code Results:");
        console.log(output);

        resolve({code, output});
      });
    });

    req.on('error', (e) => {
      console.log('Problem Executing Code: ' + e.message);
      reject(e);
    });

    const wrappedCode = `return function(ctx, cb) { 
      const result = (function(){
       ${code}
      })();
      cb(null, result); 
    }`;

    req.write(wrappedCode);
    req.end();
  });
}

export default executeCode;
