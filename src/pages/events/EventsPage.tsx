import { useEffect, useState } from "react";
import {
  DocumentData,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { FaRegDotCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getEventObjects } from "../../utils/getSuiEvent";
const formatDate = (dateString: string) => {
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };
  const date = new Date(dateString);
  return `${date.toLocaleDateString(undefined, dateOptions)} ${date.toLocaleTimeString(undefined, timeOptions)}`;
};
const EventPage = () => {
  const [filterActive, setFilterActive] = useState(true);
  const [events, setEvents] = useState<DocumentData>([]);
  const [suiEventData, setSuiEventData] = useState<any>([]);
  const firestore = getFirestore();
  const eventIds: Array<string> = [];
  useEffect(() => {
    const fetchEvents = async () => {
      const q = filterActive
        ? query(
            collection(firestore, "events"),
            where("status", "==", "active"),
          )
        : query(collection(firestore, "events"));
      const eventSnapshot = await getDocs(q);
      eventSnapshot.forEach((doc) => {
        eventIds.push(doc.data().suiEventId);
      });
      await getEventObjects(eventIds).then((result) => {
        setSuiEventData(result);
        setEvents(eventSnapshot.docs);
      });
    };
    fetchEvents();
  }, [filterActive]);

  return (
    <div className="bg-gray-100 mx-auto py-2 px-1 sm:px-2 lg:px-8 max-h-screen">
      <div className="container mx-auto p-4 shadow-lg rounded-2xl bg-white ">
        <div className="flex items-center space-x-2 my-1">
          <button
            type="button"
            onClick={() => setFilterActive(!filterActive)}
            className={`has-tooltip p-3 rounded-full flex items-center justify-center ${filterActive ? "bg-green-50" : "bg-violet-50"}`}
          >
            <span className="tooltip rounded shadow-lg p-1 -mt-14">
              {filterActive ? "Show all polls" : "Show active polls"}
            </span>
            <FaRegDotCircle
              className={`text-2xl ${filterActive ? "text-green-600" : "text-violet-600"}`}
            />
          </button>
          <span className="font-bold text-2xl">
            {filterActive ? "Active Polls" : "All Polls"}
          </span>
        </div>
        <hr />
        <div className="overflow-x-auto my-2">
          <div className="">
            <div className="flex justify-around bg-gray-100 p-4 rounded-2xl my-4">
              <span className="w-1/6 overflow-x-auto">Poll Name</span>
              <span className="w-1/6 overflow-x-auto">Type</span>
              <span className="w-1/6 overflow-x-auto">Candidates</span>
              <span className="w-1/6 overflow-x-auto">Voted</span>
              <span className="w-1/6 overflow-x-auto">Start Date</span>
              <span className="w-1/6 overflow-x-auto">Status</span>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: "490px" }}>
              {events.map((event: any, index: any) => {
                return (
                  <div className="my-4" key={index}>
                    <div className="flex justify-around p-4 my-2">
                      <Link
                        to={`/events/${event.id}`}
                        className="w-1/6 text-blue-400 overflow-x-auto"
                      >
                        {event.data().name}
                      </Link>
                      <span className="w-1/6 overflow-x-auto">
                        {event.data().type}
                      </span>
                      <span className="w-1/6 overflow-x-auto">
                        {suiEventData[index]?.data?.content?.fields?.candidates}
                      </span>
                      <span className="w-1/6 overflow-x-auto">
                        {suiEventData[index]?.data?.content?.fields?.voted}
                      </span>
                      <span className="w-1/6 overflow-x-auto">
                        {formatDate(event.data().startDate)}
                      </span>
                      <span className="w-1/6 overflow-x-auto ">
                        <span
                          className={`
                        ${event.data().status == "active" ? "bg-green-600" : "bg-yellow-600"}
                        text-white
                        p-2 inline-block rounded-lg
                      `}
                        >
                          {event.data().status}
                        </span>
                      </span>
                    </div>
                    <hr />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPage;
