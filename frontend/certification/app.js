import certificationByteCode from "./certificationByteCode.js";
import processingAbi from "../processing/abi.js";
import { showLoader, hideLoader } from "../helper/loading.js";
import certAbi from "./abi.js";
import { connectWallet, getContractInstance } from "../helper/contractCreation.js"

window.onload = () => {
    let provider, signer, userAddress, contract; // Declare contract variable
    populateDropdowns(); // Populate dropdowns on page load

    document
        .getElementById("connectWalletBtn")
        .addEventListener("click", async () => {
            const wallet = await connectWallet(); // Calls connectWallet function to connect to the user's wallet
            provider = wallet.provider;
            signer = wallet.signer;
            userAddress = wallet.userAddress;
            let processingContractAddress =
                localStorage.getItem("processingAddress");
            let certificationAddress = localStorage.getItem("certificationAddress");
            if (!certificationAddress) { // If certification address is not found in local storage then deploy a new contract
                showLoader();
                const factory = new ethers.ContractFactory(
                    certAbi,
                    certificationByteCode,
                    signer
                );
                const certContract = await factory.deploy(processingContractAddress);
                await certContract.deployed();
                certificationAddress = certContract.address;
                localStorage.setItem("certificationAddress", certificationAddress); // Store the certification contract address in local storage
                hideLoader();
            } else {
                alert("Loading Contract. Please Wait:");
            }
            contract = getContractInstance(certificationAddress, certAbi, signer); // Calls the getContractInstance function to get the contract instance using the certification contract address, ABI, and signer
            document.getElementById("appContent").style.display = "block"; // Show the app content after connecting the wallet
            getProcessingDetails(processingContractAddress, signer) // Get processing details on page load
        }
        );


    //function to get the processing details
    async function getProcessingDetails(processingAddress, signer) { //Function to get the processing details
        const processingList = document.getElementById("waitingList") // Get the waiting list element
        processingList.innerHTML = "";
        try {
            showLoader();
            if (!processingAddress) {
                alert("Processing contract address not found.");
                return;
            }
            const processingContract = new ethers.Contract( // Create a new contract instance for the processing contract
                processingAddress,
                processingAbi,
                signer
            );
            const certificationAddress = localStorage.getItem("certificationAddress"); // Get the certification contract address from local storage
            const certificationContract = new ethers.Contract( // Create a new contract instance for the certification contract
                certificationAddress,
                certAbi,
                signer
            );
            const certifiedIds = await certificationContract.getAllCertifiedIds(); // Get all certified IDs from the certification contract
            const certifiedSet = new Set(certifiedIds.map(id => id.toLowerCase())); // Create a set of certified IDs for quick lookup

            const seafoodIds = localStorage.getItem("seafoodIds"); // Get the seafood IDs from local storage
            const seafoodExtract = seafoodIds.split(","); // Split the seafood IDs into an array
            for (const seafoodId of seafoodExtract) {
                if (certifiedSet.has(seafoodId.toLowerCase())) continue;
                try {
                    const [catchId, packaging, cleaningNotes, compliant, paymentAmount, timestamp, logisticsCount] = await processingContract.getProcessingInfo(seafoodId); // Get processing info for each seafood ID
                    let logisticsInfo = `<p><em>No logistics information available.</em></p>`;
                    if (logisticsCount > 0) {
                        const lastIdx = logisticsCount - 1;
                        const [location, temperature, status, batchNumber, complianceNote, storageMethod, logTimestamp] =
                            await processingContract.getLogisticsUpdate(seafoodId, lastIdx);
                        logisticsInfo = `                        <strong>Latest Logistics Update:</strong><br>
                        - Location: ${location}<br>
                        - Temp: ${temperature}<br>
                        - Status: ${status}<br>
                        - Batch #: ${batchNumber}<br>
                        - Note: ${complianceNote}<br>
                        - Storage: ${storageMethod}<br>
                        - Timestamp: ${new Date(logTimestamp * 1000).toLocaleString()}
                    `;
                    }

                    const listItem = document.createElement("li");
                    listItem.innerHTML = `
                        <strong>Seafood ID:</strong> ${seafoodId}<br>
                        <strong>Catch ID:</strong> ${catchId}<br>
                        <strong>Packaging:</strong> ${packaging}<br>
                        <strong>Cleaning Notes:</strong> ${cleaningNotes}<br>
                        <strong>Compliant:</strong> ${compliant ? "✅ Yes" : "❌ No"}<br>
                        <strong>Timestamp:</strong> ${new Date(timestamp * 1000).toLocaleString()}
                        ${logisticsInfo}
                    `;
                    processingList.appendChild(listItem); // Append the list item to the processing list
                } catch (error) {
                    const errorItem = document.createElement("li");
                    errorItem.textContent = `❌ Failed to fetch details for ${seafoodId}`;
                    processingList.appendChild(errorItem);
                }
            }
        } catch (error) {
            alert("Error fetching processing details: " + error.message);
        } finally {
            hideLoader();
        }
    }

    //Function to certify seafood. This function gets the elements from the drop down and uses the input fields to certify the seafood
    document
        .getElementById("certificationForm")
        .addEventListener("submit", certify);
    async function certify(e) {
        e.preventDefault();
        const seafoodId = document.getElementById(
            "getCertificateFormDropdown"
        ).value;
        if (!seafoodId) {
            alert("Please select a seafood ID to certify.");
            return;
        }
        const inspectorName = document.getElementById("inspectorName").value;
        const notes = document.getElementById("notes").value;
        const passed = document.getElementById("passed").checked;
        try {
            showLoader();
            const transaction = await contract.certifySeafood(
                seafoodId,
                inspectorName,
                notes,
                passed,
                { gasLimit: 3000000 }
            );
            await transaction.wait();
            alert("Seafood certified successfully!");
            //get all certified ids
            await getAllCertifiedIds();
            //populate fields
            populateDropdowns();
            const listItems = document.querySelectorAll("#waitingList li");
            listItems.forEach((li) => {
                if (li.innerHTML.includes(seafoodId)) {
                    li.remove();
                }
            });
        } catch (error) {
            alert("Error certifying seafood: " + error.message);
        } finally {
            hideLoader();
        }
    }

    //Function to get certification details. This function gets the seafood id from the drop down and fetches the certification details 
    document
        .getElementById("queryForm")
        .addEventListener("submit", getCertificationDetails);
    async function getCertificationDetails(e) {
        e.preventDefault();
        const seafoodId = document.getElementById("getCertificateDropdown").value;
        if (!seafoodId) {
            alert("Please select a seafood ID to query.");
            return;
        }
        try {
            showLoader();
            const transaction = await contract.getCertification(seafoodId,
                { gasLimit: 3000000 }
            );
            alert("Certification details fetched successfully!");
            //Display the certification details
            const [inspectorName, notes, passed, timestamp] = transaction;
            const detailsDiv = document.getElementById("certificationInfoDisplay");
            detailsDiv.innerHTML = `
                    <h3>Certification Details for Seafood ID: ${seafoodId}</h3>
                    <p><strong>Inspector Name:</strong> ${inspectorName}</p>
                    <p><strong>Notes:</strong> ${notes}</p>
                    <p><strong>Passed:</strong> ${passed ? "✅ Yes" : "❌ No"}</p>
                    <p><strong>Timestamp:</strong> ${new Date(timestamp * 1000).toLocaleString()}</p>
                `;
        } catch (error) {
            alert("Error fetching certification details: " + error.message);
        } finally {
            hideLoader();
        }
    }
    //get all certified ids
    async function getAllCertifiedIds() {
        try {
            const certifiedIds = await contract.getAllCertifiedIds();
            localStorage.setItem("certId", certifiedIds);
        } catch (error) {
            alert("Error fetching certified IDs: " + error.message);
        }
    }

    //populate the dropdown menus 
    function populateDropdowns() {
        const getCertificateFormDropdown = document.getElementById(
            "getCertificateFormDropdown"
        );
        const getCertificateDropdown = document.getElementById(
            "getCertificateDropdown"
        );
        const certificationId = localStorage.getItem("certId");
        const seafoodId = localStorage.getItem("seafoodIds");

        if (getCertificateFormDropdown) getCertificateFormDropdown.innerHTML = "<option value=''>Select an ID</option>";
        if (getCertificateDropdown) getCertificateDropdown.innerHTML = "<option value=''>Select an ID</option>";
        if (seafoodId) {
            const certfiedSet = new Set(certificationId ? certificationId.split(",").map(id => id.toLowerCase()) : []);
            const spliting = seafoodId.split(",");
            spliting.forEach((id) => {
                const userLabel = `${id.slice(60, 67)}`;
                if (!certfiedSet.has(id.toLowerCase())) {
                    const option1 = document.createElement("option");
                    option1.value = id;
                    option1.textContent = userLabel;
                    getCertificateFormDropdown.appendChild(option1);
                } // Skip if the ID is already certified
                if (certfiedSet.has(id.toLowerCase())) {
                    const option2 = document.createElement("option");
                    option2.value = id;
                    option2.textContent = userLabel;
                    getCertificateDropdown.appendChild(option2);
                }
            });
        }

    }

};
