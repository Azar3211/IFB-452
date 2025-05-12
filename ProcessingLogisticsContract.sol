// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ICatchContract {
    function getCatchInfo(bytes32 catchId)
        external
        view
        returns (
            string memory location,
            string memory vesselName,
            address fisher,
            uint timestamp,
            bool verified,
            uint entryCount
        );
}

contract ProcessingLogisticsContract {
    ICatchContract public catchContract;

    constructor(address _catchContract) {
        catchContract = ICatchContract(_catchContract);
    }

    struct DistributionEntry {
    string location;
    string temperature;
    string status;
    string batchNumber;
    string complianceNote;
    string storageMethod; 
    uint timestamp;
    }   


    struct ProcessedBatch {
        bytes32 catchId;
        string packaging;
        string cleaningNotes;
        bool compliant;
        uint paymentAmount;
        uint timestamp;
        DistributionEntry[] logistics;
    }

    mapping(bytes32 => ProcessedBatch) public batches;
    bytes32[] public seafoodIds;

    function processCatch(
        bytes32 catchId,
        string memory packaging,
        string memory cleaningNotes,
        bool compliant,
        uint paymentAmount
    ) public returns (bytes32 seafoodId) {
        (, , , uint timestamp, , ) = catchContract.getCatchInfo(catchId);
        require(timestamp > 0, "Invalid catchId");

        seafoodId = keccak256(
            abi.encodePacked(catchId, packaging, cleaningNotes, block.timestamp, msg.sender)
        );

        ProcessedBatch storage p = batches[seafoodId];
        p.catchId = catchId;
        p.packaging = packaging;
        p.cleaningNotes = cleaningNotes;
        p.compliant = compliant;
        p.paymentAmount = paymentAmount;
        p.timestamp = block.timestamp;

        seafoodIds.push(seafoodId);
        return seafoodId;
    }

    function addLogisticsUpdate(
        bytes32 seafoodId,
        string memory location,
        string memory temperature,
        string memory status,
        string memory batchNumber,
        string memory complianceNote,
        string memory storageMethod // 🆕 NEW PARAMETER
    ) public returns (uint index) {
        require(batches[seafoodId].timestamp > 0, "Batch not found");

        batches[seafoodId].logistics.push(DistributionEntry({
            location: location,
            temperature: temperature,
            status: status,
            batchNumber: batchNumber,
            complianceNote: complianceNote,
            storageMethod: storageMethod, // 🆕 store it
            timestamp: block.timestamp
        }));

        return batches[seafoodId].logistics.length - 1;
    }


    function getProcessingInfo(bytes32 seafoodId)
        public view
        returns (
            bytes32 catchId,
            string memory packaging,
            string memory cleaningNotes,
            bool compliant,
            uint paymentAmount,
            uint timestamp,
            uint logisticsCount
        )
    {
        ProcessedBatch storage p = batches[seafoodId];
        return (
            p.catchId,
            p.packaging,
            p.cleaningNotes,
            p.compliant,
            p.paymentAmount,
            p.timestamp,
            p.logistics.length
        );
    }

    function getLogisticsUpdate(bytes32 seafoodId, uint index)
        public view
        returns (
            string memory location,
            string memory temperature,
            string memory status,
            string memory batchNumber,
            string memory complianceNote,
            string memory storageMethod, // 🆕
            uint timestamp
        )
    {
        DistributionEntry storage d = batches[seafoodId].logistics[index];
        return (
            d.location,
            d.temperature,
            d.status,
            d.batchNumber,
            d.complianceNote,
            d.storageMethod, // 🆕 return it
            d.timestamp
        );
    }


    function getAllSeafoodIds() public view returns (bytes32[] memory) {
        return seafoodIds;
    }
}
