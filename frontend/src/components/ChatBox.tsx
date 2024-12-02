import {
  AiOutlineCopy,
  AiOutlineEdit,
  AiOutlineCheck,
  AiOutlineDelete,
} from "react-icons/ai";
import { useState } from "react";

export const ChatContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-1/2 items-center">{children}</div>
    </div>
  );
};

const ChatBox = ({
  text,
  index,
  onDeleteChat,
}: {
  text: string;
  index: number;
  onDeleteChat: (index: number) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false); // Track editing mode
  const [currentText, setCurrentText] = useState(text); // Track current text value

  const handleEdit = () => {
    setIsEditing(true); // Enter editing mode
  };

  const handleSave = () => {
    setIsEditing(false); // Exit editing mode
    // Optionally: Save changes to a server or parent state
  };

  const handleDelete = (index: number) => {
    onDeleteChat(index);
  };

  return (
    <div className="my-4 p-6 rounded-lg bg-white shadow-md border border-gray-200 flex items-center justify-between">
      {/* Conditionally render input or span based on isEditing */}
      {isEditing ? (
        <input
          type="text"
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
          className="flex-grow border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      ) : (
        <span className="font-semibold text-gray-800 text-lg">
          {currentText}
        </span>
      )}
      <div className="flex flex-row space-x-3">
        {/* Copy Button */}
        <button
          className="w-10 h-10 rounded-full bg-blue-500 text-white shadow-lg flex justify-center items-center hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={() => navigator.clipboard.writeText(currentText)}
          title="Copy to Clipboard"
        >
          <AiOutlineCopy size={20} />
        </button>

        {/* Edit or Save Button */}
        {isEditing ? (
          <button
            className="w-10 h-10 rounded-full bg-green-500 text-white shadow-lg flex justify-center items-center hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
            onClick={handleSave}
            title="Save Changes"
          >
            <AiOutlineCheck size={20} />
          </button>
        ) : (
          <button
            className="w-10 h-10 rounded-full bg-green-500 text-white shadow-lg flex justify-center items-center hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
            onClick={handleEdit}
            title="Edit"
          >
            <AiOutlineEdit size={20} />
          </button>
        )}

        {/* Delete Button */}
        <button
          className="w-10 h-10 rounded-full bg-red-500 text-white shadow-lg flex justify-center items-center hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
          onClick={() => handleDelete(index)}
          title="Delete Chat"
        >
          <AiOutlineDelete size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
