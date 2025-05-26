// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IProcessingLogisticsContract {
    function getProcessingInfo(
        bytes32 seafoodId // A method that retrieves information about the processing and logistics history for a specific batch of seafood.
    )
        external
        view
        returns (
            bytes32 catchId,
            string memory packaging,
            string memory cleaningNotes,
            bool compliant,
            uint256 paymentAmount,
            uint256 timestamp,
            uint256 logisticsCount
        );

    function getLogisticsUpdate(
        bytes32 seafoodId,
        uint256 index // A method that retrieves updates about the current status of a batch of seafood at any given point in time.
    )
        external
        view
        returns (
            string memory location,
            string memory temperature,
            string memory status,
            string memory batchNumber,
            string memory complianceNote,
            uint256 timestamp
        );
}

contract CertificationContract {
    // Define a new contract named "CertificationContract"

    IProcessingLogisticsContract public processingContract;

    constructor(address _processingContract) {
        processingContract = IProcessingLogisticsContract(_processingContract);
    }

    struct Certification {
        // Define a structure (or class) for each certification record

        bytes32 seafoodId; // Unique identifier of the batch being certified.
        string inspectorName;
        string notes;
        bool passed; // Whether or not did it pass?
        uint256 timestamp;
    }

    mapping(bytes32 => Certification) public certifications; // A mapping (key-value pair system)

    bytes32[] public certifiedIds;
    bytes32 public lastCertifiedId;

    ///  Certify a seafood batch after reviewing logistics and processing data
    function certifySeafood(
        bytes32 seafoodId,
        string memory inspectorName, // Name of person who made this inspection and gave certificate to sea food
        string memory notes, // Additional information about the certification process.
        bool passed
    ) public returns (bool) {
        // Validate seafoodId by checking it has a timestamp
        (, , , , , uint256 processTimestamp, ) = processingContract
            .getProcessingInfo(seafoodId);
        require(processTimestamp > 0, "Invalid seafoodId");

        certifications[seafoodId] = Certification({ // Save certification record
            seafoodId: seafoodId,
            inspectorName: inspectorName,
            notes: notes,
            passed: passed,
            timestamp: block.timestamp
        });

        certifiedIds.push(seafoodId);
        lastCertifiedId = seafoodId;
        return true;
    }

    ///  Retrieves a certification record for a given seafood ID
    function getCertification(bytes32 seafoodId)
        public
        view
        returns (
            string memory inspectorName,
            string memory notes,
            bool passed,
            uint256 timestamp
        )
    {
        Certification memory c = certifications[seafoodId];
        return (c.inspectorName, c.notes, c.passed, c.timestamp);
    }

    /// Returns a list of all seafood IDs that have been certified
    function getAllCertifiedIds() public view returns (bytes32[] memory) {
        return certifiedIds;
    }
}
