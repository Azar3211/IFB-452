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
export default certAbi;