
const AppNavigation = () => {
  return (
    <div className="h-screen w-64 bg-white shadow-md">
      <div className="flex items-center justify-center h-20 border-b">
        <img src="/path/to/logo.png" alt="Votechain Logo" className="h-10" />
        <span className="text-xl font-semibold text-blue-600">Votechain</span>
      </div>
      <nav className="mt-10">
        <ul>
          <li className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
            <i className="fas fa-tachometer-alt w-6 h-6"></i>
            <span className="ml-4">Dashboard</span>
          </li>
          <li className="flex items-center px-4 py-2 text-white bg-blue-500 rounded-lg">
            <i className="fas fa-plus-square w-6 h-6"></i>
            <span className="ml-4">Create a Poll</span>
          </li>
          <li className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
            <i className="fas fa-pen-square w-6 h-6"></i>
            <span className="ml-4">Fill a Poll</span>
          </li>
          <li className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
            <i className="fas fa-history w-6 h-6"></i>
            <span className="ml-4">Poll History</span>
          </li>
          <li className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
            <i className="fas fa-cog w-6 h-6"></i>
            <span className="ml-4">Settings</span>
          </li>
          <li className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
            <i className="fas fa-moon w-6 h-6"></i>
            <span className="ml-4">Dark Mode</span>
            <input type="checkbox" className="ml-auto" />
          </li>
        </ul>
      </nav>
      <div className="absolute bottom-0 w-full">
        <div className="flex items-center px-4 py-2 text-red-600 hover:bg-red-100">
          <i className="fas fa-sign-out-alt w-6 h-6"></i>
          <span className="ml-4">Log out</span>
        </div>
      </div>
    </div>
  );
};

export default AppNavigation;
