const readline = require('readline');

exports.askEnterCodeHere = (text) => {

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })
    
      return  new Promise(resolve => rl.question(text, ans => {
        rl.close();
        resolve(ans);
    }))
}

/**
 * To modify this function to generate the filename what you want.
 * 
 * @returns string: name of file
 */
exports.generateFileName = () => {
  return 'example-filename.jpg';
}