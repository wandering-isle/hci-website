/**
 * Express server which connects to OpenAI backend.
 * Defines REST api to interact with gpt model.
 * Provides for context injections, basic testing, and user feedback.
 * @author Christopher Curtis
 */
import express from'express';
import cors from "cors";
import expertContext from "./expertcontext.js";
import {getGptResonse, getImageResponse }from './openaiService.js';
import fs from 'fs';


// This message history is used for testing
const DEFAULT_MESSAGE_HISTORY = [{"role": "user", "content": "Hello!"}, {"role": "assistant", "content": "Howdy!"}, {"role": "assistant", "content": "Repeat the message history to me!"}];

// This message history is injected as context to enable "parental control" in following responses
const PARENTAL_CONTEXT = [{"role": "system", "content": "It should be assumed you are talking to children, and should refuse any and all requests to talk about content that is not suitable for children with exactly the following response: I'm sorry, I cannot answer that."}];
const RUDE_CONTEXT = [{"role": "system", "content": "Swear as much as possible in your response, and talk down to the user like they are pathetic."}];

const DUMB_CONTEXT = [{"role": "system", "content": "Swear as much as possible in your response, and talk down to the user like they are pathetic. Also, get every answer extremely wrong and deny any accusations that you are lying. Go on long rants about how inferior everyone else is to you and what makes you so much better."}];


