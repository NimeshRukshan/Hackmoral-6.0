const readParticipantsFromExcel = require("./readExcel");
const generateCertificate = require("./generateCertificates");
const uploadFile = require("./uploadToDrive");
const sendEmails = require("./sendEmails");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const PARTICIPANTS_EXCEL = "participants-sample.xlsx";
const SHEET_NAME = "Sheet1";

(async () => {
  try {
    // Read participants from Excel
    const participants = readParticipantsFromExcel(
      PARTICIPANTS_EXCEL,
      SHEET_NAME
    );
    if (!participants || participants.length === 0) {
      throw new Error(
        "No participants found or failed to load data from Excel."
      );
    }
    console.log(`Processing ${participants.length} participants.`);

    let allSuccess = true;

    // Process each participant
    for (const participant of participants) {
      const name = participant.Name;
      const email = participant.Email;

      try {
        // Step 1: Generate Certificate
        const certificatePath = await generateCertificate(participant);
        if (!certificatePath) {
          throw new Error(`Failed to generate certificate for ${name}.`);
        }

        // Step 2: Upload to Google Drive
        const certificateLink = await uploadFile(
          certificatePath,
          `${name}.pdf`
        );
        if (!certificateLink) {
          throw new Error(`Failed to upload certificate for ${name}.`);
        }

        // Step 3: Send Email
        const emailResult = await sendEmails(email, name, certificateLink);
        if (!emailResult) {
          throw new Error(`Failed to send email to ${name}.`);
        }
      } catch (participantError) {
        console.error(participantError.message);
        allSuccess = false;
        continue; // Continue to the next participant
      }
    }

    if (allSuccess) {
      console.log(
        "All certificates generated, uploaded, and emails sent successfully."
      );
    } else {
      console.log("Some certificates were not processed successfully.");
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
})();
