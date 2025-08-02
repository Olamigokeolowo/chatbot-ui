interface SidebarProps {
  username: string;
}

function Sidebar({ username }: SidebarProps) {
  return (
    <div className="w-64 bg-black text-white p-4 flex flex-col justify-between rounded-r-lg shadow-lg">
      {/* Sidebar content */}
      <div>
        <h2 className="text-lg font-semibold mb-6">Trafficbot</h2>

        <ul className="space-y-4">
          <li className="hover:bg-gray-800 p-2 rounded cursor-pointer">Home</li>
          <li className="hover:bg-gray-800 p-2 rounded cursor-pointer">
            Conversations
          </li>
          <li className="hover:bg-gray-800 p-2 rounded cursor-pointer">
            Settings
          </li>
        </ul>
      </div>

      <div className="bg-white text-black rounded-lg p-3 mt-6">
        <p className="text-sm">Welcome back,</p>
        <p className="font-bold">{username || "Guest"}</p>
      </div>
    </div>
  );
}

export default Sidebar;
