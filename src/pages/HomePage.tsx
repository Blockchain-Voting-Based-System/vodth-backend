import { ConnectButton } from "@mysten/dapp-kit";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { SuiAccount } from "../components/account/SuiAccount";
import RequestFaucetButton from "../components/events/RequestFaucetButton";
import { WalletStatus } from "../components/wallet/WalletStatus";
import { keypairFromSecretKey } from "../utils/sui";
const HomePage = () => {
  function testMnenic() {
    const words =
      "hybrid bulk segment twelve puzzle evoke hockey defy lava sleep sword want";
    const keypairs = Ed25519Keypair.deriveKeypair(words);
    console.log(keypairs.getSecretKey());

    console.log(keypairs);
    console.log(keypairFromSecretKey(keypairs.getSecretKey()));
    // const address = keypairs.getPublicKey().toSuiAddress();
    // const keyPair = decodeSuiPrivateKey(privateKeyBase64);
    // return Ed25519Keypair.fromSecretKey(keyPair.secretKey);
  }
  return (
    <>
      <div className="bg-gray-500 p-10 rounded-lg">
        <ConnectButton></ConnectButton>
        <WalletStatus />
        <SuiAccount />
        <RequestFaucetButton></RequestFaucetButton>
        <button
          onClick={(e) => {
            e.preventDefault();
            testMnenic();
          }}
        >
          Test Mnemonic
        </button>
      </div>
    </>
  );
};

export default HomePage;
