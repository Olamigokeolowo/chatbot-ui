import MessageBubble from "./MessageBubble";
import InputBox from "./InputBox";
import Sidebar from "./Sidebar";
import { useState } from "react";

function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log("User location:", location);
        localStorage.setItem("userLocation", JSON.stringify(location));
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

function ChatWindow() {
  const [showPopup, setShowPopup] = useState(true); // Ask for location on load
  const [messages, setMessages] = useState<{ sender: "bot" | "user"; text: string }[]>([
    { sender: "bot", text: "Welcome to the chat!" },
  ]);

  const handleSendMessage = (message: string) => {
    // 1. Show user message
    setMessages((prevMessages) => [...prevMessages, { sender: "user", text: message }]);

    // 2. Optionally send to backend (you can add this later)
    fetch("https://trafficchatter.onrender.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.reply) {
          setMessages(prev => [...prev, { sender: "bot", text: data.reply }]);
        }
      })
      .catch(err => console.error("Backend error:", err));
  };

  return (
    <>
      {/* 📍 Popup Overlay */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Allow Location Access?</h2>
            <p className="mb-4">We use your location to help with traffic info.</p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded"
                onClick={() => setShowPopup(false)}
              >
                Deny
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={() => {
                  getUserLocation();
                  setShowPopup(false);
                }}
              >
                Allow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 💬 Chat UI */}
      <div className="flex h-screen bg-gray-900 text-white">
        <Sidebar />

        <div className="flex flex-col flex-grow bg-white text-black rounded-lg m-4 p-4 shadow-lg">
          <div className="flex-1 overflow-y-auto space-y-3">
            {messages.map((msg, index) => (
              <MessageBubble key={index} sender={msg.sender} text={msg.text} />
            ))}
          </div>

          <InputBox onSend={handleSendMessage} />
        </div>
      </div>
    </>
  );
}

export default ChatWindow;
