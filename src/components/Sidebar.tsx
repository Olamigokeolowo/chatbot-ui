import { useEffect, useState } from "react";

interface SidebarProps {
  username: string;
  onNewChat: () => void;
}

interface UsageStats {
  active_sessions: number;
  total_conversations: number;
  sessions: Record<string, number>;
}

function Sidebar({ username, onNewChat }: SidebarProps) {
  const [usage, setUsage] = useState<UsageStats | null>(null);

  // ✅ Fetch usage stats from backend when Sidebar mounts
  useEffect(() => {
    fetch("https://trafficchatter.onrender.com/chat") // change to your server URL if deployed
      .then((res) => res.json())
      .then((data) => setUsage(data))
      .catch((err) => console.error("Failed to load usage stats:", err));
  }, []);

  const handleNewChatClick = () => {
    if (
      window.confirm(
        "Are you sure you want to start a new chat? This will clear your messages."
      )
    ) {
      onNewChat();
    }
  };

  return (
    <div
      className="
        w-56 sm:w-64 
        bg-black text-white p-3 sm:p-4 
        flex flex-col justify-between 
        rounded-r-lg shadow-lg
        min-h-screen sm:min-h-full
        fixed sm:static z-50
      "
    >
      {/* Top section */}
      <div>
        <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">
          Trafficbot
        </h2>

        <ul className="space-y-2 sm:space-y-4 text-sm sm:text-base">
          <li className="hover:bg-gray-800 p-2 rounded cursor-pointer transition">
            Home
          </li>
          <li className="hover:bg-gray-800 p-2 rounded cursor-pointer transition">
            Conversations
          </li>
          <li className="hover:bg-gray-800 p-2 rounded cursor-pointer transition">
            Settings
          </li>
        </ul>
      </div>

      {/* Bottom section */}
      <div className="mt-4 sm:mt-6">
        {/* ✅ Eye-catching New Chat Button */}
        <button
          onClick={handleNewChatClick}
          className="
            w-full px-3 sm:px-4 py-2 mb-2 sm:mb-3 rounded font-semibold text-white 
            bg-gradient-to-r from-blue-500 to-blue-700 shadow-md 
            hover:shadow-lg hover:from-blue-600 hover:to-blue-800 
            transition-all duration-300 text-sm sm:text-base
          "
        >
          New Chat
        </button>

        {/* User Info */}
        <div className="bg-white text-black rounded-lg p-2 sm:p-3 text-sm sm:text-base mb-3">
          <p className="text-xs sm:text-sm">Welcome back,</p>
          <p className="font-bold truncate">{username || "Guest"}</p>
        </div>

        {/* ✅ Usage Stats */}
        {usage && (
          <div className="bg-gray-900 text-white rounded-lg p-3 text-xs sm:text-sm shadow-md">
            <p className="font-bold mb-1">📊 Usage Stats</p>
            <p>Active Sessions: {usage.active_sessions}</p>
            <p>Total Conversations: {usage.total_conversations}</p>
            <div className="mt-2 max-h-20 overflow-y-auto">
              {Object.entries(usage.sessions).map(([sid, count]) => (
                <p key={sid} className="truncate">
                  Session {sid}: {count} msgs
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
