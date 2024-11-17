import express from'express';
import cors from "cors";
import fs from 'fs';

const app = express();  // Server is instantiated

// We define the port to listen on, and do so
const port = process.env.PORT || 8080;
app.listen(port, () => {
	console.log(`Listening on port ${port}...`);
});
