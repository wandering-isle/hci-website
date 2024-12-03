// import { ChangeEvent, useState, useRef } from "react";
// import { createFileService } from "../services/backend-service";
// import { AiOutlineFile, AiOutlineFileAdd } from "react-icons/ai";

// function Upload() {
//   const [file, setFile] = useState<File>();
//   const uploadRef = useRef<HTMLInputElement | null>(null);

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setFile(e.target.files[0]);
//     }

//     // Check whether to create an upload button on click
//     if (!document.getElementById("upload_click")) {
//       // Only if no upload already exists
//       let upload_section = document.getElementById("upload_div");
//       if (upload_section) {
//         // Create upload button
//         let new_button = document.createElement("button");
//         new_button.id = "upload_click";
//         new_button.onclick = handleUploadClick;
//         new_button.textContent = "Upload";
//         upload_section.appendChild(new_button);
//       }
//     }
//   };
//   // How to respond if a file is uploaded
//   const handleUploadClick = () => {
//     if (!file) {
//       return;
//     }

//     let formData = new FormData();
//     formData.append("file",file);
//     // Send the file to the server to be cleaned
//     const { request, cancel } = createFileService().post({ body: formData });
//     // Update the text box
//     request.then((res) => UpdateText(res.data)); // UpdateText does not exist yet.
//   };

//   return (
//     // Create the grouping to contain upload file and submit file.
//     /* <div for grouping
//           <label for section>
//           <button to add a new file> This triggers the hidden input
//           <actual file input> hidden so this works with a button press
//        >
//     */
//     <div
//       id="upload_div"
//       className="flex flex-row items-center space-x-4 p-4"
//     >
//       <label className="text-gray-700 font-medium">Upload a file:</label>

//       <button
//         onClick={() => uploadRef.current?.click()}
//         className="flex flex-row items-center px-6 py-3 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
//       >
//         <AiOutlineFileAdd size={20} />
//         <span className="ml-2">{file ? `${file.name}` : "Select File"}</span>
//       </button>

//       <input
//         ref={uploadRef}
//         type="file"
//         onChange={handleFileChange}
//         style={{ display: "none" }}
//       />
//     </div>
//   );
// }

// export default Upload;

import { ChangeEvent, useState, useRef } from "react";
import { AiOutlineFileAdd } from "react-icons/ai";

function Upload() {
  const [file, setFile] = useState<File | null>(null); // Track selected file
  const [responseText, setResponseText] = useState<string>(""); // Track server response
  const uploadRef = useRef<HTMLInputElement | null>(null);

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]); // Set the selected file
      setResponseText(""); // Reset response when new file is selected
    }
  };

  // Handle file upload
  const handleUploadClick = async () => {
    if (!file) {
      alert("Please select a file before uploading.");
      return;
    }
  
    console.log("Selected file details:", file.name, file.type); // Log file name and type
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await fetch("http://localhost:8080/file", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorMessage}`);
      }
  
      const data = await response.json();
      console.log("File uploaded successfully:", data);
      setResponseText(data.content);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(`An error occurred while uploading the file: ${error.message}`);
    }
  };
  
  return (
    <div className="flex flex-col items-start space-y-4 p-4">
      <div className="flex flex-row items-center space-x-4">
        <label className="text-gray-700 font-medium">Upload a file:</label>

        {/* Trigger File Selection */}
        <button
          onClick={() => uploadRef.current?.click()}
          className="flex flex-row items-center px-6 py-3 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <AiOutlineFileAdd size={20} />
          <span className="ml-2">{file ? file.name : "Select File"}</span>
        </button>

        {/* Hidden Input for File Selection */}
        <input
          ref={uploadRef}
          type="file"
          accept=".webm,.txt" // Restrict allowed file types
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      {/* Upload Button */}
      {file && (
        <button
          onClick={handleUploadClick}
          className="px-6 py-3 bg-green-500 text-white rounded-md shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          Upload
        </button>
      )}

      {/* Display Response */}
      {responseText && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Response:</h3>
          <textarea
            value={responseText}
            readOnly
            className="w-full p-2 border border-gray-300 rounded-md"
          ></textarea>
        </div>
      )}
    </div>
  );
}

export default Upload;
