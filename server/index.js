import express from'express';
import cors from "cors";
import fs from 'fs';
import {getGptResonse }from './openaiService.js';

import sdk from 'microsoft-cognitiveservices-speech-sdk' // audio->text

const CORRECTIVE_CONTEXT = [{"role": "system", "content": "The following text may have incorrect words. Replace any words with more likely words based on context."}]

var counter = 0;

const app = express();  // Server is instantiated

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
		let callback = (text) => {
			console.log(text);
			//let reply = getCorrectiveResponse(text);
			res.send({"content":text})
		}

		audioToText(req.body.params.content, callback);
		
	} else {
		res.send({"content":"Failed to interpret"})
	}
});

// The actual post request for image and audio GPT processing
app.post("/file", async (req, res) => {
	// TODO: Identify if text or audio
	// For text, read file and return content
	// For audio, convert into text, then return
	if (req.body.params.content && req.body.params.type) {
		res.send({"content":"Test FILE content"})
	} else {
		res.send({"content":"Failed to interpret"})
	}
});

// We define the port to listen on, and do so
const port = process.env.PORT || 8080;
app.listen(port, () => {
	console.log(`Listening on port ${port}...`);
});
