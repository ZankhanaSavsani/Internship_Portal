const { google } = require("googleapis");
const fs = require("fs");

const auth = new google.auth.GoogleAuth({
  keyFile: "E:/Internship_Management_System/server/apikey.json", // Path to your Service Account JSON key file
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });

const uploadFileToDrive = async (file, folderId) => {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: file.originalname,
        mimeType: file.mimetype,
        parents: [folderId],
      },
      media: {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.path),
      },
    });

    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    return `https://drive.google.com/uc?export=view&id=${response.data.id}`;
  } catch (error) {
    console.error("Error uploading file to Google Drive:", error);
    throw error;
  }
};

const deleteLocalFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) console.error("Error deleting local file:", err);
    else console.log("Local file deleted successfully:", filePath);
  });
};

module.exports = { uploadFileToDrive, deleteLocalFile };