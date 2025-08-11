import { useEffect, useState } from "react";
import { X, Menu, Plus } from "lucide-react";

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
  const [isOpen, setIsOpen] = useState(false);

  // Fetch usage stats
  useEffect(() => {
    fetch("https://trafficchatter.onrender.com/chat")
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
      setIsOpen(false); // Close menu on mobile after new chat
    }
  };

  return (
    <>
      {/* Header Navbar */}
      <nav
        className="
          fixed top-0 left-0 w-full z-50 flex items-center justify-between
          bg-blue-80 
          px-4 py-3 sm:hidden
        "
        style={{ boxShadow: "none" }}
      >
        {/* Menu Button (left) */}
        <button
          className="p-2 rounded-md text-white hover:bg-gray-800 transition"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={22} />
        </button>

        {/* Centered Title */}
        <div className="flex-1 flex justify-center">
          <span className="text-lg font-semibold tracking-wide select-none">
            Trafficbot
          </span>
        </div>

        {/* New Chat Icon (right) */}
        <button
          className="p-2 rounded-md text-white hover:bg-blue-700 transition"
          onClick={handleNewChatClick}
        >
          <Plus size={22} />
        </button>
      </nav>

      {/* Sidebar Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-gray-950 text-white p-0
          flex flex-col rounded-r-lg shadow-lg z-50
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
          sm:static sm:rounded-none sm:shadow-none sm:p-4
        `}
        style={{ maxWidth: "16rem" }}
      >
        {/* Mobile: Drawer Header */}
        <div className="sm:hidden flex items-center justify-between px-4 py-4 border-b border-gray-800">
          <span className="text-lg font-semibold">Trafficbot</span>
          <button onClick={() => setIsOpen(false)} className="p-1">
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex flex-col justify-between h-screen sm:h-screen px-4 pt-4 sm:pt-0 bg-transparent">
          {/* Top section */}
          <div>
            <h2 className="hidden sm:block text-lg font-semibold mb-6">
              Trafficbot
            </h2>
            <ul className="space-y-4 text-base">
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
          <div className="">
            <button
              onClick={handleNewChatClick}
              className="
                w-full px-4 py-2 mb-3 rounded font-semibold text-white 
                bg-gradient-to-r from-blue-500 to-blue-700 shadow-md 
                hover:shadow-lg hover:from-blue-600 hover:to-blue-800 
                transition-all duration-300
                hidden sm:block
              "
            >
              New Chat
            </button>

            <div className="bg-white text-black rounded-lg p-3 text-base mb-3">
              <p className="text-sm">Welcome back,</p>
              <p className="font-bold truncate">{username || "Guest"}</p>
            </div>

            {usage && (
              <div className="bg-gray-900 text-white rounded-lg p-3 text-sm shadow-md">
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
      </div>
      {/* Spacer for mobile navbar */}
      <div className="h-14 sm:hidden" />
    </>
  );
}

export default Sidebar;
