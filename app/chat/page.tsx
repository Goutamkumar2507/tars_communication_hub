"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import { useState, useRef, useEffect } from "react";

// ── Types ──
type Message = { id: number; sender: string; text: string; time: string; self: boolean };
type Conversation = { id: number; name: string; username: string; avatar: string; online: boolean; unread: number; messages: Message[] };
type Group = { id: number; name: string; members: number; messages: Message[] };

// ── Mock Data ──
const MOCK_DMS: Conversation[] = [
  { id: 1, name: "Gaurav Thakur", username: "@gauravthakur83551", avatar: "G", online: true, unread: 2, messages: [
    { id: 1, sender: "Gaurav Thakur", text: "Hey, system is online?", time: "09:42", self: false },
    { id: 2, sender: "You", text: "Affirmative. All nodes connected.", time: "09:43", self: true },
    { id: 3, sender: "Gaurav Thakur", text: "Copy that. Initiating data transfer.", time: "09:44", self: false },
  ]},
  { id: 2, name: "Eren", username: "@erenthakur650", avatar: "e", online: false, unread: 0, messages: [
    { id: 1, sender: "Eren", text: "Channel secure?", time: "08:10", self: false },
    { id: 2, sender: "You", text: "AES-256 active. Proceed.", time: "08:11", self: true },
  ]},
  { id: 3, name: "Gaurav Coder", username: "@gauravcoder3512", avatar: "G", online: true, unread: 1, messages: [
    { id: 1, sender: "Gaurav Coder", text: "Patch deployed to orbit node.", time: "Yesterday", self: false },
  ]},
  { id: 4, name: "Yash Dhiman", username: "@ydhiman123456", avatar: "Y", online: false, unread: 0, messages: [] },
];

const MOCK_GROUPS: Group[] = [
  { id: 1, name: "The Avengers", members: 5, messages: [
    { id: 1, sender: "Gaurav Thakur", text: "Team, stand by for mission briefing.", time: "10:00", self: false },
    { id: 2, sender: "You", text: "Ready.", time: "10:01", self: true },
  ]},
  { id: 2, name: "Dev Squad", members: 3, messages: [
    { id: 1, sender: "Eren", text: "Build successful. Deploying to prod.", time: "Yesterday", self: false },
  ]},
];

const ALL_USERS = MOCK_DMS;

const AVATAR_COLORS = ["#1a6b5a","#2d7a3a","#c44b1a","#1a5fa0","#6b3a8a","#8a4a1a","#1a7a6b","#7a1a3a"];

function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const color = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: "6px", background: color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.4, fontWeight: 700, color: "#fff",
      flexShrink: 0, fontFamily: "var(--font-orbitron,'Orbitron')",
      border: "1px solid rgba(0,212,255,0.2)",
    }}>{name[0].toUpperCase()}</div>
  );
}

