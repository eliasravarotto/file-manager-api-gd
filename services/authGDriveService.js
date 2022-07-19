const fs = require('fs');
const fsp = require('fs').promises;
const readline = require('readline');
const { google } = require('googleapis');

const { SCOPES } = require('../constants/driveApi');
const { TOKEN_PATH } = require('../constants/commons');
const { askEnterCodeHere } = require('../utils/utils');
const { ERROR_RETRIVING_ACCESS_TOKEN, 
    ENTER_CODE_MESSAGE, 
    AUTHORIZE_APP_MESSAGE, 
    TOKEN_STORED_MESSAGE, 
    PLEASE_GENERATE_A_NEW_TOKEN, 
    USING_EXISTENT_TOKEN_MESSAGE } = require('../constants/logsMessages');


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 */
 exports.authorize = async (credentials) => {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    try {
        const token = await fsp.readFile(TOKEN_PATH);
        oAuth2Client.setCredentials(JSON.parse(token));
        console.log(USING_EXISTENT_TOKEN_MESSAGE)
        return oAuth2Client;
    } catch (error) {
        console.log(PLEASE_GENERATE_A_NEW_TOKEN)
        throw error;
    }
}

/**
 * IS NOT WORKING FOR NOW
 * Get and store new token after prompting for user authorization.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 */
async function getAccessTokenPromise(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log(AUTHORIZE_APP_MESSAGE , authUrl);
    
    const code = await askEnterCodeHere(ENTER_CODE_MESSAGE);

    const token = await oAuth2Client.getToken(code);
    console.log(token)
    fsp.writeFile(TOKEN_PATH, JSON.stringify(token));
    console.log(TOKEN_STORED_MESSAGE, TOKEN_PATH);

    return token;
}


// ORIGINAL CODE

/**
 * Create an OAuth2 client with the given credentials.
 * Por el momento es usado para generar el archivo token.json
 * @param {Object} credentials The authorization client credentials.
 */
exports.authorizeX = (credentials) => {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
  
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getAccessToken(oAuth2Client);
      oAuth2Client.setCredentials(JSON.parse(token));
    });
  }

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 */
getAccessToken = (oAuth2Client) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log(AUTHORIZE_APP_MESSAGE, authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question(ENTER_CODE_MESSAGE, (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error(ERROR_RETRIVING_ACCESS_TOKEN, err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log(TOKEN_STORED_MESSAGE, TOKEN_PATH);
            });
        });
    });
}