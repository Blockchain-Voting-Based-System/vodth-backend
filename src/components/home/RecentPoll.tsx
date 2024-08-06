import { RiLineChartFill, RiReactjsFill } from "react-icons/ri";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { firestore } from "../../firebase";
import { Link } from "react-router-dom";
import { getCandidateObjects } from "../../utils/getSuiCandidate";

function hasFields(content: any): content is { fields: { voted: number } } {
  return content && typeof content.fields === "object";
}
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};
const RecentPoll = () => {
  const [recentPoll, setRecentPoll] = useState<any>();
  const [candidatesList, setCandidatesList] = useState<any>([]);
  useEffect(() => {
    fetchEvents();
  }, []);
  const fetchEvents = async () => {
    const q = query(
      collection(firestore, "events"),
      where("status", "==", "active"),
      orderBy("createdAt", "desc"),
      limit(1),
    );
    const eventSnapshot = await getDocs(q);
    if (!eventSnapshot.empty) {
      setRecentPoll({
        id: eventSnapshot.docs[0].id,
        ...eventSnapshot.docs[0].data(),
      });
      getCandidates(eventSnapshot.docs[0].id);
    }
  };

  async function getCandidates(eventId: any) {
    const candidates: any = [];
    const candidatesCollection = collection(firestore, "candidates");
    const q = query(candidatesCollection, where("eventId", "==", eventId));
    const suiCandidateId: Array<string> = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.docs.map(async (doc) => {
      candidates.push({ id: doc.id, ...doc.data() });
      suiCandidateId.push(doc.data().suiCandidateId);
    });
    await getCandidateObjects(suiCandidateId).then((result) => {
      const suicandidatesList: any = [];
      candidates.map(async (candidate: any, index: number) => {
        suicandidatesList.push({
          voted: hasFields(result[index]?.data?.content)
            ? result[index]?.data?.content.fields.voted
            : 0,
          ...candidate,
        });
        suicandidatesList.sort((a: any, b: any) => b.voted - a.voted);
      });
      setCandidatesList(suicandidatesList);
    });
  }
  return (
    <>
      <div className="bg-white shadow-md px-6 rounded-md w-96 py-4">
        <div className="flex items-center justify-between space-x-2">
          <span className="">
            <div className="font-bold text-xl">Recent Poll</div>
            <Link to={`/polls/${recentPoll?.id}`}>
              <div className="text-lg font-semibold text-blue-400">
                {recentPoll?.name}
              </div>
              <div className="text-sm">{`${formatDate(recentPoll?.startDate)} - ${formatDate(recentPoll?.endDate)}`}</div>
            </Link>
          </span>
          <div className="p-4 bg-pink-50 rounded-full flex items-center justify-center">
            <RiLineChartFill className="text-3xl text-pink-400" />
          </div>
        </div>
        <div className="flex space-x-6 mt-10 overflow-auto">
          {candidatesList?.map((candidate: any, index: number) => (
            <div key={index}>
              <div className=" text-2xl text-green-600">{candidate.voted}</div>
              <div>{candidate.name}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default RecentPoll;
