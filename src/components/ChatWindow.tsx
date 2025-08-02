import { useState, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import InputBox from "./InputBox";
import Sidebar from "./Sidebar";
import TypingIndicator from "./TypingIndicator";

// ✅ Utility: generate session ID
function generateSessionId(): string {
  const id = `sess-${Date.now()}`;
  localStorage.setItem("session_id", id);
  return id;
}

// ✅ Utility: get stored location
function getStoredLocation(): { lat?: number; lng?: number } {
  const storedLocation = localStorage.getItem("userLocation");
  return storedLocation ? JSON.parse(storedLocation) : {};
}

// ✅ Utility: request location
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

  // ✅ Messages now include timestamp
  const [messages, setMessages] = useState<
    { sender: "bot" | "user"; text: string; time: string }[]
  >([
    {
      sender: "bot",
      text: "Welcome to the chat!",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [showTyping, setShowTyping] = useState(false);
  const [username, setUsername] = useState("");

  // ✅ Ask username once per session
  useEffect(() => {
    const storedName = sessionStorage.getItem("username");
    if (storedName) {
      setUsername(storedName);
    } else {
      const name = prompt("What's your name?") || "Guest";
      sessionStorage.setItem("username", name);
      setUsername(name);
    }
  }, []);

  // ✅ Show popup only once per session
  useEffect(() => {
    const existing = localStorage.getItem("session_id");
    if (!existing) generateSessionId();

    const popupAnswered = sessionStorage.getItem("location_popup_answered");
    if (!popupAnswered) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  // ✅ Handle location permission
  const handleLocationPermission = (granted: boolean) => {
    sessionStorage.setItem("location_popup_answered", "true");

    if (granted) {
      requestUserLocation(() => setShowPopup(false));
    } else {
      setShowPopup(false);
    }
  };

  // ✅ Handle sending message with timestamp
  const handleSendMessage = (user_input: string) => {
    const session_id = localStorage.getItem("session_id") || generateSessionId();
    const { lat, lng } = getStoredLocation();
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Add user message
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: user_input, time },
    ]);

    setShowTyping(true);

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
          const distance = data.distance || data.routes[0].distance || "N/A";
          const duration = data.duration || data.routes[0].duration || "N/A";
          const durationTraffic = data.duration_in_traffic || "N/A";
          const severity = data.traffic_severity || "N/A";

          botMessage += `🚗 **Your Route Details**\n`;
          botMessage += `📏 Distance: ${distance}\n`;
          botMessage += `🕒 Duration: ${duration} (${durationTraffic} in traffic)\n`;
          botMessage += `🚦 Traffic Severity: ${severity}\n\n`;

          data.routes.forEach((route: any, idx: number) => {
            botMessage += `### Route ${idx + 1}: ${route.summary}\n`;
            route.steps.forEach((step: string, stepIdx: number) => {
              botMessage += `${stepIdx + 1}. ${step}\n`;
            });
            botMessage += "\n";
          });
        } else if (data.response) {
          botMessage = data.response;
        } else if (data.error) {
          botMessage = `❌ Error: ${data.error}`;
        } else {
          botMessage = "Hmm... I couldn't understand that.";
        }

        if (data.session_id) {
          localStorage.setItem("session_id", data.session_id);
        }

        const botTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        setShowTyping(false);
        setMessages((prev) => [...prev, { sender: "bot", text: botMessage, time: botTime }]);
      })
      .catch(() => {
        setShowTyping(false);
        const errorTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Oops! Something went wrong.", time: errorTime },
        ]);
      });
  };

  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg w-96 animate-fade-in">
            <h2 className="text-xl font-bold mb-4">Allow Location Access?</h2>
            <p className="mb-4">We use your location to help with traffic info.</p>
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
        <Sidebar username={username} />
        <div className="flex flex-col flex-grow bg-white text-black rounded-lg m-4 p-4 shadow-lg">
          <div className="flex-1 overflow-y-auto space-y-3">
            {messages.map((msg, index) => (
              <MessageBubble key={index} sender={msg.sender} text={msg.text} time={msg.time} />
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
