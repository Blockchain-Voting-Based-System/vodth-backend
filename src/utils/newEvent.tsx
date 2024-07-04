import { TransactionBlock } from "@mysten/sui.js/transactions";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { NetworkName } from "@polymedia/suits";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
const NETWORK: NetworkName = "devnet";

const suiClient = new SuiClient({
  url: getFullnodeUrl(NETWORK),
});

type EventResult = {
  suiEventId: string | undefined;
  success: boolean;
};

export async function NewEvent(): Promise<EventResult> {
  let eventResult: EventResult = {
    suiEventId: "",
    success: false,
  };
  const MNEMONICS = import.meta.env.VITE_MNEMONICS;
  const ephemeralKeyPair = Ed25519Keypair.deriveKeypair(MNEMONICS);
  const userAddr = ephemeralKeyPair.getPublicKey().toSuiAddress();
  const new_event = import.meta.env.VITE_NEW_EVENT;
  const txb = new TransactionBlock();
  const [event] = txb.moveCall({ target: new_event });
  txb.setSender(userAddr);
  txb.transferObjects([event], userAddr);
  await suiClient
    .signAndExecuteTransactionBlock({
      transactionBlock: txb,
      signer: ephemeralKeyPair,
      options: {
        showEffects: true,
      },
    })
    .then((result) => {
      eventResult.success = true;
      eventResult.suiEventId =
        result.effects?.created?.[0]?.reference?.objectId;
    })
    .catch((error: unknown) => {
      console.warn("[sendTransaction] executeTransactionBlock failed:", error);
      eventResult.success = false;
    });

  return eventResult;
}
