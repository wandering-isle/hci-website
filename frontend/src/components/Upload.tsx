import { ChangeEvent, useState, useRef } from "react";
import { createFileService } from "../services/backend-service";
import { AiOutlineFile, AiOutlineFileAdd } from "react-icons/ai";

function Upload() {
  const [file, setFile] = useState<File>();
  const uploadRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }

    // Check whether to create an upload button on click
    if (!document.getElementById("upload_click")) {
      // Only if no upload already exists
      let upload_section = document.getElementById("upload_div");
      if (upload_section) {
        // Create upload button
        let new_button = document.createElement("button");
        new_button.id = "upload_click";
        new_button.onclick = handleUploadClick;
        new_button.textContent = "Upload";
        upload_section.appendChild(new_button);
      }
    }
  };

  // How to respond if a file is uploaded
  const handleUploadClick = () => {
    if (!file) {
      return;
    }

    let formData = new FormData();
    formData.append("file",file);
    // Send the file to the server to be cleaned
    const { request, cancel } = createFileService().post({ body: formData });
    // Update the text box
    request.then((res) => UpdateText(res.data)); // UpdateText does not exist yet.
  };

  return (
    // Create the grouping to contain upload file and submit file.
    /* <div for grouping
          <label for section>
          <button to add a new file> This triggers the hidden input
          <actual file input> hidden so this works with a button press
       >
    */
    <div
      id="upload_div"
      className="flex flex-row items-center space-x-4 p-4"
    >
      <label className="text-gray-700 font-medium">Upload a file:</label>

      <button
        onClick={() => uploadRef.current?.click()}
        className="flex flex-row items-center px-6 py-3 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <AiOutlineFileAdd size={20} />
        <span className="ml-2">{file ? `${file.name}` : "Select File"}</span>
      </button>

      <input
        ref={uploadRef}
        type="file"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
}

export default Upload;
