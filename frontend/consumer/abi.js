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
  export default retailAbi;