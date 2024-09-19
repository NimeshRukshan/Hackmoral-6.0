const XLSX = require("xlsx");
const path = require("path");

function readParticipantsFromExcel(filePath, sheetName = "Sheet1") {
  try {
    const workbook = XLSX.readFile(path.resolve(__dirname, filePath));
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);
    return jsonData; // Array of objects with keys as headers
  } catch (error) {
    console.error(`Error reading Excel file: ${error}`);
    return [];
  }
}

module.exports = readParticipantsFromExcel;
