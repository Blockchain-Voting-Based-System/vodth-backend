import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { NetworkName } from "@polymedia/suits";
const NETWORK: NetworkName = "devnet";

const suiClient = new SuiClient({
  url: getFullnodeUrl(NETWORK),
});

const suiCandidate = (createdObjects: any) => {
  // const owner = createdObjects?.[0]?.owner?.objectOwner;
  // const candidate = createdObjects?.[1]?.reference?.objectId;
  // if (owner === candidate) {
  //   return candidate;
  // }
  // return createdObjects?.[0]?.reference?.objectId;

  const owner_id_0 = createdObjects[0].owner.ObjectOwner;
  const owner_id_1 = createdObjects[1].owner.ObjectOwner;
  const candidate_id_0 = createdObjects[0].reference.objectId;
  const candidate_id_1 = createdObjects[1].reference.objectId;

  if (owner_id_0 == candidate_id_1 && candidate_id_0 != owner_id_1) {
    return candidate_id_0;
  } else {
    return candidate_id_1;
  }
};

type CandidateResult = {
  suiCandidateId: string | undefined | any;
  success: boolean;
};
export async function NewCandidate(event_id: String): Promise<CandidateResult> {
  let candidateResult: CandidateResult = {
    suiCandidateId: "",
    success: false,
  };
  const MNEMONICS = import.meta.env.VITE_MNEMONICS;
  const new_candidate = import.meta.env.VITE_NEW_CANDIDATE;
  const ephemeralKeyPair = Ed25519Keypair.deriveKeypair(MNEMONICS);
  const userAdd = ephemeralKeyPair.getPublicKey().toSuiAddress();
  const txb = new TransactionBlock();
  txb.setSender(userAdd);
  txb.moveCall({
    target: new_candidate,
    arguments: [txb.pure(event_id)],
  });

  await suiClient
    .signAndExecuteTransactionBlock({
      transactionBlock: txb,
      signer: ephemeralKeyPair,
      options: {
        showEffects: true,
      },
    })
    .then((result) => {
      candidateResult.success = true;
      candidateResult.suiCandidateId = suiCandidate(result?.effects?.created);
    })
    .catch((error: unknown) => {
      console.warn("[sendTransaction] executeTransactionBlock failed:", error);
      candidateResult.success = false;
    });

  return candidateResult;
}
