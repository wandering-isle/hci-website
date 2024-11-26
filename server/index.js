import express from'express';
import cors from "cors";
import fs from 'fs';

const app = express();  // Server is instantiated

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
