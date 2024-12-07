import "./App.css";

import Integration from "./components/Integration";
import { KeyboardEvent, useEffect } from "react";

function App() {
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
      <Integration />
    </div>
  );
}

export default App;
