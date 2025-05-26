// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CatchContract {
    struct CatchDetail {
        string species;
        string method;
        uint256 quantity;
    } //This creates structure of each individual species caught. And the method and the amount of seafood caught

    struct Catch {
        string location;
        string vesselName;
        address fisher;
        uint256 timestamp;
        bool verified;
        CatchDetail[] details;
    } // This is a structure for each individual catch, which includes information like location and vessel name.

    mapping(bytes32 => Catch) public catches; // A mapping (key-value pair system
    // where keys can be unique identifiers generated from data about fishers' activities,
    // and values are the actual "Catch" structures containing their details
    bytes32[] public catchIds;
    bytes32 public lastCatchId;

    function logCatch(
        //Structure to hold the data for logging a catch, it takes a string of the location and vessel as theres only one place they can catch a seafood at that point in time
        string memory location,
        string memory vesselName,
        string[] memory speciesList, //an array of species, how they caught it and how many.
        string[] memory methodList,
        uint256[] memory quantityList
    ) public returns (bytes32 catchId) {
        // A function that logs (records) each individual seafood catch.

        require( // Before logging a new record, ensure the array lengths are all correct!
            speciesList.length == methodList.length &&
                methodList.length == quantityList.length,
            "Mismatched array lengths"
        );
        // Before logging a new record, ensure the array lengths are all correct!

        catchId = keccak256(
            abi.encodePacked(location, vesselName, block.timestamp, msg.sender)
        );

        Catch storage c = catches[catchId];
        c.location = location;
        c.vesselName = vesselName; // Save details about the vessel used to make catch.
        c.fisher = msg.sender;
        c.timestamp = block.timestamp; //Save when exactly was record created

        c.verified = false; // Initially assume that data is not verified.

        for (uint256 i = 0; i < speciesList.length; i++) {
            // For each catch detail, save the type of seafood caught,
            // how it got there and amount.
            c.details.push(
                CatchDetail({
                    species: speciesList[i],
                    method: methodList[i],
                    quantity: quantityList[i]
                }) //save details about fishing vessel
            );
        }

        catchIds.push(catchId);
        lastCatchId = catchId;
        return catchId;
    }

    function verifyCatch(bytes32 catchId) public returns (bool) {
        require(catches[catchId].timestamp > 0, "Catch not found"); // Before verifying a record, ensure it exists!

        catches[catchId].verified = true;
        return true;
    }

    function getCatchInfo(bytes32 catchId)
        public
        view
        returns (
            string memory location,
            string memory vesselName,
            address fisher,
            uint256 timestamp,
            bool verified,
            uint256 entryCount
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

    function getCatchDetail(bytes32 catchId, uint256 index)
        public
        view
        returns (
            string memory species,
            string memory method,
            uint256 quantity
        )
    {
        CatchDetail storage d = catches[catchId].details[index]; // Retrieve a single record from this log entry.

        return (d.species, d.method, d.quantity);
    }

    function getAllCatchIds() public view returns (bytes32[] memory) {
        // Return all the unique identifiers for each catch recorded in database

        return catchIds;
    }
}
