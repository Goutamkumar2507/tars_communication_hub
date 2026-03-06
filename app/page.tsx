"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

export default function Home() {
  const { isSignedIn, user } = useUser();

  // Gate phases: "gate" → "opening" → "done"
  const [phase, setPhase] = useState<"gate" | "opening" | "done">("gate");
  const [clock, setClock] = useState("");

  useEffect(() => {
    // Start opening after 400ms
    const t1 = setTimeout(() => setPhase("opening"), 400);
    // Show content after gate finishes (400 + 900ms animation + 100ms buffer)
    const t2 = setTimeout(() => setPhase("done"), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    const tick = () => setClock(new Date().toTimeString().split(" ")[0]);
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#020a14", color: "#67e8f9", overflow: "hidden", position: "relative", fontFamily: "var(--font-geist-mono), 'Courier New', monospace" }}>

      {/* ── SCANLINES ── */}
      <div className="scanlines" style={{ position: "fixed", inset: 0, zIndex: 200, pointerEvents: "none" }} />

      {/* ── GATE ── */}
      {phase !== "done" && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 150,
          opacity: phase === "opening" ? 1 : 1,
          pointerEvents: phase === "done" ? "none" : "all",
        }}>
          {/* Left door */}
          <div style={{
            position: "absolute", top: 0, left: 0, width: "50%", height: "100%",
            background: "linear-gradient(90deg, #0f1c28 0%, #1a2d3e 40%, #243545 70%, #1a2d3e 100%)",
            borderRight: "2px solid rgba(0,212,255,0.4)",
            boxShadow: "inset -30px 0 80px rgba(0,0,0,0.7), 6px 0 40px rgba(0,150,200,0.08)",
            transform: phase === "opening" ? "translateX(-102%)" : "translateX(0)",
            transition: "transform 900ms cubic-bezier(0.7,0,0.15,1)",
            backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.01) 0px, transparent 1px, transparent 60px), repeating-linear-gradient(0deg, rgba(255,255,255,0.008) 0px, transparent 1px, transparent 50px)",
          }}>
            {/* Braces */}
            <div style={{ position:"absolute", top:"8%", left:"5%", right:"5%", height:"16px", background:"linear-gradient(180deg, rgba(60,90,110,0.5), rgba(30,50,65,0.7), rgba(60,90,110,0.5))", borderTop:"1px solid rgba(100,160,190,0.15)", borderBottom:"1px solid rgba(20,40,55,0.6)" }}/>
            <div style={{ position:"absolute", bottom:"8%", left:"5%", right:"5%", height:"16px", background:"linear-gradient(180deg, rgba(60,90,110,0.5), rgba(30,50,65,0.7), rgba(60,90,110,0.5))", borderTop:"1px solid rgba(100,160,190,0.15)", borderBottom:"1px solid rgba(20,40,55,0.6)" }}/>
            {/* Diagonal */}
            <div style={{ position:"absolute", top:"22%", left:"8%", width:"80%", height:"1px", background:"linear-gradient(90deg, transparent, rgba(0,180,220,0.2), transparent)", transform:"rotate(-12deg)" }}/>
            <div style={{ position:"absolute", top:"58%", left:"6%", width:"72%", height:"1px", background:"linear-gradient(90deg, transparent, rgba(0,180,220,0.15), transparent)", transform:"rotate(16deg)" }}/>
            {/* Edge glow */}
            <div style={{ position:"absolute", right:"6px", top:0, bottom:0, width:"3px", background:"linear-gradient(180deg, transparent, rgba(0,200,255,0.5) 30%, rgba(0,200,255,0.7) 50%, rgba(0,200,255,0.5) 70%, transparent)" }}/>
          </div>

          {/* Right door */}
          <div style={{
            position: "absolute", top: 0, right: 0, width: "50%", height: "100%",
            background: "linear-gradient(270deg, #0f1c28 0%, #1a2d3e 40%, #243545 70%, #1a2d3e 100%)",
            borderLeft: "2px solid rgba(0,212,255,0.4)",
            boxShadow: "inset 30px 0 80px rgba(0,0,0,0.7), -6px 0 40px rgba(0,150,200,0.08)",
            transform: phase === "opening" ? "translateX(102%)" : "translateX(0)",
            transition: "transform 900ms cubic-bezier(0.7,0,0.15,1)",
            backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.01) 0px, transparent 1px, transparent 60px), repeating-linear-gradient(0deg, rgba(255,255,255,0.008) 0px, transparent 1px, transparent 50px)",
          }}>
            <div style={{ position:"absolute", top:"8%", left:"5%", right:"5%", height:"16px", background:"linear-gradient(180deg, rgba(60,90,110,0.5), rgba(30,50,65,0.7), rgba(60,90,110,0.5))", borderTop:"1px solid rgba(100,160,190,0.15)", borderBottom:"1px solid rgba(20,40,55,0.6)" }}/>
            <div style={{ position:"absolute", bottom:"8%", left:"5%", right:"5%", height:"16px", background:"linear-gradient(180deg, rgba(60,90,110,0.5), rgba(30,50,65,0.7), rgba(60,90,110,0.5))", borderTop:"1px solid rgba(100,160,190,0.15)", borderBottom:"1px solid rgba(20,40,55,0.6)" }}/>
            <div style={{ position:"absolute", top:"22%", right:"8%", width:"80%", height:"1px", background:"linear-gradient(90deg, transparent, rgba(0,180,220,0.2), transparent)", transform:"rotate(12deg)" }}/>
            <div style={{ position:"absolute", top:"58%", right:"6%", width:"72%", height:"1px", background:"linear-gradient(90deg, transparent, rgba(0,180,220,0.15), transparent)", transform:"rotate(-16deg)" }}/>
            <div style={{ position:"absolute", left:"6px", top:0, bottom:0, width:"3px", background:"linear-gradient(180deg, transparent, rgba(0,200,255,0.5) 30%, rgba(0,200,255,0.7) 50%, rgba(0,200,255,0.5) 70%, transparent)" }}/>
          </div>

          {/* Center seam */}
          <div style={{
            position:"absolute", top:0, bottom:0,
            left:"50%", transform:"translateX(-50%)",
            width:"3px",
            background:"linear-gradient(180deg, transparent, rgba(0,220,255,0.9) 20%, #00dcff 50%, rgba(0,220,255,0.9) 80%, transparent)",
            boxShadow:"0 0 20px rgba(0,220,255,0.9), 0 0 50px rgba(0,220,255,0.4)",
            opacity: phase === "opening" ? 0 : 1,
            transition:"opacity 0.3s 0.2s",
          }}/>

          {/* Top frame */}
          <div style={{
            position:"absolute", top:0, left:0, right:0, height:"10vh",
            background:"linear-gradient(180deg, #0d1c28 0%, #081420 100%)",
            borderBottom:"1px solid rgba(0,180,220,0.2)",
            display:"flex", alignItems:"flex-end", justifyContent:"center", paddingBottom:"10px",
          }}>
            <span style={{ fontFamily:"var(--font-geist-mono)", fontSize:"10px", letterSpacing:"0.3em", color:"rgba(0,212,255,0.45)" }}>
              TARS // SECURE ACCESS PROTOCOL
            </span>
          </div>

          {/* Center label */}
          <div style={{
            position:"absolute", inset:0,
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-end",
            paddingBottom:"14%",
            opacity: phase === "opening" ? 0 : 1,
            transition:"opacity 0.3s",
          }}>
            <div style={{
              fontFamily:"var(--font-orbitron, 'Orbitron', sans-serif)",
              fontSize:"clamp(32px, 6vw, 64px)",
              fontWeight:900,
              letterSpacing:"0.4em",
              color:"#00d4ff",
              textShadow:"0 0 30px rgba(0,212,255,0.8), 0 0 70px rgba(0,212,255,0.4)",
            }}>TARS</div>
            <div style={{ fontFamily:"var(--font-geist-mono)", fontSize:"10px", letterSpacing:"0.3em", color:"rgba(0,212,255,0.4)", marginTop:"8px" }}>
              INITIALIZING SYSTEMS...
            </div>
            <div style={{ width:"200px", height:"2px", background:"rgba(0,212,255,0.1)", marginTop:"14px", overflow:"hidden" }}>
              <div className="gate-progress" style={{ height:"100%", boxShadow:"0 0 8px rgba(0,220,255,0.8)" }}/>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div style={{
        position:"relative", zIndex:10,
        opacity: phase === "done" ? 1 : 0,
        transform: phase === "done" ? "scale(1)" : "scale(0.97)",
        transition:"opacity 0.8s ease, transform 0.8s ease",
      }}>

        {/* ── NAVBAR ── */}
        <nav style={{
          position:"fixed", top:0, left:0, right:0, zIndex:60,
          height:"56px", display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"0 32px",
          background:"rgba(2,10,20,0.9)",
          backdropFilter:"blur(12px)",
          borderBottom:"1px solid rgba(0,212,255,0.1)",
          boxShadow:"0 1px 30px rgba(0,0,0,0.6)",
        }}>
          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            <div style={{
              width:"28px", height:"28px", display:"flex", alignItems:"center", justifyContent:"center",
              border:"1px solid rgba(0,212,255,0.4)", background:"rgba(0,212,255,0.06)", position:"relative",
            }}>
              <div style={{ width:"8px", height:"8px", background:"#00d4ff", borderRadius:"2px", boxShadow:"0 0 10px #00d4ff", animation:"blink 2s ease-in-out infinite" }}/>
            </div>
            <span style={{ fontFamily:"var(--font-orbitron, 'Orbitron')", fontSize:"13px", letterSpacing:"0.22em", color:"#a0e8ff", textShadow:"0 0 12px rgba(0,212,255,0.5)" }}>TARS</span>
            <span style={{ fontSize:"10px", letterSpacing:"0.2em", color:"rgba(0,212,255,0.25)", marginLeft:"2px" }}>COMM HUB</span>
          </div>

          {/* Nav links */}
          <div style={{ display:"flex", alignItems:"center", gap:"32px" }}>
            <a href="https://your-portfolio.com" target="_blank" rel="noopener noreferrer" className="nav-link"
              style={{ fontSize:"11px", letterSpacing:"0.25em", color:"rgba(0,212,255,0.5)", textDecoration:"none", transition:"color 0.2s" }}>
              PORTFOLIO
            </a>
            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="nav-link"
              style={{ fontSize:"11px", letterSpacing:"0.25em", color:"rgba(0,212,255,0.5)", textDecoration:"none", transition:"color 0.2s", display:"flex", alignItems:"center", gap:"6px" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GITHUB
            </a>
            <div style={{ width:"1px", height:"16px", background:"rgba(0,212,255,0.15)" }}/>
            <span style={{ fontSize:"9px", color:"rgba(0,212,255,0.25)", letterSpacing:"0.15em" }}>{clock}</span>
          </div>

          {/* Auth */}
          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            {!isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <button style={{
                    fontSize:"10px", letterSpacing:"0.25em", color:"rgba(0,212,255,0.65)",
                    background:"rgba(0,212,255,0.04)", border:"1px solid rgba(0,212,255,0.2)",
                    padding:"6px 14px", cursor:"pointer", fontFamily:"inherit", transition:"all 0.2s",
                  }}>LOGIN</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button style={{
                    fontSize:"10px", letterSpacing:"0.25em", color:"#020a14", fontWeight:700,
                    background:"linear-gradient(135deg, #00d4ff, #0099bb)",
                    border:"none", padding:"7px 16px", cursor:"pointer", fontFamily:"inherit",
                    boxShadow:"0 0 16px rgba(0,212,255,0.4)",
                  }}>SIGN UP</button>
                </SignUpButton>
              </>
            ) : (
              <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                <span style={{ fontSize:"9px", color:"rgba(0,212,255,0.4)", letterSpacing:"0.15em" }}>
                  {(user?.firstName || "OPERATOR").toUpperCase()}
                </span>
                <UserButton />
              </div>
            )}
          </div>
        </nav>

        {/* ── HERO ── */}
        <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative", paddingTop:"56px" }}>

          {/* Grid bg */}
          <div style={{
            position:"absolute", inset:0, pointerEvents:"none",
            backgroundImage:"repeating-linear-gradient(0deg, rgba(0,212,255,0.025) 0px, transparent 1px, transparent 80px), repeating-linear-gradient(90deg, rgba(0,212,255,0.025) 0px, transparent 1px, transparent 80px)",
            WebkitMaskImage:"radial-gradient(ellipse 70% 60% at 50% 50%, black 0%, transparent 100%)",
            maskImage:"radial-gradient(ellipse 70% 60% at 50% 50%, black 0%, transparent 100%)",
          }}/>

          {/* Corner brackets */}
          {([[22,"8%","left","top"],[22,"8%","right","top"],[22,"8%","left","bottom"],[22,"8%","right","bottom"]] as const).map(([,pct,h,v], i) => (
            <div key={i} style={{
              position:"absolute",
              [v]: v === "top" ? "72px" : "32px",
              [h]: pct,
              width:"32px", height:"32px",
              borderTop: v==="top" ? "1px solid rgba(0,212,255,0.2)" : "none",
              borderBottom: v==="bottom" ? "1px solid rgba(0,212,255,0.2)" : "none",
              borderLeft: h==="left" ? "1px solid rgba(0,212,255,0.2)" : "none",
              borderRight: h==="right" ? "1px solid rgba(0,212,255,0.2)" : "none",
              pointerEvents:"none",
            }}/>
          ))}

          {/* Hero text */}
          <div style={{ textAlign:"center", position:"relative", zIndex:10, padding:"0 32px", maxWidth:"900px", animation:"heroIn 1s cubic-bezier(0.16,1,0.3,1) 0.1s both" }}>

            <div style={{ fontSize:"9px", letterSpacing:"0.4em", color:"rgba(0,212,255,0.3)", marginBottom:"24px", display:"flex", alignItems:"center", justifyContent:"center", gap:"12px" }}>
              <div style={{ width:"32px", height:"1px", background:"linear-gradient(to right, transparent, rgba(0,212,255,0.4))" }}/>
              TARS COMMUNICATION HUB v4.2.1
              <div style={{ width:"32px", height:"1px", background:"linear-gradient(to left, transparent, rgba(0,212,255,0.4))" }}/>
            </div>

            <h1 style={{
              fontFamily:"var(--font-orbitron, 'Orbitron', sans-serif)",
              fontSize:"clamp(44px, 9vw, 110px)",
              fontWeight:900, letterSpacing:"-0.02em", lineHeight:1.0,
              marginBottom:"24px",
            }}>
              <span style={{ display:"block", color:"#d0f0ff" }}>SECURE</span>
              <span style={{ display:"block", color:"#00d4ff", textShadow:"0 0 50px rgba(0,212,255,0.6), 0 0 100px rgba(0,212,255,0.2)" }}>ORBIT</span>
              <span style={{ display:"block", color:"#d0f0ff" }}>COMMS</span>
            </h1>

            <p style={{ fontSize:"11px", letterSpacing:"0.12em", color:"rgba(0,212,255,0.4)", maxWidth:"480px", margin:"0 auto 40px", lineHeight:1.9 }}>
              Encrypted communication channel for authorized personnel.<br/>
              Real-time messaging · Quantum-grade security · Zero latency.
            </p>

            {/* CTA buttons */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"16px", flexWrap:"wrap" }}>
              {!isSignedIn ? (
                <>
                  <SignInButton mode="modal">
                    <button style={{
                      padding:"14px 32px", fontSize:"11px", letterSpacing:"0.3em",
                      color:"#020a14", fontWeight:700, fontFamily:"inherit",
                      background:"linear-gradient(135deg, #00d4ff, #0099bb)",
                      border:"none", cursor:"pointer",
                      boxShadow:"0 0 30px rgba(0,212,255,0.45), 0 0 60px rgba(0,212,255,0.15)",
                      transition:"transform 0.2s",
                    }}>INITIALIZE LOGIN</button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button style={{
                      padding:"14px 32px", fontSize:"11px", letterSpacing:"0.3em",
                      color:"#67e8f9", fontFamily:"inherit",
                      background:"rgba(0,212,255,0.04)",
                      border:"1px solid rgba(0,212,255,0.35)", cursor:"pointer",
                      transition:"all 0.2s",
                    }}>CREATE ACCOUNT</button>
                  </SignUpButton>
                </>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"16px" }}>
                  <div style={{ fontSize:"11px", letterSpacing:"0.2em", color:"#00ff88", textShadow:"0 0 10px rgba(0,255,136,0.6)" }}>
                    ✓ ACCESS GRANTED — WELCOME BACK, {(user?.firstName || "OPERATOR").toUpperCase()}
                  </div>
                  <a href="/chat" style={{
                    display:"block", padding:"14px 40px", fontSize:"11px", letterSpacing:"0.3em",
                    color:"#020a14", fontWeight:700, textDecoration:"none",
                    background:"linear-gradient(135deg, #00ff88, #00cc6a)",
                    boxShadow:"0 0 30px rgba(0,255,136,0.4)",
                  }}>ENTER COMMUNICATION HUB →</a>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div style={{
            position:"absolute", bottom:"40px", left:0, right:0,
            display:"flex", justifyContent:"center", gap:"48px",
            animation:"heroIn 1s cubic-bezier(0.16,1,0.3,1) 0.4s both",
          }}>
            {[["4","ACTIVE NODES"],["99.97%","UPTIME"],["AES-256","ENCRYPTION"],["0.08ms","LATENCY"]].map(([val,label])=>(
              <div key={label} style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"var(--font-orbitron,'Orbitron')", fontSize:"18px", color:"#67e8f9", textShadow:"0 0 10px rgba(0,212,255,0.5)" }}>{val}</div>
                <div style={{ fontSize:"8px", color:"rgba(0,212,255,0.25)", letterSpacing:"0.2em", marginTop:"2px" }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Orbit rings */}
          <div style={{ position:"absolute", right:"7%", top:"50%", transform:"translateY(-50%)", width:"240px", height:"240px", opacity:0.18, pointerEvents:"none" }}>
            <div style={{ position:"absolute", inset:0, border:"1px solid #00d4ff", borderRadius:"50%", animation:"spin 20s linear infinite" }}/>
            <div style={{ position:"absolute", inset:"14%", border:"1px dashed #00d4ff", borderRadius:"50%", animation:"spin 14s linear infinite reverse" }}/>
            <div style={{ position:"absolute", inset:"28%", border:"1px solid #00d4ff", borderRadius:"50%", animation:"spin 8s linear infinite" }}/>
            <div style={{ position:"absolute", top:"50%", left:"50%", width:"10px", height:"10px", background:"#00d4ff", borderRadius:"50%", transform:"translate(-50%,-50%)", boxShadow:"0 0 14px #00d4ff" }}/>
          </div>
          <div style={{ position:"absolute", left:"7%", top:"50%", transform:"translateY(-50%)", width:"140px", height:"140px", opacity:0.12, pointerEvents:"none" }}>
            <div style={{ position:"absolute", inset:0, border:"1px solid #00d4ff", borderRadius:"50%", animation:"spin 15s linear infinite reverse" }}/>
            <div style={{ position:"absolute", inset:"20%", border:"1px dashed #00d4ff", borderRadius:"50%", animation:"spin 10s linear infinite" }}/>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer style={{
          borderTop:"1px solid rgba(0,212,255,0.08)",
          padding:"14px 32px", display:"flex", alignItems:"center", justifyContent:"space-between",
          fontSize:"8px", color:"rgba(0,212,255,0.2)", letterSpacing:"0.15em",
        }}>
          <span>TARS COMM HUB © 2025</span>
          <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
            <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#00ff88", boxShadow:"0 0 4px #00ff88", animation:"blink 2s ease-in-out infinite" }}/>
            <span>ALL SYSTEMS OPERATIONAL</span>
          </div>
          <span>ORBIT CHANNEL READY</span>
        </footer>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes heroIn { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .nav-link:hover { color: #67e8f9 !important; }
        .nav-link { position:relative; }
        .nav-link::after { content:''; position:absolute; bottom:-3px; left:0; width:0; height:1px; background:#00d4ff; transition:width 0.3s; }
        .nav-link:hover::after { width:100%; }
      `}</style>
    </div>
  );
}