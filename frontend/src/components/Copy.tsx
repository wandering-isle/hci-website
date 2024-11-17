import { ChangeEvent, useState } from "react";
import { createFileService } from "../services/backend-service";

function Copy() {
  const [file, setFile] = useState<File>();

  const copyTextBoxes = () => {
    // TODO: Scrape the text versions of all the text and return it.
    // Requires text boxes to exist
    navigator.clipboard.writeText("SOMEBODY MAKE ME SOME TEXT BOXES!!");
  };

  return (
    <div className="flex justify-center my-6">
      <button
        onClick={copyTextBoxes}
        className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Copy Transcript
      </button>
    </div>
  );
}

export default Copy;
