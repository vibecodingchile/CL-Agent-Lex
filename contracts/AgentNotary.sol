// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AgentNotary {
    mapping(string => uint256) public agentSpendingLimit;
    
    event LegalActVerified(string agentRUT, uint256 amount);

    function setAgentLimit(string memory _rut, uint256 _limit) public {
        agentSpendingLimit[_rut] = _limit;
    }

    function verifyTransaction(string memory _rut, uint256 _amount) public returns (bool) {
        require(_amount <= agentSpendingLimit[_rut], "Excede atribucion legal");
        emit LegalActVerified(_rut, _amount);
        return true;
    }
}
