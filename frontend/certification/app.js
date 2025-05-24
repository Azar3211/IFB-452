import certificationByteCode from "./certificationByteCode.js";
import processingAbi from "../processing/abi.js";
window.onload = () => {
    const certAbi = [
        {
            inputs: [
                {
                    internalType: "bytes32",
                    name: "seafoodId",
                    type: "bytes32",
                },
                {
                    internalType: "string",
                    name: "inspectorName",
                    type: "string",
                },
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
            ],
            name: "certifySeafood",
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
                    name: "_processingContract",
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
            name: "certifications",
            outputs: [
                {
                    internalType: "bytes32",
                    name: "seafoodId",
                    type: "bytes32",
                },
                {
                    internalType: "string",
                    name: "inspectorName",
                    type: "string",
                },
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
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            name: "certifiedIds",
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
            name: "getAllCertifiedIds",
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
            name: "getCertification",
            outputs: [
                {
                    internalType: "string",
                    name: "inspectorName",
                    type: "string",
                },
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
            inputs: [],
            name: "lastCertifiedId",
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
            name: "processingContract",
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
    ];
    let provider, signer, userAddress, contract;
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
                let processingContractAddress =
                    localStorage.getItem("processingAddress");
                let certificationAddress = localStorage.getItem("certificationAddress");
                if (!certificationAddress) {
                    const factory = new ethers.ContractFactory(
                        certAbi,
                        certificationByteCode,
                        signer
                    );
                    const certContract = await factory.deploy(processingContractAddress);
                    await certContract.deployed();
                    const certificationAddress = certContract.address;
                    localStorage.setItem("certificationAddress", certificationAddress);
                }
                contract = new ethers.Contract(certificationAddress, certAbi, signer);
                document.getElementById("appContent").style.display = "block";
                getProcessingDetails(processingContractAddress, signer)
            } else {
                alert("Please install MetaMask or another Ethereum wallet provider.");
            }
        });


    //function to get the processing details
    async function getProcessingDetails(processingAddress, signer) {
        const processingList = document.getElementById("waitingList")
        processingList.innerHTML = ""; 
        try {
            if (!processingAddress) {
                alert("Processing contract address not found.");
                return;
            }
            const processingContract = new ethers.Contract(
                processingAddress,
                processingAbi,
                signer
            );
            const seafoodIds = localStorage.getItem("seafoodIds");
            const seafoodExtract = seafoodIds.split(",");
            for (const seafoodId of seafoodExtract) {
                try {

                    const [catchId, packaging, cleaningNotes, compliant, paymentAmount, timestamp, logisticsCount] = await processingContract.getProcessingInfo(seafoodId);
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
                    `;}

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
                        processingList.appendChild(listItem);
                    } catch (error) {
                        const errorItem = document.createElement("li");
                        errorItem.textContent = `❌ Failed to fetch details for ${seafoodId}`;
                        processingList.appendChild(errorItem);
                    }
                }
        } catch (error) {
                alert("Error fetching processing details: " + error.message);
            }
        }

    //function to certify seafood
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
                getAllCertifiedIds();
                //populate fields
                populateDropdowns();
                location.reload();
            } catch (error) {
                alert("Error certifying seafood: " + error.message);
            }
        }

        //function to get certification details
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
            [
                getCertificateFormDropdown,
                getCertificateDropdown,

            ].forEach((dropdown) => {
                if (dropdown)
                    dropdown.innerHTML = "<option value=''>Select an ID</option>";
            });

            if (seafoodId) {
                const spliting = seafoodId.split(",");
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

                    getCertificateFormDropdown.appendChild(option1);
                    getCertificateDropdown.appendChild(option2);
                });
            }

        }

    };
