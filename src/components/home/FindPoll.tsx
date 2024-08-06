import { GoZap } from "react-icons/go";
import { Link } from "react-router-dom";
const FindPoll = () => {
  return (
    <div className="bg-white shadow-md rounded-md w-96 px-6 py-4">
      <div className="flex items-center justify-between space-x-2">
        <span className="font-bold text-xl">Create or Find Poll</span>
        <div className="p-4 bg-violet-50 rounded-full flex items-center justify-center">
          <GoZap className="text-3xl text-violet-400" />
        </div>
      </div>
      <div className="flex space-x-8 mt-14 ">
        <button className="bg-violet-600 p-2 rounded-md text-white text-md font-bold w-28">
          Find Poll
        </button>
        <Link to="/polls/new">
          <button className="bg-green-600 p-2 rounded-md text-white text-md font-bold w-28">
            New Poll
          </button>
        </Link>
      </div>
    </div>
  );
};

export default FindPoll;
