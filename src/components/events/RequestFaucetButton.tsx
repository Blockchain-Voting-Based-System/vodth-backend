import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { getFaucetHost, requestSuiFromFaucetV1 } from "@mysten/sui.js/faucet";
import { MIST_PER_SUI } from "@mysten/sui.js/utils";

// replace <YOUR_SUI_ADDRESS> with your actual address, which is in the form 0x123...
const MY_ADDRESS =
  "0x4e7f8da60b23f772a8c23654585e344443b453ebc02db3f39f9ed238425459db";

// create a new SuiClient object pointing to the network you want to use
const suiClient = new SuiClient({ url: getFullnodeUrl("testnet") });

// Convert MIST to Sui
const balance = (balance: {
  coinType?: string;
  coinObjectCount?: number;
  totalBalance: any;
  lockedBalance?: Record<string, string>;
}) => {
  return Number.parseInt(balance.totalBalance) / Number(MIST_PER_SUI);
};

// store the JSON representation for the SUI the address owns before using faucet
const suiBefore = await suiClient.getBalance({
  owner: MY_ADDRESS,
});

// store the JSON representation for the SUI the address owns after using faucet
const suiAfter = await suiClient.getBalance({
  owner: MY_ADDRESS,
});

const RequestFaucetButton = () => {
  return (
    <>
      <button
        className="px-8 py-2 bg-slate-500 rounded-md"
        onClick={async () => {
          await requestSuiFromFaucetV1({
            // host: getFaucetHost("devnet"),
            host: getFaucetHost("testnet"),
            recipient: MY_ADDRESS,
          });

          console.log(
            `Balance before faucet: ${balance(suiBefore)} SUI. Balance after: ${balance(
              suiAfter,
            )} SUI. Hello, SUI!`,
          );
        }}
      >
        Request SUI from Faucet
      </button>
    </>
  );
};

export default RequestFaucetButton;
