// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract airquality {

    struct cityAQIdeets {
        string city;
        uint AQI;
        string PP;
    }

    cityAQIdeets[] cityAQIentries;

    //OWNER ONLY FUNCTIONS
    // this function adds cityAQIdeets for 10 cities
    function setcityAQIs(string memory _city, uint _AQI, string memory _PP) public {
        cityAQIentries.push(cityAQIdeets(_city,_AQI, _PP));
    }

    // this function will return a string of cities for display
    function getAllcityAQICombos() public view returns(string memory) {
        string memory mycityAQIInfo;
        for (uint i = 0; i < cityAQIentries.length; i++) {
            string memory text = cityAQIentries[i].city;
            mycityAQIInfo = string.concat(text,mycityAQIInfo);
            mycityAQIInfo = string.concat(" ",mycityAQIInfo);
        }
        return mycityAQIInfo;
    }

    // this function deletes a single entry from the cityAQIentries array 
    function deletecityAQICombo(string memory _city) public {
        uint idx;
        for (uint i = 0; i < cityAQIentries.length;i++){
            if (keccak256(abi.encodePacked(bytes(_city))) == keccak256(abi.encodePacked(cityAQIentries[i].city))){
                idx = i;
                delete cityAQIentries[i];
            }
        }
        for (uint i = idx; i < cityAQIentries.length-1;i++) {
            cityAQIentries[i] = cityAQIentries[i+1];
        }
        cityAQIentries.pop();
    }

        function returncityAQLLength() public view returns (uint256) {
        return cityAQIentries.length;
    }

    // ** USER ONLY FUNCTIONS **

    // this function retrieves the AQI from the smart contract based on the entry made by the user
    function getcityPPAQI(string memory _city) public view returns (uint AQIval, string memory PPval){
        for (uint i = 0; i < cityAQIentries.length;i++){
            if (keccak256(abi.encodePacked(bytes(_city))) == keccak256(abi.encodePacked(cityAQIentries[i].city))) {
                return (cityAQIentries[i].AQI, cityAQIentries[i].PP);
            }
        }
    }
}