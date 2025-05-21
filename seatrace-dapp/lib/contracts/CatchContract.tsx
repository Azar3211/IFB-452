import { ethers } from "ethers";
import CatchContractJSON from "./CatchContract.json";

const CONTRACT_ADDRESS = "0x1c036CA613f1DADb37C08d0454F20E15F2f52eE1"; 

export function getCatchContract(providerOrSigner: ethers.Provider | ethers.Signer) {
    return new ethers.Contract(CONTRACT_ADDRESS, CatchContractJSON.abi, providerOrSigner);
}
