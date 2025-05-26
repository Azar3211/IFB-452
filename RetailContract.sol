// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Interfaces for connected contracts: Certification, Catch, and ProcessingLogistics

interface ICertificationContract {
    function getCertification(bytes32 seafoodId)
        external
        view
        returns (
            string memory inspectorName,
            string memory notes,
            bool passed,
            uint256 timestamp
        );
}

interface ICatchContract {
    function getCatchInfo(bytes32 catchId)
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

    function getCatchDetail(bytes32 catchId, uint256 index)
        external
        view
        returns (
            string memory species,
            string memory method,
            uint256 quantity
        );
}

interface IProcessingLogisticsContract {
    function getProcessingInfo(bytes32 seafoodId)
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

    function getLogisticsUpdate(bytes32 seafoodId, uint256 index)
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

contract RetailContract {
    //RetailContract - Final step in the seafood traceability chain
    ICertificationContract public certification;
    ICatchContract public catchContract;
    IProcessingLogisticsContract public processing;

    constructor(
        address _certification,
        address _catchContract,
        address _processing
    ) {
        certification = ICertificationContract(_certification);
        catchContract = ICatchContract(_catchContract);
        processing = IProcessingLogisticsContract(_processing);
    }

    struct Sale {
        //Structure representing a sale record at the retailer level
        string retailerName; // Retailer who sold the seafood
        string location; // Retail location
        string notes; // Additional notes or comments
        uint256 timestamp; // Time of sale
    }

    mapping(bytes32 => Sale) public sales; //Mapping seafoodId to sale
    bytes32[] public soldIds; // List of all sold seafood IDs
    bytes32 public lastSoldId; // Most recent sale ID

    /// Records a seafood sale (requires prior certification)
    function recordSale(
        //  Record the sale of a seafood batch after certification
        bytes32 seafoodId,
        string memory retailerName,
        string memory location,
        string memory notes
    ) public returns (bool) {
        // Ensure the seafood has passed certification before sale
        (, , bool passed, ) = certification.getCertification(seafoodId);
        require(passed, "Seafood batch not certified");

        sales[seafoodId] = Sale({
            retailerName: retailerName,
            location: location,
            notes: notes,
            timestamp: block.timestamp
        });

        soldIds.push(seafoodId);
        lastSoldId = seafoodId;
        return true;
    }

    function getCertificationTrace(
        bytes32 seafoodId //Retrieves certification status and notes
    )
        public
        view
        returns (
            string memory notes,
            bool passed,
            uint256 timestamp
        )
    {
        (
            ,
            string memory _notes,
            bool _passed,
            uint256 _timestamp
        ) = certification.getCertification(seafoodId);
        return (_notes, _passed, _timestamp);
    }

    //Retrieves original catch location, vessel, and time
    function getCatchTrace(bytes32 seafoodId)
        public
        view
        returns (
            string memory location,
            string memory vessel,
            uint256 timestamp
        )
    {
        (bytes32 catchId, , , , , , ) = processing.getProcessingInfo(seafoodId); //Get associated catchId from processing contract
        (
            string memory loc,
            string memory vesselName,
            ,
            uint256 catchTime,
            ,

        ) = catchContract.getCatchInfo(catchId);
        return (loc, vesselName, catchTime);
    }

    //Retrieves latest processing and logistics update info
    function getProcessingTrace(bytes32 seafoodId)
        public
        view
        returns (
            string memory packaging,
            string memory cleaningNotes,
            string memory lastDistributionStatus,
            string memory lastDistributionLocation,
            string memory lastDistributionTemperature,
            string memory lastDistributionBatch,
            string memory lastDistributionNote
        )
    {
        uint256 logisticsCount; // Declare variable to store number of logistics updates for the seafood batch

        {
            string memory _pack; //Retrieve only cleaning and packaged info
            string memory _clean;
            (
                ,
                // Call processing contract to get processing info for the seafood ID

                //Ignore
                _pack,
                _clean,  
                , //Ignore
                , //Ignore
                , //Ignore
                logisticsCount
            ) = processing.getProcessingInfo(seafoodId);

            packaging = _pack;
            cleaningNotes = _clean;
        }

        if (logisticsCount > 0) {
            // If logistics updates exist, retrieve the latest (most recent) entry
            {
                string memory _loc;
                string memory _temp;
                string memory _status;
                string memory _batch;
                string memory _note;
                // Get the most recent logistics update using the last index
                (_loc, _temp, _status, _batch, _note, ) = processing
                    .getLogisticsUpdate(seafoodId, logisticsCount - 1);
                // Assign values to output variables

                lastDistributionStatus = _status;
                lastDistributionLocation = _loc;
                lastDistributionTemperature = _temp;
                lastDistributionBatch = _batch;
                lastDistributionNote = _note;
            }
        } else {
            // If there are no logistics updates, assign empty values

            lastDistributionStatus = "";
            lastDistributionLocation = "";
            lastDistributionTemperature = "";
            lastDistributionBatch = "";
            lastDistributionNote = "";
        }
    }

    //Retrieve retail-level sale information
    function getRetailSaleTrace(bytes32 seafoodId)
        public
        view
        returns (
            string memory retailer,
            string memory location,
            string memory notes,
            uint256 timestamp
        )
    {
        Sale storage sale = sales[seafoodId];
        return (sale.retailerName, sale.location, sale.notes, sale.timestamp);
    }

    //Lists all seafood IDs that have been sold
    function getAllSoldIds() public view returns (bytes32[] memory) {
        return soldIds;
    }
}
