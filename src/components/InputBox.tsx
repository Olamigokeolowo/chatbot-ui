import { useState } from "react";

function InputBox({ onSend }: { onSend: (user_input: string) => void }) {
  const [user_input, setMessage] = useState("");

  const handleSend = () => {
    if (user_input.trim() === "") return; // prevent sending empty messages
    onSend(user_input);
    setMessage(""); // clear input after sending
  };

  return (
    <div
      className="
        flex items-end p-2 gap-2 
        w-full
        sm:p-3
      "
    >
      <textarea
        value={user_input}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="
          flex-grow border rounded-lg 
          px-3 py-2 text-black resize-none 
          text-sm sm:text-base
          focus:outline-none focus:ring-2 focus:ring-blue-400
          min-h-[45px] sm:min-h-[55px]
        "
        rows={2}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />
      <button
        onClick={handleSend}
        className="
          px-3 sm:px-5 py-2 
          bg-blue-500 hover:bg-blue-600 
          text-white rounded-lg 
          text-sm sm:text-base
          transition-all duration-200
        "
      >
        Send
      </button>
    </div>
  );
}

export default InputBox;
