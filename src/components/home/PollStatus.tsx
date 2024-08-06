import { BiSolidBarChartAlt2 } from "react-icons/bi";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../../firebase";

const PollStatus = () => {
  const [completedCount, setCompletedCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      // Query for completed events
      const completedQuery = query(
        collection(firestore, "events"),
        where("status", "==", "ended"),
      );
      const completedSnapshot = await getDocs(completedQuery);
      setCompletedCount(completedSnapshot.size);

      // Query for active events
      const activeQuery = query(
        collection(firestore, "events"),
        where("status", "==", "active"),
      );
      const activeSnapshot = await getDocs(activeQuery);
      setActiveCount(activeSnapshot.size);

      // Query for pending events
      const pendingQuery = query(
        collection(firestore, "events"),
        where("status", "==", "pending"),
      );
      const pendingSnapshot = await getDocs(pendingQuery);
      setPendingCount(pendingSnapshot.size);
    };

    fetchEvents();
  }, []);
  return (
    <>
      <div className="bg-white shadow-md px-6 rounded-md w-96 py-4">
        <div className="flex items-center justify-between space-x-2">
          <span className="font-bold text-xl">Your Poll Info</span>
          <div className="p-4 bg-blue-50 rounded-full flex items-center justify-center">
            <BiSolidBarChartAlt2 className="text-3xl text-blue-400" />
          </div>
        </div>
        <div className="flex space-x-4 mt-10">
          <div>
            <div className=" text-3xl text-red-600">{completedCount}</div>
            <div>Ended</div>
          </div>
          <div>
            <div className=" text-3xl text-green-600">{activeCount}</div>
            <div>Progressing</div>
          </div>
          <div>
            <div className=" text-3xl text-yellow-500">{pendingCount}</div>
            <div>Pending</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PollStatus;
