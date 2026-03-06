"use client";
import { useEffect, useState } from "react";

export default function GateIntro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"idle" | "opening" | "done">("idle");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("opening"), 600);
    const t2 = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  if (phase === "done") return null;

  return (
    <div className={`gate-wrapper ${phase === "opening" ? "opening" : ""}`}>
      {/* Background wall texture via CSS */}
      <div className="gate-bg" />

      {/* Ambient flicker light */}
      <div className="gate-ambient" />

      {/* Left door panel */}
      <div className="gate-door gate-door-left">
        <div className="door-inner">
          <div className="door-detail d1" />
          <div className="door-detail d2" />
          <div className="door-detail d3" />
          <div className="door-brace top" />
          <div className="door-brace bottom" />
          <div className="door-light" />
        </div>
      </div>

      {/* Right door panel */}
      <div className="gate-door gate-door-right">
        <div className="door-inner">
          <div className="door-detail d1" />
          <div className="door-detail d2" />
          <div className="door-detail d3" />
          <div className="door-brace top" />
          <div className="door-brace bottom" />
          <div className="door-light" />
        </div>
      </div>

      {/* Center seam glow */}
      <div className="gate-seam" />

      {/* Top frame */}
      <div className="gate-frame-top">
        <div className="frame-inner" />
      </div>

      {/* Scan line on open */}
      <div className="gate-scanline" />

      {/* Loading text */}
      <div className="gate-text">
        <span className="gate-label">TARS</span>
        <span className="gate-sublabel">INITIALIZING SYSTEMS...</span>
        <div className="gate-progress">
          <div className="gate-progress-bar" />
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap');

        .gate-wrapper {
          position: fixed; inset: 0; z-index: 9999;
          overflow: hidden;
          font-family: 'Share Tech Mono', monospace;
        }

        .gate-bg {
          position: absolute; inset: 0;
          background:
            linear-gradient(180deg, #0a1520 0%, #060e18 40%, #030a12 100%);
        }
        /* Metal panel texture via repeating gradients */
        .gate-bg::before {
          content: '';
          position: absolute; inset: 0;
          background:
            repeating-linear-gradient(90deg, rgba(255,255,255,0.015) 0px, transparent 1px, transparent 80px),
            repeating-linear-gradient(0deg, rgba(255,255,255,0.01) 0px, transparent 1px, transparent 60px);
        }

        .gate-ambient {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0,180,220,0.04) 0%, transparent 70%);
          animation: ambientPulse 2s ease-in-out infinite;
        }
        @keyframes ambientPulse {
          0%,100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        /* Door panels */
        .gate-door {
          position: absolute;
          top: 0; bottom: 0;
          width: 50%;
          transition: transform 1.8s cubic-bezier(0.7, 0, 0.2, 1);
          transition-delay: 0.3s;
          will-change: transform;
        }
        .gate-door-left {
          left: 0;
          background: linear-gradient(90deg, #1a2530 0%, #253545 40%, #2d4055 60%, #1e2e3e 100%);
          border-right: 3px solid #3a5060;
          box-shadow: inset -20px 0 60px rgba(0,0,0,0.6), 4px 0 30px rgba(0,150,200,0.08);
        }
        .gate-door-right {
          right: 0;
          background: linear-gradient(270deg, #1a2530 0%, #253545 40%, #2d4055 60%, #1e2e3e 100%);
          border-left: 3px solid #3a5060;
          box-shadow: inset 20px 0 60px rgba(0,0,0,0.6), -4px 0 30px rgba(0,150,200,0.08);
        }

        .opening .gate-door-left  { transform: translateX(-102%); }
        .opening .gate-door-right { transform: translateX(102%); }

        /* Door inner structure */
        .door-inner {
          position: absolute; inset: 0;
          overflow: hidden;
        }

        /* Diagonal brace lines */
        .door-detail {
          position: absolute;
          background: rgba(255,255,255,0.04);
        }
        .gate-door-left .d1 {
          top: 15%; left: 10%; width: 80%; height: 2px;
          transform: rotate(-15deg);
          background: linear-gradient(90deg, transparent, rgba(0,180,220,0.2), transparent);
        }
        .gate-door-left .d2 {
          top: 50%; left: 5%; width: 70%; height: 2px;
          transform: rotate(20deg);
          background: linear-gradient(90deg, transparent, rgba(0,150,200,0.15), transparent);
        }
        .gate-door-left .d3 {
          top: 75%; left: 15%; width: 75%; height: 2px;
          transform: rotate(-10deg);
          background: linear-gradient(90deg, transparent, rgba(0,180,220,0.12), transparent);
        }
        .gate-door-right .d1 {
          top: 15%; left: 10%; width: 80%; height: 2px;
          transform: rotate(15deg);
          background: linear-gradient(90deg, transparent, rgba(0,180,220,0.2), transparent);
        }
        .gate-door-right .d2 {
          top: 50%; right: 5%; width: 70%; height: 2px;
          transform: rotate(-20deg);
          background: linear-gradient(90deg, transparent, rgba(0,150,200,0.15), transparent);
        }
        .gate-door-right .d3 {
          top: 75%; left: 10%; width: 75%; height: 2px;
          transform: rotate(10deg);
          background: linear-gradient(90deg, transparent, rgba(0,180,220,0.12), transparent);
        }

        /* Horizontal braces */
        .door-brace {
          position: absolute;
          left: 5%; right: 5%; height: 18px;
          background: linear-gradient(180deg, rgba(60,90,110,0.6), rgba(30,50,65,0.8), rgba(60,90,110,0.6));
          border-top: 1px solid rgba(100,160,190,0.2);
          border-bottom: 1px solid rgba(20,40,55,0.8);
        }
        .door-brace.top { top: 8%; }
        .door-brace.bottom { bottom: 8%; }

        /* Edge light strip */
        .door-light {
          position: absolute;
          top: 0; bottom: 0; width: 4px;
          background: linear-gradient(180deg, transparent, rgba(0,200,255,0.3) 30%, rgba(0,200,255,0.5) 50%, rgba(0,200,255,0.3) 70%, transparent);
        }
        .gate-door-left .door-light { right: 6px; }
        .gate-door-right .door-light { left: 6px; }

        /* Center seam */
        .gate-seam {
          position: absolute;
          top: 0; bottom: 0;
          left: 50%; transform: translateX(-50%);
          width: 4px;
          background: linear-gradient(180deg, transparent, rgba(0,220,255,0.8) 20%, rgba(0,220,255,1) 50%, rgba(0,220,255,0.8) 80%, transparent);
          box-shadow: 0 0 20px rgba(0,220,255,0.8), 0 0 40px rgba(0,220,255,0.4);
          opacity: 1;
          transition: opacity 0.5s;
        }
        .opening .gate-seam { opacity: 0; transition-delay: 0.2s; }

        /* Top frame bar */
        .gate-frame-top {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: clamp(50px, 10vh, 90px);
          background: linear-gradient(180deg, #1a2a38 0%, #0f1e2a 100%);
          border-bottom: 2px solid rgba(0,180,220,0.3);
          box-shadow: 0 4px 30px rgba(0,0,0,0.5);
        }
        .frame-inner {
          position: absolute; inset: 0;
          background: repeating-linear-gradient(90deg,
            rgba(255,255,255,0.03) 0px, transparent 1px, transparent 40px);
        }
        .gate-frame-top::after {
          content: 'TARS // SECURE ACCESS PROTOCOL';
          position: absolute;
          bottom: 10px; left: 50%; transform: translateX(-50%);
          font-family: 'Share Tech Mono', monospace;
          font-size: clamp(8px, 1.2vw, 11px);
          letter-spacing: 0.3em;
          color: rgba(0,200,255,0.5);
          white-space: nowrap;
        }

        /* Scanline flash on open */
        .gate-scanline {
          position: absolute; left: 0; right: 0;
          height: 3px;
          background: rgba(0,220,255,0.8);
          box-shadow: 0 0 20px rgba(0,220,255,0.8);
          top: 50%;
          opacity: 0;
          transition: none;
        }
        .opening .gate-scanline {
          animation: scanFlash 0.4s ease-out 0.25s forwards;
        }
        @keyframes scanFlash {
          0% { opacity: 0; top: 50%; }
          30% { opacity: 1; top: 50%; }
          100% { opacity: 0; top: -5%; }
        }

        /* Center text */
        .gate-text {
          position: absolute;
          bottom: 12%;
          left: 50%; transform: translateX(-50%);
          text-align: center;
          z-index: 10;
          transition: opacity 0.4s;
        }
        .opening .gate-text { opacity: 0; transition-delay: 0s; }

        .gate-label {
          display: block;
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(28px, 5vw, 52px);
          font-weight: 900;
          color: rgba(0,200,255,0.9);
          letter-spacing: 0.4em;
          text-shadow: 0 0 30px rgba(0,200,255,0.7), 0 0 60px rgba(0,200,255,0.3);
          animation: labelPulse 2s ease-in-out infinite;
        }
        @keyframes labelPulse {
          0%,100% { opacity: 0.8; }
          50% { opacity: 1; }
        }

        .gate-sublabel {
          display: block;
          font-size: clamp(8px, 1.2vw, 11px);
          letter-spacing: 0.3em;
          color: rgba(0,180,220,0.5);
          margin-top: 8px;
          animation: typeBlink 0.8s steps(1) infinite;
        }
        @keyframes typeBlink { 50% { opacity: 0.3; } }

        .gate-progress {
          width: 200px; height: 2px;
          background: rgba(0,180,220,0.15);
          margin: 14px auto 0;
          position: relative;
          overflow: hidden;
        }
        .gate-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, rgba(0,180,220,0.4), rgba(0,220,255,1));
          box-shadow: 0 0 8px rgba(0,220,255,0.8);
          animation: progressFill 2.2s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        @keyframes progressFill {
          0% { width: 0%; }
          60% { width: 80%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}