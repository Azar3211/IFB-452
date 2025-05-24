import processingByteCode from "./processingByteCode.js";
import catchAbi from "../catch/abi.js";
window.onload = () => {
  const processingAbi = [
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "seafoodId",
          type: "bytes32",
        },
        {
          internalType: "string",
          name: "location",
          type: "string",
        },
        {
          internalType: "string",
          name: "temperature",
          type: "string",
        },
        {
          internalType: "string",
          name: "status",
          type: "string",
        },
        {
          internalType: "string",
          name: "batchNumber",
          type: "string",
        },
        {
          internalType: "string",
          name: "complianceNote",
          type: "string",
        },
        {
          internalType: "string",
          name: "storageMethod",
          type: "string",
        },
      ],
      name: "addLogisticsUpdate",
      outputs: [
        {
          internalType: "uint256",
          name: "index",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "catchId",
          type: "bytes32",
        },
        {
          internalType: "string",
          name: "packaging",
          type: "string",
        },
        {
          internalType: "string",
          name: "cleaningNotes",
          type: "string",
        },
        {
          internalType: "bool",
          name: "compliant",
          type: "bool",
        },
        {
          internalType: "uint256",
          name: "paymentAmount",
          type: "uint256",
        },
      ],
      name: "processCatch",
      outputs: [
        {
          internalType: "bytes32",
          name: "seafoodId",
          type: "bytes32",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_catchContract",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      name: "batches",
      outputs: [
        {
          internalType: "bytes32",
          name: "catchId",
          type: "bytes32",
        },
        {
          internalType: "string",
          name: "packaging",
          type: "string",
        },
        {
          internalType: "string",
          name: "cleaningNotes",
          type: "string",
        },
        {
          internalType: "bool",
          name: "compliant",
          type: "bool",
        },
        {
          internalType: "uint256",
          name: "paymentAmount",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "timestamp",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "catchContract",
      outputs: [
        {
          internalType: "contract ICatchContract",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getAllSeafoodIds",
      outputs: [
        {
          internalType: "bytes32[]",
          name: "",
          type: "bytes32[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "seafoodId",
          type: "bytes32",
        },
        {
          internalType: "uint256",
          name: "index",
          type: "uint256",
        },
      ],
      name: "getLogisticsUpdate",
      outputs: [
        {
          internalType: "string",
          name: "location",
          type: "string",
        },
        {
          internalType: "string",
          name: "temperature",
          type: "string",
        },
        {
          internalType: "string",
          name: "status",
          type: "string",
        },
        {
          internalType: "string",
          name: "batchNumber",
          type: "string",
        },
        {
          internalType: "string",
          name: "complianceNote",
          type: "string",
        },
        {
          internalType: "string",
          name: "storageMethod",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "timestamp",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "seafoodId",
          type: "bytes32",
        },
      ],
      name: "getProcessingInfo",
      outputs: [
        {
          internalType: "bytes32",
          name: "catchId",
          type: "bytes32",
        },
        {
          internalType: "string",
          name: "packaging",
          type: "string",
        },
        {
          internalType: "string",
          name: "cleaningNotes",
          type: "string",
        },
        {
          internalType: "bool",
          name: "compliant",
          type: "bool",
        },
        {
          internalType: "uint256",
          name: "paymentAmount",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "timestamp",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "logisticsCount",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "seafoodIds",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];
  let provider, signer, userAddress, contract;
  //deploy contract if it doesn't exist
  populateDropdowns();




  document
    .getElementById("connectWalletBtn")
    .addEventListener("click", async () => {
      if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        userAddress = await signer.getAddress();
        document.getElementById(
          "walletDisplay"
        ).innerText = `Connected: ${userAddress}`;
        let processingAddress = localStorage.getItem("processingAddress");
        let catchAddress = localStorage.getItem("catchAddress");
        console.log("Processing address:", processingAddress);
        if (!processingAddress) {
          console.log("Processing contract not deployed yet.");
          const factory = new ethers.ContractFactory(
            processingAbi,
            processingByteCode,
            signer
          );
          const processContract = await factory.deploy(catchAddress);

          await processContract.deployed();
          console.log("processed");
          const processingAddress = processContract.address;
          localStorage.setItem("processingAddress", processingAddress);
        } else {
          console.log(
            "Processing contract already deployed at:",
            processingAddress
          );
        }
        contract = new ethers.Contract(
          processingAddress,
          processingAbi,
          signer
        );
            document.getElementById("appContent").style.display = "block";
        getCatchDetails(catchAddress, signer);
      } else {
        alert("MetaMask not detected.");
      }
    });
    //functiuon to get chatch details
    async function getCatchDetails(catchAddy, signer) {
        const catchList = document.getElementById("catchList");
        catchList.innerHTML = ""; // Clear previous entries
        try {
            
            if (!catchAddy) {
                alert("Catch contract address not found in local storage.");
                return;
            }
            const catchContract = new ethers.Contract(
                catchAddy,
                catchAbi,
                signer
            );
            const catchId = localStorage.getItem("catchId");
            const catchInfoExtract = catchId.split(",");
            for (const id of catchInfoExtract) {
                try{
                    const [location, vesselName,_, timestamp, verified, entryCount ] = 
                    await catchContract.getCatchInfo(id);
                    let detailsofCatch = "";
                    for (let i = 0; i < entryCount; i++) {
                        try{
                            const [species, method, quantity] =
                            await catchContract.getCatchDetail(id, i);
                            detailsofCatch += `<li>${quantity} of ${species} caught by ${method}</li>`;
                        } catch (error) {
                            console.error("Error fetching catch entry:", error);
                        }}
                    const li = document.createElement("li");
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
        }}} catch (error) {
            alert("Error fetching catch details: " + error.message);
        }
    }

  //function to process the catch
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
      getAllSeafoodIds();
      populateDropdowns();
      location.reload();
    } catch (error) {
      alert("Error processing catch: " + error.message);
    }
  }
  //function to get all seafood ids
  async function getAllSeafoodIds() {
    try {
      const seafoodIds = await contract.getAllSeafoodIds();
      localStorage.setItem("seafoodIds", seafoodIds);
    } catch (error) {
      alert("Error fetching seafood IDs: " + error.message);
    }
  }
  



  //function to add logistics update
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
    }
  }




  ///functyion to get the processing info
  document
    .getElementById("getProcessingInfo")
    .addEventListener("submit", getProcessingInfo);
  async function getProcessingInfo(e) {
    e.preventDefault();
    const seafoodId = document.getElementById(
      "seafoodDropdownProcessing"
    ).value;

    try {
      const processingInfo = await contract.getProcessingInfo(seafoodId);
      console.log("Processing Info:", processingInfo);
      const infoDisplay = document.getElementById("processingInfoDisplay");
      let logisticsInformation = `<p>NO logistics updates available.</p>`;
      if (processingInfo.logisticsCount > 0) {
        const lIndex = processingInfo.logisticsCount - 1;
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
      if (processingInfo) {
        infoDisplay.innerHTML = `
                <h3>Processing Information for Seafood ID: ${seafoodId}</h3>
                <p>Catch ID: ${processingInfo.catchId}</p>
                <p>Packaging: ${processingInfo.packaging}</p>
                <p>Cleaning Notes: ${processingInfo.cleaningNotes}</p>
                <p>Compliant: ${processingInfo.compliant}</p>
                <p>Payment Amount: ${processingInfo.paymentAmount}</p>
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
    }
  }





  //function to update the logistics info
  document
    .getElementById("updateLogistics")
    .addEventListener("submit", updateLogistics);
  async function updateLogistics(e) {
    e.preventDefault();
    const seafoodId = document.getElementById("seafoodDropdownLogistics").value;
    const location = document.getElementById("location").value;
    const temperature = document.getElementById("temperature").value;
    const storageMethod = document.getElementById("storageMethod").value;
    const status = document.getElementById("status").value;
    try {
      const processingInfo = await contract.getProcessingInfo(seafoodId);
      const logisticsCount = processingInfo.logisticsCount;
      const dummy = "-";
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
    }
  }





  // Load seafood IDs and catch IDs from local storage into dropdowns
function populateDropdowns() {  const seafoodDropdown = document.getElementById("seafoodDropdown");
  const seafoodDropdownLogistics = document.getElementById(
    "seafoodDropdownLogistics"
  );
  const seafoodDropdownProcessing = document.getElementById(
    "seafoodDropdownProcessing"
  );
  const catchDropdown = document.getElementById("catchDropdown");
  const seafoodStored = localStorage.getItem("seafoodIds");
  const catchStored = localStorage.getItem("catchId");
  //clear existing options
  [seafoodDropdown, seafoodDropdownLogistics, seafoodDropdownProcessing, catchDropdown].forEach(dropdown => {
    if (dropdown) dropdown.innerHTML = "<option value=''>Select an ID</option>";
  });

  if (seafoodStored) {
    const spliting = seafoodStored.split(",");
    spliting.forEach((id) => {
      const option1 = document.createElement("option");
      option1.value = id;
      option1.textContent = id;

      const option2 = document.createElement("option");
      option2.value = id;
      option2.textContent = id;

      const option3 = document.createElement("option");
      option3.value = id;
      option3.textContent = id;

      seafoodDropdown.appendChild(option1);
      seafoodDropdownLogistics.appendChild(option2);
      seafoodDropdownProcessing.appendChild(option3);
    });
  }
  if (catchStored) {
    const spliting = catchStored.split(",");
    spliting.forEach((id) => {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = id;
      catchDropdown.appendChild(option);
    });
  }}
};
