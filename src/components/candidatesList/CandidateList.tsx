import { Link } from "react-router-dom";
type CandidateListProps = {
  candidates: any;
  eventId: string | undefined;
};
const CandidatesList = ({ candidates, eventId }: CandidateListProps) => {
  return (
    <section className="bg-gray-100">
      <div className="mx-auto py-6 px-1 sm:px-2 lg:px-4">
        <div className="rounded-lg bg-white shadow-lg">
          <div className=" flex justify-between">
            <div className="my-4 ml-8 text-2xl font-semibold">Candidate</div>
            <button
              onClick={() => {
                window.location.href = `/events/${eventId}/candidates/new`;
              }}
              className=" bg-blue-400 h-12 rounded-md p-2 m-4"
            >
              New Candidate
            </button>
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
                            className=" inline-block w-16 h-16 rounded-full overflow-hidden shadow-lg"
                          ></img>
                        </div>
                        <Link
                          to={`/events/${eventId}/candidates/${candidate.id}/edit`}
                          className="w-1/6 text-blue-400 overflow-x-auto"
                          target="_blank" // Add target="_blank" to open link in a new tab
                          rel="noopener noreferrer" // Add rel="noopener noreferrer" for security reasons
                        >
                          {candidate.name}
                        </Link>
                        <div className=" w-1/6 overflow-x-auto ">
                          <span className="bg-red-500 p-1 inline-block rounded-lg">
                            {candidate.status}
                          </span>
                        </div>
                        <div className=" inline-block w-1/6 overflow-x-auto">
                          {candidate.sex}
                        </div>
                        <div className=" inline-block w-1/6 overflow-x-auto">
                          10
                        </div>
                        <Link
                          to={`https://devnet.suivision.xyz/object/${candidate.suiCandidateId}`}
                          className="w-1/6 text-blue-400 overflow-x-auto max-h-10"
                          target="_blank" // Add target="_blank" to open link in a new tab
                          rel="noopener noreferrer" // Add rel="noopener noreferrer" for security reasons
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
