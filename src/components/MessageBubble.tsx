import React from "react";
import bot_avatar from "../images/bot-avatar.png";
import user_avatar from "../images/user-avatar.png";

interface MessageBubbleProps {
  sender: "bot" | "user";
  text: string;
  time: string;
}

export default function MessageBubble({ sender, text, time }: MessageBubbleProps) {
  const isBot = sender === "bot";

  return (
    <div
      className={`flex items-end mb-3 px-1 sm:px-0 ${
        isBot ? "justify-start" : "justify-end"
      }`}
    >
      {/* Bot icon (left) */}
      {isBot && (
        <img
          src={bot_avatar}
          alt="Bot"
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full mr-2 shadow-md flex-shrink-0"
        />
      )}

      {/* Message bubble */}
      <div
        className={`p-2 sm:p-3 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-md flex flex-col
          max-w-[85%] sm:max-w-[75%]
          ${isBot
            ? "bg-gray-200 text-black rounded-bl-none"
            : "bg-blue-600 text-white rounded-br-none"
          }`}
      >
        <span className="break-words">{text}</span>

        {/* Timestamp - responsive color & size */}
        <span
          className={`text-[0.65rem] sm:text-xs mt-1 self-end italic ${
            isBot
              ? "text-gray-500"
              : "text-yellow-300 font-medium drop-shadow-sm"
          }`}
        >
          {time}
        </span>
      </div>

      {/* User icon (right) */}
      {!isBot && (
        <img
          src={user_avatar}
          alt="User"
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full ml-2 shadow-md flex-shrink-0"
        />
      )}
    </div>
  );
}
