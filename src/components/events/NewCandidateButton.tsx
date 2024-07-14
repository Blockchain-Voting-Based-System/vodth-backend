import { Modal } from "@polymedia/webutils";
import { useState } from "react";
import { NewCandidate } from "../../utils/newCandidate";
import { AccountData } from "../../utils/suiType";

type NewCandidateButtonProps = {
  account: AccountData;
};

export const NewCandidateButton = ({ account }: NewCandidateButtonProps) => {
  const [modalContent, setModalContent] = useState<string>("");

  async function createCandidate() {
    const event_id =
      "0xf0888aeed150159cafa654daa8556e05f14d2ebd564a4e25116dd7329eb73989";
    setModalContent("🚀 Creating Candidate...");
    const result = await NewCandidate(event_id);

    if (result.success) {
      setModalContent("🎉 Candidate created successfully!");
      console.log(result.suiCandidateId);
    } else {
      setModalContent("❌ Candidate creation failed!");
    }
  }
  return (
    <div id="page">
      <Modal content={modalContent} />
      <div className="account" key={account.userAddr}>
        <button
          className={"btn-send bg-blue-500 px-10 py-2 text-white rounded-lg"}
          onClick={() => {
            createCandidate();
          }}
        >
          Create Candidate
        </button>
      </div>
    </div>
  );
};
