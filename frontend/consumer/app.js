//get the abi from the js file
import retailBytecode from "./retailByteCode.js";
import { showLoader, hideLoader } from "../helper/loading.js";
import retailAbi from "./abi.js";
import certAbi from "../certification/abi.js";
import { connectWallet, getContractInstance } from "../helper/contractCreation.js"

window.onload = () => {


  let provider, signer, userAddress, contract;
  let userRole = null;
  window.setRole = function (role) {

    userRole = role;
    document.getElementById("roleSelectScreen").style.display = "none";
    document.getElementById("appContent").style.display = "block";
    document.getElementById("retailer").style.display = "none";
    if (role === "vendor") {
      document.getElementById("retailer").style.display = "block";
    }

    populateSeafoodDropdown();
  }
  //The connect wallet button gets the user's wallet and connects to the retail contract. If 
  //the retail contract is not deployed, it deploys a new contract and stores the address in local storage.
  //If the retail contract is already deployed, it retrieves the address from local storage and connects to it.
  document
    .getElementById("connectWalletBtn")
    .addEventListener("click", async () => {
      const wallet = await connectWallet();
      provider = wallet.provider;
      signer = wallet.signer;
      userAddress = wallet.userAddress;
      let catchAddress = localStorage.getItem("catchAddress");
      let processingAddress = localStorage.getItem("processingAddress")
      let certificationAddress = localStorage.getItem("certificationAddress")
      let retailContractAddress = localStorage.getItem("retailContractAddress");
      if (!retailContractAddress) {
        showLoader();
        const factory = new ethers.ContractFactory(retailAbi, retailBytecode, signer);
        const retailContract = await factory.deploy(
          certificationAddress,
          catchAddress,
          processingAddress
        );
        await retailContract.deployed();
        retailContractAddress = retailContract.address;
        localStorage.setItem("retailContractAddress", retailContractAddress);
        hideLoader();
      } else {
        alert("Loading Contract. Please Wait:");
      }
      contract = getContractInstance(retailContractAddress, retailAbi, signer);
      populateSeafoodDropdown();
    }
    );



  //This records the sale of seafood by the retailer. It gets the seafood ID, retailer name, location, and notes from the form.
  //It tells the user if the sale was successful or not. and if they filled all the fields.
  document.getElementById("recordSale").addEventListener("submit", recordSale);
  async function recordSale(data) {
    data.preventDefault();
    if (!contract) return alert("Please connect your wallet first.");
    const seafoodId = document.getElementById("seafoodSaleDropdown").value.trim();
    const retailerName = document.getElementById("retailerName").value.trim();
    const location = document.getElementById("location").value.trim();
    const notes = document.getElementById("notes").value.trim();
    if (!seafoodId || !retailerName || !location || !notes) {
      alert("❌ All fields are required.");
      return;
    }
    try {
      showLoader();
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
      console.error("Error recording sale:", error)
      alert("Error recording sale. Please try again. The seafood Most Likely has been rejected by the certification authority.");
    } finally {
      hideLoader();
    }
  }
  document.getElementById("getSaleInfo").addEventListener("submit", (event) => {
    event.preventDefault();
    const seafoodId = document.getElementById("getSaleDropdown").value;
    console.log("Fetching details for seafood ID:", seafoodId);
    getDetails(seafoodId);
    console.log("Details fetched for seafood ID:", seafoodId);
  });


  //This function fetches the details of the seafood based on the seafood ID provided by the user.
  //It recieves all of the information completed so that it can be displayed to the user.
  async function getDetails(seafoodId) {
    //get the details.
    try {
      showLoader();
      console.log("Seafood ID:", seafoodId);

      const getCatchDetails = await contract.getCatchTrace(seafoodId);
      const getProcessingDetails = await contract.getProcessingTrace(seafoodId);
      const getCertificationDetails = await contract.getCertificationTrace(
        seafoodId
      );
      const getRetailDetails = await contract.getRetailSaleTrace(seafoodId);
      const catchDate = new Date(
        getCatchDetails.timestamp * 1000
      ).toLocaleString();
      const certDate = new Date(
        getCertificationDetails.timestamp * 1000
      ).toLocaleString();
      const saleDate = new Date(
        getRetailDetails.timestamp * 1000
      ).toLocaleString();
      let certificationStatus = getCertificationDetails.passed ? "passed" : "failed";

      const information =
        "Here is the information of the seafood you bought:\n\n" +
        `Caught at ${getCatchDetails.location} on the vessel ${getCatchDetails.vessel} (${catchDate}).\n` +
        `Processed by ${getProcessingDetails.packaging}, cleaned (${getProcessingDetails.cleaningNotes}).\n` +
        `Last seen at ${getProcessingDetails.lastDistributionLocation}, stored at ${getProcessingDetails.lastDistributionTemperature}, status: ${getProcessingDetails.lastDistributionStatus}.\n` +
        `Certification: ${certificationStatus} on ${certDate} (Notes: ${getCertificationDetails.notes}).\n` +
        `Sold by ${getRetailDetails.retailer} at ${getRetailDetails.location} on ${saleDate}.`
          .trim();
      document.getElementById("saleInfoDisplay").innerHTML = information;

      generateQRCode(information);
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      hideLoader();
    }
  }

  //Generates a QR code for the given data and displays it in the HTML element with id "qrcode".
  function generateQRCode(data) {
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
  };

  async function populateSeafoodDropdown() {
    const certificationAddress = localStorage.getItem("certificationAddress");
    const certificationContract = new ethers.Contract(certificationAddress, certAbi, provider);

    const seafoodDropdown = document.getElementById("seafoodSaleDropdown");
    const getSaleDropdown = document.getElementById("getSaleDropdown");



    seafoodDropdown.innerHTML = "";
    const seafoodIds = localStorage.getItem("seafoodIds");

    [seafoodDropdown, getSaleDropdown].forEach(dropdown => {
      if (dropdown) dropdown.innerHTML = "<option value=''>Select an ID</option>";
    });
    for (const id of seafoodIds.split(",")) {
      try {
        const [, , passed, timestamp] = await certificationContract.getCertification(id);
        if (passed) {
          const time = new Date(timestamp * 1000).toLocaleString();
          const userLabel = `${id.slice(60, 67)}... | Certified: ${time}`
          const option1 = document.createElement("option");
          option1.value = id;
          option1.textContent = userLabel;
          const option2 = document.createElement("option");
          option2.value = id;
          option2.textContent = userLabel;
          seafoodDropdown.appendChild(option1);
          getSaleDropdown.appendChild(option2);
        }
      } catch (error) {
        console.warn(`Seafood ID ${id} may not be certified yet.`);
      }
    }
  }

};
