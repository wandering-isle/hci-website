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
