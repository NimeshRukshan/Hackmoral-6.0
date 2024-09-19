const dotenv = require("dotenv");

// Load environment variables
dotenv.config();
const fs = require("fs");
const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.CREDENTIALS_PATH,
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

const drive = google.drive({ version: "v3", auth });

async function uploadFile(filePath, fileName) {
  try {
    const fileMetadata = {
      name: fileName,
      parents: [process.env.CERTIFICATES_FOLDER_ID],
    };
    const media = {
      mimeType: "application/pdf",
      body: fs.createReadStream(filePath),
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id, webViewLink",
    });

    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    const result = await drive.files.get({
      fileId: response.data.id,
      fields: "webViewLink",
    });

    console.log(`Uploaded ${fileName}: ${result.data.webViewLink}`);
    return result.data.webViewLink;
  } catch (error) {
    console.error(`Error uploading ${fileName}: ${error.message}`);
    return null;
  }
}

module.exports = uploadFile;
