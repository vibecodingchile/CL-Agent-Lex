// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AgentNotary
 * @dev Valida atribuciones legales para agentes de IA bajo jurisdicción chilena.
 */
contract AgentNotary {
    address public admin;
    
    struct LegalPower {
        bool isActive;
        uint256 maxAmountCLP;
        string rut;
    }

    mapping(address => LegalPower) public registry;

    event AgentActionValidated(address indexed agent, string rut, uint256 amount);

    constructor() {
        admin = msg.sender;
    }

    function registerAgent(address _agent, string memory _rut, uint256 _limit) public {
        require(msg.sender == admin, "Only admin can register legal powers");
        registry[_agent] = LegalPower(true, _limit, _rut);
    }

    function verifyAndExecute(uint256 _amount) public returns (bool) {
        LegalPower memory power = registry[msg.sender];
        require(power.isActive, "Agent not legally authorized");
        require(_amount <= power.maxAmountCLP, "Amount exceeds legal attribution");
        
        emit AgentActionValidated(msg.sender, power.rut, _amount);
        return true;
    }
}
