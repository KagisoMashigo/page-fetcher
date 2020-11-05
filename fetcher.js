const fs = require('fs');
const request = require('request');
const urlPath = process.argv[2];
const filePath = process.argv[3];
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const writeFileTrue = (file, body) => {
  fs.writeFile(file, body, (err) => {
    if (err) console.log(err);
    console.log(`Downloaded and saved ${body.length} bytes to ${file}`);
  })
  rl.close()
}

request(urlPath, (error, response, body) => {
  if (!error && response.statusCode === 200) {
    fs.access(filePath, fs.constants.F_OK, function(err) {
      if (err) {
        writeFileTrue(filePath, body);
      } else if (err === null) {
        rl.question("The file already exists, press Y to overwrite or any key to cancel followed by enter.\n", (answer) => {
          if (answer !== "Y") {
            rl.close();
          } else {
            writeFileTrue(filePath, body);
          }
        });
      }
    });
  } else if (response.statusCode !== 200) {
    console.error(`Error: ${error}`);
    console.log(`Response code: ${response.statusCode} - if this isn't 200 then its likely a problem with your request.`);
    rl.close();
   }
});

// theres weak error handling
// using variables for values that will repeat is better for readablity and editing

