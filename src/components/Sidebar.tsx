interface SidebarProps {
  username: string;
  onNewChat: () => void;
}

function Sidebar({ username, onNewChat }: SidebarProps) {
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
        <div className="bg-white text-black rounded-lg p-2 sm:p-3 text-sm sm:text-base">
          <p className="text-xs sm:text-sm">Welcome back,</p>
          <p className="font-bold truncate">{username || "Guest"}</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
