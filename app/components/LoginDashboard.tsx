"use client";
import { useState, useEffect } from "react";

export default function LoginDashboard() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "scanning" | "granted" | "denied">("idle");
  const [visible, setVisible] = useState(false);
  const [clock, setClock] = useState("");
  const [bars, setBars] = useState<number[]>([]);
  const [wave, setWave] = useState("");
  const [wave2, setWave2] = useState("");
  const [waveT, setWaveT] = useState(0);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    setBars(Array.from({ length: 18 }, () => 20 + Math.random() * 80));
    const clockInterval = setInterval(() => {
      setClock(new Date().toTimeString().split(" ")[0]);
    }, 1000);
    setClock(new Date().toTimeString().split(" ")[0]);
    return () => clearInterval(clockInterval);
  }, []);

  // Animate bars slowly
  useEffect(() => {
    const interval = setInterval(() => {
      setBars(prev => prev.map(b => {
        const delta = (Math.random() - 0.5) * 15;
        return Math.max(10, Math.min(100, b + delta));
      }));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Wave animation
  useEffect(() => {
    let t = 0;
    let raf: number;
    const animate = () => {
      t += 0.04;
      const pts: string[] = [], pts2: string[] = [];
      for (let x = 0; x <= 200; x += 2) {
        const y = 20 + Math.sin(x / 20 + t) * 6 + Math.sin(x / 8 + t * 1.7) * 3;
        const y2 = 20 + Math.sin(x / 15 + t * 0.8 + 1) * 8;
        pts.push(`${x},${y}`);
        pts2.push(`${x},${y2}`);
      }
      setWave(pts.join(" "));
      setWave2(pts2.join(" "));
      setWaveT(t);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleLogin = () => {
    if (status === "scanning") return;
    setStatus("scanning");
    setTimeout(() => {
      if (username && password) {
        setStatus("granted");
      } else {
        setStatus("denied");
        setTimeout(() => setStatus("idle"), 2000);
      }
    }, 1400);
  };

  const btnLabel = status === "scanning" ? "AUTHENTICATING..." : status === "granted" ? "✓ ACCESS GRANTED" : status === "denied" ? "✗ AUTH FAILED — RETRY" : "INITIALIZE LOGIN";
  const btnColor = status === "granted" ? "#00ff88" : status === "denied" ? "#ff4455" : "var(--cyan)";

  const logs = [
    "SYS BOOT COMPLETE", "AUTH MODULE LOADED", "CHANNEL 1: ONLINE",
    "ENCRYPTION: AES-256", "ORBIT LINK ACTIVE", "NODE-01 CONNECTED",
    "NODE-02 CONNECTED", "NODE-04 CONNECTED", "SIGNAL LOCK: 98.2%",
    "LATENCY CHECK: 0.08ms", "UPLINK READY", "WAITING FOR AUTH...",
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Share+Tech+Mono&display=swap');
        :root {
          --cyan: #00d4ff;
          --cyan-glow: rgba(0,212,255,0.6);
          --border: rgba(0,212,255,0.3);
          --border-bright: rgba(0,212,255,0.7);
          --panel: rgba(0,20,40,0.88);
          --text-dim: rgba(0,212,255,0.45);
          --faint: rgba(0,212,255,0.07);
          --bg: #020a14;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html,body { background: var(--bg); color: var(--cyan); font-family: 'Share Tech Mono', monospace; }

        .login-page {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          padding: 16px;
          position: relative; overflow: hidden;
          opacity: 0; transform: scale(0.96);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .login-page.visible { opacity: 1; transform: scale(1); }

        /* Stars */
        .stars { position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background: radial-gradient(ellipse at 20% 30%, rgba(0,80,160,0.06) 0%, transparent 60%); }

        .scanlines { position: fixed; inset: 0; pointer-events: none; z-index: 100;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.025) 2px, rgba(0,0,0,0.025) 4px); }

        /* HUD grid */
        .hud {
          position: relative; z-index: 1;
          width: min(95vw, 1100px);
          aspect-ratio: 16/9;
          border: 1px solid var(--border-bright);
          background: var(--panel);
          box-shadow: 0 0 40px rgba(0,212,255,0.12), 0 0 80px rgba(0,212,255,0.04), inset 0 0 60px rgba(0,20,50,0.5);
          display: grid;
          grid-template-columns: 260px 1fr 240px;
          grid-template-rows: 44px 1fr 56px;
        }
        .hud::before { content:''; position:absolute; top:-1px; left:-1px; width:20px; height:20px; border:2px solid var(--cyan); border-right:none; border-bottom:none; }
        .hud::after  { content:''; position:absolute; bottom:-1px; right:-1px; width:20px; height:20px; border:2px solid var(--cyan); border-left:none; border-top:none; }
        .c-tr { position:absolute; top:-1px; right:-1px; width:20px; height:20px; border:2px solid var(--cyan); border-left:none; border-bottom:none; }
        .c-bl { position:absolute; bottom:-1px; left:-1px; width:20px; height:20px; border:2px solid var(--cyan); border-right:none; border-top:none; }

        /* Header */
        .hdr {
          grid-column: 1/-1;
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center; gap: 16px; padding: 0 20px;
          background: rgba(0,212,255,0.02);
        }
        .hdr-title {
          font-family: 'Orbitron', sans-serif; font-weight: 700;
          font-size: clamp(10px,1.6vw,14px); letter-spacing: 0.35em;
          text-shadow: 0 0 20px var(--cyan-glow);
          animation: textPulse 3s ease-in-out infinite;
        }
        @keyframes textPulse { 0%,100%{text-shadow:0 0 20px var(--cyan-glow);}50%{text-shadow:0 0 35px var(--cyan-glow), 0 0 60px rgba(0,212,255,0.5);} }
        .hdr-line { flex:1; height:1px; background:linear-gradient(to right, transparent, var(--border-bright), transparent); }
        .hdr-dot { width:6px; height:6px; border-radius:50%; background:var(--cyan); box-shadow:0 0 8px var(--cyan); animation:blink 1.5s steps(1) infinite; }
        @keyframes blink { 50%{opacity:0;} }

        /* Panels */
        .panel-l { border-right:1px solid var(--border); padding:14px 12px; display:flex; flex-direction:column; gap:12px; overflow:hidden; }
        .panel-r { border-left:1px solid var(--border); padding:14px 12px; display:flex; flex-direction:column; gap:12px; overflow:hidden; }

        /* Widget */
        .widget { border:1px solid var(--border); padding:10px; background:var(--faint); flex-shrink:0; }
        .wlabel { font-size:8px; letter-spacing:0.2em; color:var(--text-dim); margin-bottom:7px; text-transform:uppercase; }

        /* Radar */
        .radar-wrap { display:flex; justify-content:center; padding:4px 0; }
        .radar-svg { width:88px; height:88px; }

        /* Bars */
        .bars { display:flex; align-items:flex-end; gap:3px; height:38px; }
        .bar { flex:1; background:linear-gradient(to top, var(--cyan), rgba(0,212,255,0.25)); border-radius:1px; transition: height 0.8s ease; }

        /* Waveform */
        .wave-wrap { height:34px; overflow:hidden; }
        .wave-svg { width:100%; height:100%; }

        /* Data rows */
        .drow { display:flex; justify-content:space-between; font-size:9px; color:var(--text-dim); padding:2px 0; border-bottom:1px solid rgba(0,212,255,0.07); }
        .drow span:last-child { color:var(--cyan); }

        /* Log */
        .log-scroll { font-size:8px; color:var(--text-dim); height:52px; overflow:hidden; }
        .log-inner { animation: scrollUp 9s linear infinite; }
        @keyframes scrollUp { from{transform:translateY(0)} to{transform:translateY(-50%)} }

        /* Ring stat */
        .ring-stat { display:flex; align-items:center; gap:10px; }
        .ring-svg { width:48px; height:48px; flex-shrink:0; }
        .ring-info { font-size:9px; color:var(--text-dim); }
        .ring-info b { display:block; font-size:13px; color:var(--cyan); font-family:'Orbitron',sans-serif; }

        /* Center */
        .center { display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; padding:16px; }
        .orbit-ring { position:absolute; border-radius:50%; border:1px solid; }
        .o1 { width:72%; aspect-ratio:1; border-color:rgba(0,212,255,0.18); animation:spin 20s linear infinite; }
        .o2 { width:66%; aspect-ratio:1; border-color:rgba(0,212,255,0.1); border-style:dashed; animation:spin 14s linear infinite reverse; }
        .o3 { width:82%; aspect-ratio:1; border-color:rgba(0,212,255,0.06); animation:spin 30s linear infinite; }
        @keyframes spin { to{transform:rotate(360deg)} }
        .odot { position:absolute; width:5px; height:5px; background:var(--cyan); border-radius:50%; box-shadow:0 0 8px var(--cyan); top:-2px; left:50%; transform:translateX(-50%); }

        /* Login box */
        .login-box { position:relative; z-index:2; width:min(275px,80%); text-align:center; }
        .login-title { font-family:'Orbitron',sans-serif; font-size:clamp(9px,1.3vw,12px); letter-spacing:0.25em; color:#a0e8ff; margin-bottom:18px; text-shadow:0 0 12px var(--cyan-glow); }
        .typewriter { font-size:9px; color:var(--text-dim); letter-spacing:0.1em; margin-bottom:12px; overflow:hidden; white-space:nowrap; border-right:1px solid var(--cyan); animation: typing 2.5s steps(22) both, blink2 0.6s step-end infinite 2.5s; width:0; }
        @keyframes typing { to{width:100%;} }
        @keyframes blink2 { 50%{border-color:transparent;} }

        .inp-wrap { position:relative; margin-bottom:9px; }
        .inp-wrap input {
          width:100%; background:rgba(0,25,50,0.7); border:1px solid var(--border);
          color:var(--cyan); font-family:'Share Tech Mono',monospace; font-size:11px;
          padding:9px 12px 9px 30px; outline:none; letter-spacing:0.1em;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .inp-wrap input::placeholder { color:rgba(0,212,255,0.3); }
        .inp-wrap input:focus { border-color:var(--cyan); box-shadow:0 0 12px rgba(0,212,255,0.2), inset 0 0 8px rgba(0,212,255,0.04); }
        .inp-icon { position:absolute; left:10px; top:50%; transform:translateY(-50%); width:10px; height:10px; border:1px solid var(--text-dim); border-radius:2px; }
        .inp-icon::after { content:''; position:absolute; bottom:-3px; left:50%; transform:translateX(-50%); width:4px; height:3px; border:1px solid var(--text-dim); border-top:none; border-radius:0 0 2px 2px; }

        .btn-login {
          width:100%; margin-top:13px; padding:10px;
          background:transparent; border:1px solid; cursor:pointer;
          font-family:'Orbitron',sans-serif; font-size:10px; letter-spacing:0.28em;
          position:relative; overflow:hidden; transition:all 0.3s;
        }
        .btn-login::before { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(0,212,255,0.15),transparent); transform:translateX(-100%); transition:transform 0.6s; }
        .btn-login:hover::before { transform:translateX(100%); }
        .btn-scanning::after { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:var(--cyan); box-shadow:0 0 8px var(--cyan); animation:scanAnim 1.4s ease-in-out infinite; }
        @keyframes scanAnim { 0%{top:0;opacity:1} 100%{top:100%;opacity:0} }

        /* Footer */
        .footer {
          grid-column:1/-1; border-top:1px solid var(--border);
          display:flex; align-items:center; justify-content:space-between;
          padding:0 20px; font-size:9px; color:var(--text-dim); letter-spacing:0.14em;
          background:rgba(0,212,255,0.015);
        }
        .sdot { display:inline-block; width:6px; height:6px; border-radius:50%; background:#00ff88; box-shadow:0 0 6px #00ff88; margin-right:6px; animation:blink 2s ease-in-out infinite; }
        .footer-mid { display:flex; gap:24px; }
        .glow-bottom { position:absolute; bottom:-28px; left:50%; transform:translateX(-50%); width:40%; height:28px; background:radial-gradient(ellipse, rgba(0,212,255,0.35) 0%, transparent 70%); filter:blur(8px); pointer-events:none; animation:glowP 3s ease-in-out infinite; }
        @keyframes glowP { 0%,100%{opacity:0.4;}50%{opacity:0.9;} }

        /* World map panel */
        .world-wrap { height:68px; overflow:hidden; }
      `}</style>

      <div className="stars" />
      <div className="scanlines" />

      <div className={`login-page ${visible ? "visible" : ""}`}>
        <div className="hud">
          <div className="c-tr" /><div className="c-bl" />

          {/* Header */}
          <header className="hdr">
            <div className="hdr-dot" />
            <div className="hdr-line" />
            <div className="hdr-title">TARS COMMUNICATION HUB</div>
            <div className="hdr-line" />
            <div className="hdr-dot" />
          </header>

          {/* Left panel */}
          <aside className="panel-l">
            <div className="widget">
              <div className="wlabel">SYS MONITOR</div>
              <div className="radar-wrap">
                <svg className="radar-svg" viewBox="0 0 90 90">
                  <circle cx="45" cy="45" r="40" fill="none" stroke="rgba(0,212,255,0.15)" strokeWidth="1"/>
                  <circle cx="45" cy="45" r="28" fill="none" stroke="rgba(0,212,255,0.1)" strokeWidth="1"/>
                  <circle cx="45" cy="45" r="16" fill="none" stroke="rgba(0,212,255,0.08)" strokeWidth="1"/>
                  <line x1="45" y1="5" x2="45" y2="85" stroke="rgba(0,212,255,0.1)" strokeWidth="0.5"/>
                  <line x1="5" y1="45" x2="85" y2="45" stroke="rgba(0,212,255,0.1)" strokeWidth="0.5"/>
                  <defs>
                    <radialGradient id="sg" cx="0" cy="50%" r="100%">
                      <stop offset="0%" stopColor="rgba(0,212,255,0.35)"/>
                      <stop offset="100%" stopColor="rgba(0,212,255,0)"/>
                    </radialGradient>
                  </defs>
                  <path d="M45,45 L85,45 A40,40 0 0,0 45,5 Z" fill="url(#sg)" opacity="0.5">
                    <animateTransform attributeName="transform" type="rotate" from="0 45 45" to="360 45 45" dur="3s" repeatCount="indefinite"/>
                  </path>
                  <circle cx="62" cy="28" r="2" fill="#00d4ff"><animate attributeName="opacity" values="0.9;0.2;0.9" dur="2.1s" repeatCount="indefinite"/></circle>
                  <circle cx="30" cy="55" r="1.5" fill="#00d4ff"><animate attributeName="opacity" values="0.7;0.1;0.7" dur="1.7s" repeatCount="indefinite"/></circle>
                  <circle cx="50" cy="65" r="1.5" fill="#00ff88"><animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.5s" repeatCount="indefinite"/></circle>
                  <circle cx="45" cy="45" r="2" fill="#00d4ff"/>
                </svg>
              </div>
            </div>

            <div className="widget">
              <div className="wlabel">SIGNAL METRICS</div>
              {[["FREQ","142.67 MHz"],["LATENCY","0.08ms"],["PKT LOSS","0.00%"],["UPTIME","99.97%"]].map(([k,v])=>(
                <div className="drow" key={k}><span>{k}</span><span>{v}</span></div>
              ))}
            </div>

            <div className="widget">
              <div className="wlabel">BANDWIDTH</div>
              <div className="bars">
                {bars.map((h,i)=><div key={i} className="bar" style={{height:`${h}%`}}/>)}
              </div>
            </div>

            <div className="widget" style={{flex:1,overflow:"hidden"}}>
              <div className="wlabel">ACTIVITY LOG</div>
              <div className="log-scroll">
                <div className="log-inner">
                  {[...logs,...logs].map((l,i)=>(
                    <div key={i} style={{marginBottom:"3px",color:`rgba(0,212,255,${0.3+Math.random()*0.35})`}}>&gt; {l}</div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Center */}
          <main className="center">
            <div className="orbit-ring o3"/>
            <div className="orbit-ring o1"><div className="odot"/></div>
            <div className="orbit-ring o2"/>

            <div className="login-box">
              <div className="typewriter">ORBIT ACCESS TERMINAL v4.2.1</div>
              <div className="login-title">ORBIT ACCESS TERMINAL</div>

              <div className="inp-wrap">
                <div className="inp-icon"/>
                <input type="text" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
              </div>
              <div className="inp-wrap">
                <div className="inp-icon"/>
                <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
              </div>

              <button
                className={`btn-login ${status==="scanning"?"btn-scanning":""}`}
                style={{ color: btnColor, borderColor: btnColor,
                  boxShadow: `0 0 ${status!=="idle"?"20px":"12px"} ${btnColor}40`,
                  textShadow: `0 0 10px ${btnColor}` }}
                onClick={handleLogin}
                disabled={status==="scanning"||status==="granted"}
              >
                {btnLabel}
              </button>
            </div>
          </main>

          {/* Right panel */}
          <aside className="panel-r">
            <div className="widget">
              <div className="wlabel">ORBIT MAP</div>
              <div className="world-wrap">
                <svg viewBox="0 0 220 75" fill="none" width="100%" height="100%">
                  <ellipse cx="110" cy="37" rx="100" ry="32" stroke="rgba(0,212,255,0.15)" strokeWidth="0.5"/>
                  <path d="M28 33 Q48 19 68 29 Q78 38 63 48 Q43 53 28 43Z" fill="rgba(0,212,255,0.1)" stroke="rgba(0,212,255,0.3)" strokeWidth="0.5"/>
                  <path d="M78 26 Q98 17 118 23 Q133 30 128 43 Q113 52 93 47 Q76 40 78 26Z" fill="rgba(0,212,255,0.09)" stroke="rgba(0,212,255,0.3)" strokeWidth="0.5"/>
                  <path d="M133 28 Q150 20 163 30 Q170 40 158 50 Q143 55 130 46Z" fill="rgba(0,212,255,0.09)" stroke="rgba(0,212,255,0.3)" strokeWidth="0.5"/>
                  <ellipse cx="110" cy="37" rx="95" ry="29" stroke="rgba(0,212,255,0.2)" strokeWidth="0.5" strokeDasharray="4 3"/>
                  <circle r="3" fill="#00d4ff">
                    <animateMotion dur="6s" repeatCount="indefinite" path="M205,37 A95,29 0 1,1 204.99,37Z"/>
                  </circle>
                  <circle cx="50" cy="36" r="2" fill="#00ff88"><animate attributeName="r" values="2;5;2" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite"/></circle>
                  <circle cx="105" cy="29" r="2" fill="#00d4ff"><animate attributeName="r" values="2;5;2" dur="2.5s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.8;0;0.8" dur="2.5s" repeatCount="indefinite"/></circle>
                </svg>
              </div>
            </div>

            <div className="widget">
              <div className="wlabel">CHANNEL STATUS</div>
              <div className="ring-stat">
                <svg className="ring-svg" viewBox="0 0 50 50">
                  <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(0,212,255,0.12)" strokeWidth="3"/>
                  <circle cx="25" cy="25" r="20" fill="none" stroke="#00d4ff" strokeWidth="3"
                    strokeDasharray="113" strokeDashoffset="16" strokeLinecap="round"
                    transform="rotate(-90 25 25)"/>
                </svg>
                <div className="ring-info"><b>86%</b>UPLINK<br/>CAPACITY</div>
              </div>
            </div>

            <div className="widget">
              <div className="wlabel">NODE STATUS</div>
              {[["NODE-01","#00ff88","ACTIVE"],["NODE-02","#00ff88","ACTIVE"],["NODE-03","#ffaa00","STANDBY"],["NODE-04","#00ff88","ACTIVE"]].map(([n,c,s])=>(
                <div className="drow" key={n}><span>{n}</span><span style={{color:c}}>{s}</span></div>
              ))}
            </div>

            <div className="widget" style={{flex:1}}>
              <div className="wlabel">SIGNAL WAVE</div>
              <div className="wave-wrap">
                <svg viewBox="0 0 200 40" preserveAspectRatio="none" width="100%" height="100%">
                  <polyline points={wave} fill="none" stroke="#00d4ff" strokeWidth="1.5"/>
                  <polyline points={wave2} fill="none" stroke="rgba(0,212,255,0.3)" strokeWidth="1"/>
                </svg>
              </div>
            </div>
          </aside>

          {/* Footer */}
          <footer className="footer">
            <div><span className="sdot"/>NETWORK ONLINE &nbsp;·&nbsp; ORBIT CHANNEL READY</div>
            <div className="footer-mid">
              <span>SEC: ALPHA</span>
              <span>ENC: AES-256</span>
              <span>NODES: 4/4</span>
            </div>
            <div>SYS TIME: {clock}</div>
          </footer>

          <div className="glow-bottom"/>
        </div>
      </div>
    </>
  );
}