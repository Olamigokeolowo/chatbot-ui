import React from 'react';
import bot_avatar from '../images/bot-avatar.png';
import user_avatar from '../images/user-avatar.png';
interface MessageBubbleProps {
  sender: "bot" | "user";
  text: string;
}

export default function MessageBubble({ sender, text }: MessageBubbleProps) {
  const isBot = sender === "bot";

  return (
    <div
      className={`flex items-end mb-3 ${
        isBot ? "justify-start" : "justify-end"
      }`}
    >
      {/* Bot icon (left) */}
      {isBot && (
        <img
          src={bot_avatar }
          alt="Bot"
          className="w-8 h-8 rounded-full mr-2 shadow-md"
        />
      )}

      {/* Message bubble */}
      <div
        className={`max-w-[75%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line shadow-md ${
          isBot
            ? "bg-gray-200 text-black rounded-bl-none" // Bot bubble style
            : "bg-blue-600 text-white rounded-br-none" // User bubble style
        }`}
      >
        {text}
      </div>

      {/* User icon (right) */}
      {!isBot && (
        <img
          src={user_avatar}
          alt="User"
          className="w-8 h-8 rounded-full ml-2 shadow-md"
        />
      )}
    </div>
  );
}
