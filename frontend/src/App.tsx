import "./App.css";

import QueryBox from "./components/QueryBox";
import QueryForm from "./components/QueryForm";
import ChatRoom from "./components/ChatRoom";
import Upload from "./components/Upload";
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
      <ChatRoom />
      <div> <Upload />
      </div>
      <br />
      
      
    </div>
  );
}

export default App;
