import React, { useState, useRef } from "react";
import RecordRTC from 'recordrtc';
import { createAudioService } from "../services/backend-service";

// Function to convert a Blob to a Base64 string or ArrayBuffer
const convertBlob = async (blob:Blob) => {
  return new Promise<string | ArrayBuffer | null>((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.readAsDataURL(blob)
  });
}

// AudioRecorder component for recording and transcribing audio
const AudioRecorder: React.FC <{ onAddTranscription: (text: string) => void }> = ({ onAddTranscription }) => {
  const [isRecording, setIsRecording] = useState(false); // to track recording state
  const mediaRecorderRef = useRef<RecordRTC | null>(null); // to manage MediaRecorder
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]); // to store recorded audio
  const [audioUrl, setAudioUrl] = useState<string | null>(null); // to save and preview audio

  // Function to handle starting and stopping the recording
  const handleToggleRecording = async () => {
    if (!isRecording) {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        
        // Prepare to record audio as WAV
        const mediaRecorder = new RecordRTC(stream, {
          mimeType: 'audio/wav',
          recorderType: RecordRTC.StereoAudioRecorder
        });

        mediaRecorderRef.current = mediaRecorder
      
        setAudioChunks([]); // reset audio chunks
        
        mediaRecorder.reset(); // reset any previous recordings
        mediaRecorder.startRecording(); // start recording
        setIsRecording(true); // update the state to indicate recording is in progress
      } catch (error) {
        console.error("Error accessing microphone:", error);
        alert("Please allow microphone access to record audio.");
      }
    } else {
      // Stop recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stopRecording(async () => {
          const blob = mediaRecorderRef.current?.getBlob(); // retrieve the recorded Blob

          if (blob) {
            setAudioChunks((prev) => [...prev, blob]); // add the Blob to audio chunks

            // convert the Blob to a Data URL
            const url = await convertBlob(blob);
            if (typeof url === "string") {
              setAudioUrl(url); // set the audio URL for playback

              // set the source attribute of the audio element to the recorded URL
              document.getElementById("audio")?.setAttribute("src",url);

              // send the audio data to the backend for transcription
              const { request } = createAudioService().post({ content: url });
              request.then((res) => {
                // add the transcription to the list via the callback
                onAddTranscription(res.data.content); // Add transcription to the beginning of the list
                console.log(res.data.content)
              })
              .catch((error) => {
                console.error("Error fetching transcription:", error);
            });
            }
          }
        });
        setIsRecording(false);
      }
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Audio Recorder
      </h3>

      {/* Button to start or stop recording */}
      <button
        id = "recorderButton"
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

      {/* Display recorded audio and download link if available */}
      {audioUrl && (
        <div className="mt-6">
          <h4 className="text-lg font-medium text-gray-700 mb-2">
            Recorded Audio:
          </h4>

          {/* Audio player to play the recorded audio */}
          <audio id="audio" controls className="w-full">
            <source id="audio_source" src={audioUrl} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>

          {/* Download link for the recorded audio */}
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