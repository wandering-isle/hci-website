import Upload from "./Upload";
import Copy from "./Copy";
import AudioRecorder from "./AudioRecorder";
import ChatBox, {ChatContainer} from "./ChatBox";
import { useState, useRef } from "react";


function Integration() {

    const [transcriptions, setTranscriptions] = useState<string[]>([]);

    const handleAddTranscription = (newTranscription: string) => {
      /**
       * Allows the creation of new transcription boxes between different React elements
       *  newTranscription: The text to be added to the transcription.
       */
      setTranscriptions((prev) => {
        const updated = [...prev, newTranscription];
        return updated;
      });
    };

    const handleDeleteTranscription = (index: number) => {
      /**
       * Deletes a transcription textbox.
       */
      setTranscriptions((prev) => prev.filter((_, i) => i !== index));
    };

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
        <Upload onAddTranscription={handleAddTranscription}/>
        <Copy transcriptions={transcriptions}/>
      </div>
    </div>
    );
  }

export default Integration;