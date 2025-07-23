import { useState } from "react";

function InputBox({ onSend }: { onSend: (user_input: string) => void }) {
  const [user_input, setMessage] = useState("");

  const handleSend = () => {
    if (user_input.trim() === "") return; // don’t send empty messages
    onSend(user_input);
    setMessage(""); // clear input after sending
  };

  return (
    <div className="flex p-2">
      <textarea
      value={user_input}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Type your message"
      className="flex-grow border rounded px-3 py-2 text-black resize-none"
      rows={3}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
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
