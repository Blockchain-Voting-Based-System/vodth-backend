import { RiLineChartFill } from "react-icons/ri";
class RecentPollProps {
  recentEvent: any;
  recentSuiEvent: any;
}
const RecentPoll = (recentEvent: RecentPollProps) => {
  const event = recentEvent.recentEvent;
  const suiEventData = recentEvent.recentSuiEvent;
  return (
    <>
      <div className="bg-white shadow-md px-6 rounded-md w-96 p-8">
        <div className="flex items-center justify-between space-x-2">
          <span className="font-bold text-xl">Recent Poll</span>
          <div className="p-4 bg-pink-50 rounded-full flex items-center justify-center">
            <RiLineChartFill className="text-3xl text-pink-400" />
          </div>
        </div>
        <div className="flex space-x-4 mt-4">
          <div>
            <div className=" text-3xl text-violet-500">
              {suiEventData?.data?.content?.fields?.voted}
            </div>
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

export default RecentPoll;
