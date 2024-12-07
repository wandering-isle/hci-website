// Copy component to copy multiple transcriptions to the clipboard
function Copy({ transcriptions }: { transcriptions: string[] }) {

  // Function to handle copying transcriptions to the clipboard
  const copyTextBoxes = () => {
    // Combine all transcriptions into a single string with line breaks
    const textToCopy = transcriptions.join("\n");

    // Use the Clipboard API to copy the combined string to the clipboard
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        // Alert the user on successful copy
        alert("Transcriptions copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy text: ", error);
        alert("Failed to copy transcriptions to clipboard.");
      });
  };

  return (
    // Creates a button that copies the ChatBox content.
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
