// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Interfaces for connected contracts

interface ICertificationContract {
    function getCertification(bytes32 seafoodId)
        external
        view
        returns (
            string memory inspectorName,
            string memory notes,
            bool passed,
            uint timestamp
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
            uint timestamp,
            bool verified,
            uint entryCount
        );
        
    function getCatchDetail(bytes32 catchId, uint index)
        external
        view
        returns (string memory species, string memory method, uint quantity);
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

contract RetailContract {
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
        string retailerName;
        string location;
        string notes;
        uint timestamp;
    }

    mapping(bytes32 => Sale) public sales;
    bytes32[] public soldIds;
    bytes32 public lastSoldId;

    /// @notice Records a seafood sale (requires prior certification)
    function recordSale(
        bytes32 seafoodId,
        string memory retailerName,
        string memory location,
        string memory notes
    ) public returns (bool) {
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

    /// @notice Gets catch-level trace info
    function getCatchTrace(bytes32 seafoodId)
        public
        view
        returns (
            string memory location,
            string memory vessel,
            uint timestamp
        )
    {
        (bytes32 catchId, , , , , , ) = processing.getProcessingInfo(seafoodId);
        (string memory loc, string memory vesselName, , uint catchTime, , ) =
            catchContract.getCatchInfo(catchId);
        return (loc, vesselName, catchTime);
    }

    /// @notice Gets processing-level trace info
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
        uint logisticsCount;
        {
            string memory _pack;
            string memory _clean;
            (
                ,
                _pack,
                _clean,
                ,
                ,
                ,
                logisticsCount
            ) = processing.getProcessingInfo(seafoodId);

            packaging = _pack;
            cleaningNotes = _clean;
        }

        if (logisticsCount > 0) {
            {
                string memory _loc;
                string memory _temp;
                string memory _status;
                string memory _batch;
                string memory _note;

                (
                    _loc,
                    _temp,
                    _status,
                    _batch,
                    _note,

                ) = processing.getLogisticsUpdate(seafoodId, logisticsCount - 1);

                lastDistributionStatus = _status;
                lastDistributionLocation = _loc;
                lastDistributionTemperature = _temp;
                lastDistributionBatch = _batch;
                lastDistributionNote = _note;
            }
        } else {
            lastDistributionStatus = "";
            lastDistributionLocation = "";
            lastDistributionTemperature = "";
            lastDistributionBatch = "";
            lastDistributionNote = "";
        }
    }


    /// @notice Gets retail-level sale info
    function getRetailSaleTrace(bytes32 seafoodId)
        public
        view
        returns (
            string memory retailer,
            string memory location,
            string memory notes,
            uint timestamp
        )
    {
        Sale storage sale = sales[seafoodId];
        return (
            sale.retailerName,
            sale.location,
            sale.notes,
            sale.timestamp
        );
    }

    /// @notice Lists all seafood IDs that have been sold
    function getAllSoldIds() public view returns (bytes32[] memory) {
        return soldIds;
    }
}
