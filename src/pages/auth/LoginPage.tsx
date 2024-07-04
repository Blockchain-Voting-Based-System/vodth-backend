import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { generateNonce, generateRandomness } from "@mysten/zklogin";
import { NetworkName } from "@polymedia/suits";
import { useEffect, useRef } from "react";
// import "./App.less";
import Logo from "./logo.png";

/* Configuration */

const NETWORK: NetworkName = "devnet";
const MAX_EPOCH = 2; // keep ephemeral keys active for this many Sui epochs from now (1 epoch ~= 24h)

const suiClient = new SuiClient({
  url: getFullnodeUrl(NETWORK),
});

/* Session storage keys */

const setupDataKey = "zklogin-demo.setup";
const accountDataKey = "zklogin-demo.accounts";

/* Types */

type OpenIdProvider = "Google" | "Twitch" | "Facebook";

type SetupData = {
  provider: OpenIdProvider;
  maxEpoch: number;
  randomness: string;
  ephemeralPrivateKey: string;
};

type AccountData = {
  provider: OpenIdProvider;
  userAddr: string;
  zkProofs: any;
  ephemeralPrivateKey: string;
  userSalt: string;
  sub: string;
  aud: string;
  maxEpoch: number;
};

export const LoginPage: React.FC = () => {
  const accounts = useRef<AccountData[]>(loadAccounts()); // useRef() instead of useState() because of setInterval()

  useEffect(() => {
    fetchBalances(accounts.current);
    const interval = setInterval(() => fetchBalances(accounts.current), 5_000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  /* zkLogin end-to-end */

  /**
   * Start the zkLogin process by getting a JWT token from an OpenID provider.
   * https://docs.sui.io/concepts/cryptography/zklogin#get-jwt-token
   */
  async function beginZkLogin(provider: OpenIdProvider) {
    // Create a nonce
    const { epoch } = await suiClient.getLatestSuiSystemState();
    const maxEpoch = Number(epoch) + MAX_EPOCH; // the ephemeral key will be valid for MAX_EPOCH from now
    const ephemeralKeyPair = new Ed25519Keypair();
    const randomness = generateRandomness();
    const nonce = generateNonce(
      ephemeralKeyPair.getPublicKey(),
      maxEpoch,
      randomness,
    );

    // Save data to session storage so completeZkLogin() can use it after the redirect
    saveSetupData({
      provider,
      maxEpoch,
      randomness: randomness.toString(),
      ephemeralPrivateKey: ephemeralKeyPair.getSecretKey(),
    });

    // Start the OAuth flow with the OpenID provider
    const urlParamsBase = {
      nonce: nonce,
      redirect_uri: window.location.origin,
      response_type: "id_token",
      scope: "openid",
    };
    let loginUrl: string;
    switch (provider) {
      case "Google": {
        const urlParams = new URLSearchParams({
          ...urlParamsBase,
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        });
        loginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${urlParams.toString()}`;
        alert(urlParams.toString());
        break;
      }
      case "Twitch": {
        const urlParams = new URLSearchParams({
          ...urlParamsBase,
          client_id: import.meta.env.VITE_TWITCH_CLIENT_ID,
          force_verify: "true",
          lang: "en",
          login_type: "login",
        });
        loginUrl = `https://id.twitch.tv/oauth2/authorize?${urlParams.toString()}`;
        break;
      }
      case "Facebook": {
        const urlParams = new URLSearchParams({
          ...urlParamsBase,
          client_id: import.meta.env.VITE_FACEBOOK_CLIENT_ID,
        });
        loginUrl = `https://www.facebook.com/v19.0/dialog/oauth?${urlParams.toString()}`;
        break;
      }
    }
    window.location.replace(loginUrl);
  }

  /**
   * Get the SUI balance for each account
   */
  async function fetchBalances(accounts: AccountData[]) {
    if (accounts.length == 0) {
      return;
    }
    const newBalances = new Map<string, number>();
    for (const account of accounts) {
      const suiBalance = await suiClient.getBalance({
        owner: account.userAddr,
        coinType: "0x2::sui::SUI",
      });
      newBalances.set(
        account.userAddr,
        +suiBalance.totalBalance / 1_000_000_000,
      );
    }
  }

  /* Session storage */

  function saveSetupData(data: SetupData) {
    sessionStorage.setItem(setupDataKey, JSON.stringify(data));
  }

  function loadAccounts(): AccountData[] {
    const dataRaw = sessionStorage.getItem(accountDataKey);
    if (!dataRaw) {
      return [];
    }
    const data: AccountData[] = JSON.parse(dataRaw);
    return data;
  }

  return (
    <div id="page">
      <div className="h-screen flex items-center justify-center">
        <div className="relative flex flex-col flex-nowrap items-center justify-center w-popup-width min-h-popup-minimum max-h-popup-height overflow-hidden shadow-lg rounded-xl">
          <div className="rounded-20 bg-sui-lightest shadow-wallet-content flex flex-col items-center px-7 py-6 h-full overflow-auto">
            <div className="shrink-0">
              <img className="max-h-32" src={Logo} alt="" />
            </div>
            <div className="text-center mx-auto mt-2">
              <h1 className="my-0 md:text-heading2 text-heading3 text-gray-90 font-bold leading-tight">
                Welcome to Vodth
              </h1>
              <div className="mt-2">
                <div className="font-medium text-pBody text-gray-75 mt-2">
                  Your blockchain based voting system
                </div>
              </div>
            </div>
            <div className="w-full h-full mt-3.5 flex justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="280"
                height="281"
                fill="none"
                role="img"
              >
                <path
                  fill="url(#WelcomeSplash_svg__a)"
                  d="M0 12.5C0 5.873 5.373.5 12 .5h256c6.627 0 12 5.373 12 12v256c0 6.627-5.373 12-12 12H12c-6.627 0-12-5.373-12-12v-256Z"
                ></path>
                <path
                  fill="url(#WelcomeSplash_svg__b)"
                  stroke="#000"
                  strokeWidth="1.499"
                  d="M21.224 32.535c4.956-6.655 12.17-5.349 15.152-3.869.958-7.132 8.697-9.47 12.419-9.146 12.053 1.053 12.389 13.19 10.27 23.642-1.691 8.364-5.63 15.33-7.385 17.77-2.71-.321-10.286-1.839-18.91-5.3-10.777-4.325-17.75-14.78-11.552-23.1l.006.003Z"
                ></path>
                <path
                  fill="#F5CF54"
                  stroke="#000"
                  strokeWidth="1.8"
                  d="M175.285 104.087c-1.501-1.111-3.24-1.587-4.979-1.587-2.687 0-5.374 1.269-7.034 3.65l-29.875 42.13-16.598-16.662a8.603 8.603 0 0 0-6.085-2.539c-2.213 0-4.426.873-6.165 2.539a8.69 8.69 0 0 0 0 12.298l23.868 23.882 6.323 6.347.87.873.711-1.031 5.216-7.379 35.803-50.541c2.687-3.808 1.818-9.203-2.055-11.98Z"
                ></path>
                <path
                  fill="#F5CF54"
                  stroke="#000"
                  strokeWidth="1.276"
                  d="m246.156 41.685-8.66-3.936c-1.994-.893-3.464-2.782-3.831-4.934l-2.73-14.591c-.314-1.417-1.627-2.467-3.096-2.467-1.417 0-2.572.84-2.992 2.152-.052.053-.052.158-.105.263l-3.359 14.643a6.777 6.777 0 0 1-3.831 4.671l-10.498 4.672c-1.207.524-1.942 1.732-1.837 3.096.105 1.312.945 2.415 2.257 2.782l9.763 2.834a6.769 6.769 0 0 1 4.723 5.039l2.625 12.072a3.088 3.088 0 0 0 3.044 2.466c1.469 0 2.729-1.05 3.044-2.466l2.519-11.81a6.92 6.92 0 0 1 3.937-4.828l8.975-3.937c1.155-.525 1.889-1.574 1.889-2.834s-.682-2.362-1.837-2.887Z"
                ></path>
                <path
                  fill="#F5CF54"
                  stroke="#000"
                  strokeWidth="1.276"
                  d="M217.919 60.895c-1.574-.367-3.097-.577-4.566-.787h-.053c-.105 0-.157 0-.21-.053 0-.052 0-.157-.052-.315a705.64 705.64 0 0 1-.315-3.254c-.052-.472-.105-.892-.105-1.364-.052-.63-.525-1.208-1.155-1.312-.052.104-.21.104-.315.104-.524 0-.997.263-1.312.735-.262.42-.42.893-.472 1.47-.105 1.365-.263 2.677-.367 4.041v.053c-.21 0-.42.052-.578.105-.105 0-.21.052-.367.052-.945.105-1.942.21-2.887.315l-.84.105c-.42.053-.735.263-.997.578a1.443 1.443 0 0 0-.315 1.102v.157c.105.735.63 1.26 1.365 1.312l1.417.158c.945.105 1.942.21 2.887.262h.262c0 .053 0 .158.053.263.052.367.052.734.104 1.102 0 .21.053.472.053.682l.157 1.575.105 1.154c.053.735.683 1.313 1.418 1.365h.104c.735 0 1.365-.525 1.47-1.207.263-1.207.367-2.415.525-3.622.052-.367.105-.787.157-1.154 0-.105 0-.158.053-.21h.21c.315 0 .63-.053.945-.053.577-.052 1.154-.105 1.784-.157.42-.053.84-.105 1.207-.158.158 0 .315-.052.473-.052a1.514 1.514 0 0 0 1.312-1.417c.052-.735-.42-1.365-1.155-1.575ZM266.73 27.199c-3.096-.735-6.14-1.102-9.132-1.47h-.105c-.367-.052-1.365-.157-1.627-.315-.158-.262-.263-1.26-.315-1.627-.263-2.1-.42-4.251-.63-6.35-.105-.893-.157-1.733-.262-2.625-.053-.63-.525-1.154-1.155-1.312-.052.053-.158.053-.315.053-.525 0-.997.262-1.26.682-.419.63-.629 1.364-.734 2.204-.263 2.52-.525 5.196-.735 7.873-.105 1.26-.525 1.417-1.207 1.47-.473.052-.893.105-1.313.157-.262.053-.524.105-.787.105-2.204.262-4.356.473-6.561.735l-.997.105c-.42.052-.787.262-.997.577-.21.315-.367.735-.315 1.102l.053.21v.158c.105.735.629 1.26 1.364 1.312.997.105 1.995.21 2.992.262 1.942.158 3.936.368 5.878.525 1.103.105 1.47.263 1.627.368.105.105.263.472.42 1.47.105.734.158 1.469.21 2.204.053.472.105.944.105 1.364.105 1.208.263 2.415.368 3.622l.157 1.784c.053.735.682 1.313 1.417 1.365h.105c.682 0 1.312-.525 1.47-1.207.472-2.362.787-4.671 1.049-6.876.105-.735.158-1.522.263-2.257.157-1.05.787-1.68 1.942-1.784.63-.053 1.26-.105 1.837-.158l3.621-.315c.84-.052 1.627-.21 2.415-.314.315-.053.682-.105.997-.158a1.512 1.512 0 0 0 1.312-1.417c.053-.735-.472-1.365-1.155-1.522Z"
                ></path>
                <path
                  fill="#84DFFF"
                  stroke="#000"
                  strokeLinejoin="round"
                  strokeMiterlimit="2"
                  strokeWidth="1.29"
                  d="M81.045 213.99c-.525-.71-2.888-.331-4.32-.074-5.31.988-7.958-2.005-6.608-7.302.315-1.224.69-3.388.184-3.739-2.002-1.352-4.334-2.452-6.745-2.971-.073-.032-.18.01-.339.072-.743.292-1.855 1.829-2.508 2.819-1.09 1.59-2.283 2.609-3.451 3.068-2.336.919-4.625-.382-6.39-3.782-.502-.964-1.507-2.586-1.952-2.472-1.623.394-3.278.861-4.87 1.487-1.009.396-2.05.867-2.975 1.475-.649.377-.234 3.147.222 4.618.59 1.968.274 3.192-1.198 4.749-.63.736-1.257 1.166-1.947 1.438-1.328.521-2.66.251-4.138-.391-1.309-.524-2.271-.634-3.12-.3-1.01.396-1.715 1.407-2.234 2.894-.917 2.499-2.647 4.646 1.055 6.736 5.357 3.027 5.212 7.178-.283 10.194-2.476 1.34-2.889 2.786-1.72 5.137 1.15 2.298 1.308 5.353 5.477 4.264 6.003-1.566 9.01 1.408 7.149 7.273-1.473 4.673 2.15 4.533 4.385 5.854 1.138.714 2.027.792 2.717.521.903-.355 1.556-1.345 2.273-2.483 1.114-1.843 2.318-2.989 3.54-3.469 2.175-.855 4.358.487 6.357 3.857.617 1.102 1.897 2.798 2.575 2.654 1.304-.268 2.64-.61 3.862-1.09 1.061-.418 2.081-.941 2.965-1.655.799-.619.225-3.327-.114-4.966-.574-2.708.905-5.184 3.134-6.06a5.145 5.145 0 0 1 3.04-.217c1.554.367 3.055.754 5.085 1.24 1.085-2.382 2.34-4.648 2.971-7.096.217-.696-1.213-2.151-2.204-2.8-5.312-3.534-5.297-7.084.137-10.565.978-.629 2.596-1.815 2.473-2.439-.407-2.284-1.143-4.623-2.485-6.479ZM58.41 236.393a9.24 9.24 0 0 1-11.83-5.616c-1.65-4.668.821-9.917 5.493-11.753l.212-.084c4.713-1.73 10.031.885 11.744 5.711 1.735 4.879-.543 9.686-5.374 11.585-.032.074-.138.115-.245.157Z"
                ></path>
                <path
                  fill="#F5CF54"
                  stroke="#000"
                  strokeWidth="1.568"
                  d="M259.499 172.183c-5.668 12.905-20.652 18.815-33.383 13.223-12.731-5.592-18.535-20.582-12.848-33.53 5.687-12.948 20.652-18.815 33.383-13.223 12.731 5.592 18.516 20.625 12.848 33.53Z"
                ></path>
                <path
                  fill="#000"
                  d="M255.905 164.903c.249-2.689-.503-4.989-2.131-6.948-1.652-2.022-3.767-3.106-6.283-3.278-2.56-.192-4.773.599-6.683 2.351-1.934 1.69-2.97 3.931-3.2 6.577-.229 2.646.523 4.946 2.194 6.924 1.671 1.978 3.767 3.106 6.327 3.298 2.516.172 4.729-.618 6.639-2.371 1.954-1.734 3.014-3.911 3.137-6.553Z"
                ></path>
                <path
                  fill="#fff"
                  d="M253.036 163.176c.213-.839.089-1.619-.309-2.364-.398-.745-1.036-1.181-1.876-1.394-.777-.238-1.538-.157-2.239.26-.765.442-1.244 1.061-1.438 1.857-.194.796-.07 1.576.328 2.321.399.745.974 1.205 1.77 1.399.839.213 1.6.133 2.302-.284.808-.423 1.287-1.042 1.462-1.795ZM249.007 167.627c.209.351.249.732.14 1.099-.109.366-.33.632-.681.841-.331.165-.731.249-1.098.14-.366-.11-.651-.287-.841-.681-.165-.332-.249-.731-.14-1.098.11-.367.349-.676.7-.885.351-.209.688-.268 1.055-.159.372.216.7.412.865.743Z"
                ></path>
                <path
                  fill="#000"
                  d="M233.095 152.759c-1.652-2.022-3.768-3.106-6.284-3.278-2.559-.192-4.772.599-6.683 2.351-1.934 1.69-3.013 3.912-3.199 6.577-.23 2.647.522 4.947 2.193 6.925 1.671 1.978 3.768 3.106 6.327 3.297 2.516.172 4.729-.618 6.639-2.371 1.954-1.733 3.014-3.911 3.138-6.552.229-2.647-.46-4.971-2.131-6.949Z"
                ></path>
                <path
                  fill="#fff"
                  d="M232.775 157.854c.213-.84.089-1.62-.309-2.365-.399-.745-1.037-1.181-1.876-1.394-.777-.238-1.538-.157-2.283.241-.764.442-1.243 1.061-1.437 1.857-.195.796-.071 1.576.328 2.321.398.745.973 1.205 1.769 1.399.84.213 1.601.133 2.302-.284.852-.404 1.312-.979 1.506-1.775ZM228.728 162.347c.209.351.249.731.14 1.098-.11.367-.33.633-.681.842-.332.165-.731.248-1.098.139-.367-.109-.652-.286-.841-.68a1.346 1.346 0 0 1-.14-1.098c.109-.367.349-.677.7-.885a1.35 1.35 0 0 1 1.054-.159c.391.172.657.392.866.743Z"
                ></path>
                <path
                  stroke="#000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.568"
                  d="M241.248 176.089a10.19 10.19 0 0 1-2.379 2.583c-2.165 1.745-4.495 2.328-6.921 1.833-2.426-.496-4.35-2.015-5.618-4.438a9.373 9.373 0 0 1-1.142-3.3"
                ></path>
                <path
                  fill="#84DFFF"
                  stroke="#000"
                  strokeWidth="0.945"
                  d="M63.32 122.42c1.635-.649 4.74-2.984 3.951-7.304-.893-4.844-6.248-6.17-11.376-4.516 3.47-3.07 5.619-6.914 2.426-11.274-1.467-1.311-5.214-3.34-8.129-.9-.649-1.636-2.983-4.741-7.303-3.952-4.656.863-6.096 5.869-4.69 10.785-3.127-3.713-7.082-6.075-11.603-2.798-1.311 1.467-3.34 5.214-.9 8.129-1.636.649-4.742 2.983-3.952 7.303.893 4.845 6.248 6.171 11.376 4.517-3.47 3.07-5.619 6.913-2.426 11.273 1.467 1.312 5.214 3.34 8.129.901.649 1.635 2.983 4.741 7.303 3.952 4.656-.863 6.096-5.869 4.69-10.786 3.127 3.713 7.042 6.063 11.603 2.799 1.311-1.467 3.327-5.174.9-8.129Z"
                ></path>
                <path
                  stroke="#000"
                  strokeWidth="0.945"
                  d="M33.148 122.464 55.894 110.6M50.843 127.804 38.187 105.3"
                ></path>
                <path
                  fill="url(#WelcomeSplash_svg__c)"
                  stroke="#000"
                  strokeWidth="0.945"
                  d="M41.831 125.015a8.878 8.878 0 1 0 5.326-16.939 8.878 8.878 0 0 0-5.326 16.939Z"
                ></path>
                <path
                  fill="#84DFFF"
                  stroke="#000"
                  strokeWidth="1.074"
                  d="M198.648 212.84c-22.81-7.631-47.998 5.64-57.648 29.846l28.63 9.577c3.966-7.472 11.823-11.487 18.883-9.125 7.061 2.362 10.92 10.295 9.592 18.651l28.629 9.577c6.819-25.153-5.275-50.896-28.086-58.526Z"
                ></path>
                <path
                  fill="#EB8865"
                  stroke="#000"
                  strokeWidth="1.074"
                  d="M195.144 223.314c-17.069-5.71-36.018 4.515-43.346 22.941l17.806 5.957c3.966-7.473 11.823-11.488 18.883-9.126 7.061 2.362 10.92 10.296 9.592 18.651l17.845 5.969c5.233-19.126-3.723-38.643-20.78-44.392Z"
                ></path>
                <path
                  fill="#F5CF54"
                  stroke="#000"
                  strokeWidth="1.074"
                  d="M191.952 232.857c-12.414-4.152-26.12 3.038-31.736 16.214l9.427 3.153c3.966-7.472 11.823-11.487 18.883-9.125 7.061 2.362 10.92 10.295 9.592 18.651l9.427 3.153c3.404-13.915-3.217-27.906-15.593-32.046Z"
                ></path>
                <path
                  fill="#EB8865"
                  d="M137.7 75.511c12.023 3.254 24.471-4.093 27.805-16.409 3.333-12.316-3.712-24.937-15.734-28.191-12.023-3.254-24.472 4.093-27.805 16.408-3.333 12.316 3.711 24.938 15.734 28.192Z"
                ></path>
                <path
                  fill="#84DFFF"
                  stroke="#000"
                  strokeLinejoin="round"
                  strokeMiterlimit="2"
                  strokeWidth="1.967"
                  d="M137.052 77.273c-1.486-.402-2.983-.978-4.398-1.646-1.97-.932-3.748-2.154-5.323-3.492a24.232 24.232 0 0 1-6.477-8.705c-1.419-3.176-2.169-6.514-2.209-9.944-.004-1.88.152-3.72.587-5.539l.177-.864.23-.85.029-.105c.441-1.42.92-2.772 1.545-4.027 1.139-2.313 2.635-4.472 4.446-6.319 2.354-2.383 5.1-4.318 8.195-5.646 3.538-1.493 7.246-2.142 11.126-1.946 1.572.083 3.102.326 4.603.676l.106.028.85.23.159.043c1.473.456 2.969 1.032 4.37 1.753a25.91 25.91 0 0 1 7.165 5.529 24.733 24.733 0 0 1 4.656 7.642c1.804 4.705 2.136 9.582 1.094 14.486a24.152 24.152 0 0 1-2.116 5.923 24.33 24.33 0 0 1-4.768 6.46c-2.326 2.276-4.961 4.013-7.907 5.21-4.68 1.925-9.6 2.417-14.624 1.4-.507-.024-1.038-.168-1.516-.297Zm3.287-4.353c.472-.271.906-.61 1.378-.88a34.413 34.413 0 0 0 6.15-5.46 27.198 27.198 0 0 0-5.171-2.368l-2.357 8.708Zm-14.94-9.229c1.641 2.78 3.759 5.063 6.353 6.848-1.071-2.57-1.756-5.091-2.186-7.715a30.69 30.69 0 0 0-4.167.867Zm25.695 5.074c-1.612 1.957-3.447 3.682-5.547 5.336a20.736 20.736 0 0 0 8.471-2.665 42.744 42.744 0 0 0-2.924-2.671Zm-17.587-6.185c.541 3.053 1.565 6.008 3.042 8.972l2.285-8.442a35.257 35.257 0 0 0-5.327-.53ZM122.883 49.62a20.755 20.755 0 0 0 .864 10.491c1.746-.553 3.554-.919 5.387-1.163-.111-2.538.057-5.056.545-7.489l-6.796-1.84Zm30.593 16.03c1.367 1.053 2.638 2.252 3.828 3.543a20.752 20.752 0 0 0 6.037-8.624l-6.477-1.753a35.374 35.374 0 0 1-3.388 6.833Zm-9.746-5.26c2.293.792 4.476 1.782 6.533 3.022a26.589 26.589 0 0 0 2.778-5.63l-8.018-2.17-1.293 4.779Zm-10.228-7.896a25.63 25.63 0 0 0-.413 6.156c2.282-.009 4.56.209 6.833.653l1.293-4.779-7.713-2.03Zm30.821 4.238c.3-1.742.374-3.489.236-5.293a23.293 23.293 0 0 0-.912-4.634c-1.692.568-3.447.947-5.227 1.207.048 2.349-.131 4.694-.575 6.967l6.478 1.753Zm-10.301-2.788a26.9 26.9 0 0 0 .428-5.582c-2.469.072-4.906-.188-7.339-.676l-1.106 4.089 8.017 2.17Zm-23.309-6.308a32.455 32.455 0 0 1 2.936-6.214c-1.512-1.15-2.861-2.484-4.142-3.857-2.499 2.287-4.38 5.026-5.59 8.232l6.796 1.84Zm11.469 3.104 1.106-4.088c-2.24-.778-4.422-1.767-6.427-2.993-.716 1.173-1.912 3.699-2.378 4.998l7.699 2.083Zm6.017-6.862c1.94.41 3.952.556 5.887.567-.562-3.4-1.673-6.664-3.358-9.912l-2.529 9.345Zm-8.98-3.456a27.178 27.178 0 0 0 5.172 2.368l2.471-9.132c-3.04 1.97-5.578 4.188-7.643 6.764Zm-6.557-5.25c.89.924 2.436 2.368 3.224 3.037a39.055 39.055 0 0 1 6.134-6.033c-3.26.258-6.442 1.277-9.358 2.995Zm23.081.832a39.8 39.8 0 0 1 1.102 3.09c.529 1.625.87 3.313 1.157 4.987 1.365-.2 2.759-.508 4.075-.95a20.75 20.75 0 0 0-6.334-7.127Z"
                ></path>
                <defs>
                  <linearGradient
                    id="WelcomeSplash_svg__a"
                    x1="140"
                    x2="140"
                    y1="0.5"
                    y2="280.5"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#84DFFF"></stop>
                    <stop offset="0.599" stopColor="#fff"></stop>
                  </linearGradient>
                  <linearGradient
                    id="WelcomeSplash_svg__b"
                    x1="34.288"
                    x2="51.547"
                    y1="24.612"
                    y2="61"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0.41" stopColor="#F5CF54"></stop>
                    <stop offset="0.85" stopColor="#84DFFF"></stop>
                  </linearGradient>
                  <radialGradient
                    id="WelcomeSplash_svg__c"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientTransform="rotate(107.455 -20.465 74.673) scale(8.28488 8.28487)"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0.54" stopColor="#F5CF54"></stop>
                    <stop offset="0.89" stopColor="#EB8865"></stop>
                  </radialGradient>
                </defs>
              </svg>
            </div>
            <div className="flex flex-col gap-3 mt-3.5 w-full items-center">
              <div className="font-medium text-pBody text-steel-dark">
                Sign in with your preferred service
              </div>
              <div className="flex w-full flex-row gap-2">
                <div className="flex-1">
                  <button
                    onClick={() => {
                      beginZkLogin("Google");
                    }}
                    key="Google"
                    className="h-10 w-full rounded-xl inline-flex items-center justify-center gap-3 px-4 py-2 disabled:opacity-40 focus:opacity-80 bg-white text-steel-dark border border-solid border-steel hover:border-steel-dark"
                    aria-label="Sign in with Google"
                    type="button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      fill="none"
                      viewBox="0 0 25 24"
                      className="h-6 w-6"
                    >
                      <path fill="transparent" d="M.5 0h24v24H.5z"></path>
                      <path
                        fill="#4285F4"
                        fillRule="evenodd"
                        d="M23.54 12.261c0-.815-.073-1.6-.21-2.352H12.5v4.448h6.19a5.29 5.29 0 0 1-2.296 3.471v2.886h3.717c2.174-2.002 3.429-4.95 3.429-8.453Z"
                        clipRule="evenodd"
                      ></path>
                      <path
                        fill="#34A853"
                        fillRule="evenodd"
                        d="M12.5 23.5c3.105 0 5.708-1.03 7.61-2.786l-3.716-2.886c-1.03.69-2.347 1.098-3.894 1.098-2.995 0-5.53-2.023-6.435-4.741H2.223v2.98A11.496 11.496 0 0 0 12.5 23.5Z"
                        clipRule="evenodd"
                      ></path>
                      <path
                        fill="#FBBC05"
                        fillRule="evenodd"
                        d="M6.065 14.185A6.913 6.913 0 0 1 5.705 12c0-.758.13-1.495.36-2.185v-2.98H2.223A11.496 11.496 0 0 0 1 12c0 1.856.444 3.612 1.223 5.165l3.842-2.98Z"
                        clipRule="evenodd"
                      ></path>
                      <path
                        fill="#EA4335"
                        fillRule="evenodd"
                        d="M12.5 5.074c1.688 0 3.204.58 4.396 1.72l3.298-3.299C18.203 1.64 15.6.5 12.5.5A11.496 11.496 0 0 0 2.223 6.835l3.842 2.98c.904-2.718 3.44-4.741 6.435-4.741Z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
