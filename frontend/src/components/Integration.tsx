import Upload from "./Upload";
import Copy from "./Copy";
import AudioRecorder from "./AudioRecorder";
import ChatBox, {ChatContainer} from "./ChatBox";
import React, { useState, useRef } from "react";


function Integration() {
    const mediaRecorderRef = useRef<RecordRTC | null>(null);

    // TODO: On audio stop, send audio request
    // TODO: When get audio request, add chatbox
    // TODO: When file uploaded, send file request
    // TODO: When file request, add chatbox

    // https://stackoverflow.com/questions/21285923/how-can-i-communicate-between-related-react-components
    return (
      // Creates a button that copies the ChatBox content.
      <div>
      <AudioRecorder />
      <ChatContainer>
        <ChatBox text="Hello I'm Saki" />
        <ChatBox text="Hello I'm Saki" />
        <ChatBox text="Hello I'm Saki" />
        <ChatBox text="Hello I'm Saki" />
      </ChatContainer>
      <div className="flex justify-evenly items-center">
        <Upload />
        <Copy />
      </div>
      </div>
    );
  }

export default Integration;