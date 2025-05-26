import processingByteCode from "./processingByteCode.js";
import catchAbi from "../catch/abi.js";
import processingAbi from "./abi.js";
import { showLoader, hideLoader } from "../helper/loading.js";
import { connectWallet, getContractInstance } from "../helper/contractCreation.js"


window.onload = () => {

  let provider, signer, userAddress, contract;
  //deploy contract if it doesn't exist

  document
    .getElementById("connectWalletBtn")
    .addEventListener("click", async () => {
      const wallet = await connectWallet();
      provider = wallet.provider;
      signer = wallet.signer;
      userAddress = wallet.userAddress;
      let processingAddress = localStorage.getItem("processingAddress");
      let catchAddress = localStorage.getItem("catchAddress");
      if (!processingAddress) {
        showLoader();
        const factory = new ethers.ContractFactory(
          processingAbi,
          processingByteCode,
          signer
        );
        const processContract = await factory.deploy(catchAddress);
        await processContract.deployed();
        processingAddress = processContract.address;
        localStorage.setItem("processingAddress", processingAddress);
        hideLoader();
      } else {
        alert("Loading Contract. Please Wait:");
      }
      contract = getContractInstance(processingAddress, processingAbi, signer);
      document.getElementById("appContent").style.display = "block";
      getCatchDetails(catchAddress, signer);
      populateDropdowns();
    }

    );


  //Function to get the catch details from the contract and display them in the catchList
  async function getCatchDetails(catchAddy, signer) {
    const catchList = document.getElementById("catchList");
    catchList.innerHTML = ""; // Clear previous entries
    try {
      showLoader();
      if (!catchAddy) { //If there is no catch address in local storage
        alert("Catch contract address not found in local storage.");
        return;
      }
      const catchContract = new ethers.Contract(
        catchAddy,
        catchAbi,
        signer
      );
      const catchId = localStorage.getItem("catchId"); // Retrieve the catch ID from local storage
      const processedIds = JSON.parse(localStorage.getItem("processedCatchIds")) || [];

      const catchInfoExtract = catchId.split(",").filter(id => !processedIds.includes(id)); // Split the catch ID string into an array and filter out processed IDs
      for (const id of catchInfoExtract) {
        try { // For each catch ID, fetch the catch information
          const [location, vesselName, _, timestamp, verified, entryCount] =
            await catchContract.getCatchInfo(id);
          let detailsofCatch = "";
          for (let i = 0; i < entryCount; i++) {
            try {
              const [species, method, quantity] =
                await catchContract.getCatchDetail(id, i);
              detailsofCatch += `<li>${quantity} of ${species} caught by ${method}</li>`;
            } catch (error) {
              console.error("Error fetching catch entry:", error);
            }
          }
          const li = document.createElement("li"); // Create a new list item for each catch and display the details
          li.innerHTML = `
                    <strong>Catch ID:</strong> ${id} <br>
                    <strong>Location:</strong> ${location} <br>
                    <strong>Vessel Name:</strong> ${vesselName} <br>    
                    <strong>Timestamp:</strong> ${new Date(timestamp * 1000).toLocaleString()} <br>
                    <strong>Verified:</strong> ${verified ? "Yes" : "No"} <br>
                    <strong>Details of the Catch:</strong><br>
                    <ul>${detailsofCatch}</ul>
                    `;
          catchList.appendChild(li);
        } catch (error) {
          alert("Error fetching catch info for ID " + id + ": " + error.message);
        }
      }
    } catch (error) {
      alert("Error fetching catch details: " + error.message);
    } finally {
      hideLoader();
    }
  }

  //Function to process the catch. It takes details from the form and processes it
  //It then makes a transaction to process it.
  document
    .getElementById("processForm")
    .addEventListener("submit", processCatch);
  async function processCatch(e) {
    e.preventDefault();
    const catchId = document.getElementById("catchDropdown").value;
    if (!catchId) {
      alert("No catch ID found in local storage.");
      return;
    }
    const packaging = document.getElementById("packaging").value;
    const cleaningNotes = document.getElementById("cleaningNotes").value;
    const compliant = document.getElementById("compliant").checked;
    const paymentAmount = document.getElementById("paymentAmount").value;
    try {
      showLoader();
      const transaction = await contract.processCatch(
        catchId,
        packaging,
        cleaningNotes,
        compliant,
        paymentAmount,
        { gasLimit: 3000000 }
      );
      await transaction.wait();
      alert("Catch processed successfully!");
      let processedIds = JSON.parse(localStorage.getItem("processedCatchIds")) || [];
      const cleanId = catchId.trim();
      if (!processedIds.includes(cleanId)) {
        processedIds.push(cleanId);
        localStorage.setItem("processedCatchIds", JSON.stringify(processedIds));

      }
      const catchDropdown = document.getElementById("catchDropdown");
      const optionToRemove = catchDropdown.querySelector(`option[value="${cleanId}"]`);
      if (optionToRemove) {
        optionToRemove.remove();
      }
      await getCatchDetails(localStorage.getItem("catchAddress"), signer);

      await getAllSeafoodIds();
      populateDropdowns();
    } catch (error) {
      alert("Error processing catch: " + error.message);
    } finally {
      hideLoader();
    }
  }


  //function to get all seafood ids it then stores them in local storage
  async function getAllSeafoodIds() {
    try {
      const seafoodIds = await contract.getAllSeafoodIds();
      localStorage.setItem("seafoodIds", seafoodIds);
    } catch (error) {
      alert("Error fetching seafood IDs: " + error.message);
    }
  }




  //function to add logistics update
  //It takes details from the form and adds a logistics update
  //It then makes a transaction to add the logistics update.
  document
    .getElementById("addlogistics")
    .addEventListener("submit", logisticsUpdate);
  async function logisticsUpdate(e) {
    e.preventDefault();
    const seafoodId = document.getElementById("seafoodDropdown").value;
    const location = document.getElementById("location").value;
    const temperature = document.getElementById("temperature").value;
    const status = document.getElementById("status").value;
    const batchNumber = document.getElementById("batchNumber").value;
    const complianceNote = document.getElementById("complianceNote").value;
    const storageMethod = document.getElementById("storageMethod").value;
    try {
      showLoader();
      const transaction = await contract.addLogisticsUpdate(
        seafoodId,
        location,
        temperature,
        status,
        batchNumber,
        complianceNote,
        storageMethod,
        { gasLimit: 3000000 }
      );
      await transaction.wait();
      alert("Logistics update added successfully!");
    } catch (error) {
      alert("Error adding logistics update: " + error.message);
    } finally {
      hideLoader();
    }
  }




  //Function to get processing info
  //It takes the seafood ID from the dropdown and fetches the processing info
  //It then displays the processing info in the processingInfoDisplay element.
  document
    .getElementById("getProcessingInfo")
    .addEventListener("submit", getProcessingInfo);
  async function getProcessingInfo(e) {
    e.preventDefault();
    const seafoodId = document.getElementById(
      "seafoodDropdownProcessing"
    ).value;

    try {
      showLoader();
      const processingInfo = await contract.getProcessingInfo(seafoodId);
      const infoDisplay = document.getElementById("processingInfoDisplay");
      let logisticsInformation = `<p>NO logistics updates available.</p>`; // Default message if no logistics updates are found
      if (processingInfo.logisticsCount > 0) { // Check if there are logistics updates
        const lIndex = processingInfo.logisticsCount - 1; // Get the latest logistics update
        const logisticsUpdate = await contract.getLogisticsUpdate(
          seafoodId,
          lIndex)
        logisticsInformation = `
        <p>Logistics Update:</p>
        <p>Location: ${logisticsUpdate.location}</p>
        <p>Temperature: ${logisticsUpdate.temperature}</p>
        <p>Status: ${logisticsUpdate.status}</p>
        <p>Batch Number: ${logisticsUpdate.batchNumber}</p>
        <p>Compliance Note: ${logisticsUpdate.complianceNote}</p>
        <p>Storage Method: ${logisticsUpdate.storageMethod}</p>
        <p>Timestamp: ${new Date(
          logisticsUpdate.timestamp * 1000
        ).toLocaleString()}</p>
        `;
      }
      if (processingInfo) { // Check if processing info is available
        infoDisplay.innerHTML = `
                <h3>Processing Information for Seafood ID: ${seafoodId}</h3>
                <p>Catch ID: ${processingInfo.catchId}</p>
                <p>Packaging: ${processingInfo.packaging}</p>
                <p>Cleaning Notes: ${processingInfo.cleaningNotes}</p>
                <p>Compliant: ${processingInfo.compliant}</p>
                <p>Payment Amount: $${processingInfo.paymentAmount}</p>
                <p>Timestamp: ${new Date(
          processingInfo.timestamp * 1000
        ).toLocaleString()}</p>
                <p>Logistics Count: ${processingInfo.logisticsCount}</p>
                ${logisticsInformation}
              `;
      } else {
        alert("No processing info found for this seafood ID.");
      }
    } catch (error) {
      alert("Error getting processing info: " + error.message);
    } finally {
      hideLoader();
    }
  }





  //function to update the logistics info
  //it gets the values from the form and updates the logistics info
  //For information that doesnt need to be updated, we use a dummy value
  document
    .getElementById("updateLogistics") // This form is used to update logistics information
    .addEventListener("submit", updateLogistics);
  async function updateLogistics(e) {
    e.preventDefault();
    const seafoodId = document.getElementById("seafoodDropdownLogistics").value;
    const location = document.getElementById("location").value;
    const temperature = document.getElementById("temperature").value;
    const storageMethod = document.getElementById("storageMethod").value;
    const status = document.getElementById("status").value;
    try {
      showLoader();
      const processingInfo = await contract.getProcessingInfo(seafoodId);
      const logisticsCount = processingInfo.logisticsCount;
      const dummy = "-"; // Dummy value for fields that are not being updated
      const transaction = await contract.addLogisticsUpdate(
        seafoodId,
        location,
        temperature,
        status,
        dummy,
        dummy,
        storageMethod,
        { gasLimit: 3000000 }
      );
      await transaction.wait();
      alert("Logistics update added successfully!");
      if (logisticsCount === 0) {
        alert("No logistics updates available.");
        return;
      }
      // Fetch the latest logistics update to display
      const logisticsUpdate = await contract.getLogisticsUpdate(
        seafoodId,
        logisticsCount
      );
      document.getElementById("logisticsInfoDisplay").innerText = `
Seafood ID: ${seafoodId}
Location: ${logisticsUpdate.location}
Temperature: ${logisticsUpdate.temperature}
Status: ${logisticsUpdate.status}
Storage Method: ${logisticsUpdate.storageMethod}
Timestamp: ${new Date(logisticsUpdate.timestamp * 1000).toLocaleString()}
    `.trim();
    } catch (error) {
      alert("Error updating logistics: " + error.message);
    } finally {
      hideLoader();
    }
  }





  function populateDropdowns() {
    const seafoodDropdown = document.getElementById("seafoodDropdown");
    const seafoodDropdownLogistics = document.getElementById(
      "seafoodDropdownLogistics"
    );
    const seafoodDropdownProcessing = document.getElementById(
      "seafoodDropdownProcessing"
    );
    const catchDropdown = document.getElementById("catchDropdown");
    const seafoodStored = localStorage.getItem("seafoodIds");
    const catchStored = localStorage.getItem("catchId");

    [seafoodDropdown, seafoodDropdownLogistics, seafoodDropdownProcessing, catchDropdown].forEach(dropdown => {
      if (dropdown) dropdown.innerHTML = "<option value=''>Select an ID</option>";
    });

    if (seafoodStored) {
      const spliting = seafoodStored.split(",");
      spliting.forEach((id) => {
        const userLabel = `${id.slice(60, 67)}`;

        const option1 = document.createElement("option");
        option1.value = id;
        option1.textContent = userLabel;

        const option2 = document.createElement("option");
        option2.value = id;
        option2.textContent = userLabel;

        const option3 = document.createElement("option");
        option3.value = id;
        option3.textContent = userLabel;

        seafoodDropdown.appendChild(option1);
        seafoodDropdownLogistics.appendChild(option2);
        seafoodDropdownProcessing.appendChild(option3);
      });
    }
    if (catchStored) {
      const processedIds = JSON.parse(localStorage.getItem("processedCatchIds")) || [];

      const spliting = catchStored.split(",");
      spliting.forEach((id) => {
        if (processedIds.includes(id.trim())) return;
        const userLabel = `${id.slice(60, 67)}`;

        const option = document.createElement("option");
        option.value = id;
        option.textContent = userLabel;
        catchDropdown.appendChild(option);
      });
    }
  }
};