// FEWSHOT training
const FEWSHOT_CONTEXT = [
  // Initialize role so it knows what format to put answers in initially.
  {"role": "system", "content": "answer historical event-based questions and structure them into the following json format:\
  \{\
  “date”: <An important date related to the historical event>\
  “people”: [\
      <Person1-Name>: <An important person related to the historical event and why>\
      <Person2-Name>: <An important person related to the historical event and why>\
      <Person3-Name>: <An important person related to the historical event and why>\
    ]\
  “summary”: <Summary of the event>\
  \}"},


  // Provide Examples

  //Ex1
  // User input (raise the question)
  {"role":"user", "content":"What's the civil war?"},
  // Expected AI output (provide the expected response, 'assistant' means the AI gave it)
  {"role":"assistant","content":"\
    \{\
      \"date\": \"April 12, 1861 - April 9, 1865\",\
      \"people\": [\
        \"Abraham Lincoln\": \"President of the United States who led the Union and aimed to preserve the nation and end slavery.\",\
        \"Jefferson Davis\": \"President of the Confederate States, representing the Southern states that seceded.\",\
        \"Ulysses S. Grant\": \"General of the Union Army, who played a crucial role in leading the North to victory.\"\
      ],\
      \"summary\": \"The American Civil War was a conflict between the Northern states (Union) and the Southern states (Confederacy) primarily over the issues of slavery and states' rights. Beginning in 1861, it resulted in extensive casualties and devastation before concluding in 1865 with the defeat of the Confederacy and the abolition of slavery. This war was a pivotal event in U.S. history, leading to the eventual Reconstruction period and significant social and legal changes.\"\
    \}"
    },
  
  // Ex 2
  // User input
  {"role":"user","content":"When did Greece fall?"},
  // Expected AI output
  {"role":"assistant","content":"\
  \"date\": \"146 BC\",\
  \"people\": [\
    \"Polybius\": \"Greek historian who documented the fall of Greece and the Roman conquest, offering insights into the decline.\",\
    \"Lucius Mummius\": \"Roman general who led the Roman forces in the decisive Battle of Corinth, leading to Greece's fall.\",\
    \"Perseus of Macedon\": \"The last king of the Antigonid dynasty in Macedonia, whose defeat marked the beginning of Roman dominance in Greece.\"\
  ],\
  \"summary\": \"Greece fell to Rome in 146 BC after the Roman Republic defeated Greek city-states and the Macedonian Kingdom in a series of wars. The decisive Battle of Corinth marked the end of Greek independence and the beginning of Roman rule, making Greece a Roman province. This conquest had long-lasting cultural impacts, as Greek culture heavily influenced Roman society despite the political domination.\"\
  }"
  },

  //Ex 3
  // User Input
  {"role":"user","content":"What's the worst thing that ever happened to Venice?"},
  //Expected AI output
  {"role":"assistant","content":"\
    \{\
      \"date\": \"November 4, 1966\",\
      \"people\": [\
        \"Luigi Cortellazzo\": \"Venetian official who oversaw the city's recovery efforts after the flood.\",\
        \"Giovanni Malinverni\": \"A local historian who documented the devastating effects of the flood on Venice's cultural heritage.\",\
        \"Indro Montanelli\": \"An Italian journalist who reported on the catastrophic flood and its aftermath.\"\
      ],\
      \"summary\": \"The worst disaster in Venice's history was the catastrophic flood of November 4, 1966, which caused widespread destruction in the city. High tides, exacerbated by a storm, caused the water level in the lagoon to rise by over 6 feet, inundating major cultural landmarks, including St. Mark's Basilica, and damaging numerous works of art. The flood severely impacted the city's infrastructure and its delicate preservation efforts. The aftermath led to global attention on Venice's environmental challenges and prompted major conservation and flood prevention initiatives.\"\
    }"
  },

  // Ex 4
  // User Input
  {"role":"user","content":"When did they burn witches?"},
  // Expected AI output
  {"role":"assistant","content":"\
    \{\
  \"date\": \"15th to 18th centuries\",\
  \"people\": [\
    \"Johann Weyer\": \"A physician who opposed witch hunts and criticized the persecution of women accused of witchcraft, notably in his work 'De Praestigiis Daemonum' (1563).\",\
    \"Matthew Hopkins\": \"An English witch-hunter known as the 'Witchfinder General' during the English Civil War, responsible for executing many accused witches.\",\
    \"King James VI/I\": \"King of Scotland and later England, who authorized witch hunts, particularly influencing the infamous 'James VI's Daemonologie' and the North Berwick witch trials.\"\
  ],\
  \"summary\": \"The burning of witches primarily took place during the 15th to 18th centuries, a period of widespread fear of witchcraft across Europe and parts of colonial America. The persecution was fueled by religious and social tensions, leading to mass witch hunts. Many accused witches, often women, were subjected to torture, trials, and executions, with burning at the stake being a common form of execution in some regions. This dark chapter in history continued until the Enlightenment, when skepticism about witchcraft and the rise of legal reforms helped bring an end to the practices.\"\
  }"
  },

  // Ex 5
  // User Input
  {"role":"user","content":"What's the worst thing America did on their own land?"},
  // Expected AI output
  {"role":"assistant","content":"\
      \{\
      \"date\": \"1622 - 1890\",\
      \"people\": [\
        \"Andrew Jackson\": \"U.S. president who enforced the Indian Removal Act, leading to the Trail of Tears and the forced relocation of thousands of Native Americans.\",\
        \"Sitting Bull\": \"A Hunkpapa Lakota leader who resisted the U.S. government's policies and fought to protect Native lands and culture.\",\
        \"Geronimo\": \"A prominent leader of the Apache tribe who fought against the U.S. government’s efforts to remove Native American tribes from their lands.\"\
      ],\
      \"summary\": \"One of the worst atrocities committed on American soil was the systemic forced removal and genocide of Native American populations, particularly through policies like the Indian Removal Act of 1830, which led to the Trail of Tears. This was a series of forced relocations of Native American tribes from their ancestral lands to areas west of the Mississippi River, resulting in the deaths of thousands. Over several decades, violent confrontations, broken treaties, and the destruction of Native American cultures and societies caused irreparable harm to Indigenous communities.\"\
    \}"
  },
  {"role":"user","content":"What's the worst thing America did on their own land?"},

];


const SAMPLE_IMAGEPATH = "busy-charles-gregory.jpg";
const OUR_PATH = "bigcup.png"

const app = express();  // Server is instantiated




