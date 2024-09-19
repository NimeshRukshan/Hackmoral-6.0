````markdown
# Certificate Sender

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-v14.0.0-blue.svg)

**Certificate Sender** is an automated tool designed to generate personalized certificates from an Excel file, upload them to Google Drive, and send each participant their unique certificate link via email. This project streamlines the process of awarding certificates for events, competitions, or courses, saving time and ensuring consistency.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Automated Certificate Generation:** Create personalized PDF certificates using a Canva template and participant data from an Excel file.
- **Google Drive Integration:** Upload generated certificates to a specified Google Drive folder and obtain shareable links.
- **Email Automation:** Send customized emails to participants with their unique certificate download links.
- **Customizable Templates:** Adjust font, size, alignment, and positioning to match your certificate design requirements.
- **Secure Configuration:** Manage sensitive information using environment variables to ensure security.

## Demo

![Certificate Sender Workflow](./assets/workflow.png)

_Illustration of the Certificate Sender workflow: Excel ➔ PDF Generation ➔ Google Drive Upload ➔ Email Delivery_

## Technologies Used

- **Node.js:** JavaScript runtime for executing scripts.
- **pdf-lib:** Library for PDF manipulation.
- **xlsx:** Library to read Excel files.
- **Nodemailer:** Module for sending emails.
- **Google APIs:** Integration with Google Drive for file uploads.
- **dotenv:** Module to manage environment variables.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js & npm:** Ensure Node.js (v14 or higher) and npm are installed on your machine.
  - [Download Node.js](https://nodejs.org/)
- **Google Cloud Account:** Access to Google Cloud Console to set up Google Drive API.
- **Gmail Account:** For sending emails via Nodemailer (preferably with App Passwords for security).
- **Excel File:** An `.xlsx` file containing participant names and email addresses.
- **Canva Template:** A PDF certificate template downloaded from Canva.
- **Custom Font:** The `.ttf` file for the desired certificate font.

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/certificate-sender.git
   cd certificate-sender
   ```
````

2. **Install Dependencies:**

   ```bash
   npm install
   ```

## Configuration

### 1. Google Drive API Setup

To enable Google Drive integration, follow these steps:

1. **Create a Google Cloud Project:**

   - Navigate to the [Google Cloud Console](https://console.cloud.google.com/).
   - Create a new project or select an existing one.

2. **Enable Google Drive API:**

   - Go to **APIs & Services > Library**.
   - Search for **Google Drive API** and enable it.

3. **Create Service Account Credentials:**

   - Navigate to **APIs & Services > Credentials**.
   - Click **Create Credentials > Service Account**.
   - Fill in the required details and proceed.
   - After creating, select the service account and navigate to **Keys**.
   - Click **Add Key > Create New Key** in JSON format.
   - Download the `credentials.json` file and place it in the project root.

4. **Share Google Drive Folder with Service Account:**

   - In Google Drive, create a folder (e.g., `HackMoral6.0 Certificates`).
   - Share this folder with the service account's email (found in `credentials.json`) with **Editor** permissions.

### 2. Environment Variables

Create a `.env` file in the project root to store sensitive information:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password-or-app-specific-password
CERTIFICATES_FOLDER_ID=your-google-drive-folder-id
```

- **EMAIL_USER:** Your Gmail address used to send emails.
- **EMAIL_PASS:** Your Gmail password or an [App Password](https://support.google.com/accounts/answer/185833) if using two-factor authentication.
- **CERTIFICATES_FOLDER_ID:** The ID of the Google Drive folder where certificates will be uploaded. You can find this in the folder's URL (`https://drive.google.com/drive/folders/YOUR_FOLDER_ID`).

**_Note:_** Ensure that `.env` and `credentials.json` are added to `.gitignore` to prevent sensitive data from being pushed to version control.

### 3. Project Structure

Ensure your project directory looks like this:

```
certificate-sender/
├── certificates/               # Generated certificates
├── fonts/
│   └── Singel.ttf              # Your custom font file
├── assets/
│   └── workflow.png            # (Optional) Workflow illustration
├── certificate-template.pdf    # Your Canva PDF template
├── credentials.json            # Google Service Account credentials
├── participants.xlsx           # Excel file with participant data
├── .env                        # Environment variables
├── .gitignore                  # Git ignore file
├── generateCertificates.js     # Script to generate certificates
├── uploadToDrive.js            # Script to upload certificates to Google Drive
├── sendEmails.js               # Script to send emails with certificate links
├── readExcel.js                # Module to read Excel data
├── index.js                    # Master script to automate the workflow
├── package.json
└── README.md
```

## Usage

### 1. Prepare Participant Data

Ensure your Excel file (`participants.xlsx`) is formatted correctly:

| Name          | Email             |
| ------------- | ----------------- |
| Alice Johnson | alice@example.com |
| Bob Smith     | bob@example.com   |
| ...           | ...               |

- **Headers:** The first row should contain headers like `Name` and `Email`.
- **Sheet Name:** By default, the script reads from `Sheet1`. Ensure your data is on this sheet or update the script accordingly.

### 2. Generate Certificates

Run the certificate generation script to create personalized PDFs:

```bash
node generateCertificates.js
```

This will create a `certificates/` directory containing PDFs named after each participant (e.g., `Alice_Johnson.pdf`).

### 3. Upload Certificates to Google Drive

Ensure that the `credentials.json` is correctly placed and the `CERTIFICATES_FOLDER_ID` is set in the `.env` file.

### 4. Send Emails

Run the email sending script to distribute certificates:

```bash
node sendEmails.js
```

Each participant will receive an email with a link to download their certificate.

### 5. Automate the Entire Workflow

For a streamlined process, use the master script:

```bash
node index.js
```

This script will:

1. Generate personalized certificates.
2. Upload them to Google Drive.
3. Send personalized emails with download links.

## Project Structure

```
certificate-sender/
├── certificates/               # Generated certificates
├── fonts/
│   └── Singel.ttf              # Your custom font file
├── assets/
│   └── workflow.png            # (Optional) Workflow illustration
├── certificate-template.pdf    # Your Canva PDF template
├── credentials.json            # Google Service Account credentials
├── participants.xlsx           # Excel file with participant data
├── .env                        # Environment variables
├── .gitignore                  # Git ignore file
├── generateCertificates.js     # Script to generate certificates
├── uploadToDrive.js            # Script to upload certificates to Google Drive
├── sendEmails.js               # Script to send emails with certificate links
├── readExcel.js                # Module to read Excel data
├── index.js                    # Master script to automate the workflow
├── package.json
└── README.md
```

## Troubleshooting

- **Certificate Not Found Error:**

  - Ensure that `generateCertificates.js` has successfully created all certificates in the `certificates/` directory before running the upload and email scripts.

- **Google Drive Upload Issues:**

  - Verify that the service account has the necessary permissions to access and upload files to the specified Google Drive folder.
  - Ensure that `credentials.json` is correctly placed and that the `CERTIFICATES_FOLDER_ID` is accurate.

- **Email Sending Issues:**

  - Confirm that your email credentials in the `.env` file are correct.
  - If using Gmail, ensure that [App Passwords](https://support.google.com/accounts/answer/185833) are set up if two-factor authentication is enabled.

- **Font Embedding Issues:**

  - Ensure that the font file (`Singel.ttf`) is correctly placed in the `fonts/` directory.
  - Verify that the font name in the script matches the actual font file.

- **Excel Reading Issues:**
  - Ensure that the Excel file (`participants.xlsx`) is correctly formatted with headers matching the script's expectations (`Name`, `Email`).
  - Verify the sheet name (`Sheet1`) or update it in the scripts if different.

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the Repository**

2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/YourFeatureName
   ```

3. **Commit Your Changes**

   ```bash
   git commit -m "Add some feature"
   ```

4. **Push to the Branch**

   ```bash
   git push origin feature/YourFeatureName
   ```

5. **Open a Pull Request**

## License

This project is licensed under the [MIT License](LICENSE).

---

> **Note:** Ensure that you handle all sensitive information securely. Never commit your `.env` or `credentials.json` files to version control.

```

```
