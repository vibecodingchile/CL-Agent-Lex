# CL-Agent-Lex: Jurisdictional Extension for Harvard LIL Agent Protocols

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Jurisdiction: Chile](https://img.shields.io/badge/Jurisdiction-Chile-blue.svg)](#)

## Overview

**Extending the Harvard LIL Agent Protocol for Civil Law Jurisdictions: Integrating Chilean Legal Frameworks into AI Interoperability.**

**CL-Agent-Lex** is a technical extension of the [Harvard LIL Agent Protocols](https://harvard-lil.github.io/agent-protocols/). While the original protocol focuses on the technical interoperability of AI agents, **CL-Agent-Lex** introduces a "Jurisdictional Layer" specifically designed for Civil Law systems, starting with the Chilean legal framework.

Our goal is to transform AI interactions from mere data exchanges into **legally binding acts** under Chilean Law (Ley 19.799 & Ley 21.096).

## Key Features

- **Jurisdictional Handshake:** Extends JSON-RPC calls to include Chilean Tax ID (RUT) and Advanced Electronic Signature (FEA) metadata.
- **On-Chain Attribution (Smart Contracts):** A Solidity-based registrar (`AgentNotary.sol`) that validates if an agent has the legal "power of attorney" to execute financial transactions in CLP.
- **Semantic-CL Mapping:** Standardized schemas for Chilean-specific entities (UF, UTM, RUT, and local address formats).
- **Compliance-as-Code:** Automated validation against the Chilean AI Policy and Data Protection standards.

## Architecture

1. **Transport Layer:** Compatible with the Harvard Agent Protocol.
2. **Legal Layer:** Injects cryptographic proofs of identity verified against Chilean digital signatures.
3. **Settlement Layer:** Uses Ethereum-compatible Smart Contracts to log "Legal Events" inmutably.

## Quick Start

```bash
# Clone the repo
git clone https://github.com/your-user/CL-Agent-Lex.git

# Install dependencies
npm install

# Run the Jurisdictional Demo
npm run dev
```

## Execution Flow (Demo)

1. **Handshake:** Harvard Agent asks: "Who are you?".
2. **Identity:** Chilean Agent responds with RUT and FEA Certificate.
3. **On-Chain Check:** Protocol queries Smart Contract: "Does this agent have power to sign for $5,000,000 CLP?".
4. **Execution:** Smart Contract emits "Contract Signed" event; Harvard Agent receives status: 200 OK.
