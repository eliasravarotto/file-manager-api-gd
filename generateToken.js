const fs = require('fs');

const { authorizeX } = require('./services/authGDriveService');
const { CREDENTIALS_PATH } = require('./constants/commons');
const { ERROR_LOAD_SECRET_FILE } = require('./constants/logsMessages');


// Load client secrets from a local file.
fs.readFile(CREDENTIALS_PATH, async (err, content) => {
    if (err) return console.log(ERROR_LOAD_SECRET_FILE, err);
    // Authorize a client with credentials, then call the Google Drive API.   
    authorizeX(JSON.parse(content));
});




