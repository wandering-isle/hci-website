# CS5170-HCI-FINAL

## Overview
This is the final project for the CS5170 course. The application integrates various functionalities, including audio transcription, text correction using OpenAI's GPT, and file uploads for processing.

## Installation
To set up the project, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone git@github.com:wandering-isle/hci-website.git
   cd hci-website
   ```

2. **Install dependencies**:
   Navigate to both the frontend and server folders and run:
   ```bash
   npm install
   ```

3. **Install additional packages**:
   Enter the server folder and run:
   ```bash
   npm install -g nodemon
   npm install -D tailwindcss postcss autoprefixer vite multer
   ```

4. **Set up environment variables**:
   Enter your OpenAI API key in the server/openaiService.js file.

## Running the Application
1. **Start the server**:
   From the server folder, run:
   ```bash
   nodemon index.js
   ```

2. **Start the frontend**:
   Open a new terminal window, navigate to the frontend folder, and run:
   ```bash
   npm run dev
   ```

## Usage
- **Audio Recording**: Click the "Start Recording" button to begin recording audio. Click "Stop Recording" to finish. The transcribed text will be displayed after processing.
- **File Upload**: Use the "Upload a file" button to select and upload a text or audio file. The application will process the file and return the corrected content.

## Acknowledgments
- [OpenAI](https://openai.com/) for providing the GPT API.
- [Microsoft Cognitive Services](https://azure.microsoft.com/en-us/services/cognitive-services/speech-to-text/) for audio transcription capabilities.
- [Tailwind CSS](https://tailwindcss.com/) for styling the frontend.
