import catchByte from "./catchByte.js";
import { showLoader, hideLoader } from "../helper/loading.js";
import catchAbi from "./abi.js";
import {
  connectWallet,
  getContractInstance,
} from "../helper/contractCreation.js";
window.onload = () => {
  let provider, signer, userAddress, contract; // Declare contract variable

  document
    .getElementById("connectWalletBtn") //Connect wallet button
    .addEventListener("click", async () => {
      const wallet = await connectWallet(); //Calls connectWallet function to connect to the user's wallet
      provider = wallet.provider; // Get the provider from the wallet
      signer = wallet.signer; // Get the signer from the wallet
      userAddress = wallet.userAddress; // Get the user's address from the wallet
      let catchAddress = localStorage.getItem("catchAddress"); // Retrieve the catch contract address from local storage
      if (!catchAddress) {
        // If the catch contract address is not found in local storage then deploy a new contract
        showLoader();
        const factory = new ethers.ContractFactory(catchAbi, catchByte, signer); // Create a new contract factory using the catch ABI and bytecode
        const catchContract = await factory.deploy(); // Deploy the catch contract
        await catchContract.deployed(); // Wait for the contract to be deployed
        catchAddress = catchContract.address; // Get the address of the deployed contract
        localStorage.setItem("catchAddress", catchAddress); // Store the catch contract address in local storage
        hideLoader(); // Hide the loader after the contract is deployed
      } else {
        alert("Loading Contract. Please Wait:");
      }
      if (!ethers.utils.isAddress(catchAddress)) {
        alert("Invalid contract address.");
        return;
      }
      contract = getContractInstance(catchAddress, catchAbi, signer); //Calls the getContractInstance function to get the contract instance using the catch contract address, ABI, and signer
      loadCatches(); // Load existing catches from the contract
    });


  document.getElementById("addDetailBtn").addEventListener("click", addDetail);
  document.getElementById("catchForm").addEventListener("submit", submitCatch);
  function addDetail() {
    const div = document.createElement("div");
    div.className = "flex space-x-2 mb-2";
    div.innerHTML = `
      <input type="text" placeholder="Species" class="input w-1/3" required />
      <input type="text" placeholder="Method" class="input w-1/3" required />
      <input type="number" placeholder="Quantity" class="input w-1/3" required />
    `;
    document.getElementById("detailsContainer").appendChild(div);
  }

  async function submitCatch(e) { // Function to submit the catch details
    e.preventDefault();   // Prevent the default form submission behavior
    if (!contract) return alert("Please connect your wallet first."); // Check if the contract is initialized

    const location = document.getElementById("location").value;
    const vesselName = document.getElementById("vesselName").value;

    const speciesList = [];
    const methodList = [];
    const quantityList = [];

    document.querySelectorAll("#detailsContainer > div").forEach((row) => { // Loop through each detail row in the form
      const [speciesInput, methodInput, quantityInput] = 
        row.querySelectorAll("input");
      speciesList.push(speciesInput.value); // Get the species input value
      methodList.push(methodInput.value); // Get the method input value
      quantityList.push(parseInt(quantityInput.value)); // Get the quantity input value and convert it to an integer
    });
    if (
      !location ||
      !vesselName ||
      speciesList.includes("") ||
      methodList.includes("") ||
      quantityList.includes(NaN)
    ) {
      alert("❌ Please fill in all fields correctly.");
      return;
    } // Validate that all required fields are filled in
    try { // Try to log the catch details
      showLoader();
      const transaction = await contract.logCatch( // Call the logCatch function of the contract to log the catch details
        location,
        vesselName,
        speciesList,
        methodList,
        quantityList,
        { gasLimit: 500000 }
      );
      await transaction.wait(); // Wait for the transaction to be mined

      document.getElementById("successMessage").innerText =
        "✅ Catch logged successfully!";
      document.getElementById("catchForm").reset();
      document.getElementById("detailsContainer").innerHTML = ""; // Clear the details container
      addDetail(); // Add an initial detail row
      loadCatches(); // Reload the catches to reflect the new catch
    } catch (err) {
      console.error(err);
      document.getElementById("successMessage").innerText =
        "❌ Failed to log catch."; // Display an error message if the transaction fails
    } finally {
      hideLoader();
    }
  }

  async function loadCatches() { // Function to load all catches from the contract
    const list = document.getElementById("catchList");
    list.innerHTML = "";

    try {
      const ids = await contract.getAllCatchIds(); // Get all catch IDs from the contract

      for (const id of ids) {
        const [location, vessel, fisher, timestamp, verified, entryCount] =
          await contract.getCatchInfo(id); // Get catch info for each ID
        localStorage.setItem("catchId", ids); // Store the catch ID in local storage

        const catchCard = document.createElement("div");
        catchCard.className = "border p-4 mb-4 rounded";
        catchCard.innerHTML = `
          <p><strong>Catch ID:</strong> ${id}</p>
          <p><strong>Location:</strong> ${location}</p>
          <p><strong>Vessel:</strong> ${vessel}</p>
          <p><strong>Fisher:</strong> ${fisher}</p>
          <p><strong>Time:</strong> ${new Date(
            timestamp * 1000
          ).toLocaleString()}</p>
          <p><strong>Verified:</strong> ${verified ? "✅ Yes" : "❌ No"}</p>
        `; 

        if (fisher.toLowerCase() === userAddress.toLowerCase()) {  // Check if the current user is the fisher of the catch
          const button = document.createElement("button");
          const detailButton = document.createElement("button"); 

          detailButton.textContent = "Get Details";
          button.textContent = "✅ Verify";

          detailButton.className =
            "mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700";
          button.className =
            "mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700";

          detailButton.onclick = async () => {
            try {
              const [, , , , , entryCount] = await contract.getCatchInfo(id); // Get the entry count for the catch
              const detailList = document.createElement("ul");
              detailList.className = "list-disc ml-5 mt-2";

              for (let i = 0; i < entryCount; i++) { // Loop through each entry in the catch
                const [species, method, quantity] = 
                  await contract.getCatchDetail(id, i);
                const listItem = document.createElement("li"); // Create a list item for each entry
                listItem.textContent = `Caught ${quantity}x of ${species} via ${method}`;
                detailList.appendChild(listItem);
              }

              catchCard.appendChild(detailList); // Append the detail list to the catch card
              detailButton.remove(); // prevent multiple insertions
            } catch (err) {
              console.error("Details retrieval failed:", err);
              alert("❌ Error retrieving catch details.");
            }
          };
          catchCard.appendChild(detailButton);

          if (!verified) { // If the catch is not verified, show the verify button
            button.onclick = async () => {
              try {
                showLoader();
                const transaction = await contract.verifyCatch(id, {
                  gasLimit: 100000,
                }); // Call the verifyCatch function of the contract to verify the catch
                await transaction.wait();
                alert("✅ Catch verified!");
                loadCatches(); // Reload the catches to reflect the verification
              } catch (err) {
                console.error("Verification failed:", err);
                alert("❌ Error verifying catch.");
              } finally {
                hideLoader();
              }
            };
            catchCard.appendChild(button);
          }
        }

        list.appendChild(catchCard);
      }
    } catch (err) {
      console.error("Failed to load catches:", err);
    }
  }
};
