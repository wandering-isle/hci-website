import express from'express';
import cors from "cors";
import fs from 'fs';
import {getGptResonse }from './openaiService.js';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';


import sdk from 'microsoft-cognitiveservices-speech-sdk' // audio->text

const CORRECTIVE_CONTEXT = [{"role": "system", "content": "This text was transcribed from speech. It may be imperfect, so correct any words that most likely were misheard. Make as few changes as possible. Do not say anything other than the corrected sentence."}]

var counter = 0;

const app = express();  // Server is instantiated

const upload = multer({ dest: 'uploads/' });

// These options enable us to dump json payloads and define the return signal
const corsOptions = {
	origin: '*', 
	credentials: true,
	optionSuccessStatus: 200,
  }
  
// Allow for large requests so audio and images can be sent to server
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({limit:'50mb'}));
app.use(cors(corsOptions));


async function getCorrectiveResponse(text) {
	const newMessages = [...CORRECTIVE_CONTEXT,
 		{role: "user", content: text}
	]
	const response = await getGptResonse(newMessages);
	console.log(response.choices[0].message);
	return response.choices[0].message.content;
}

const speechConfig = sdk.SpeechConfig.fromSubscription("8186be822a5d456f9653c5f5303f055d", "eastus");

const audioToText = async(audio_url, callback) => {
	//console.log("audio called");

	counter += 1;
	let cur_count = counter;
	var b64_audio = audio_url.replace("data:audio/wav;base64,", "");
	// Write the audio to a file
	fs.writeFileSync("audio_out_"+cur_count+".wav", b64_audio, 'base64', function(err) {
		console.log(err);
	});

	// Read the file in Azure's speech recognizer
	// Yes it has to do this
	let audioConfig = sdk.AudioConfig.fromWavFileInput(fs.readFileSync("audio_out_"+cur_count+".wav"));
	let speechRecognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
	console.log("starting recog");
	speechRecognizer.recognizeOnceAsync(async result => {
		fs.unlinkSync("audio_out_"+cur_count+".wav");
		console.log("Recog done");
		switch (result.reason) {
			case sdk.ResultReason.RecognizedSpeech:
				// If success:
				console.log(`RECOGNIZED: Text=${result.text}`);
				callback(result.text);
				break;
			// For all other cases, don't return a proper response.
			case sdk.ResultReason.NoMatch:
				console.log("NOMATCH: Speech could not be recognized.");
				callback("No match.");
				break;
			case sdk.ResultReason.Canceled:
				const cancellation = sdk.CancellationDetails.fromResult(result);
				console.log(`CANCELED: Reason=${cancellation.reason}`);
	
				if (cancellation.reason == sdk.CancellationReason.Error) {
					console.log(`CANCELED: ErrorCode=${cancellation.ErrorCode}`);
					console.log(`CANCELED: ErrorDetails=${cancellation.errorDetails}`);
					console.log("CANCELED: Did you set the speech resource key and region values?");
					
				}
				callback("Service Error");
				break;
		}
		speechRecognizer.close();	
	});

};

// The actual post request for image and audio GPT processing
app.post("/audio", async (req, res) => {
	
	if (req.body.params.content) {
		let callback = async (text) => {
			console.log(text);
			let reply = await getCorrectiveResponse(text);
			res.send({"content":reply})
		}

		audioToText(req.body.params.content, callback);
		
	} else {
		res.send({"content":"Failed to interpret"})
	}
});

app.post("/file", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }
    const filePath = req.file.path; // The uploaded file's path
    const fileType = req.file.mimetype; // The uploaded file's MIME type
    console.log("Uploaded file details:", req.file);
    console.log("File MIME type:", fileType);
    // Handle Text Files
    if (fileType === "text/plain" || fileType === "text/csv") {
        fs.readFile(filePath, "utf8", async (err, data) => {
            fs.unlinkSync(filePath); // Clean up the file
            if (err) {
                console.error("Error reading text file:", err);
                return res.status(500).send("Error processing text file.");
            }
            // Send the text to GPT for correction
            try {
                const correctedResponse = await getCorrectiveResponse(data);
                res.json({ content: correctedResponse });
            } catch (error) {
                console.error("Error processing corrective response:", error);
                res.status(500).send("Error correcting text file.");
            }
        });
    }
    // Handle Audio/WebM Files
    else if (
        fileType === "audio/webm" ||
        fileType === "video/webm" ||
        fileType.startsWith("audio/")
    ) {
        const wavPath = `${filePath}.wav`;
        ffmpeg(filePath)
            .toFormat("wav")
            .on("end", () => {
                fs.unlinkSync(filePath); // Clean up original file
                const wavFile = fs.readFileSync(wavPath);
                const wavBase64 = wavFile.toString("base64");
                const audio_url = `data:audio/wav;base64,${wavBase64}`;
                // Use the audioToText function
                audioToText(audio_url, async (text) => {
                    fs.unlinkSync(wavPath); // Clean up WAV file
                    // Pass the raw transcript to GPT for correction
                    try {
                        const correctedResponse = await getCorrectiveResponse(text);
                        res.json({ content: correctedResponse });
                    } catch (error) {
                        console.error("Error processing corrective response:", error);
                        res.status(500).send("Error correcting audio file.");
                    }
                });
            })
            .on("error", (err) => {
                console.error("Error converting audio:", err);
                res.status(500).send("Error processing audio file.");
            })
            .save(wavPath);
    }
    // Handle Unsupported File Types
    else {
        console.error("Unsupported file type:", fileType);
        fs.unlinkSync(filePath); // Clean up unsupported files
        res.status(400).send(`Unsupported file type: ${fileType}`);
    }
});
  
// We define the port to listen on, and do so
const port = process.env.PORT || 8080;
app.listen(port, () => {
	console.log(`Listening on port ${port}...`);
});
