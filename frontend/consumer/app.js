//get the abi from the js file
import retailBytecode from "./retailByteCode.js";
window.onload = () => {
  const retailAbi = [
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "seafoodId",
          type: "bytes32",
        },
        {
          internalType: "string",
          name: "retailerName",
          type: "string",
        },
        {
          internalType: "string",
          name: "location",
          type: "string",
        },
        {
          internalType: "string",
          name: "notes",
          type: "string",
        },
      ],
      name: "recordSale",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_certification",
          type: "address",
        },
        {
          internalType: "address",
          name: "_catchContract",
          type: "address",
        },
        {
          internalType: "address",
          name: "_processing",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
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
      name: "certification",
      outputs: [
        {
          internalType: "contract ICertificationContract",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getAllSoldIds",
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
      ],
      name: "getCatchTrace",
      outputs: [
        {
          internalType: "string",
          name: "location",
          type: "string",
        },
        {
          internalType: "string",
          name: "vessel",
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
      name: "getCertificationTrace",
      outputs: [
        {
          internalType: "string",
          name: "notes",
          type: "string",
        },
        {
          internalType: "bool",
          name: "passed",
          type: "bool",
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
      name: "getProcessingTrace",
      outputs: [
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
          internalType: "string",
          name: "lastDistributionStatus",
          type: "string",
        },
        {
          internalType: "string",
          name: "lastDistributionLocation",
          type: "string",
        },
        {
          internalType: "string",
          name: "lastDistributionTemperature",
          type: "string",
        },
        {
          internalType: "string",
          name: "lastDistributionBatch",
          type: "string",
        },
        {
          internalType: "string",
          name: "lastDistributionNote",
          type: "string",
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
      name: "getRetailSaleTrace",
      outputs: [
        {
          internalType: "string",
          name: "retailer",
          type: "string",
        },
        {
          internalType: "string",
          name: "location",
          type: "string",
        },
        {
          internalType: "string",
          name: "notes",
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
      inputs: [],
      name: "lastSoldId",
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
    {
      inputs: [],
      name: "processing",
      outputs: [
        {
          internalType: "contract IProcessingLogisticsContract",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      name: "sales",
      outputs: [
        {
          internalType: "string",
          name: "retailerName",
          type: "string",
        },
        {
          internalType: "string",
          name: "location",
          type: "string",
        },
        {
          internalType: "string",
          name: "notes",
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
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "soldIds",
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

  document
    .getElementById("connectWalletBtn")
    .addEventListener("click", async () => {
      console.log("Connecting to wallet...");
        if (window.ethereum) {
          provider = new ethers.providers.Web3Provider(window.ethereum);
          await provider.send("eth_requestAccounts", []);
          signer = provider.getSigner();
          userAddress = await signer.getAddress();
          document.getElementById(
            "walletDisplay"
          ).innerText = `Connected: ${userAddress}`;
          const catchAddress = localStorage.getItem("catchAddress"); //,"0x714450a43E145bD83a3C040eFFEC375394CAC16d"
          const processingAddress = localStorage.getItem("processingAddress")//,"0x35191808734e05792c3dF169b8eBe94eAaB06FF5"
          const certificationAddress = localStorage.getItem("certAddress") //,"0x3b08990398a76442Ec43c3001e83cB8c70a00f7c"
          const factory = new ethers.ContractFactory(retailAbi, retailBytecode, signer);
          const retailContract = await factory.deploy(
            certificationAddress,
            catchAddress,
            processingAddress
          );
          await retailContract.deployed();
          const retailContractAddress = retailContract.address;
          localStorage.setItem("retailContractAddress", retailContractAddress);
      contract = new ethers.Contract(retailContractAddress, retailAbi, signer);
        } else {
          alert("MetaMask not detected.");
        }
    });

  document.getElementById("recordSale").addEventListener("submit", recordSale);
  //function to record the sale  - retailers
  //function to return/view certificant, trace of catch, processing, and selling
  async function recordSale(data) {
    data.preventDefault();
    if (!contract) return alert("Please connect your wallet first.");
    const seafoodId = localStorage.getItem("seafoodId");
    if (!seafoodId) {
      alert("No seafood ID found in local storage.");
      return;
    }
    const retailerName = document.getElementById("retailerName").value;
    const location = document.getElementById("location").value;
    const notes = document.getElementById("notes").value;
    try {
      const transaction = await contract.recordSale(
        seafoodId,
        retailerName,
        location,
        notes,
        { gasLimit: 3000000 }
      );
      await transaction.wait();
      alert("Sale recorded successfully!");
    } catch (error) {
      alert("Error recording sale. Please try again.");
    }
  }
  document.getElementById("buttonss").addEventListener("click", () => {
    const seafoodId = localStorage.getItem("seafoodId");
    getDetails(seafoodId);
  });
  async function getDetails(seafoodId) {
    //get the details.
    try {
      console.log("Seafood ID:", seafoodId);

      const getChatchDetails = await contract.getCatchTrace(seafoodId);
      const getProcessingDetails = await contract.getProcessingTrace(seafoodId);
      const getCertificationDetails = await contract.getCertificationTrace(
        seafoodId
      );
      const getRetailDetails = await contract.getRetailSaleTrace(seafoodId);
      const catchDate = new Date(
        getChatchDetails.timestamp * 1000
      ).toLocaleString();
      const certDate = new Date(
        getCertificationDetails.timestamp * 1000
      ).toLocaleString();
      const saleDate = new Date(
        getRetailDetails.timestamp * 1000
      ).toLocaleString();
      const information =
        "Here is the information of the seafood you bought: \n\n" +
        `It was caught at ${getChatchDetails.location} on the vessel ${getChatchDetails.vessel} at ${catchDate}\nProcessing Details:\nPackaged by ${getProcessingDetails.packaging}, cleaned ${
          getProcessingDetails.cleaningNotes
        }.\nIts distribution status is ${
        getProcessingDetails.lastDistributionStatus
        }. It was located at ${
        getProcessingDetails.lastDistributionLocation
        } and stored at ${
        getProcessingDetails.lastDistributionTemperature
        }.\nIt ${getCertificationDetails.passed ? "Passed" : "Failed the certification"} the certification date on ${certDate} with the notes ${
        getCertificationDetails.notes
        }.\nLastly, it was sold by ${getRetailDetails.retailer} at ${
        getRetailDetails.location
        } on ${saleDate}.`.trim();
      generateQRCode(information);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  }
  function generateQRCode(data) {
    document.getElementById("generateQRCode").addEventListener("click", () => {
      const something = document.getElementById("qrcode");
      something.innerHTML = "";
      new QRCode(something, {
        text: data,
        width: 260,
        height: 260,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
    });
  }
};
