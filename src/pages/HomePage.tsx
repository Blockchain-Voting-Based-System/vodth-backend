import PollStatus from "../components/home/PollStatus";
import FindPoll from "../components/home/FindPoll";
import RecentPoll from "../components/home/RecentPoll";
import EventPage from "./events/EventsPage";
const HomePage = () => {
  return (
    <div>
      <div className="flex p-8 space-x-8 overflow-x-auto">
        <PollStatus></PollStatus>
        <FindPoll></FindPoll>
        <RecentPoll></RecentPoll>
      </div>
      <EventPage></EventPage>
    </div>
  );
};

export default HomePage;
