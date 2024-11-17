import React, { useState, useRef } from "react";

const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false); // To track recording state
  const mediaRecorderRef = useRef<MediaRecorder | null>(null); // To manage MediaRecorder
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]); // To store recorded audio
  const [audioUrl, setAudioUrl] = useState<string | null>(null); // To save and preview audio
  const [transcriptions, setTranscriptions] = useState<string[]>([]); // State for transcriptions
  const [currentTranscript, setCurrentTranscript] = useState(""); // State for current transcript input

  const handleToggleRecording = async () => {
    if (!isRecording) {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        setAudioChunks([]); // Reset audio chunks

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setAudioChunks((prev) => [...prev, event.data]);
          }
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        console.error("Error accessing microphone:", error);
        alert("Please allow microphone access to record audio.");
      }
    } else {
      // Stop recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
        setIsRecording(false);

        // Create a Blob from recorded audio chunks
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const audioPreviewUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioPreviewUrl); // Save audio for preview or download
      }
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Audio Recorder
      </h3>
      <button
        onClick={handleToggleRecording}
        className={`px-4 py-2 items-center rounded-md text-white font-medium ${
          isRecording
            ? "bg-red-500 hover:bg-red-600"
            : "bg-blue-500 hover:bg-blue-600"
        } focus:outline-none focus:ring focus:ring-offset-2 ${
          isRecording ? "focus:ring-red-400" : "focus:ring-blue-400"
        }`}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>

      {audioUrl && (
        <div className="mt-6">
          <h4 className="text-lg font-medium text-gray-700 mb-2">
            Recorded Audio:
          </h4>
          <audio controls className="w-full">
            <source src={audioUrl} type="audio/webm" />
            Your browser does not support the audio element.
          </audio>
          <div className="mt-4">
            <a
              href={audioUrl}
              download="recording.webm"
              className="inline-block px-4 py-2 text-sm font-medium text-blue-500 hover:text-blue-600 underline"
            >
              Download Audio
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;

// import React, { useState, useRef } from "react";

// const AudioRecorder: React.FC = () => {
//   const [isRecording, setIsRecording] = useState(false);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
//   const [audioUrl, setAudioUrl] = useState<string | null>(null);
//   const [uploadMessage, setUploadMessage] = useState<string>("");

//   const handleToggleRecording = async () => {
//     if (!isRecording) {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
//         mediaRecorderRef.current = mediaRecorder;
//         setAudioChunks([]);

//         mediaRecorder.ondataavailable = (event) => {
//           if (event.data.size > 0) {
//             setAudioChunks((prev) => [...prev, event.data]);
//           }
//         };

//         mediaRecorder.start();
//         setIsRecording(true);
//       } catch (error) {
//         console.error("Microphone access error:", error);
//         alert("Please allow microphone access to record audio.");
//       }
//     } else {
//       if (mediaRecorderRef.current) {
//         mediaRecorderRef.current.stop();
//         mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
//         setIsRecording(false);

//         const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
//         const audioPreviewUrl = URL.createObjectURL(audioBlob);
//         setAudioUrl(audioPreviewUrl);
//       }
//     }
//   };

//   const handleUpload = async () => {
//     if (!audioUrl) {
//       alert("Please record audio before uploading!");
//       return;
//     }

//     const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
//     const formData = new FormData();
//     formData.append("audio", audioBlob, "recording.webm");

//     try {
//       const response = await fetch("http://localhost:5000/upload", {
//         method: "POST",
//         body: formData,
//       });

//       if (response.ok) {
//         const result = await response.json();
//         setUploadMessage("Upload successful!");
//         console.log("Server response:", result);
//       } else {
//         setUploadMessage("Upload failed!");
//         console.error("Upload error:", await response.text());
//       }
//     } catch (error) {
//       setUploadMessage("Upload failed!");
//       console.error("Error uploading audio:", error);
//     }
//   };

//   return (
//     <div>
//       <h3>Audio Recorder</h3>
//       <button onClick={handleToggleRecording}>
//         {isRecording ? "Stop Recording" : "Start Recording"}
//       </button>
//       {audioUrl && (
//         <div>
//           <h4>Recorded Audio:</h4>
//           <audio controls src={audioUrl}></audio>
//           <br />
//           <button onClick={handleUpload}>Upload Audio</button>
//           {uploadMessage && <p>{uploadMessage}</p>}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AudioRecorder;
