import express from'express';
import cors from "cors";
import fs from 'fs';

import sdk from 'microsoft-cognitiveservices-speech-sdk' // audio->text

const CORRECTIVE_CONTEXT = [{"role": "system", "content": "The following text may have incorrect words. Replace any words with more likely words based on context."}]

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



// The actual post request for image and audio GPT processing
app.post("/audio", async (req, res) => {

	if (req.body.params.content) {
		res.send({"content":"Test audio content"})
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
