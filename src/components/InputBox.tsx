import { useState } from "react";

function InputBox({ onSend }: { onSend: (message: string) => void }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() === "") return; // don’t send empty messages
    onSend(message);
    setMessage(""); // clear input after sending
  };

  return (
    <div className="flex p-2">
      <input
      type="text"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Type your message"
      className="flex-grow border rounded px-3 py-2 text-black"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
        handleSend();
        }
      }}
      />
      <button
      onClick={handleSend}
      className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
      Send
      </button>
    </div>
  );
}

export default InputBox;
