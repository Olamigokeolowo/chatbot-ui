import React from 'react';
import bot_avatar from '../images/bot-avatar.png';
import user_avatar from '../images/user-avatar.png';
import ReactMarkdown from 'react-markdown';
type Props = {
  sender: "bot" | "user";
  text: string;
};

function MessageBubble ({ sender, text }: Props)  {
  const isBot = sender === "bot";

  return (
    <div className="flex p-2 items-start gap-2">
      <img
        src={isBot ? bot_avatar : user_avatar}
        alt={isBot ? "Bot" : "User"}
        className="rounded-full w-8 h-8 aspect-auto"
      />
      <div
        className={`p-2 rounded-lg w-fit ${
          isBot ? "bg-blue-100" : "bg-green-100"
        } text-black`}
      >
        <p>
          <ReactMarkdown>{text}</ReactMarkdown>
        </p>
      </div>
    </div>
  );
}

export default MessageBubble;
