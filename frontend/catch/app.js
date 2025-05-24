import catchByte from "./catchByte.js";
window.onload = () => {
  const catchAbi = [
    {
      inputs: [
        {
          internalType: "string",
          name: "location",
          type: "string",
        },
        {
          internalType: "string",
          name: "vesselName",
          type: "string",
        },
        {
          internalType: "string[]",
          name: "speciesList",
          type: "string[]",
        },
        {
          internalType: "string[]",
          name: "methodList",
          type: "string[]",
        },
        {
          internalType: "uint256[]",
          name: "quantityList",
          type: "uint256[]",
        },
      ],
      name: "logCatch",
      outputs: [
        {
          internalType: "bytes32",
          name: "catchId",
          type: "bytes32",
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
      ],
      name: "verifyCatch",
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
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      name: "catches",
      outputs: [
        {
          internalType: "string",
          name: "location",
          type: "string",
        },
        {
          internalType: "string",
          name: "vesselName",
          type: "string",
        },
        {
          internalType: "address",
          name: "fisher",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "timestamp",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "verified",
          type: "bool",
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
      name: "catchIds",
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
      name: "getAllCatchIds",
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
          name: "catchId",
          type: "bytes32",
        },
        {
          internalType: "uint256",
          name: "index",
          type: "uint256",
        },
      ],
      name: "getCatchDetail",
      outputs: [
        {
          internalType: "string",
          name: "species",
          type: "string",
        },
        {
          internalType: "string",
          name: "method",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "quantity",
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
          name: "catchId",
          type: "bytes32",
        },
      ],
      name: "getCatchInfo",
      outputs: [
        {
          internalType: "string",
          name: "location",
          type: "string",
        },
        {
          internalType: "string",
          name: "vesselName",
          type: "string",
        },
        {
          internalType: "address",
          name: "fisher",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "timestamp",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "verified",
          type: "bool",
        },
        {
          internalType: "uint256",
          name: "entryCount",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "lastCatchId",
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
      if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        userAddress = await signer.getAddress();
        document.getElementById(
          "walletDisplay"
        ).innerText = `Connected: ${userAddress}`;
        let catchAddress = localStorage.getItem("catchAddress");
        if (!catchAddress)
        {
        const factory = new ethers.ContractFactory(catchAbi, catchByte, signer);
        const catchContract = await factory.deploy();
        await catchContract.deployed();
        const catchAddress = catchContract.address;
        console.log("Catch contract deployed at:", catchAddress);
        localStorage.setItem("catchAddress", catchAddress);
        } else {
          console.log("Catch contract already deployed at:", catchAddress);
        }

        contract = new ethers.Contract(catchAddress, catchAbi, signer);
        loadCatches();
      } else {
        alert("MetaMask not detected.");
      }
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

  async function submitCatch(e) {
    e.preventDefault();
    if (!contract) return alert("Please connect your wallet first.");

    const location = document.getElementById("location").value;
    const vesselName = document.getElementById("vesselName").value;

    const speciesList = [];
    const methodList = [];
    const quantityList = [];

    document.querySelectorAll("#detailsContainer > div").forEach((row) => {
      const [speciesInput, methodInput, quantityInput] =
        row.querySelectorAll("input");
      speciesList.push(speciesInput.value);
      methodList.push(methodInput.value);
      quantityList.push(parseInt(quantityInput.value));
    });

    try {
      const tx = await contract.logCatch(
        location,
        vesselName,
        speciesList,
        methodList,
        quantityList,
        { gasLimit: 500000 }
      );
      await tx.wait();

      document.getElementById("successMessage").innerText =
        "✅ Catch logged successfully!";
      document.getElementById("catchForm").reset();
      document.getElementById("detailsContainer").innerHTML = "";
      addDetail();
      loadCatches();
    } catch (err) {
      console.error(err);
      document.getElementById("successMessage").innerText =
        "❌ Failed to log catch.";
    }
  }

  async function loadCatches() {
    const list = document.getElementById("catchList");
    list.innerHTML = "";

    try {
      const ids = await contract.getAllCatchIds();

      for (const id of ids) {
        const [location, vessel, fisher, timestamp, verified, entryCount] =
          await contract.getCatchInfo(id);
          localStorage.setItem("catchId", id);

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

        if (fisher.toLowerCase() === userAddress.toLowerCase()) {
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
              const [,,,,,entryCount] = await contract.getCatchInfo(id);
              const detailList = document.createElement("ul");
              detailList.className = "list-disc ml-5 mt-2";

              for (let i = 0; i < entryCount; i++) {
                const [species, method, quantity] =
                  await contract.getCatchDetail(id, i);
                const listItem = document.createElement("li");
                listItem.textContent = `Caught ${quantity}x of ${species} via ${method}`;
                detailList.appendChild(listItem);
              }

              catchCard.appendChild(detailList);
              detailButton.remove(); // prevent multiple insertions
            } catch (err) {
              console.error("Details retrieval failed:", err);
              alert("❌ Error retrieving catch details.");
            }
          };
          catchCard.appendChild(detailButton);

          if (!verified) {
            button.onclick = async () => {
              try {
                const tx = await contract.verifyCatch(id, { gasLimit: 100000 });
                await tx.wait();
                alert("✅ Catch verified!");
                loadCatches();
              } catch (err) {
                console.error("Verification failed:", err);
                alert("❌ Error verifying catch.");
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

  async function verifyCatch(id) {
    try {
      if (!contract) return alert("Please connect your wallet first.");
      const tx = await contract.verifyCatch(id, { gasLimit: 100000 });
      await tx.wait();
      alert("✅ Catch verified!");
      loadCatches();
    } catch (err) {
      console.error("Verification failed:", err);
      alert("❌ Error verifying catch.");
    }
  }
    // QR Code generation


};
