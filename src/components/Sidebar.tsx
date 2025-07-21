// Sidebar.tsx
function Sidebar () {

  return (
    <div className="w-64 black text-white p-4 flex flex-col justify-between rounded-r-ig shadow-lg">
      {/* Sidebar content like menu or icons */}
      <div>
        <h2 className="text-lg font-semibold mb-6">ChatBot UI</h2>

      <ul className="space-y4">
        <li className="hover:bg-gray-800 p-2 rounded cursor-pointer">Home</li>
        <li className="hover:bg-gray-800 p-2 rounded cursor-pointer">Conversations</li>
        <li className="hover:bg-gray-800 p-2 rounded cursor-pointer">Settings</li>
      </ul>
      </div>

    <div className="bg-white text-black rounded-lg p-3 mt-6">
      <p className="text-sm">Welcome back,</p>
      <p className="font-bold">Goke</p>
      
    </div>
    </div>
  );
};

export default Sidebar;
