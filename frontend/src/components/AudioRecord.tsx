import React, { useState, useRef } from "react";

const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false); // To track recording state
  const mediaRecorderRef = useRef<MediaRecorder | null>(null); // To manage MediaRecorder
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]); // To store recorded audio
  const [audioUrl, setAudioUrl] = useState<string | null>(null); // To save and preview audio

  const handleToggleRecording = async () => {
    if (!isRecording) {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);

        // Create a Blob from recorded audio chunks
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const audioPreviewUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioPreviewUrl); // Save audio for preview or download
      }
    }
  };

  return (
    <div className="audio-recorder">
      <h3>Audio Recorder</h3>
      <button onClick={handleToggleRecording}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>

      {audioUrl && (
        <div>
          <h4>Recorded Audio:</h4>
          <audio controls>
            <source src={audioUrl} type="audio/webm" />
            Your browser does not support the audio element.
          </audio>
          <br />
          <a href={audioUrl} download="recording.webm">
            Download Audio
          </a>
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