// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title JurisdiccionCL
 * @dev Manages the legal capacity (Capacidad de Goce y Ejercicio) of AI Agents in Chile.
 */
contract JurisdiccionCL {
    struct AgentCapacity {
        string rut;
        bool hasAdvancedElectronicSignature;
        uint256 maxTransactionLimitCLP;
        bool isActive;
    }

    mapping(address => AgentCapacity) public agents;
    address public authority;

    event CapacityUpdated(address indexed agent, string rut, uint256 limit);
    event LegalActExecuted(address indexed agent, uint256 amount, string description);

    modifier onlyAuthority() {
        require(msg.sender == authority, "Only authority can perform this action");
        _;
    }

    constructor() {
        authority = msg.sender;
    }

    function registerAgent(
        address _agent,
        string memory _rut,
        bool _fea,
        uint256 _limit
    ) public onlyAuthority {
        agents[_agent] = AgentCapacity(_rut, _fea, _limit, true);
        emit CapacityUpdated(_agent, _rut, _limit);
    }

    function checkCapacity(address _agent, uint256 _amount) public view returns (bool) {
        AgentCapacity memory agent = agents[_agent];
        return (agent.isActive && _amount <= agent.maxTransactionLimitCLP);
    }

    function executeLegalAct(uint256 _amount, string memory _description) public {
        require(checkCapacity(msg.sender, _amount), "Agent lacks legal capacity for this transaction amount");
        emit LegalActExecuted(msg.sender, _amount, _description);
    }
}
