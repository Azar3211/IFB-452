// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IProcessingLogisticsContract {
    function getProcessingInfo(bytes32 seafoodId)
        external
        view
        returns (
            bytes32 catchId,
            string memory packaging,
            string memory cleaningNotes,
            bool compliant,
            uint paymentAmount,
            uint timestamp,
            uint logisticsCount
        );

    function getLogisticsUpdate(bytes32 seafoodId, uint index)
        external
        view
        returns (
            string memory location,
            string memory temperature,
            string memory status,
            string memory batchNumber,
            string memory complianceNote,
            uint timestamp
        );
}

contract CertificationContract {
    IProcessingLogisticsContract public processingContract;

    constructor(address _processingContract) {
        processingContract = IProcessingLogisticsContract(_processingContract);
    }

    struct Certification {
        bytes32 seafoodId;
        string inspectorName;
        string notes;
        bool passed;
        uint timestamp;
    }

    mapping(bytes32 => Certification) public certifications;
    bytes32[] public certifiedIds;
    bytes32 public lastCertifiedId;

    /// @notice Certify a seafood batch after reviewing logistics and processing data
    function certifySeafood(
        bytes32 seafoodId,
        string memory inspectorName,
        string memory notes,
        bool passed
    ) public returns (bool) {
        // Validate seafoodId by checking it has a timestamp
        (, , , , , uint processTimestamp, ) = processingContract.getProcessingInfo(seafoodId);
        require(processTimestamp > 0, "Invalid seafoodId");

        certifications[seafoodId] = Certification({
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

    /// @notice Retrieve certification details
    function getCertification(bytes32 seafoodId)
        public
        view
        returns (
            string memory inspectorName,
            string memory notes,
            bool passed,
            uint timestamp
        )
    {
        Certification memory c = certifications[seafoodId];
        return (c.inspectorName, c.notes, c.passed, c.timestamp);
    }

    /// @notice List all certified seafood IDs
    function getAllCertifiedIds() public view returns (bytes32[] memory) {
        return certifiedIds;
    }
}
