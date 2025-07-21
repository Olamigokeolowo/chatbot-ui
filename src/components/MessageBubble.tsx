type Props = {
  sender: "bot" | "user"; // this restricts sender to only these two strings
  text: string;
};

function MessageBubble ({ sender, text }: Props)  {
  const isBot = sender === "bot";

  return (
    <div className={`p-2 rounded-lg w-fit ${isBot ? 'bg-blue-100' : 'bg-green-100'} text-black`}>
      <p>{text}</p>
    </div>
  );
}

export default MessageBubble;
