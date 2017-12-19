import https from 'https'

function executeCode(code){
  return new Promise((resolve, reject) => {
    const result = "some cool results, eh?";
    resolve({code, result});
  });
}

export default executeCode;
