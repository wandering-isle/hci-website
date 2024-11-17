function Copy() {

  const copyTextBoxes = () => {
    // TODO: Scrape the text versions of all the text and return it.
    navigator.clipboard.writeText("Placeholder text for functionality");
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
