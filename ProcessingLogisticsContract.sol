// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ICatchContract {
    //Interface for interacting with the CatchContract
    function getCatchInfo(
        bytes32 catchId //Retrieves basic metadata for a catch
    )
        external
        view
        returns (
            string memory location,
            string memory vesselName,
            address fisher,
            uint256 timestamp,
            bool verified,
            uint256 entryCount
        );
}

contract ProcessingLogisticsContract {
    //ProcessingLogisticsContract - Handles seafood processing and distribution updates
    ICatchContract public catchContract; //Reference to the CatchContract to verify catch existence

    constructor(address _catchContract) {
        // Set the CatchContract during deployment
        catchContract = ICatchContract(_catchContract);
    }

    struct DistributionEntry {
        //Structure to store distribution updates for a processed batch
        string location; // Location of the batch at update time
        string temperature; // Storage temperature
        string status; // Status of the batch (e.g., In Transit)
        string batchNumber; // Batch identifier for internal tracking
        string complianceNote;
        string storageMethod; // Method of storage (e.g., Frozen, Chilled)
        uint256 timestamp; // When the update was recorded
    }

    struct ProcessedBatch {
        //Structure to represent a processed seafood batch
        bytes32 catchId; // ID of the original catch
        string packaging; // Packaging method
        string cleaningNotes;
        bool compliant;
        uint256 paymentAmount;
        uint256 timestamp;
        DistributionEntry[] logistics; // Distribution updates for this batch
    }

    mapping(bytes32 => ProcessedBatch) public batches; // Mapping from seafoodId to processed batch
    bytes32[] public seafoodIds; // List of all processed seafood IDs

    function processCatch(
        //Processes a catch into a batch, storing packaging and cleaning data
        bytes32 catchId, //catchId ID of the original catch
        string memory packaging,
        string memory cleaningNotes,
        bool compliant, //compliant Whether the batch complies with standards
        uint256 paymentAmount //seafoodId Unique ID generated for the processed batch
    ) public returns (bytes32 seafoodId) {
        (, , , uint256 timestamp, , ) = catchContract.getCatchInfo(catchId); // Verify catch exists by checking for a valid timestamp

        require(timestamp > 0, "Invalid catchId");

        seafoodId = keccak256( // Generate a unique ID for the processed seafood batch
            abi.encodePacked(
                catchId,
                packaging,
                cleaningNotes,
                block.timestamp,
                msg.sender
            )
        );
        // Store processing details
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
        //Adds a logistics/distribution update to an existing batch
        bytes32 seafoodId, // seafoodId ID of the processed batch
        string memory location,
        string memory temperature,
        string memory status,
        string memory batchNumber,
        string memory complianceNote,
        string memory storageMethod
    ) public returns (uint256 index) {
        require(batches[seafoodId].timestamp > 0, "Batch not found");

        batches[seafoodId].logistics.push(
            DistributionEntry({
                location: location,
                temperature: temperature,
                status: status,
                batchNumber: batchNumber,
                complianceNote: complianceNote,
                storageMethod: storageMethod, // 🆕 store it
                timestamp: block.timestamp
            })
        );

        return batches[seafoodId].logistics.length - 1;
    }

    function getProcessingInfo(
        bytes32 seafoodId //Retrieves processing information for a seafood batch
    )
        public
        view
        returns (
            bytes32 catchId,
            string memory packaging,
            string memory cleaningNotes,
            bool compliant,
            uint256 paymentAmount,
            uint256 timestamp,
            uint256 logisticsCount
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
            p.logistics.length //logisticsCount Number of logistics updates recorded
        );
    }

    function getLogisticsUpdate(
        bytes32 seafoodId,
        uint256 index //Retrieves a specific logistics update for a seafood batch
    )
        public
        view
        returns (
            //allows location, temperature, status, batchNumber, complianceNote, storageMethod, timestamp to be updated
            string memory location,
            string memory temperature,
            string memory status,
            string memory batchNumber,
            string memory complianceNote,
            string memory storageMethod,
            uint256 timestamp
        )
    {
        DistributionEntry storage d = batches[seafoodId].logistics[index];
        return (
            d.location,
            d.temperature,
            d.status,
            d.batchNumber,
            d.complianceNote,
            d.storageMethod,
            d.timestamp
        );
    }

    function getAllSeafoodIds() public view returns (bytes32[] memory) {
        // Returns all recorded seafood IDs for processed batches
        return seafoodIds;
    }
}
