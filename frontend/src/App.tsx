import "./App.css";


import Upload from "./components/Upload";
import Copy from "./components/Copy";
import AudioRecorder from "./components/AudioRecorder";
import Integration from "./components/Integration";

import useImage from "./hooks/useImage";
import useText from "./hooks/useText";
import { KeyboardEvent, useEffect } from "react";

import ChatBox, { ChatContainer } from "./components/ChatBox";

function App() {
  const { image, imgError, imgIsLoading } = useImage("");
  const { text, textError, textIsLoading } = useText("", "chatroom-image");

  useEffect(() => {
    console.log(text);
  }, [text]);


  // Function for on key press
  // Start/Stop Audio Recording
  let keyPress = (event:KeyboardEvent) => {

    // TODO: Please use better class names than just the CSS??
    // should be like getByClass('text-edit-box'), checks whether currently trying to edit text
    // That way it won't try to record while editing.
    if (document.getElementsByClassName("flex-grow border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300").length == 0) {
      // Get the recorder button and CLICK IT\
      if (event.key != "Enter" && event.key != "Tab") {
        console.log(event.key)
        document.getElementById("recorderButton")?.click();
      }
    } 
  }
    

  // Set it to only activate once per key press
  useEffect(() => {
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  });

  


  return (
    <div>
      {(imgIsLoading || textIsLoading) && <div className="spinner-border" />}
      <Integration />
    </div>
  );
}

export default App;
