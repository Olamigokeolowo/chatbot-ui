import avatar_img from "../images/bot-avatar.png";

interface TypingIndicatorProps {
  avatar?: string;
}

export default function TypingIndicator({ avatar }: TypingIndicatorProps) {
  return (
    <div
      className="
        flex items-center space-x-2 sm:space-x-3 
        ml-1 sm:ml-2 mb-2 sm:mb-3
      "
    >
      {/* Bot Avatar */}
      <img
        src={avatar || avatar_img}
        alt="Bot"
        className="
          w-6 h-6 sm:w-8 sm:h-8 
          rounded-full shadow-md object-cover
        "
      />

      {/* 3-dot animation */}
      <div
        className="
          flex space-x-1 bg-gray-200 
          px-2 py-1 sm:px-3 sm:py-2 
          rounded-2xl rounded-bl-none shadow
        "
      >
        <span
          className="
            w-1.5 h-1.5 sm:w-2 sm:h-2 
            bg-gray-500 rounded-full animate-bounce
          "
          style={{ animationDelay: "0s" }}
        ></span>
        <span
          className="
            w-1.5 h-1.5 sm:w-2 sm:h-2 
            bg-gray-500 rounded-full animate-bounce
          "
          style={{ animationDelay: "0.15s" }}
        ></span>
        <span
          className="
            w-1.5 h-1.5 sm:w-2 sm:h-2 
            bg-gray-500 rounded-full animate-bounce
          "
          style={{ animationDelay: "0.3s" }}
        ></span>
      </div>
    </div>
  );
}
