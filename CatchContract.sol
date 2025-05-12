// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CatchContract {
    struct CatchDetail {
        string species;
        string method;
        uint quantity;
    }

    struct Catch {
        string location;
        string vesselName;
        address fisher;
        uint timestamp;
        bool verified;
        CatchDetail[] details;
    }

    mapping(bytes32 => Catch) public catches;
    bytes32[] public catchIds;
    bytes32 public lastCatchId;


    function logCatch(
        string memory location,
        string memory vesselName,
        string[] memory speciesList,
        string[] memory methodList,
        uint[] memory quantityList
    ) public returns (bytes32 catchId) {
        require(
            speciesList.length == methodList.length &&
            methodList.length == quantityList.length,
            "Mismatched array lengths"
        );

        catchId = keccak256(
            abi.encodePacked(location, vesselName, block.timestamp, msg.sender)
        );

        Catch storage c = catches[catchId];
        c.location = location;
        c.vesselName = vesselName;
        c.fisher = msg.sender;
        c.timestamp = block.timestamp;
        c.verified = false;

        for (uint i = 0; i < speciesList.length; i++) {
            c.details.push(CatchDetail({
                species: speciesList[i],
                method: methodList[i],
                quantity: quantityList[i]
            }));
        }

        catchIds.push(catchId);
        lastCatchId = catchId;
        return catchId;
    }

    function verifyCatch(bytes32 catchId) public returns (bool) {
        require(catches[catchId].timestamp > 0, "Catch not found");
        catches[catchId].verified = true;
        return true;
    }

    function getCatchInfo(bytes32 catchId)
        public view
        returns (
            string memory location,
            string memory vesselName,
            address fisher,
            uint timestamp,
            bool verified,
            uint entryCount
        )
    {
        Catch storage c = catches[catchId];
        return (
            c.location,
            c.vesselName,
            c.fisher,
            c.timestamp,
            c.verified,
            c.details.length
        );
    }

    function getCatchDetail(bytes32 catchId, uint index)
        public view
        returns (string memory species, string memory method, uint quantity)
    {
        CatchDetail storage d = catches[catchId].details[index];
        return (d.species, d.method, d.quantity);
    }

    function getAllCatchIds() public view returns (bytes32[] memory) {
        return catchIds;
    }
}
