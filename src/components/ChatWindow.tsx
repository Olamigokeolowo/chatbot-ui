import MessageBubble from "./MessageBubble";
import InputBox from "./InputBox";
import Sidebar from "./Sidebar";
import TypingIndicator from "./TypingIndicator";
import { useState, useEffect } from "react";

// Utils
function generateSessionId(): string {
  const id = `sess-${Date.now()}`;
  localStorage.setItem("session_id", id);
  return id;
}

function getStoredLocation(): { lat?: number; lng?: number } {
  const storedLocation = localStorage.getItem("userLocation");
  return storedLocation ? JSON.parse(storedLocation) : {};
}

function requestUserLocation(callback?: () => void) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        localStorage.setItem("userLocation", JSON.stringify(location));
        if (callback) callback();
      },
      (error) => {
        console.error("Error getting location:", error);
        if (callback) callback();
      }
    );
  } else {
    console.log("Geolocation is not supported by this browser.");
    if (callback) callback();
  }
}

interface ChatPayload {
  user_input: string;
  session_id: string;
  lat?: number;
  lng?: number;
}

function ChatWindow() {
  const [showPopup, setShowPopup] = useState(false);
  const [messages, setMessages] = useState<
    { sender: "bot" | "user"; text: string }[]
  >([{ sender: "bot", text: "Welcome to the chat!" }]);
  const [showTyping, setShowTyping] = useState(false);

  // ✅ Show popup only once per session
  useEffect(() => {
    const existing = localStorage.getItem("session_id");
    if (!existing) generateSessionId();

    const popupAnswered = sessionStorage.getItem("location_popup_answered");
    if (!popupAnswered) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 2000); // Show popup after 2s
      return () => clearTimeout(timer);
    }
  }, []);

  const handleLocationPermission = (granted: boolean) => {
    // Mark popup as answered for this session
    sessionStorage.setItem("location_popup_answered", "true");

    if (granted) {
      requestUserLocation(() => setShowPopup(false));
    } else {
      setShowPopup(false);
    }
  };

  const handleSendMessage = (user_input: string) => {
    const session_id =
      localStorage.getItem("session_id") || generateSessionId();
    const { lat, lng } = getStoredLocation();

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: user_input },
    ]);

    setShowTyping(true); // Show typing animation

    const payload: ChatPayload = {
      user_input,
      session_id,
      lat,
      lng,
    };

    fetch("https://trafficchatter.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res: Response) => res.json())
      .then((data) => {
        let botMessage = "";

        if (data.routes?.length) {
          botMessage += `🚣️ *Here are your route details:*\n`;
          botMessage += `📏 Distance: ${data.distance}\n🕒 Duration: ${data.duration}\n🚦 In traffic: ${data.duration_in_traffic}\n📊 Severity: ${data.traffic_severity}\n`;

          data.routes.forEach((route: any, idx: number) => {
            botMessage += `\n📍 Route ${idx + 1}: ${route.summary}\n`;
            botMessage += `- Distance: ${route.distance}\n- Duration: ${route.duration}\n- 🧭 Steps:\n`;
            route.steps.forEach((step: string, stepIdx: number) => {
              botMessage += `  ${stepIdx + 1}. ${step}\n`;
            });
          });
        } else if (data.response) {
          botMessage = data.response;
        } else if (data.error) {
          botMessage = `Error: ${data.error}`;
        } else {
          botMessage = "Hmm... I couldn't understand that.";
        }

        if (data.session_id) {
          localStorage.setItem("session_id", data.session_id);
        }

        setShowTyping(false); // Hide typing animation
        setMessages((prev) => [...prev, { sender: "bot", text: botMessage }]);
      })
      .catch((err) => {
        console.error("Error talking to bot:", err);
        setShowTyping(false);
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Oops! Something went wrong." },
        ]);
      });
  };

  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg w-96 animate-fade-in">
            <h2 className="text-xl font-bold mb-4">Allow Location Access?</h2>
            <p className="mb-4">
              We use your location to help with traffic info.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded"
                onClick={() => handleLocationPermission(false)}
              >
                Deny
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={() => handleLocationPermission(true)}
              >
                Allow
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex h-screen bg-gray-900 text-white">
        <Sidebar />
        <div className="flex flex-col flex-grow bg-white text-black rounded-lg m-4 p-4 shadow-lg">
          <div className="flex-1 overflow-y-auto space-y-3">
            {messages.map((msg, index) => (
              <MessageBubble key={index} sender={msg.sender} text={msg.text} />
            ))}
            {showTyping && (
              <div className="flex justify-start">
                <TypingIndicator />
              </div>
            )}
          </div>
          <InputBox onSend={handleSendMessage} />
        </div>
      </div>
    </>
  );
}

export default ChatWindow;
