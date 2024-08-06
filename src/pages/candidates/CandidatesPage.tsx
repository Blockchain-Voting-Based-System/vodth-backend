import { useParams } from "react-router-dom";
const CandidatesPage = () => {
  const event_id = useParams().event_id;
  return <div>{event_id}</div>;
};

export default CandidatesPage;
