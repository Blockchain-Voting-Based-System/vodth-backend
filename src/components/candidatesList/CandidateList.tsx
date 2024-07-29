import { Link } from "react-router-dom";
type CandidateListProps = {
  candidates: any;
  eventId: string | undefined;
  suiCandidates: any;
};
const CandidatesList = ({
  candidates = [],
  eventId,
  suiCandidates = [],
}: CandidateListProps) => {
  return (
    <section className="bg-gray-100">
      <div className="mx-auto py-6 px-1 sm:px-2 lg:px-4">
        <div className="rounded-lg bg-white shadow-lg">
          <div className=" flex justify-between items-center">
            <div className="my-4 ml-8 text-2xl font-semibold">Candidates</div>
            <Link
              to={`/events/${eventId}/candidates/new`}
              className=" bg-green-600 text-white rounded-md p-3 m-4"
            >
              New Candidate
            </Link>
          </div>
          <hr />
          <div className="overflow-x-auto my-2 p-4 rounded-2xl">
            <div className="">
              <div className="flex justify-around bg-gray-100 p-4 rounded-2xl my-4">
                <span className="w-1/6 overflow-x-auto">Profile</span>
                <span className="w-1/6 overflow-x-auto">Name</span>
                <span className="w-1/6 overflow-x-auto">Status</span>
                <span className="w-1/6 overflow-x-auto">Sex</span>
                <span className="w-1/6 overflow-x-auto">Voted</span>
                <span className="w-1/6 overflow-x-auto">Candidate ID</span>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: "490px" }}>
                {candidates.map((candidate: any, index: any) => {
                  return (
                    <div className="my-4" key={index}>
                      <div className="flex justify-around items-center p-4 my-2">
                        <div className="w-1/6">
                          <img
                            src={candidate.imageUrl}
                            className="inline-block w-16 h-16 rounded-full overflow-hidden shadow-lg object-cover"
                          ></img>
                        </div>
                        <Link
                          to={`/events/${eventId}/candidates/${candidate.id}/edit`}
                          className="w-1/6 text-blue-400 overflow-x-auto"
                          rel="noopener noreferrer"
                        >
                          {candidate.name}
                        </Link>
                        <div className=" w-1/6 overflow-x-auto ">
                          <span
                            className={`p-1 inline-block rounded-lg ${candidate.status == "Active" ? "bg-green-600 text-white" : candidate.status == "Suspended" ? "bg-yellow-600 text-white" : "bg-red-600 text-white"}`}
                          >
                            {candidate.status}
                          </span>
                        </div>
                        <div className=" inline-block w-1/6 overflow-x-auto">
                          {candidate.sex}
                        </div>
                        <div className=" inline-block w-1/6 overflow-x-auto">
                          {suiCandidates[index]?.data?.content?.fields?.voted}
                        </div>
                        <Link
                          to={`https://testnet.suivision.xyz/object/${candidate.suiCandidateId}`}
                          className="w-1/6 text-blue-400 overflow-x-auto max-h-10"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {candidate.suiCandidateId}
                        </Link>
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
    </section>
  );
};

export default CandidatesList;
