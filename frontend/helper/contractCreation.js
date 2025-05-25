 import { showLoader, hideLoader } from "./loading.js";
 function getContractInstance(address, abi, signer) {
    return new ethers.Contract(address, abi, signer); // Create a new contract instance with the provided address, ABI, and signer
}
// Connects to the user's Ethereum wallet
 async function connectWallet() {
    if (window.ethereum) {
        let provider = new ethers.providers.Web3Provider(window.ethereum); // Create a new provider instance
        await provider.send("eth_requestAccounts", []);
        let signer = provider.getSigner(); // Get the signer from the provider
        let userAddress = await signer.getAddress(); // Get the user's address
        document.getElementById(
            "walletDisplay"
        ).innerText = `Connected: ${userAddress}`; // Display the connected address in the UI
        return {
            provider,
            signer,
            userAddress
        }; // Return the provider, signer, and user's address
    } else {
        alert("MetaMask not detected.");
    }
}


export { connectWallet, getContractInstance };
