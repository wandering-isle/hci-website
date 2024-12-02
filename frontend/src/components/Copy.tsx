function Copy({ transcriptions }: { transcriptions: string[] }) {

  const copyTextBoxes = () => {
    // Combine all transcriptions into a single string with line breaks
    const textToCopy = transcriptions.join("\n");

    // Copy the combined string to the clipboard
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
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
