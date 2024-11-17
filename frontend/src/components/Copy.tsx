import { ChangeEvent, useState } from 'react';
import { createFileService } from '../services/backend-service';

function Copy() {
  const [file, setFile] = useState<File>();

  const copyTextBoxes = () => {
    // TODO: Scrape the text versions of all the text and return it.
    // Requires text boxes to exist
    navigator.clipboard.writeText("SOMEBODY MAKE ME SOME TEXT BOXES!!")
  };



  return (
    <div>
      <button onClick={copyTextBoxes}>Copy Transcript</button>
    </div>
  );
}

export default Copy;