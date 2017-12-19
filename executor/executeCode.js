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

        resolve(output);
      });
    });

    req.on('error', (e) => {
      console.log('Problem Executing Code: ' + e.message);
      reject(e);
    });

    const wrappedCode = `
    'use latest';
    return function(ctx, cb) { 

      const oc = {
        log: console.log.bind(console),
        info: console.info.bind(console),
        warn: console.warn.bind(console),
        error: console.error.bind(console)
      };

      const consoleData = {
        log: [],
        warn: [],
        info: [],
        error: []
      };

      console.log = function(...args) { 
        consoleData.log = [].concat(consoleData.log).concat(args);
        oc.log("CONSOLE LOG DATA:", consoleData.log);
      }

      console.warn = function(...args) { 
        consoleData.warn = [].concat(consoleData.warn).concat(args);
        oc.log("CONSOLE WARN DATA:", consoleData.warn);
      }

      console.info = function(...args) { 
        consoleData.info = [].concat(consoleData.info).concat(args);
        oc.log("CONSOLE INFO DATA:", consoleData.info);
      }

      console.error = function(...args) { 
        consoleData.error = [].concat(consoleData.error).concat(args);
        oc.log("CONSOLE ERROR DATA:", consoleData.error);
      }

      const output = (function(){ ${code} })();

      const result = {
        output,
        consoleData
      };

      cb(null, result); 
    }`;

    req.write(wrappedCode);
    req.end();
  });
}

export default executeCode;
