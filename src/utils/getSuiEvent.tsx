import {
  SuiClient,
  SuiObjectResponse,
  getFullnodeUrl,
} from "@mysten/sui.js/client";
import { NetworkName } from "@polymedia/suits";

// const NETWORK: NetworkName = "devnet";
const NETWORK: NetworkName = "testnet";

const suiClient = new SuiClient({
  url: getFullnodeUrl(NETWORK),
});

export async function getEventObject(
  suiObjectID: string,
): Promise<SuiObjectResponse> {
  return await suiClient
    .getObject({
      id: suiObjectID,
      options: { showContent: true, showDisplay: true },
    })
    .then((result: SuiObjectResponse) => {
      return result;
    })
    .catch((error: SuiObjectResponse) => {
      return error;
    });
}

export async function getEventObjects(
  suiObjectID: Array<string>,
): Promise<SuiObjectResponse[]> {
  return await suiClient
    .multiGetObjects({ ids: suiObjectID, options: { showContent: true } })
    .then((result: SuiObjectResponse[]) => {
      return result;
    })
    .catch((error: SuiObjectResponse[]) => {
      return error;
    });
}
