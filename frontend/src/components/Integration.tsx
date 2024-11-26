import Upload from "./Upload";
import Copy from "./Copy";
import AudioRecorder from "./AudioRecorder";
import ChatBox, {ChatContainer} from "./ChatBox";

function Integration() {
  
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