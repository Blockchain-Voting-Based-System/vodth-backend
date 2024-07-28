import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { NetworkName } from "@polymedia/suits";

// const NETWORK: NetworkName = "devnet";
const NETWORK: NetworkName = "testnet";

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
export async function NewBallot(
  event_id: String,
  candidate_id: string,
  voter: string,
  candidate: string,
): Promise<CandidateResult> {
  let candidateResult: CandidateResult = {
    suiCandidateId: "",
    success: false,
  };
  const MNEMONICS = import.meta.env.VITE_MNEMONICS;
  const new_ballot = import.meta.env.VITE_NEW_BALLOT;
  const ephemeralKeyPair = Ed25519Keypair.deriveKeypair(MNEMONICS);
  const userAdd = ephemeralKeyPair.getPublicKey().toSuiAddress();
  const txb = new TransactionBlock();
  txb.setSender(userAdd);
  txb.moveCall({
    target: new_ballot,
    arguments: [
      txb.pure(event_id),
      txb.pure(candidate_id),
      txb.pure(voter),
      txb.pure(candidate),
    ],
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