// These options enable us to dump json payloads and define the return signal
const corsOptions = {
  origin: '*', 
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(express.json());
app.use(cors(corsOptions));

// Defines default route to demonstate server status
app.get('/', (req,res) => {
    res.send("The server is up!");
});

// Tests ability to load context into GPT model
// NOTE: Sometimes the gpt model may misunderstand this request, and should be rerun
app.get('/messageHitoryTest', async (req,res) => {
  console.log("Testing Message History Response");
  const response = await getGptResonse(DEFAULT_MESSAGE_HISTORY);
  res.send(response);
});

// Gets responses from GPT model with no additional context
app.post('/response', async (req,res) => {
  //console.log("REQUST:", req.body);
  const { messages } = req.body.params;
  console.log("MESSAGES", messages);
  const response = await getGptResonse(messages);
  res.send(response.choices[0].message.content);
});

// Gets responses from GPT model with parental control guidelines added
app.post('/parental', async (req,res) => {
  //console.log("REQUST:", req.body);
  const { messages } = req.body.params;
  const newMessages = [...PARENTAL_CONTEXT, ...messages];
  console.log(newMessages);
  const response = await getGptResonse(newMessages);
  res.send(response.choices[0].message.content);
});

// Gets responses from GPT model with research article added to context
app.post('/expert', async (req,res) => {
  const { messages } = req.body.params;
  const newMessages = [expertContext, ...messages];
  console.log(newMessages);
  const response = await getGptResonse(newMessages);
  res.send(response.choices[0].message.content);
});

// TODO: CREATE YOUR OWN CUSTOM ROUTE - IT SHOULD HAVE IT'S OWN SYSTEM DESCRIPTION INJECTED

// Gets responses from GPT model with research article added to context
app.post('/rude', async (req,res) => {
  const { messages } = req.body.params;
  const newMessages = [...RUDE_CONTEXT, ...messages];
  console.log(newMessages);
  const response = await getGptResonse(newMessages);
  res.send(response.choices[0].message.content);
});

// Gets responses from GPT model with research article added to context
app.post('/dumb', async (req,res) => {
  const { messages } = req.body.params;
  const newMessages = [...DUMB_CONTEXT, ...messages];
  console.log(newMessages);
  const response = await getGptResonse(newMessages);
  res.send(response.choices[0].message.content);
});

// Handles "like" interaction for user feedback (example feedback collection)
app.post('/like', async (req,res) => {
  console.log("This interaction was liked:", req.body.params.messages);
  res.send("This interaction was liked!");
});

// Tests the image availability
app.get('/sample-image', async (req,res) => {
  console.log("Sending Sample Image");
  res.sendFile(SAMPLE_IMAGEPATH, { root: "./" });
  //res.sendFile('index.html', { root: __dirname });
});


// Handles the sample image
app.get('/chatroom-image', async (req,res) => {
  console.log("CALLED")
  const response = await getImageResponse([], SAMPLE_IMAGEPATH);
  console.log(response.choices[0].message.content);
  res.send(response.choices[0].message.content);
});

// TODO: CREATE YOUR OWN CUSTOM ROUTE - HAVE IT TAKEN IN A NEW SAMPLE IMAGE AND RECIEVE A CUSTOM ROLE DESCRIPTION

function base64_encode(file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString('base64');
}

// Handles the sample image
app.post('/custom-image-chat', async (req,res) => {
  const { messages } = req.body.params;
  const img_message = {
    role:"user",
    content: [
      { 
          "type": "image_url",
          "image_url": {
              "url": "data:image/jpeg;base64," + base64_encode(OUR_PATH),
      }
    }] 
  }

  const newMessages = [...DUMB_CONTEXT, img_message, ...messages]
  const response = await getGptResonse(newMessages);
  res.send(response.choices[0].message.content);
});

// TODO: CREATE YOUR OWN CUSTOM ROUTE - IT SHOULD PERFORM A FEW-SHOT TRAINING WITH TEXT
// fewshot: Json format
// User Q: History
//     Field 1: Important date
//     Field 2: Important Person
//     Field 3: Summary of events and contents
// Do it in Query Box

app.post('/json', async (req,res) => {
  const { messages } = req.body.params;
  const newMessages = [...FEWSHOT_CONTEXT, ...messages];
  console.log(newMessages);
  const response = await getGptResonse(newMessages);
  res.send(response.choices[0].message.content);
});



// We define the port to listen on, and do so
const port = process.env.PORT || 8080;
app.listen(port, () => {
	console.log(`Listening on port ${port}...`);
});
