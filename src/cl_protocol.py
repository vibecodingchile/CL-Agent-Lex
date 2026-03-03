import hashlib
import datetime
from ecdsa import SigningKey, SECP256k1

class CLAgentProtocol:
    def __init__(self, agent_id, rut_empresa, cert_serial="FEA-CL-998877"):
        self.agent_id = agent_id
        self.rut = rut_empresa
        self.cert_serial = cert_serial
        self.private_key = SigningKey.generate(curve=SECP256k1)
        
    def sign_legal_payload(self, amount_clp, destination_rut):
        """Simula la Firma Electrónica Avanzada Chilena con Timestamp y Certificado"""
        timestamp = datetime.datetime.now(datetime.timezone.utc).isoformat()
        
        # El mensaje ahora incluye el serial del certificado y el timestamp para mayor realismo legal
        message = f"{self.rut}|{amount_clp}|{destination_rut}|{self.cert_serial}|{timestamp}"
        
        signature = self.private_key.sign(message.encode())
        return {
            "protocol_version": "1.1-CL",
            "sender_rut": self.rut,
            "certificate_serial": self.cert_serial,
            "timestamp": timestamp,
            "payload_hash": hashlib.sha256(message.encode()).hexdigest(),
            "signature": signature.hex(),
            "jurisdiction": "Chile",
            "legal_validity": "Advanced Electronic Signature (FEA)"
        }

# Ejemplo de uso
if __name__ == "__main__":
    agente = CLAgentProtocol("Agent-001", "76.453.210-K")
    print(agente.sign_legal_payload(500000, "99.555.444-3"))
