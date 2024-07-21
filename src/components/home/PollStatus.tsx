import { BiSolidBarChartAlt2 } from "react-icons/bi";

class PollStatusProps {
  events: any;
}
const PollStatus = (event: PollStatusProps) => {
  const eventCount = event.events.length;
  return (
    <>
      <div className="bg-white shadow-md px-6 rounded-md w-96 p-8">
        <div className="flex items-center justify-between space-x-2">
          <span className="font-bold text-xl">Your Poll Info</span>
          <div className="p-4 bg-blue-50 rounded-full flex items-center justify-center">
            <BiSolidBarChartAlt2 className="text-3xl text-blue-400" />
          </div>
        </div>
        <div className="flex space-x-4 mt-4">
          <div>
            <div className=" text-3xl text-violet-600">{eventCount}</div>
            <div>completed</div>
          </div>
          <div>
            <div className=" text-3xl text-green-600">00</div>
            <div>Progressing</div>
          </div>
          <div>
            <div className=" text-3xl text-red-500">00</div>
            <div>Suspended</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PollStatus;
