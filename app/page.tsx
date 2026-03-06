"use client";
import { useState } from "react";
import GateIntro from "./components/GateIntro";
import LoginDashboard from "./components/LoginDashboard";

export default function Home() {
  const [gateOpen, setGateOpen] = useState(false);

  return (
    <>
      {!gateOpen && <GateIntro onComplete={() => setGateOpen(true)} />}
      {gateOpen && <LoginDashboard />}
    </>
  );}