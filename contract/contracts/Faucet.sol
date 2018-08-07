pragma solidity ^0.4.24;

import "./Ownable.sol";


contract Faucet is Ownable {
    uint public blockLimit = 8640; // A day
    uint public amountEther = 10 ether;
    mapping (address => uint) lastFaucet;

    // Constructor
    function Faucet() public Ownable() {
    }

    function () public payable {}

    // External functions
    function sendEther(address account) public onlyOwner {
        require(address(this) != account);
        require(account != address(0));
        require(canReceiveEther(account) == true);

        lastFaucet[account] = block.number;
        account.transfer(amountEther);
    }

    function setBlockLimit(uint newBlockLimit) public onlyOwner {
        require(newBlockLimit > 0);
        blockLimit = newBlockLimit;
    }

    function setAmountEther(uint newAmountEther) public onlyOwner {
        require(newAmountEther >= 1 ether);
        amountEther = newAmountEther;
    }

    function checkRemainingBlocks(address account) public view returns (uint) {
        if (lastFaucet[account] > 0) {
          return lastFaucet[account] - (block.number - blockLimit);
        }
        return 0;
    }

    // Internal and Private functions
    function canReceiveEther(address account) private view returns (bool) {
        var lastFaucetBlock = lastFaucet[account];

        if (getBlockNumber() > lastFaucetBlock && checkContractBalance()) {
            return true;
        }

        return false;
    }

    function getBlockNumber() private view returns (uint) {
        return block.number - blockLimit;
    }

    function checkContractBalance() private view returns (bool) {
        return address(this).balance > amountEther;
    }
}
