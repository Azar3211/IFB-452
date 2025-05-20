import { ethers } from "ethers";
import CatchContractJSON from "./CatchContract.json";

const CONTRACT_ADDRESS = "0xd666c8e82E5211f680fEE712F47D887f416D64A3"; // replace with your actual address

export function getCatchContract(providerOrSigner: ethers.Provider | ethers.Signer) {
    return new ethers.Contract(CONTRACT_ADDRESS, CatchContractJSON.abi, providerOrSigner);
}
