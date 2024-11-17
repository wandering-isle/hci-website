import "./App.css";

import QueryBox from "./components/QueryBox";
import QueryForm from "./components/QueryForm";
import ChatRoom from "./components/ChatRoom";
import Upload from "./components/Upload";
import Copy from "./components/Copy";
import AudioRecorder from "./components/AudioRecord";

import useImage from "./hooks/useImage";
import useText from "./hooks/useText";
import { useEffect } from "react";
import ImageCaptionDisplay from "./components/ImageCaptionDisplay";

function App() {
  const { image, imgError, imgIsLoading } = useImage("");
  const { text, textError, textIsLoading } = useText("", "chatroom-image");

  useEffect(() => {
    console.log(text);
  }, [text]);

  return (
    <div>
      {(imgIsLoading || textIsLoading) && <div className="spinner-border" />}
      <AudioRecorder />
      <ChatRoom />
      <div className="uploadAndCopy"> <Upload /> <Copy />
      </div>
      <br />
      
      
    </div>
  );
}

export default App;
