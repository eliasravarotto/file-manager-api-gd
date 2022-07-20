const fs = require('fs');
const fsp = require('fs').promises;

const { uploadFile } = require('./services/fileServices');
const { authorize } = require('./services/authGDriveService');
const { CREDENTIALS_PATH, UPLOAD_FOLDER_PATH, GD_FOLDER_ID } = require('./constants/commons');
const { IMAGE_JPEG_MIME_TYPE } = require('./constants/driveMimeTypes');
const { generateFileName } = require('./utils/utils');


main = async () => {
    try {
        const content = await fsp.readFile(CREDENTIALS_PATH);

        const fileName = generateFileName();

        const fileMetadata = {
            'name': fileName,
            'parents': [GD_FOLDER_ID]
        };
        const media = {
            mimeType: IMAGE_JPEG_MIME_TYPE,
            body: fs.createReadStream(UPLOAD_FOLDER_PATH + fileName)
        };
        const fileOptionsUpload = {
            fileMetadata,
            media
        };
        
        // Authorize a client with credentials, then call the Google Drive API.
        const oAuth2Client = await authorize(JSON.parse(content)); 
        uploadFile(oAuth2Client, fileOptionsUpload);
        
    } catch (error) {
        console.log(error)
    }
}

main();

