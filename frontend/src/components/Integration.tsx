import Upload from "./Upload";
import Copy from "./Copy";
import AudioRecorder from "./AudioRecorder";
import ChatBox, {ChatContainer} from "./ChatBox";
import React, { useState, useRef } from "react";


function Integration() {
    const mediaRecorderRef = useRef<RecordRTC | null>(null);

    const [transcriptions, setTranscriptions] = useState<string[]>([]);

    const handleAddTranscription = (newTranscription: string) => {
      setTranscriptions((prev) => {
        const updated = [newTranscription, ...prev];
        return updated;
      });
    };

    const handleDeleteTranscription = (index: number) => {
      setTranscriptions((prev) => prev.filter((_, i) => i !== index));
    };

    // TODO: On audio stop, send audio request
    // TODO: When get audio request, add chatbox
    // TODO: When file uploaded, send file request
    // TODO: When file request, add chatbox

    // https://stackoverflow.com/questions/21285923/how-can-i-communicate-between-related-react-components
    return (
      // Creates a button that copies the ChatBox content.
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Adds vertical spacing between components */}
      <div>
        <AudioRecorder onAddTranscription={handleAddTranscription} />
      </div>
      <div>
        <ChatContainer>
          {transcriptions.map((text, index) => (
            <ChatBox
            key={`${text}-${index}`}
            text={text}
            index={index}
            onDeleteChat={handleDeleteTranscription}
          />
          ))}
        </ChatContainer>
      </div>
      <div style={{ display: "flex", justifyContent: "space-evenly", gap: "16px" }}>
        {/* Adds horizontal spacing between Upload and Copy */}
        <Upload />
        <Copy transcriptions={transcriptions}/>
      </div>
    </div>
    );
  }

export default Integration;