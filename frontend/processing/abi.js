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
export default processingAbi;