export default function ChatPage() {
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dmExpanded, setDmExpanded] = useState(true);
  const [groupExpanded, setGroupExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<"dm" | "group" | null>(null);
  const [activeDM, setActiveDM] = useState<Conversation | null>(null);
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [dms, setDms] = useState<Conversation[]>(MOCK_DMS);
  const [groups, setGroups] = useState<Group[]>(MOCK_GROUPS);
  const [input, setInput] = useState("");
  const [showFindUser, setShowFindUser] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupSearch, setGroupSearch] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [clock, setClock] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeDM, activeGroup]);

  useEffect(() => {
    const tick = () => setClock(new Date().toTimeString().split(" ")[0]);
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg: Message = { id: Date.now(), sender: "You", text: input.trim(), time: new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}), self: true };
    if (activeDM) {
      setDms(prev => prev.map(d => d.id === activeDM.id ? { ...d, messages: [...d.messages, msg] } : d));
      setActiveDM(prev => prev ? { ...prev, messages: [...prev.messages, msg] } : null);
    }
    if (activeGroup) {
      setGroups(prev => prev.map(g => g.id === activeGroup.id ? { ...g, messages: [...g.messages, msg] } : g));
      setActiveGroup(prev => prev ? { ...prev, messages: [...prev.messages, msg] } : null);
    }
    setInput("");
  };

  const createGroup = () => {
    if (!groupName.trim() || selectedMembers.length === 0) return;
    const newGroup: Group = { id: Date.now(), name: groupName, members: selectedMembers.length + 1, messages: [] };
    setGroups(prev => [...prev, newGroup]);
    setShowCreateGroup(false); setGroupName(""); setSelectedMembers([]);
    setActiveGroup(newGroup); setActiveDM(null); setActiveTab("group");
  };

  const openDM = (conv: Conversation) => {
    setActiveDM(conv); setActiveGroup(null); setActiveTab("dm");
    setDms(prev => prev.map(d => d.id === conv.id ? { ...d, unread: 0 } : d));
  };

  const filteredUsers = ALL_USERS.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.username.toLowerCase().includes(userSearch.toLowerCase())
  );
  const filteredGroupUsers = ALL_USERS.filter(u =>
    u.name.toLowerCase().includes(groupSearch.toLowerCase()) ||
    u.username.toLowerCase().includes(groupSearch.toLowerCase())
  );

  const activeMessages = activeDM?.messages || activeGroup?.messages || [];
  const activeTitle = activeDM?.name || activeGroup?.name || null;

  // ── Styles ──
  const s = {
    page: { display:"flex", height:"100vh", background:"#020a14", color:"#67e8f9", fontFamily:"var(--font-geist-mono,'Courier New',monospace)", overflow:"hidden" } as React.CSSProperties,
    sidebar: { width: sidebarOpen ? "300px" : "0px", minWidth: sidebarOpen ? "300px" : "0", transition:"all 0.3s ease", overflow:"hidden", borderRight:"1px solid rgba(0,212,255,0.12)", display:"flex", flexDirection:"column", background:"rgba(2,10,20,0.95)" } as React.CSSProperties,
    sidebarInner: { width:"300px", height:"100%", display:"flex", flexDirection:"column" } as React.CSSProperties,
    topBar: { padding:"16px", borderBottom:"1px solid rgba(0,212,255,0.1)", display:"flex", alignItems:"center", justifyContent:"space-between" } as React.CSSProperties,
    section: { borderBottom:"1px solid rgba(0,212,255,0.08)" } as React.CSSProperties,
    sectionHeader: { padding:"10px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", userSelect:"none" } as React.CSSProperties,
    dmItem: (active: boolean) => ({ padding:"10px 16px", display:"flex", alignItems:"center", gap:"10px", cursor:"pointer", background: active ? "rgba(0,212,255,0.08)" : "transparent", borderLeft: active ? "2px solid #00d4ff" : "2px solid transparent", transition:"all 0.15s" }) as React.CSSProperties,
    main: { flex:1, display:"flex", flexDirection:"column", overflow:"hidden" } as React.CSSProperties,
    mainTopBar: { height:"56px", borderBottom:"1px solid rgba(0,212,255,0.1)", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px", background:"rgba(2,10,20,0.9)", flexShrink:0 } as React.CSSProperties,
    messagesArea: { flex:1, overflowY:"auto", padding:"24px", display:"flex", flexDirection:"column", gap:"16px" } as React.CSSProperties,
    inputBar: { padding:"16px 24px", borderTop:"1px solid rgba(0,212,255,0.1)", display:"flex", gap:"10px", background:"rgba(2,10,20,0.9)" } as React.CSSProperties,
    input: { flex:1, background:"rgba(0,30,60,0.6)", border:"1px solid rgba(0,212,255,0.25)", color:"#67e8f9", fontFamily:"inherit", fontSize:"12px", padding:"10px 16px", outline:"none", letterSpacing:"0.05em", transition:"border-color 0.2s" } as React.CSSProperties,
    btn: (color?: string) => ({ padding:"10px 20px", background: color || "rgba(0,212,255,0.08)", border:`1px solid ${color ? "transparent" : "rgba(0,212,255,0.25)"}`, color: color ? "#020a14" : "#67e8f9", fontFamily:"inherit", fontSize:"10px", letterSpacing:"0.2em", cursor:"pointer", fontWeight: color ? 700 : 400, transition:"all 0.2s" }) as React.CSSProperties,
    modal: { position:"fixed", inset:0, zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(2,10,20,0.85)", backdropFilter:"blur(4px)" } as React.CSSProperties,
    modalBox: { background:"#071220", border:"1px solid rgba(0,212,255,0.25)", width:"380px", maxHeight:"80vh", display:"flex", flexDirection:"column", boxShadow:"0 0 40px rgba(0,212,255,0.1)" } as React.CSSProperties,
  };

  return (
    <div style={s.page}>
      {/* Scanlines */}
      <div className="scanlines" style={{ position:"fixed", inset:0, zIndex:50, pointerEvents:"none" }}/>

      {/* ── SIDEBAR ── */}
      <div style={s.sidebar}>
        <div style={s.sidebarInner}>
          {/* User header */}
          <div style={s.topBar}>
            <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
              <div style={{ position:"relative" }}>
                <Avatar name={user?.firstName || user?.username || "U"} size={38} />
                <div style={{ position:"absolute", bottom:-2, right:-2, width:9, height:9, borderRadius:"50%", background:"#00ff88", border:"2px solid #020a14", boxShadow:"0 0 6px #00ff88" }}/>
              </div>
              <div>
                <div style={{ fontSize:"12px", color:"#a0e8ff", letterSpacing:"0.1em", fontWeight:600 }}>
                  {(user?.firstName || user?.username || "OPERATOR").toUpperCase()}
                </div>
                <div style={{ fontSize:"8px", color:"rgba(0,255,136,0.7)", letterSpacing:"0.2em", marginTop:"1px" }}>● ONLINE</div>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
              <UserButton />
              <a href="/" title="Back to Home" style={{
                display:"flex", alignItems:"center", justifyContent:"center",
                width:"28px", height:"28px",
                background:"rgba(0,212,255,0.05)",
                border:"1px solid rgba(0,212,255,0.2)",
                color:"rgba(0,212,255,0.5)",
                textDecoration:"none", fontSize:"13px",
                transition:"all 0.2s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#00d4ff"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,212,255,0.5)"; (e.currentTarget as HTMLAnchorElement).style.background = "rgba(0,212,255,0.1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(0,212,255,0.5)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,212,255,0.2)"; (e.currentTarget as HTMLAnchorElement).style.background = "rgba(0,212,255,0.05)"; }}
              >⌂</a>
              <button onClick={() => setSidebarOpen(false)} style={{ background:"none", border:"none", color:"rgba(0,212,255,0.4)", cursor:"pointer", fontSize:"16px", padding:"2px 6px" }}>⟨</button>
            </div>
          </div>

          {/* DM section */}
          <div style={s.section}>
            <div style={s.sectionHeader} onClick={() => setDmExpanded(p => !p)}>
              <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                <div style={{ width:"3px", height:"14px", background:"#00d4ff", boxShadow:"0 0 6px #00d4ff" }}/>
                <span style={{ fontSize:"10px", letterSpacing:"0.25em", color:"rgba(0,212,255,0.6)" }}>DIRECT MESSAGES</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                <button onClick={e => { e.stopPropagation(); setShowFindUser(true); }}
                  style={{ background:"none", border:"1px solid rgba(0,212,255,0.2)", color:"rgba(0,212,255,0.5)", cursor:"pointer", fontSize:"14px", width:"22px", height:"22px", display:"flex", alignItems:"center", justifyContent:"center", padding:0 }}>+</button>
                <span style={{ fontSize:"10px", color:"rgba(0,212,255,0.3)", transform: dmExpanded ? "rotate(90deg)" : "rotate(0)", transition:"transform 0.2s" }}>▶</span>
              </div>
            </div>
            {dmExpanded && dms.map(dm => (
              <div key={dm.id} style={s.dmItem(activeDM?.id === dm.id)} onClick={() => openDM(dm)}>
                <div style={{ position:"relative" }}>
                  <Avatar name={dm.name} size={32} />
                  {dm.online && <div style={{ position:"absolute", bottom:-1, right:-1, width:8, height:8, borderRadius:"50%", background:"#00ff88", border:"2px solid #020a14" }}/>}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:"11px", color:"#a0e8ff", letterSpacing:"0.05em", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{dm.name}</div>
                  <div style={{ fontSize:"8px", color:"rgba(0,212,255,0.3)", letterSpacing:"0.1em", marginTop:"1px" }}>{dm.username}</div>
                </div>
                {dm.unread > 0 && (
                  <div style={{ width:"16px", height:"16px", borderRadius:"50%", background:"#00d4ff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"8px", color:"#020a14", fontWeight:700 }}>{dm.unread}</div>
                )}
              </div>
            ))}
          </div>

          {/* Groups section */}
          <div style={s.section}>
            <div style={s.sectionHeader} onClick={() => setGroupExpanded(p => !p)}>
              <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                <div style={{ width:"3px", height:"14px", background:"#00d4ff", boxShadow:"0 0 6px #00d4ff" }}/>
                <span style={{ fontSize:"10px", letterSpacing:"0.25em", color:"rgba(0,212,255,0.6)" }}>GROUPS</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                <button onClick={e => { e.stopPropagation(); setShowCreateGroup(true); }}
                  style={{ background:"none", border:"1px solid rgba(0,212,255,0.2)", color:"rgba(0,212,255,0.5)", cursor:"pointer", fontSize:"14px", width:"22px", height:"22px", display:"flex", alignItems:"center", justifyContent:"center", padding:0 }}>+</button>
                <span style={{ fontSize:"10px", color:"rgba(0,212,255,0.3)", transform: groupExpanded ? "rotate(90deg)" : "rotate(0)", transition:"transform 0.2s" }}>▶</span>
              </div>
            </div>
            {groupExpanded && groups.map(g => (
              <div key={g.id} style={s.dmItem(activeGroup?.id === g.id)} onClick={() => { setActiveGroup(g); setActiveDM(null); setActiveTab("group"); }}>
                <div style={{ width:32, height:32, borderRadius:"6px", background:"rgba(0,212,255,0.1)", border:"1px solid rgba(0,212,255,0.25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px" }}>#</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:"11px", color:"#a0e8ff", letterSpacing:"0.05em", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{g.name}</div>
                  <div style={{ fontSize:"8px", color:"rgba(0,212,255,0.3)", letterSpacing:"0.1em", marginTop:"1px" }}>{g.members} MEMBERS</div>
                </div>
              </div>
            ))}
          </div>

          {/* Start chatting button */}
          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"20px", gap:"12px" }}>
            <button onClick={() => setShowFindUser(true)} style={{
              width:"56px", height:"56px", borderRadius:"10px",
              background:"linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,212,255,0.05))",
              border:"1px solid rgba(0,212,255,0.3)", color:"#00d4ff", fontSize:"24px",
              cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:"0 0 20px rgba(0,212,255,0.1)", transition:"all 0.2s",
            }}>+</button>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:"10px", letterSpacing:"0.2em", color:"rgba(0,212,255,0.5)" }}>START CHATTING</div>
              <div style={{ fontSize:"8px", color:"rgba(0,212,255,0.25)", marginTop:"4px", lineHeight:1.6 }}>Find users or create a new channel</div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding:"10px 16px", borderTop:"1px solid rgba(0,212,255,0.08)", display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontSize:"8px", color:"rgba(0,212,255,0.2)", letterSpacing:"0.15em" }}>VOICE: OK</span>
            <span style={{ fontSize:"8px", color:"rgba(0,212,255,0.2)", letterSpacing:"0.15em" }}>V 1.0</span>
          </div>
        </div>
      </div>

      {/* Sidebar toggle when closed */}
      {!sidebarOpen && (
        <button onClick={() => setSidebarOpen(true)} style={{
          position:"absolute", left:0, top:"50%", transform:"translateY(-50%)",
          zIndex:100, background:"rgba(0,212,255,0.1)", border:"1px solid rgba(0,212,255,0.25)",
          color:"#00d4ff", cursor:"pointer", padding:"12px 6px", fontSize:"12px",
        }}>⟩</button>
      )}

      {/* ── MAIN AREA ── */}
      <div style={s.main}>
        {/* Top bar */}
        <div style={s.mainTopBar}>
          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
            {activeTitle ? (
              <>
                {activeDM ? <Avatar name={activeTitle} size={28}/> : <div style={{ width:28, height:28, borderRadius:"6px", background:"rgba(0,212,255,0.1)", border:"1px solid rgba(0,212,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px" }}>#</div>}
                <div>
                  <div style={{ fontSize:"12px", color:"#a0e8ff", letterSpacing:"0.1em" }}>{activeTitle}</div>
                  {activeDM && <div style={{ fontSize:"8px", color:activeDM.online ? "#00ff88" : "rgba(0,212,255,0.3)", letterSpacing:"0.15em" }}>{activeDM.online ? "● ONLINE" : "○ OFFLINE"}</div>}
                  {activeGroup && <div style={{ fontSize:"8px", color:"rgba(0,212,255,0.3)", letterSpacing:"0.15em" }}>{activeGroup.members} MEMBERS</div>}
                </div>
              </>
            ) : (
              <div style={{ fontSize:"12px", color:"rgba(0,212,255,0.3)", letterSpacing:"0.1em" }}>TARS COMM HUB</div>
            )}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"16px" }}>
            <span style={{ fontSize:"9px", color:"rgba(0,212,255,0.25)", letterSpacing:"0.15em" }}>{clock}</span>
            <div style={{ display:"flex", alignItems:"center", gap:"4px" }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:"#00ff88", boxShadow:"0 0 4px #00ff88" }}/>
              <span style={{ fontSize:"8px", color:"rgba(0,212,255,0.3)", letterSpacing:"0.15em" }}>SECURE</span>
            </div>
            <a href="/" style={{
              display:"flex", alignItems:"center", gap:"6px",
              fontSize:"9px", letterSpacing:"0.2em", color:"rgba(0,212,255,0.4)",
              textDecoration:"none", padding:"5px 10px",
              border:"1px solid rgba(0,212,255,0.15)",
              background:"rgba(0,212,255,0.03)",
              transition:"all 0.2s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#00d4ff"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,212,255,0.4)"; (e.currentTarget as HTMLAnchorElement).style.background = "rgba(0,212,255,0.08)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(0,212,255,0.4)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,212,255,0.15)"; (e.currentTarget as HTMLAnchorElement).style.background = "rgba(0,212,255,0.03)"; }}
            >⟵ HOME</a>
          </div>
        </div>

        {/* Messages or empty state */}
        {!activeTitle ? (
          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"20px" }}>
            {/* Grid bg */}
            <div style={{
              position:"absolute", inset:0, pointerEvents:"none",
              backgroundImage:"repeating-linear-gradient(0deg, rgba(0,212,255,0.02) 0px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, rgba(0,212,255,0.02) 0px, transparent 1px, transparent 60px)",
            }}/>
            <div style={{ width:80, height:80, borderRadius:"50%", background:"rgba(0,212,255,0.06)", border:"1px solid rgba(0,212,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"32px", position:"relative", zIndex:1 }}>💬</div>
            <div style={{ textAlign:"center", position:"relative", zIndex:1 }}>
              <div style={{ fontFamily:"var(--font-orbitron,'Orbitron')", fontSize:"clamp(20px,4vw,40px)", fontWeight:900, color:"#d0f0ff", letterSpacing:"-0.02em", lineHeight:1.1 }}>
                NO CHANNEL<br/>SELECTED
              </div>
              <div style={{ fontSize:"11px", color:"rgba(0,212,255,0.35)", letterSpacing:"0.15em", marginTop:"12px" }}>
                Select a channel or start a new conversation
              </div>
            </div>
            <button onClick={() => setShowFindUser(true)} style={{
              padding:"10px 28px", background:"rgba(0,212,255,0.06)", border:"1px solid rgba(0,212,255,0.25)",
              color:"rgba(0,212,255,0.6)", fontFamily:"inherit", fontSize:"10px", letterSpacing:"0.25em",
              cursor:"pointer", position:"relative", zIndex:1,
              animation:"pulse 2s ease-in-out infinite",
            }}>WAITING FOR INPUT...</button>
          </div>
        ) : (
          <>
            <div style={s.messagesArea}>
              {activeMessages.length === 0 && (
                <div style={{ textAlign:"center", color:"rgba(0,212,255,0.2)", fontSize:"10px", letterSpacing:"0.2em", marginTop:"40px" }}>
                  NO TRANSMISSIONS YET. SEND FIRST MESSAGE.
                </div>
              )}
              {activeMessages.map(msg => (
                <div key={msg.id} style={{ display:"flex", justifyContent: msg.self ? "flex-end" : "flex-start", gap:"10px", alignItems:"flex-end" }}>
                  {!msg.self && <Avatar name={msg.sender} size={28}/>}
                  <div style={{ maxWidth:"65%" }}>
                    {!msg.self && (
                      <div style={{ fontSize:"8px", color:"rgba(0,212,255,0.4)", letterSpacing:"0.15em", marginBottom:"4px", paddingLeft:"2px" }}>{msg.sender.toUpperCase()}</div>
                    )}
                    <div style={{
                      padding:"10px 14px",
                      background: msg.self ? "linear-gradient(135deg, rgba(0,153,187,0.3), rgba(0,212,255,0.15))" : "rgba(0,30,60,0.6)",
                      border: msg.self ? "1px solid rgba(0,212,255,0.3)" : "1px solid rgba(0,212,255,0.12)",
                      borderRadius: msg.self ? "8px 8px 2px 8px" : "8px 8px 8px 2px",
                      fontSize:"12px", color: msg.self ? "#a0e8ff" : "#67e8f9",
                      lineHeight:1.5, letterSpacing:"0.03em",
                      boxShadow: msg.self ? "0 0 15px rgba(0,212,255,0.08)" : "none",
                    }}>{msg.text}</div>
                    <div style={{ fontSize:"7px", color:"rgba(0,212,255,0.25)", letterSpacing:"0.1em", marginTop:"3px", textAlign: msg.self ? "right" : "left", paddingLeft:"2px" }}>{msg.time}</div>
                  </div>
                  {msg.self && <Avatar name={user?.firstName || "Y"} size={28}/>}
                </div>
              ))}
              <div ref={messagesEndRef}/>
            </div>

            {/* Input bar */}
            <div style={s.inputBar}>
              <input
                style={s.input}
                placeholder={`TRANSMIT TO ${activeTitle.toUpperCase()}...`}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                onFocus={e => (e.target.style.borderColor = "rgba(0,212,255,0.6)")}
                onBlur={e => (e.target.style.borderColor = "rgba(0,212,255,0.25)")}
              />
              <button onClick={sendMessage} style={{
                ...s.btn("linear-gradient(135deg,#00d4ff,#0099bb)"),
                boxShadow:"0 0 16px rgba(0,212,255,0.3)",
              }}>SEND ▶</button>
            </div>
          </>
        )}
      </div>

      {/* ── FIND USER MODAL ── */}
      {showFindUser && (
        <div style={s.modal} onClick={() => setShowFindUser(false)}>
          <div style={s.modalBox} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(0,212,255,0.12)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                <div style={{ width:"3px", height:"16px", background:"#00d4ff", boxShadow:"0 0 6px #00d4ff" }}/>
                <span style={{ fontSize:"11px", letterSpacing:"0.25em", color:"#a0e8ff" }}>FIND USER</span>
              </div>
              <button onClick={() => setShowFindUser(false)} style={{ background:"none", border:"none", color:"rgba(0,212,255,0.4)", cursor:"pointer", fontSize:"16px" }}>✕</button>
            </div>
            {/* Search */}
            <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(0,212,255,0.08)" }}>
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", left:"12px", top:"50%", transform:"translateY(-50%)", color:"rgba(0,212,255,0.3)", fontSize:"12px" }}>⌕</span>
                <input
                  style={{ ...s.input, paddingLeft:"32px", width:"100%", boxSizing:"border-box" }}
                  placeholder="Search username..."
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            {/* Users list */}
            <div style={{ padding:"12px 0", overflowY:"auto", maxHeight:"400px" }}>
              <div style={{ fontSize:"8px", letterSpacing:"0.25em", color:"rgba(0,212,255,0.3)", padding:"4px 20px 10px" }}>
                <span style={{ display:"inline-block", width:6, height:6, borderRadius:"50%", background:"#00d4ff", marginRight:6, boxShadow:"0 0 4px #00d4ff", verticalAlign:"middle" }}/>
                ALL USERS
              </div>
              {filteredUsers.map(u => (
                <div key={u.id}
                  onClick={() => { openDM(u); setShowFindUser(false); setUserSearch(""); }}
                  style={{ padding:"10px 20px", display:"flex", alignItems:"center", gap:"12px", cursor:"pointer", transition:"background 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,212,255,0.06)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ position:"relative" }}>
                    <Avatar name={u.name} size={36}/>
                    {u.online && <div style={{ position:"absolute", bottom:-1, right:-1, width:8, height:8, borderRadius:"50%", background:"#00ff88", border:"2px solid #071220" }}/>}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:"12px", color:"#a0e8ff" }}>{u.name}</div>
                    <div style={{ fontSize:"9px", color:"rgba(0,212,255,0.35)", letterSpacing:"0.1em" }}>{u.username}</div>
                  </div>
                  <div style={{ color:"rgba(0,212,255,0.3)", fontSize:"16px" }}>💬</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE GROUP MODAL ── */}
      {showCreateGroup && (
        <div style={s.modal} onClick={() => setShowCreateGroup(false)}>
          <div style={s.modalBox} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(0,212,255,0.12)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                <div style={{ width:"3px", height:"16px", background:"#00d4ff", boxShadow:"0 0 6px #00d4ff" }}/>
                <span style={{ fontSize:"11px", letterSpacing:"0.25em", color:"#a0e8ff" }}>CREATE GROUP</span>
              </div>
              <button onClick={() => setShowCreateGroup(false)} style={{ background:"none", border:"none", color:"rgba(0,212,255,0.4)", cursor:"pointer", fontSize:"16px" }}>✕</button>
            </div>
            {/* Group name */}
            <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(0,212,255,0.08)" }}>
              <div style={{ fontSize:"8px", letterSpacing:"0.25em", color:"rgba(0,212,255,0.4)", marginBottom:"8px" }}>GROUP NAME</div>
              <div style={{ position:"relative" }}>
                <input
                  style={{ ...s.input, width:"100%", boxSizing:"border-box", paddingRight:"36px" }}
                  placeholder="ex. The Avengers"
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                  autoFocus
                />
                <span style={{ position:"absolute", right:"12px", top:"50%", transform:"translateY(-50%)", color:"rgba(0,212,255,0.4)", fontSize:"14px" }}>#</span>
              </div>
            </div>
            {/* Add members */}
            <div style={{ padding:"16px 20px 8px", borderBottom:"1px solid rgba(0,212,255,0.08)" }}>
              <div style={{ fontSize:"8px", letterSpacing:"0.25em", color:"rgba(0,212,255,0.4)", marginBottom:"8px" }}>
                ADD MEMBERS ({selectedMembers.length})
              </div>
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", left:"12px", top:"50%", transform:"translateY(-50%)", color:"rgba(0,212,255,0.3)", fontSize:"12px" }}>⌕</span>
                <input
                  style={{ ...s.input, paddingLeft:"32px", width:"100%", boxSizing:"border-box" }}
                  placeholder="Search by username..."
                  value={groupSearch}
                  onChange={e => setGroupSearch(e.target.value)}
                />
              </div>
            </div>
            {/* Members list */}
            <div style={{ overflowY:"auto", maxHeight:"220px" }}>
              {filteredGroupUsers.map(u => (
                <div key={u.id}
                  onClick={() => setSelectedMembers(prev => prev.includes(u.id) ? prev.filter(id => id !== u.id) : [...prev, u.id])}
                  style={{ padding:"10px 20px", display:"flex", alignItems:"center", gap:"12px", cursor:"pointer", transition:"background 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,212,255,0.05)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <Avatar name={u.name} size={34}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:"11px", color:"#a0e8ff" }}>{u.name}</div>
                    <div style={{ fontSize:"8px", color:"rgba(0,212,255,0.3)", letterSpacing:"0.1em" }}>{u.username}</div>
                  </div>
                  {/* Checkbox */}
                  <div style={{
                    width:"16px", height:"16px",
                    border:`1px solid ${selectedMembers.includes(u.id) ? "#00d4ff" : "rgba(0,212,255,0.25)"}`,
                    background: selectedMembers.includes(u.id) ? "rgba(0,212,255,0.2)" : "transparent",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    transition:"all 0.15s",
                  }}>
                    {selectedMembers.includes(u.id) && <span style={{ color:"#00d4ff", fontSize:"10px", lineHeight:1 }}>✓</span>}
                  </div>
                </div>
              ))}
            </div>
            {/* Create button */}
            <div style={{ padding:"16px 20px", borderTop:"1px solid rgba(0,212,255,0.1)" }}>
              <button
                onClick={createGroup}
                disabled={!groupName.trim() || selectedMembers.length === 0}
                style={{
                  width:"100%", padding:"12px", fontFamily:"inherit", fontSize:"11px",
                  letterSpacing:"0.25em", fontWeight:700, cursor: (!groupName.trim() || selectedMembers.length === 0) ? "not-allowed" : "pointer",
                  background: (!groupName.trim() || selectedMembers.length === 0) ? "rgba(0,212,255,0.04)" : "linear-gradient(135deg,#00d4ff,#0099bb)",
                  border: "1px solid rgba(0,212,255,0.2)",
                  color: (!groupName.trim() || selectedMembers.length === 0) ? "rgba(0,212,255,0.25)" : "#020a14",
                  transition:"all 0.2s",
                  boxShadow: (!groupName.trim() || selectedMembers.length === 0) ? "none" : "0 0 20px rgba(0,212,255,0.3)",
                }}
              >
                CREATE GROUP {selectedMembers.length > 0 ? `[${selectedMembers.length}]` : ""}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: rgba(0,212,255,0.03); }
        ::-webkit-scrollbar-thumb { background: rgba(0,212,255,0.2); border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(0,212,255,0.4); }
      `}</style>
    </div>
  );
}