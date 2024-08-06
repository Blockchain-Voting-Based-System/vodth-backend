// import { Modal } from "@polymedia/webutils";
// import { useState } from "react";
// import { AccountData } from "../../utils/suiType";
// import { NewEvent } from "../../utils/newEvent";

// type NewEventButtonProps = {
//   account: AccountData;
// };

// export const NewEventButton = ({ account }: NewEventButtonProps) => {
//   const [modalContent, setModalContent] = useState<string>("");

//   async function createEvent() {
//     setModalContent("🚀 Creating Event...");
//     const result = await NewEvent(account);

//     if (result.success) {
//       console.log(result.event_id);

//       setModalContent("🎉 Event created successfully!");
//     } else {
//       setModalContent("❌ Event creation failed!");
//     }
//   }
//   return (
//     <div id="page">
//       <Modal content={modalContent} />
//       <div className="account" key={account.userAddr}>
//         <button
//           className={"btn-send bg-blue-500 px-10 py-2 text-white rounded-lg"}
//           onClick={() => {
//             createEvent();
//           }}
//         >
//           Create Poll
//         </button>
//       </div>
//     </div>
//   );
// };
