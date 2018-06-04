pragma solidity ^0.4.20;

contract KuniLord {
    
    uint private constant INIT_BUY_PRICE = 1000;
    
    event OccupyKuni(address person, bytes32 nation, uint price);
    event SetNickname(address person, bytes32 nickname);
    
    address public owner;
    
    struct Lord {
        address lordAddr;
        bytes32 nickname;
    }
    
    struct Kuni {
        bytes32 name;
        Lord lord;
        uint currentBuyPrice;
    }
    
    mapping (address => Lord) lords;
    mapping (bytes32 => Kuni) kunies;
    
    Kuni[] public occupiedKunies;
    Lord[] public occupingLords;
    
    constructor() public {
        owner = msg.sender;
    }
    
    function occupy(bytes32 nation, uint price) public payable {
        require(nation != "");
        if (checkKuniExist(nation)) {
            require(price > kunies[nation].currentBuyPrice);
            
            kunies[nation].currentBuyPrice = price;
            kunies[nation].lord = lords[msg.sender];
            
        } else {
            require(price > INIT_BUY_PRICE);
            
            Kuni memory newKuni = Kuni({
                name: nation,
                currentBuyPrice: price,
                lord: lords[msg.sender]
            });
            
            kunies[nation] = newKuni;
            occupiedKunies.push(newKuni);
        }
        if (!checkLordExist(lords[msg.sender].lordAddr)) {
            occupingLords.push(lords[msg.sender]);
        }
        emit OccupyKuni(msg.sender, nation, price);
    }
    
    function setNickname(bytes32 _nickname) public payable {
        lords[msg.sender].lordAddr = msg.sender;
        lords[msg.sender].nickname = _nickname;
        emit SetNickname(msg.sender, _nickname);
    }
    
    function checkKuniExist(bytes32 _name) internal view returns(bool){
        for (uint i = 0; i< occupiedKunies.length; i++) {
            if (occupiedKunies[i].name == _name) {
                return true;
            }
        }
        return false;
    }
    
    function getCurrentPrice(bytes32 kuni) public view returns(uint) {
        require(kuni != "");
        if (checkKuniExist(kuni)) {
            return kunies[kuni].currentBuyPrice;   
        }
        return INIT_BUY_PRICE;
    }
    
    function checkLordExist(address lordAddr) internal view returns(bool) {
        for(uint i = 0; i < occupingLords.length; i++) {
            if (occupingLords[i].lordAddr == lordAddr) {
                return true;
            }
        }
        return false;
    }
}