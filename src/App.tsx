import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, 
  Fingerprint, 
  Database, 
  Activity, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Smartphone,
  Cpu,
  Scale
} from "lucide-react";

interface AgentStatus {
  rut: string;
  fea: boolean;
  capacity: number;
  status: "idle" | "handshake" | "validating" | "ready" | "error";
}

export default function App() {
  const [agent, setAgent] = useState<AgentStatus>({
    rut: "12.345.678-9",
    fea: true,
    capacity: 5000000,
    status: "idle"
  });

  const [logs, setLogs] = useState<string[]>([]);
  const [showHud, setShowHud] = useState(true);
  const [rutInput, setRutInput] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev].slice(0, 10));
  };

  const runHandshake = async () => {
    setAgent(prev => ({ ...prev, status: "handshake" }));
    addLog("Handshake: Harvard Agent asks: 'Who are you?'");
    await new Promise(r => setTimeout(r, 1000));
    
    addLog("Identity: Chilean Agent responds with RUT " + agent.rut + " and FEA Certificate.");
    setAgent(prev => ({ ...prev, status: "validating" }));
    await new Promise(r => setTimeout(r, 1000));

    addLog("On-Chain Check: Querying AgentNotary.sol: 'Does this agent have power to sign for $5,000,000 CLP?'");
    await new Promise(r => setTimeout(r, 1500));
    
    addLog("Execution: Smart Contract emits 'Contract Signed' event.");
    setAgent(prev => ({ ...prev, status: "ready" }));
    addLog("Status: 200 OK. Harvard Agent receives confirmation.");
  };

  const validateRut = async () => {
    setIsValidating(true);
    try {
      const res = await fetch("/api/validate-rut", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rut: rutInput })
      });
      const data = await res.json();
      if (data.isValid) {
        setAgent(prev => ({ ...prev, rut: rutInput }));
        addLog("RUT Validated: " + rutInput);
      } else {
        addLog("Error: Invalid RUT format or checksum.");
      }
    } catch (err) {
      addLog("Error: Backend validation failed.");
    }
    setIsValidating(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-12 border-b border-black pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-4xl md:text-6xl font-serif italic tracking-tight">CL-Agent-Lex</h1>
          <p className="text-xs font-mono uppercase opacity-50 mt-2">
            Harvard LIL Agent Protocol Extension / Jurisdictional Adapter
          </p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-[10px] font-mono uppercase opacity-50">Current Jurisdiction</p>
          <p className="text-xl font-serif italic">Chile (Civil Law)</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Agent Status */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white/50 p-6 rounded-2xl border border-black/5 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Cpu className="w-5 h-5" />
              <h2 className="font-serif italic text-xl">Agent Identity & Capacity</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-black/10 rounded-xl">
                <p className="col-header">Legal Identifier (RUT)</p>
                <p className="data-value text-2xl mt-1">{agent.rut}</p>
              </div>
              <div className="p-4 border border-black/10 rounded-xl">
                <p className="col-header">On-Chain Capacity</p>
                <p className="data-value text-2xl mt-1">{agent.capacity.toLocaleString()} CLP</p>
              </div>
              <div className="p-4 border border-black/10 rounded-xl flex justify-between items-center">
                <div>
                  <p className="col-header">FEA Status</p>
                  <p className="data-value text-lg mt-1">{agent.fea ? "Verified" : "Pending"}</p>
                </div>
                <Fingerprint className={`w-8 h-8 ${agent.fea ? "text-emerald-600" : "text-amber-600"}`} />
              </div>
              <div className="p-4 border border-black/10 rounded-xl flex justify-between items-center">
                <div>
                  <p className="col-header">Protocol Status</p>
                  <p className="data-value text-lg mt-1 capitalize">{agent.status}</p>
                </div>
                {agent.status === "ready" ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                ) : (
                  <Activity className="w-8 h-8 animate-pulse text-blue-600" />
                )}
              </div>
            </div>
          </section>

          <section className="bg-white/50 p-6 rounded-2xl border border-black/5 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Scale className="w-5 h-5" />
              <h2 className="font-serif italic text-xl">Legal Validation Console</h2>
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Enter RUT (e.g. 12345678-9)"
                className="flex-1 bg-white border border-black/20 rounded-lg px-4 py-2 font-mono text-sm focus:outline-none focus:border-black"
                value={rutInput}
                onChange={(e) => setRutInput(e.target.value)}
              />
              <button 
                onClick={validateRut}
                disabled={isValidating}
                className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                {isValidating ? "Validating..." : "Update Identity"}
              </button>
            </div>
          </section>

          <section className="bg-white/50 p-6 rounded-2xl border border-black/5 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-5 h-5" />
              <h2 className="font-serif italic text-xl">Protocol Execution Logs</h2>
            </div>
            <div className="space-y-1 font-mono text-[11px] h-48 overflow-y-auto bg-zinc-100 p-4 rounded-lg border border-black/5">
              {logs.length === 0 && <p className="opacity-30">Waiting for protocol activity...</p>}
              {logs.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="opacity-30">[{new Date().toLocaleTimeString()}]</span>
                  <span className={log.includes("Error") ? "text-red-600" : log.includes("Success") ? "text-emerald-600" : ""}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Protocol Info */}
        <div className="space-y-8">
          <section className="bg-zinc-900 text-zinc-100 p-6 rounded-2xl shadow-xl">
            <h3 className="font-serif italic text-2xl mb-4">Harvard LIL Extension</h3>
            <p className="text-sm opacity-70 leading-relaxed mb-6">
              This adapter bridges the gap between Common Law agent protocols and Civil Law requirements. 
              By integrating RUT and FEA directly into the handshake, we ensure legal accountability 
              for AI agents in the Chilean jurisdiction.
            </p>
            <button 
              onClick={runHandshake}
              className="w-full bg-white text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all group"
            >
              Run Handshake
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </section>

          <div className="p-6 border-l-2 border-black/10">
            <h4 className="font-serif italic text-lg mb-2">AgentNotary.sol</h4>
            <p className="text-xs font-mono opacity-50 mb-4">Smart Contract Logic</p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Shield className="w-4 h-4 mt-1" />
                <p className="text-xs">Validates "Capacidad de Goce" before execution.</p>
              </div>
              <div className="flex items-start gap-3">
                <Activity className="w-4 h-4 mt-1" />
                <p className="text-xs">Emits AgentActionValidated events for auditability.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HUD Overlay for Mobile Touch */}
      <AnimatePresence>
        {showHud && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="hud-overlay"
          >
            <button 
              onClick={runHandshake}
              className="hud-button"
              title="Run Protocol Handshake"
            >
              <Activity className="w-6 h-6" />
            </button>
            <button 
              onClick={() => addLog("HUD: Mobile Touch Interaction detected.")}
              className="hud-button"
              title="Touch Interaction"
            >
              <Smartphone className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setShowHud(false)}
              className="hud-button bg-red-600"
              title="Close HUD"
            >
              <AlertCircle className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!showHud && (
        <button 
          onClick={() => setShowHud(true)}
          className="fixed bottom-6 right-6 bg-black text-white p-3 rounded-full shadow-lg"
        >
          <Smartphone className="w-5 h-5" />
        </button>
      )}

      <footer className="mt-20 pt-8 border-t border-black/10 text-[10px] font-mono uppercase opacity-30 flex justify-between">
        <span>CL-Agent-Lex v1.0.0</span>
        <span>Harvard LIL Agent Protocols Tech Tree Extension</span>
      </footer>
    </div>
  );
}

