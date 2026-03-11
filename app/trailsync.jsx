"use client";
import { useState, useEffect, useMemo } from "react";
import {
  MapPin, Mountain, Cloud, Users, Trophy, Search, X, ChevronDown, ChevronRight,
  Star, Wind, Droplets, Eye, Thermometer, Navigation, Calendar, Clock,
  Heart, MessageCircle, Share2, Layers, AlertTriangle, Award,
  TrendingUp, Compass, CloudSnow, CheckCircle, Globe,
  BookOpen, Bell, User, Play, Pause, Route,
  Home, Map, UserCircle, ArrowRight, Camera,
  CloudRain, Sun, CloudSun, Snowflake, Settings
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   BRAND PALETTE
   ═══════════════════════════════════════════════════════════════════
   #041e3d  — Deep navy (base/bg)
   #264f80  — Mountain blue (surfaces/cards)
   #5A98E3  — Sky blue (primary accent)
   #BDD6F4  — Snow haze (secondary text/borders)
   #F8F8F8  — Fresh snow (primary text)
   #E85D3A  — Summit orange (brand accent/CTAs)
   #F49D37  — Warm amber (secondary brand)
   ═══════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════════ */
const CLS = {
  munros: { name: "Munros", count: 282, color: "#E85D3A", desc: "Scottish peaks over 3,000ft" },
  corbetts: { name: "Corbetts", count: 222, color: "#F49D37", desc: "Scottish 2,500-3,000ft" },
  grahams: { name: "Grahams", count: 224, color: "#7FB069", desc: "Scottish 2,000-2,500ft" },
  donalds: { name: "Donalds", count: 89, color: "#8FBCBB", desc: "Lowland Scotland over 2,000ft" },
  wainwrights: { name: "Wainwrights", count: 214, color: "#B48EAD", desc: "Lake District fells" },
  hewitts: { name: "Hewitts", count: 525, color: "#5A98E3", desc: "England & Wales over 2,000ft" },
  nuttalls: { name: "Nuttalls", count: 446, color: "#88C0D0", desc: "England & Wales 2,000ft+" },
  marilyns: { name: "Marilyns", count: 1556, color: "#D08770", desc: "150m prominence, any height" },
  furths: { name: "Furths", count: 34, color: "#EBCB8B", desc: "3,000ft peaks outside Scotland" },
};

const WX_AREAS = [
  { region: "Southern Highlands", score: 94, temp: 4, feels: -1, wind: 12, precip: 0, vis: "good", peaks: ["Ben Lomond", "Ben Vorlich", "Stuc a' Chroin"], cls: "munros", ic: "sun" },
  { region: "Brecon Beacons", score: 91, temp: 7, feels: 4, wind: 14, precip: 0.1, vis: "good", peaks: ["Pen y Fan", "Corn Du", "Cribyn"], cls: "hewitts", ic: "sun" },
  { region: "Arrochar Alps", score: 89, temp: 3, feels: -2, wind: 15, precip: 0, vis: "good", peaks: ["The Cobbler", "Ben Narnain", "Beinn Ime"], cls: "corbetts", ic: "sun" },
  { region: "Galloway Hills", score: 88, temp: 5, feels: 1, wind: 16, precip: 0.3, vis: "good", peaks: ["Merrick", "Corserine"], cls: "donalds", ic: "cloudsun" },
  { region: "Snowdonia", score: 87, temp: 6, feels: 2, wind: 18, precip: 0.2, vis: "good", peaks: ["Snowdon", "Tryfan", "Glyder Fawr"], cls: "hewitts", ic: "cloudsun" },
  { region: "Lake District", score: 85, temp: 5, feels: 1, wind: 20, precip: 0.5, vis: "moderate", peaks: ["Helvellyn", "Scafell Pike", "Skiddaw"], cls: "wainwrights", ic: "cloudsun" },
  { region: "Glen Coe", score: 72, temp: 1, feels: -6, wind: 30, precip: 1.2, vis: "moderate", peaks: ["Buachaille Etive Mor", "Bidean nam Bian"], cls: "munros", ic: "cloud" },
  { region: "Torridon", score: 68, temp: 2, feels: -4, wind: 25, precip: 1.8, vis: "moderate", peaks: ["Liathach", "Beinn Eighe"], cls: "munros", ic: "cloudrain" },
  { region: "Kintail", score: 64, temp: 0, feels: -7, wind: 35, precip: 2.0, vis: "poor", peaks: ["The Five Sisters", "The Saddle"], cls: "munros", ic: "cloudrain" },
  { region: "Cairngorms", score: 58, temp: -3, feels: -12, wind: 45, precip: 2.5, vis: "poor", peaks: ["Cairn Gorm", "Ben Macdui"], cls: "munros", ic: "snow" },
];

const PEAKS = [
  { id: 1, name: "Ben Nevis", cls: "munros", ht: 1345, reg: "Ben Nevis & Mamores", lat: 56.797, lng: -5.004, w: { t: -3, f: -14, wi: 45, p: 2.5, v: "poor", sn: true } },
  { id: 2, name: "Ben Macdui", cls: "munros", ht: 1309, reg: "Cairngorms", lat: 57.070, lng: -3.669, w: { t: -5, f: -16, wi: 55, p: 3.0, v: "poor", sn: true } },
  { id: 3, name: "Braeriach", cls: "munros", ht: 1296, reg: "Cairngorms", lat: 57.078, lng: -3.729, w: { t: -4, f: -15, wi: 50, p: 2.8, v: "poor", sn: true } },
  { id: 4, name: "Buachaille Etive Mor", cls: "munros", ht: 1022, reg: "Glen Coe", lat: 56.652, lng: -4.954, w: { t: -1, f: -8, wi: 30, p: 1.2, v: "moderate", sn: true } },
  { id: 5, name: "Liathach", cls: "munros", ht: 1055, reg: "Torridon", lat: 57.581, lng: -5.468, w: { t: 0, f: -6, wi: 25, p: 1.5, v: "moderate", sn: true } },
  { id: 6, name: "An Teallach", cls: "munros", ht: 1062, reg: "Fisherfield", lat: 57.806, lng: -5.238, w: { t: 1, f: -4, wi: 22, p: 0.8, v: "good", sn: false } },
  { id: 7, name: "Ben Lomond", cls: "munros", ht: 974, reg: "Southern Highlands", lat: 56.190, lng: -4.632, w: { t: 4, f: -1, wi: 12, p: 0, v: "good", sn: false } },
  { id: 8, name: "Schiehallion", cls: "munros", ht: 1083, reg: "Southern Highlands", lat: 56.666, lng: -4.098, w: { t: 3, f: -2, wi: 14, p: 0, v: "good", sn: false } },
  { id: 9, name: "The Cobbler", cls: "corbetts", ht: 884, reg: "Arrochar Alps", lat: 56.219, lng: -4.819, w: { t: 3, f: -2, wi: 15, p: 0, v: "good", sn: false } },
  { id: 10, name: "Scafell Pike", cls: "hewitts", ht: 978, reg: "Lake District", lat: 54.454, lng: -3.212, w: { t: 3, f: -1, wi: 22, p: 0.5, v: "moderate", sn: false } },
  { id: 11, name: "Helvellyn", cls: "wainwrights", ht: 950, reg: "Lake District", lat: 54.527, lng: -3.016, w: { t: 2, f: -3, wi: 28, p: 0.8, v: "moderate", sn: false } },
  { id: 12, name: "Snowdon", cls: "hewitts", ht: 1085, reg: "Snowdonia", lat: 53.068, lng: -4.076, w: { t: 4, f: 0, wi: 20, p: 0.2, v: "good", sn: false } },
  { id: 13, name: "Pen y Fan", cls: "hewitts", ht: 886, reg: "Brecon Beacons", lat: 51.884, lng: -3.436, w: { t: 7, f: 4, wi: 14, p: 0.1, v: "good", sn: false } },
  { id: 14, name: "Merrick", cls: "donalds", ht: 843, reg: "Galloway Hills", lat: 55.146, lng: -4.615, w: { t: 5, f: 1, wi: 16, p: 0.3, v: "good", sn: false } },
  { id: 15, name: "Sgurr nan Gillean", cls: "munros", ht: 964, reg: "Skye Cuillin", lat: 57.254, lng: -6.196, w: { t: 1, f: -5, wi: 30, p: 1.0, v: "moderate", sn: false } },
];

const ROUTES = [
  { id: 1, name: "Ben Nevis via the Mountain Track", cls: "munros", reg: "Ben Nevis & Mamores", diff: "Moderate", dist: 14.2, elev: 1350, time: "6-8h", peaks: ["Ben Nevis"], rat: 4.6, rev: 342, start: "Glen Nevis Visitor Centre" },
  { id: 2, name: "CMD Arete to Ben Nevis", cls: "munros", reg: "Ben Nevis & Mamores", diff: "Hard", dist: 16.8, elev: 1500, time: "8-10h", peaks: ["Carn Mor Dearg", "Ben Nevis"], rat: 4.9, rev: 187, start: "North Face Car Park" },
  { id: 3, name: "Buachaille Etive Mor via Coire na Tulaich", cls: "munros", reg: "Glen Coe", diff: "Hard", dist: 10.1, elev: 980, time: "5-7h", peaks: ["Buachaille Etive Mor"], rat: 4.8, rev: 256, start: "Altnafeadh Layby" },
  { id: 4, name: "Helvellyn via Striding Edge", cls: "wainwrights", reg: "Lake District", diff: "Hard", dist: 12.8, elev: 890, time: "5-7h", peaks: ["Helvellyn"], rat: 4.7, rev: 412, start: "Glenridding Car Park" },
  { id: 5, name: "Snowdon Horseshoe", cls: "hewitts", reg: "Snowdonia", diff: "Hard", dist: 11.5, elev: 1050, time: "6-8h", peaks: ["Crib Goch", "Snowdon"], rat: 4.8, rev: 289, start: "Pen-y-Pass Car Park" },
  { id: 6, name: "The Cobbler from Arrochar", cls: "corbetts", reg: "Arrochar Alps", diff: "Moderate", dist: 11.0, elev: 850, time: "5-6h", peaks: ["The Cobbler"], rat: 4.7, rev: 198, start: "Succoth Car Park" },
  { id: 7, name: "Liathach Traverse", cls: "munros", reg: "Torridon", diff: "Expert", dist: 12.4, elev: 1200, time: "7-9h", peaks: ["Liathach"], rat: 4.9, rev: 134, start: "Glen Torridon Layby" },
  { id: 8, name: "Ben Lomond via Ptarmigan Ridge", cls: "munros", reg: "Southern Highlands", diff: "Moderate", dist: 11.6, elev: 974, time: "5-6h", peaks: ["Ben Lomond"], rat: 4.5, rev: 523, start: "Rowardennan Car Park" },
  { id: 9, name: "Cairn Gorm & Ben Macdui", cls: "munros", reg: "Cairngorms", diff: "Hard", dist: 18.6, elev: 1120, time: "7-9h", peaks: ["Cairn Gorm", "Ben Macdui"], rat: 4.7, rev: 267, start: "Cairn Gorm Ski Centre" },
  { id: 10, name: "Pen y Fan Horseshoe", cls: "hewitts", reg: "Brecon Beacons", diff: "Easy", dist: 6.2, elev: 550, time: "2-3h", peaks: ["Pen y Fan", "Corn Du"], rat: 4.4, rev: 678, start: "Pont ar Daf Car Park" },
  { id: 11, name: "An Teallach Traverse", cls: "munros", reg: "Fisherfield", diff: "Expert", dist: 15.2, elev: 1300, time: "8-10h", peaks: ["An Teallach"], rat: 4.9, rev: 112, start: "Dundonnell Car Park" },
  { id: 12, name: "Schiehallion", cls: "munros", reg: "Southern Highlands", diff: "Easy", dist: 9.5, elev: 760, time: "4-5h", peaks: ["Schiehallion"], rat: 4.3, rev: 445, start: "Braes of Foss Car Park" },
];

const C_WALKS = [
  { id: 1, title: "Cairngorms 4000ers", host: "HighlandHiker", av: "🧑‍🦰", date: "Sat 15 Mar", time: "06:30", spots: 8, filled: 5, type: "Mixed", age: "25-45", diff: "Hard", mutuals: 2, start: "Cairn Gorm Ski Centre", lat: 57.1, lng: -3.6 },
  { id: 2, title: "Ladies Glen Coe Day", host: "MountainMeg", av: "👩", date: "Tue 18 Mar", time: "08:00", spots: 12, filled: 9, type: "Female only", age: "Any", diff: "Moderate", mutuals: 4, start: "Altnafeadh Layby", lat: 56.65, lng: -5.0 },
  { id: 3, title: "Beginner Munro - Schiehallion", host: "ScotWalks", av: "🏔️", date: "Thu 20 Mar", time: "09:00", spots: 15, filled: 7, type: "Mixed", age: "Any", diff: "Easy", mutuals: 0, start: "Braes of Foss Car Park", lat: 56.67, lng: -4.1 },
  { id: 4, title: "Winter Skills - Aonach Mor", host: "WinterSummits", av: "❄️", date: "Sat 22 Mar", time: "07:00", spots: 6, filled: 4, type: "Mixed", age: "21+", diff: "Expert", mutuals: 1, start: "Nevis Range Car Park", lat: 56.82, lng: -5.08 },
  { id: 5, title: "Lake District Edges", host: "FellRunner_Tom", av: "🏃", date: "Sat 25 Mar", time: "07:30", spots: 10, filled: 3, type: "Mixed", age: "18-50", diff: "Hard", mutuals: 3, start: "Glenridding Car Park", lat: 54.53, lng: -3.0 },
];

const HIKERS = [
  { id: 1, name: "Jamie M.", peak: "Ben Nevis", st: "ascending", av: "🧑‍🦰" },
  { id: 2, name: "Sarah K.", peak: "Buachaille Etive Mor", st: "summit", av: "👩" },
  { id: 3, name: "Alistair D.", peak: "An Teallach", st: "ascending", av: "🧔" },
  { id: 4, name: "Fiona R.", peak: "Liathach", st: "descending", av: "👩‍🦱" },
];

const FEED = [
  { id: 1, user: "MountainMeg", av: "👩", time: "2h ago", type: "summit", text: "Stunning inversion on Ben Lomond this morning! Cloud sea stretching to the Arrochar Alps. Days like these are why we climb.", likes: 47, comments: 12, peaks: ["Ben Lomond"] },
  { id: 2, user: "ScotWalks", av: "🏔️", time: "4h ago", type: "event", text: "Beginner Munro walk this Thursday - Schiehallion! Perfect intro peak with incredible views. 8 spots left, all welcome.", likes: 23, comments: 5, peaks: ["Schiehallion"] },
  { id: 3, user: "HighlandHiker", av: "🧑‍🦰", time: "6h ago", type: "summit", text: "Completed the Ring of Steall today. Brutal wind on the ridge but incredible scrambling. 4 Munros bagged!", likes: 89, comments: 24, peaks: ["An Gearanach", "Stob Coire a' Chairn", "Am Bodach", "Sgurr a' Mhaim"] },
  { id: 4, user: "TrailSync", av: "▲", time: "8h ago", type: "news", text: "SAIS avalanche forecast updated: Considerable (3) hazard in Northern Cairngorms and Lochaber. Take care on steep lee slopes above 900m.", likes: 34, comments: 8, peaks: [] },
  { id: 5, user: "FellRunner_Tom", av: "🏃", time: "1d ago", type: "summit", text: "Helvellyn via Striding Edge in winter conditions. Crampons essential on the upper section. The Lake District doing its thing.", likes: 62, comments: 18, peaks: ["Helvellyn"] },
];

const MODULES = [
  { id: 1, title: "Navigation Fundamentals", desc: "Map reading, compass use, and navigating in poor visibility", les: 8, done: 5, ic: "🧭", lvl: "Beginner", time: "2h" },
  { id: 2, title: "Winter Mountain Skills", desc: "Ice axe arrest, crampon technique, avalanche awareness", les: 10, done: 3, ic: "❄️", lvl: "Intermediate", time: "3h" },
  { id: 3, title: "Weather Reading", desc: "Understanding mountain forecasts, cloud types, and pressure systems", les: 6, done: 6, ic: "🌦️", lvl: "Beginner", time: "1.5h" },
  { id: 4, title: "Mountain First Aid", desc: "Emergency response, hypothermia, fractures, and calling for rescue", les: 8, done: 0, ic: "🩹", lvl: "All levels", time: "2.5h" },
  { id: 5, title: "Scrambling Skills", desc: "Grade 1-3 scrambles, route finding on rock, exposure management", les: 7, done: 0, ic: "🧗", lvl: "Intermediate", time: "2h" },
  { id: 6, title: "Wild Camping", desc: "Kit selection, Leave No Trace, Scottish access rights, pitch selection", les: 5, done: 2, ic: "⛺", lvl: "Beginner", time: "1h" },
];

const ME = { name: "Alex", user: "AlexOnTheHills", loc: "Dundee", frs: 127, fng: 89, walks: 78, dist: 620, elev: 24800, munros: { d: 41, t: 282 }, corbetts: { d: 12, t: 222 }, wainwrights: { d: 18, t: 214 }, hewitts: { d: 8, t: 525 }, donalds: { d: 5, t: 89 } };

const BADGES = [
  { n: "First Summit", i: "🏔️", e: true }, { n: "10 Munros", i: "🔟", e: true },
  { n: "Winter Warrior", i: "❄️", e: true }, { n: "100km Club", i: "🏃", e: true },
  { n: "Community Leader", i: "👥", e: false, p: 60 }, { n: "Elevation King", i: "📈", e: false, p: 78 },
  { n: "All Seasons", i: "🌦️", e: false, p: 83 }, { n: "Dawn Patrol", i: "🌅", e: false, p: 33 },
  { n: "Munro Compleatist", i: "🏆", e: false, p: 14 }, { n: "Ridge Runner", i: "⛰️", e: false, p: 40 },
];

const LB = [
  { n: "HighlandHiker", m: 187, d: 2450, e: 89200, av: "🧗" },
  { n: "MountainMeg", m: 156, d: 1890, e: 72100, av: "🥾" },
  { n: "ScotWalks", m: 142, d: 2100, e: 68500, av: "🏔️" },
  { n: "FellRunner_Tom", m: 98, d: 3200, e: 95600, av: "🏃" },
  { n: "WinterSummits", m: 134, d: 1560, e: 62300, av: "❄️" },
  { n: "You", m: 41, d: 620, e: 24800, av: "⭐", u: true },
];

/* ═══════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════ */
const dc = d => d === "Expert" ? "#E85D3A" : d === "Hard" ? "#F49D37" : d === "Moderate" ? "#EBCB8B" : "#6BCB77";
const WI = ({ type, size = 16 }) => {
  const p = { size, strokeWidth: 1.8 };
  if (type === "sun") return <Sun {...p} color="#EBCB8B" />;
  if (type === "cloudsun") return <CloudSun {...p} color="#BDD6F4" />;
  if (type === "cloud") return <Cloud {...p} color="#8899aa" />;
  if (type === "cloudrain") return <CloudRain {...p} color="#5A98E3" />;
  if (type === "snow") return <Snowflake {...p} color="#BDD6F4" />;
  return <Sun {...p} color="#EBCB8B" />;
};
const greet = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };

/* ═══════════════════════════════════════════════════════════════════
   TAB 1: HOME
   ═══════════════════════════════════════════════════════════════════ */
const HomePage = () => {
  const [wxOpen, setWxOpen] = useState(true);
  const [ff, setFf] = useState("all");
  const sorted = [...WX_AREAS].sort((a, b) => b.score - a.score);

  return (
    <div style={{ padding: "0 16px 16px", overflowY: "auto", flex: 1 }}>
      {/* Greeting */}
      <div style={{ padding: "24px 0 14px", animation: "fi .5s ease" }}>
        <div style={{ fontSize: "13px", color: "#BDD6F4", fontWeight: 500, opacity: 0.7 }}>{greet()},</div>
        <div style={{ fontSize: "26px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'Playfair Display',serif", marginTop: "4px", lineHeight: 1.2 }}>
          Alex
        </div>
        <div style={{ fontSize: "15px", color: "#BDD6F4", marginTop: "4px", fontWeight: 400 }}>Where we exploring today?</div>
      </div>

      {/* Weather Engine */}
      <div style={{ marginBottom: "16px", animation: "su .4s ease .1s both" }}>
        <button onClick={() => setWxOpen(!wxOpen)} style={{ width: "100%", padding: "14px 16px", background: "linear-gradient(135deg, #264f80, #1a3a60)", border: "1px solid rgba(90,152,227,0.25)", borderRadius: wxOpen ? "14px 14px 0 0" : "14px", color: "#F8F8F8", fontSize: "14px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "'DM Sans',sans-serif", transition: "border-radius .2s" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "rgba(232,93,58,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sun size={18} color="#E85D3A" />
            </div>
            Best Weather Areas
            <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "8px", background: "rgba(107,203,119,0.15)", color: "#6BCB77", fontWeight: 600 }}>Live</span>
          </span>
          <ChevronDown size={18} style={{ transform: wxOpen ? "rotate(180deg)" : "none", transition: ".3s", color: "#BDD6F4" }} />
        </button>
        {wxOpen && (
          <div style={{ background: "#0a2240", borderRadius: "0 0 14px 14px", border: "1px solid rgba(90,152,227,0.15)", borderTop: "none" }}>
            <div style={{ padding: "8px 14px 4px", fontSize: "10px", color: "#BDD6F4", opacity: 0.6, display: "flex", justifyContent: "space-between" }}>
              <span>Ranked: wind 30% \u00B7 feels-like 25% \u00B7 precipitation 25% \u00B7 vis 20%</span>
              <span>12 min ago</span>
            </div>
            {sorted.map((a, i) => (
              <div key={i} style={{
                padding: "12px 14px", display: "flex", alignItems: "center", gap: "12px",
                borderTop: "1px solid rgba(90,152,227,0.1)", cursor: "pointer",
                background: i === 0 ? "rgba(107,203,119,0.04)" : "transparent",
                animation: `fi .3s ease ${i * .04}s both`,
                transition: "background .2s"
              }}>
                <div style={{
                  width: "30px", height: "30px", borderRadius: "9px",
                  background: a.score >= 85 ? "rgba(107,203,119,0.12)" : a.score >= 70 ? "rgba(235,203,139,0.12)" : "rgba(232,93,58,0.12)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "12px", fontWeight: 800,
                  color: a.score >= 85 ? "#6BCB77" : a.score >= 70 ? "#EBCB8B" : "#E85D3A"
                }}>{a.score}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#F8F8F8" }}>{a.region}</span>
                    <span style={{ fontSize: "9px", padding: "1px 6px", borderRadius: "4px", background: `${CLS[a.cls]?.color}18`, color: CLS[a.cls]?.color, fontWeight: 600 }}>
                      {CLS[a.cls]?.name}
                    </span>
                  </div>
                  <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.6, marginTop: "1px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {a.peaks.join(" \u00B7 ")}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", flexShrink: 0 }}>
                  <WI type={a.ic} size={18} />
                  <div style={{ textAlign: "right", minWidth: "42px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: a.feels < -5 ? "#BDD6F4" : "#F8F8F8" }}>{a.feels}°</div>
                    <div style={{ fontSize: "8px", color: "#BDD6F4", opacity: 0.5 }}>feels</div>
                  </div>
                  <div style={{ textAlign: "right", minWidth: "36px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: a.wind > 30 ? "#E85D3A" : "#F8F8F8" }}>{a.wind}</div>
                    <div style={{ fontSize: "8px", color: "#BDD6F4", opacity: 0.5 }}>mph</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SAIS Alert */}
      <div style={{ padding: "10px 14px", marginBottom: "16px", borderRadius: "12px", background: "rgba(232,93,58,0.08)", border: "1px solid rgba(232,93,58,0.2)", display: "flex", alignItems: "center", gap: "10px", animation: "su .4s ease .2s both" }}>
        <AlertTriangle size={16} color="#E85D3A" />
        <div style={{ flex: 1, fontSize: "11px", color: "#BDD6F4" }}><span style={{ fontWeight: 700, color: "#E85D3A" }}>SAIS Alert:</span> Considerable (3) hazard \u2013 Northern Cairngorms & Lochaber</div>
        <ChevronRight size={14} color="#BDD6F4" style={{ opacity: 0.5 }} />
      </div>

      {/* Feed filters */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "12px", animation: "su .4s ease .3s both" }}>
        {[["all", "For You"], ["summits", "Summits"], ["events", "Events"], ["news", "News"]].map(([k, l]) => (
          <button key={k} onClick={() => setFf(k)} style={{
            padding: "6px 14px", borderRadius: "20px", fontSize: "12px", cursor: "pointer",
            background: ff === k ? "rgba(90,152,227,0.2)" : "#0a2240",
            border: `1px solid ${ff === k ? "rgba(90,152,227,0.4)" : "rgba(90,152,227,0.12)"}`,
            color: ff === k ? "#5A98E3" : "#BDD6F4", fontWeight: ff === k ? 700 : 500,
            fontFamily: "'DM Sans'"
          }}>{l}</button>
        ))}
      </div>

      {/* Feed */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {FEED.filter(p => ff === "all" || (ff === "summits" && p.type === "summit") || (ff === "events" && p.type === "event") || (ff === "news" && p.type === "news")).map((p, i) => (
          <div key={p.id} style={{
            background: "#0a2240", borderRadius: "14px", padding: "14px",
            border: "1px solid rgba(90,152,227,0.1)", animation: `su .3s ease ${.35 + i * .05}s both`
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#264f80", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "17px" }}>{p.av}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#F8F8F8" }}>{p.user}</div>
                <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.5 }}>{p.time}</div>
              </div>
              {p.type === "event" && <span style={{ fontSize: "9px", padding: "2px 8px", borderRadius: "6px", background: "rgba(90,152,227,0.15)", color: "#5A98E3", fontWeight: 700 }}>EVENT</span>}
              {p.type === "news" && <span style={{ fontSize: "9px", padding: "2px 8px", borderRadius: "6px", background: "rgba(232,93,58,0.12)", color: "#E85D3A", fontWeight: 700 }}>ALERT</span>}
            </div>
            <div style={{ fontSize: "13px", color: "#BDD6F4", lineHeight: 1.55 }}>{p.text}</div>
            {p.peaks.length > 0 && <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "10px" }}>{p.peaks.map(pk => <span key={pk} style={{ fontSize: "9px", padding: "2px 7px", borderRadius: "6px", background: "rgba(232,93,58,0.1)", color: "#E85D3A", fontWeight: 600 }}>⛰️ {pk}</span>)}</div>}
            <div style={{ display: "flex", gap: "16px", marginTop: "12px" }}>
              {[[Heart, p.likes], [MessageCircle, p.comments], [Share2, ""]].map(([I, v], j) => <button key={j} style={{ background: "none", border: "none", color: "#BDD6F4", opacity: 0.5, fontSize: "11px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontFamily: "'DM Sans'" }}><I size={14} /> {v}</button>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   TAB 2: ROUTES
   ═══════════════════════════════════════════════════════════════════ */
const RoutesPage = () => {
  const [cf, setCf] = useState(null);
  const [df, setDf] = useState(null);
  const filtered = ROUTES.filter(r => (!cf || r.cls === cf) && (!df || r.diff === df));

  return (
    <div style={{ padding: "0 16px 16px", overflowY: "auto", flex: 1 }}>
      <div style={{ padding: "24px 0 8px" }}>
        <div style={{ fontSize: "24px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'Playfair Display',serif" }}>Routes</div>
        <div style={{ fontSize: "13px", color: "#BDD6F4", opacity: 0.6, marginTop: "4px" }}>Discover your next adventure</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", background: "#0a2240", borderRadius: "12px", border: "1px solid rgba(90,152,227,0.12)", marginBottom: "12px" }}>
        <Search size={16} color="#BDD6F4" style={{ opacity: 0.4 }} />
        <span style={{ color: "#BDD6F4", opacity: 0.4, fontSize: "13px" }}>Search routes, peaks, areas...</span>
      </div>

      <div style={{ display: "flex", gap: "6px", marginBottom: "10px", flexWrap: "wrap" }}>
        <select value={cf || ""} onChange={e => setCf(e.target.value || null)} style={{ padding: "7px 12px", borderRadius: "10px", fontSize: "11px", fontWeight: 600, background: cf ? "rgba(232,93,58,0.1)" : "#0a2240", border: `1px solid ${cf ? "rgba(232,93,58,0.3)" : "rgba(90,152,227,0.12)"}`, color: cf ? "#E85D3A" : "#BDD6F4", outline: "none", cursor: "pointer", fontFamily: "'DM Sans'" }}>
          <option value="">All Classifications</option>
          {Object.entries(CLS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
        </select>
        <select value={df || ""} onChange={e => setDf(e.target.value || null)} style={{ padding: "7px 12px", borderRadius: "10px", fontSize: "11px", fontWeight: 600, background: df ? "rgba(90,152,227,0.1)" : "#0a2240", border: `1px solid ${df ? "rgba(90,152,227,0.3)" : "rgba(90,152,227,0.12)"}`, color: df ? "#5A98E3" : "#BDD6F4", outline: "none", cursor: "pointer", fontFamily: "'DM Sans'" }}>
          <option value="">All Difficulty</option>
          {["Easy", "Moderate", "Hard", "Expert"].map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.4, marginBottom: "12px" }}>{filtered.length} routes found</div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {filtered.map((r, i) => (
          <div key={r.id} style={{ background: "#0a2240", borderRadius: "14px", padding: "14px", border: "1px solid rgba(90,152,227,0.1)", cursor: "pointer", animation: `fi .3s ease ${i * .04}s both` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "8px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#F8F8F8", lineHeight: 1.3 }}>{r.name}</div>
                <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.5, marginTop: "3px" }}>{r.reg} \u00B7 Start: {r.start}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "3px", flexShrink: 0 }}>
                <Star size={12} color="#EBCB8B" fill="#EBCB8B" />
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#F8F8F8" }}>{r.rat}</span>
                <span style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.5 }}>({r.rev})</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
              <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "8px", background: `${CLS[r.cls]?.color}15`, color: CLS[r.cls]?.color, fontWeight: 600 }}>{CLS[r.cls]?.name}</span>
              <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "8px", background: `${dc(r.diff)}18`, color: dc(r.diff), fontWeight: 600 }}>{r.diff}</span>
              <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "8px", background: "rgba(90,152,227,0.1)", color: "#5A98E3", fontWeight: 600 }}>\u2713 Verified</span>
            </div>
            <div style={{ display: "flex", gap: "16px" }}>
              {[[Navigation, `${r.dist}km`], [TrendingUp, `${r.elev}m`], [Clock, r.time]].map(([I, v], j) => <span key={j} style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.6, display: "flex", alignItems: "center", gap: "4px" }}><I size={12} /> {v}</span>)}
            </div>
            <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>{r.peaks.map(pk => <span key={pk} style={{ fontSize: "9px", padding: "2px 6px", borderRadius: "5px", background: "rgba(232,93,58,0.08)", color: "#E85D3A", fontWeight: 600 }}>⛰️ {pk}</span>)}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: "14px 0", fontSize: "10px", color: "#BDD6F4", opacity: 0.4, textAlign: "center", fontStyle: "italic" }}>Community routes are not regulated. Please use at your own risk and always carry appropriate navigation equipment.</div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   TAB 3: MAP
   ═══════════════════════════════════════════════════════════════════ */
const MapPage = ({ goHome }) => {
  const [layer, setLayer] = useState("standard");
  const [lm, setLm] = useState(false);
  const [wo, setWo] = useState(null);
  const [sh, setSh] = useState(true);
  const [sc, setSc] = useState(true);
  const [sp, setSp] = useState(null);
  const [sw, setSw] = useState(null);
  const [cf, setCf] = useState(null);
  const [d3, setD3] = useState(false);
  const fp = PEAKS.filter(p => !cf || p.cls === cf);

  return (
    <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
      {/* Map bg */}
      <div style={{
        position: "absolute", inset: 0, transition: "background .6s",
        background: layer === "satellite"
          ? "linear-gradient(160deg, #031210, #0a1e18 30%, #0e251c 60%, #071510)"
          : layer === "topo"
          ? "linear-gradient(160deg, #041e3d, #0c2d55 30%, #0a2848 60%, #061e3a)"
          : d3
          ? "linear-gradient(160deg, #031525, #0a2540 30%, #0e2d3d 60%, #062030)"
          : "linear-gradient(160deg, #041e3d, #0a2848 30%, #082540 60%, #061e3a)"
      }}>
        {/* Contours */}
        {[...Array(18)].map((_, i) => <div key={i} style={{ position: "absolute", left: `${8 + (i * 5.5) % 82}%`, top: `${10 + (i * 7.3) % 65}%`, width: `${100 + i * 18}px`, height: `${65 + i * 12}px`, border: `1px solid rgba(90,152,227,${layer === "topo" ? 0.12 : 0.05})`, borderRadius: "50%", transform: d3 ? `perspective(800px) rotateX(55deg) translateZ(${i * 2}px)` : "none", transition: "all .6s" }} />)}

        {/* Weather overlay */}
        {wo && <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>{[...Array(12)].map((_, i) => <div key={i} style={{ position: "absolute", left: `${5 + i * 8}%`, top: `${10 + (i * 13) % 60}%`, width: `${50 + i * 10}px`, height: `${50 + i * 10}px`, background: wo === "wind" ? `radial-gradient(circle,rgba(90,152,227,${.08 + i * .02}),transparent)` : wo === "precip" ? `radial-gradient(circle,rgba(90,130,180,${.06 + i * .015}),transparent)` : `radial-gradient(circle,rgba(189,214,244,${.04 + i * .01}),transparent)`, borderRadius: "50%", animation: `fl ${3 + i * .4}s ease-in-out infinite alternate` }} />)}</div>}

        {/* Peaks */}
        {fp.map((pk, i) => { const x = ((pk.lng + 8) / 12) * 100; const y = ((58 - pk.lat) / 7) * 100; const cls = CLS[pk.cls]; return (
          <div key={pk.id} onClick={() => { setSp(pk); setSw(null); }} style={{ position: "absolute", left: `${Math.max(4, Math.min(92, x))}%`, top: `${Math.max(6, Math.min(88, y))}%`, transform: "translate(-50%,-50%)", cursor: "pointer", zIndex: 10, animation: `fi .3s ease ${i * .04}s both` }}>
            <div style={{ width: "26px", height: "26px", borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)", background: cls?.color, border: "2px solid rgba(248,248,248,.85)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 2px 10px ${cls?.color}40` }}>
              <Mountain size={11} style={{ transform: "rotate(45deg)", color: "#fff" }} />
            </div>
            <div style={{ position: "absolute", top: "30px", left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap", fontSize: "9px", color: "#F8F8F8", textShadow: "0 1px 6px rgba(4,30,61,.9)", fontWeight: 700 }}>{pk.name}</div>
          </div>
        ); })}

        {/* Community walks */}
        {sc && C_WALKS.map((w, i) => { const x = ((w.lng + 8) / 12) * 100; const y = ((58 - w.lat) / 7) * 100 - 5; return (
          <div key={w.id} onClick={() => { setSw(w); setSp(null); }} style={{ position: "absolute", left: `${Math.max(4, Math.min(92, x))}%`, top: `${Math.max(6, Math.min(88, y))}%`, transform: "translate(-50%,-50%)", zIndex: 12, cursor: "pointer", animation: `fi .4s ease ${.3 + i * .05}s both` }}>
            <div style={{ background: "rgba(90,152,227,.85)", backdropFilter: "blur(8px)", borderRadius: "12px", padding: "4px 9px", border: "1px solid rgba(248,248,248,.2)", display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", color: "#F8F8F8", whiteSpace: "nowrap" }}><Users size={10} /><span style={{ fontWeight: 700 }}>{w.filled}/{w.spots}</span><span style={{ opacity: .75 }}>{w.date}</span></div>
          </div>
        ); })}

        {/* Live hikers */}
        {sh && HIKERS.map((h, i) => { const pk = PEAKS.find(p => p.name === h.peak); if (!pk) return null; const x = ((pk.lng + 8) / 12) * 100 + (i % 2 ? 2.5 : -2.5); const y = ((58 - pk.lat) / 7) * 100 + 5; return (
          <div key={h.id} style={{ position: "absolute", left: `${Math.max(4, Math.min(92, x))}%`, top: `${Math.max(6, Math.min(88, y))}%`, transform: "translate(-50%,-50%)", zIndex: 15, animation: `fl 3s ease-in-out infinite, fi .4s ease ${.5 + i * .06}s both` }}>
            <div style={{ background: "rgba(4,30,61,.9)", backdropFilter: "blur(8px)", borderRadius: "16px", padding: "3px 8px", border: `1px solid ${h.st === "summit" ? "#6BCB77" : h.st === "ascending" ? "#5A98E3" : "#F49D37"}`, display: "flex", alignItems: "center", gap: "4px", fontSize: "9px", color: "#F8F8F8", whiteSpace: "nowrap" }}>
              <span>{h.av}</span><span style={{ fontWeight: 600 }}>{h.name}</span>
              <span style={{ color: h.st === "summit" ? "#6BCB77" : h.st === "ascending" ? "#5A98E3" : "#F49D37" }}>{h.st === "summit" ? "⛰️" : h.st === "ascending" ? "\u2197" : "\u2198"}</span>
            </div>
          </div>
        ); })}
      </div>

      {/* Top controls */}
      <div style={{ position: "absolute", top: 10, left: 10, right: 10, display: "flex", gap: "6px", zIndex: 20 }}>
        <div style={{ flex: 1, background: "rgba(4,30,61,.88)", backdropFilter: "blur(12px)", borderRadius: "12px", padding: "9px 14px", display: "flex", alignItems: "center", gap: "8px", border: "1px solid rgba(90,152,227,0.15)" }}>
          <Search size={14} color="#BDD6F4" style={{ opacity: 0.4 }} />
          <span style={{ color: "#BDD6F4", opacity: 0.4, fontSize: "12px" }}>Search peaks, routes...</span>
        </div>
        <div style={{ position: "relative" }}>
          <button onClick={() => setLm(!lm)} style={{ background: "rgba(4,30,61,.88)", backdropFilter: "blur(12px)", border: "1px solid rgba(90,152,227,0.15)", borderRadius: "12px", padding: "9px 12px", color: "#BDD6F4", fontSize: "11px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontWeight: 600, fontFamily: "'DM Sans'" }}>
            <Layers size={14} /> Layers
          </button>
          {lm && (
            <div style={{ position: "absolute", top: "110%", right: 0, minWidth: "200px", background: "rgba(4,30,61,.97)", backdropFilter: "blur(16px)", borderRadius: "14px", border: "1px solid rgba(90,152,227,0.2)", padding: "6px", zIndex: 30 }}>
              <div style={{ padding: "6px 12px 4px", fontSize: "9px", color: "#BDD6F4", opacity: 0.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Map Style</div>
              {[["standard", "🗺️ Standard"], ["topo", "📐 Topographical (OS/Harvey)"], ["satellite", "🛰️ Satellite"]].map(([k, l]) => <button key={k} onClick={() => setLayer(k)} style={{ display: "block", width: "100%", padding: "8px 12px", borderRadius: "8px", border: "none", background: layer === k ? "rgba(90,152,227,0.15)" : "transparent", color: layer === k ? "#5A98E3" : "#BDD6F4", fontSize: "12px", cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans'", fontWeight: layer === k ? 600 : 400 }}>{l}</button>)}
              <div style={{ height: "1px", background: "rgba(90,152,227,0.1)", margin: "4px 0" }} />
              <div style={{ padding: "6px 12px 4px", fontSize: "9px", color: "#BDD6F4", opacity: 0.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Overlays</div>
              <button onClick={() => setD3(!d3)} style={{ display: "flex", width: "100%", padding: "8px 12px", borderRadius: "8px", border: "none", alignItems: "center", gap: "8px", background: d3 ? "rgba(90,152,227,0.15)" : "transparent", color: d3 ? "#5A98E3" : "#BDD6F4", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans'" }}><Globe size={12} /> 3D Terrain</button>
              {[["wind", "💨 Wind"], ["precip", "🌧️ Precipitation"], ["cloud", "☁️ Cloud Cover"]].map(([k, l]) => <button key={k} onClick={() => setWo(wo === k ? null : k)} style={{ display: "block", width: "100%", padding: "8px 12px", borderRadius: "8px", border: "none", background: wo === k ? "rgba(90,152,227,0.15)" : "transparent", color: wo === k ? "#5A98E3" : "#BDD6F4", fontSize: "12px", cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans'" }}>{l}</button>)}
            </div>
          )}
        </div>
      </div>

      {/* Unsure prompt */}
      {wo && <div onClick={goHome} style={{ position: "absolute", top: 56, left: "50%", transform: "translateX(-50%)", background: "rgba(232,93,58,.92)", backdropFilter: "blur(8px)", borderRadius: "20px", padding: "7px 18px", zIndex: 20, display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", animation: "fi .4s ease", border: "1px solid rgba(248,248,248,.15)" }}><span style={{ fontSize: "12px", color: "#F8F8F8", fontWeight: 600 }}>Unsure where to go?</span><ArrowRight size={14} color="#F8F8F8" /></div>}

      {/* Bottom toggles */}
      <div style={{ position: "absolute", bottom: 12, left: 10, display: "flex", gap: "6px", zIndex: 20 }}>
        {[["Live", sh, setSh, HIKERS.length, Eye], ["Walks", sc, setSc, C_WALKS.length, Users]].map(([l, s, fn, n, I]) => (
          <button key={l} onClick={() => fn(!s)} style={{ background: s ? "rgba(90,152,227,0.2)" : "rgba(4,30,61,.75)", backdropFilter: "blur(8px)", border: `1px solid ${s ? "rgba(90,152,227,0.35)" : "rgba(90,152,227,0.1)"}`, borderRadius: "20px", padding: "5px 12px", color: s ? "#5A98E3" : "#BDD6F4", fontSize: "10px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: 600, fontFamily: "'DM Sans'", opacity: s ? 1 : 0.6 }}><I size={12} /> {l} ({n})</button>
        ))}
      </div>

      {/* Classification chips */}
      <div style={{ position: "absolute", bottom: 12, right: 10, display: "flex", gap: "4px", zIndex: 20, flexWrap: "wrap", justifyContent: "flex-end", maxWidth: "280px" }}>
        <button onClick={() => setCf(null)} style={{ background: !cf ? "rgba(248,248,248,.12)" : "rgba(4,30,61,.65)", border: "1px solid rgba(90,152,227,0.12)", borderRadius: "14px", padding: "4px 9px", color: !cf ? "#F8F8F8" : "#BDD6F4", fontSize: "9px", cursor: "pointer", fontWeight: !cf ? 700 : 400, fontFamily: "'DM Sans'", opacity: cf ? 0.6 : 1 }}>All</button>
        {Object.entries(CLS).slice(0, 5).map(([k, c]) => <button key={k} onClick={() => setCf(cf === k ? null : k)} style={{ background: cf === k ? `${c.color}20` : "rgba(4,30,61,.65)", border: `1px solid ${cf === k ? c.color : "rgba(90,152,227,0.1)"}`, borderRadius: "14px", padding: "4px 9px", color: cf === k ? c.color : "#BDD6F4", fontSize: "9px", cursor: "pointer", fontWeight: cf === k ? 700 : 400, fontFamily: "'DM Sans'", opacity: cf === k ? 1 : 0.6 }}>{c.name}</button>)}
      </div>

      {/* Peak card */}
      {sp && (
        <div style={{ position: "absolute", bottom: 50, left: 10, right: 10, zIndex: 25, background: "rgba(4,30,61,.97)", backdropFilter: "blur(16px)", borderRadius: "16px", border: "1px solid rgba(90,152,227,0.15)", animation: "su .3s ease", overflow: "hidden" }}>
          <div style={{ height: "4px", background: `linear-gradient(90deg,${CLS[sp.cls]?.color},transparent)` }} />
          <div style={{ padding: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div><div style={{ fontSize: "17px", fontWeight: 800, color: "#F8F8F8" }}>{sp.name}</div><div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.6, marginTop: "2px" }}>{sp.ht}m \u00B7 {sp.reg}</div></div>
              <button onClick={() => setSp(null)} style={{ background: "#264f80", border: "none", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", color: "#BDD6F4", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={13} /></button>
            </div>
            <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}><span style={{ fontSize: "9px", padding: "2px 8px", borderRadius: "6px", background: `${CLS[sp.cls]?.color}15`, color: CLS[sp.cls]?.color, fontWeight: 700 }}>{CLS[sp.cls]?.name}</span></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "8px", marginTop: "12px" }}>
              {[["Feels", `${sp.w.f}°`, Thermometer, sp.w.f < -5 ? "#BDD6F4" : "#F8F8F8"], ["Wind", `${sp.w.wi}mph`, Wind, sp.w.wi > 35 ? "#E85D3A" : "#F8F8F8"], ["Rain", `${sp.w.p}mm`, Droplets, sp.w.p > 2 ? "#5A98E3" : "#F8F8F8"], ["Vis", sp.w.v, Eye, "#F8F8F8"]].map(([l, v, I, c]) => <div key={l} style={{ textAlign: "center", padding: "10px 4px", background: "#0a2240", borderRadius: "10px" }}><I size={14} color="#BDD6F4" style={{ opacity: 0.5 }} /><div style={{ fontSize: "14px", fontWeight: 700, color: c, marginTop: "3px" }}>{v}</div><div style={{ fontSize: "8px", color: "#BDD6F4", opacity: 0.4, marginTop: "1px" }}>{l}</div></div>)}
            </div>
            <button style={{ marginTop: "14px", width: "100%", padding: "11px", background: "linear-gradient(135deg,#E85D3A,#d04a2a)", border: "none", borderRadius: "11px", color: "#F8F8F8", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'" }}>Log This Summit ⛰️</button>
          </div>
        </div>
      )}
      {/* Walk card */}
      {sw && (
        <div style={{ position: "absolute", bottom: 50, left: 10, right: 10, zIndex: 25, background: "rgba(4,30,61,.97)", backdropFilter: "blur(16px)", borderRadius: "16px", border: "1px solid rgba(90,152,227,0.15)", animation: "su .3s ease" }}>
          <div style={{ height: "4px", background: "linear-gradient(90deg,#5A98E3,transparent)" }} />
          <div style={{ padding: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div><div style={{ fontSize: "16px", fontWeight: 800, color: "#F8F8F8" }}>{sw.title}</div><div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.6, marginTop: "2px" }}>by <span style={{ color: "#5A98E3" }}>@{sw.host}</span></div></div>
              <button onClick={() => setSw(null)} style={{ background: "#264f80", border: "none", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", color: "#BDD6F4", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={13} /></button>
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "10px" }}>
              {[`📅 ${sw.date}`, `🕐 ${sw.time}`, sw.type === "Female only" ? "\u2640\uFE0F Female only" : "👥 Mixed", sw.diff, `🎂 ${sw.age}`].map((l, i) => <span key={i} style={{ fontSize: "10px", padding: "3px 8px", borderRadius: "8px", background: l === sw.diff ? `${dc(sw.diff)}15` : "#0a2240", color: l === sw.diff ? dc(sw.diff) : "#BDD6F4", fontWeight: 500 }}>{l}</span>)}
              {sw.mutuals > 0 && <span style={{ fontSize: "10px", padding: "3px 8px", borderRadius: "8px", background: "rgba(90,152,227,0.1)", color: "#5A98E3", fontWeight: 600 }}>{sw.mutuals} mutual{sw.mutuals > 1 ? "s" : ""}</span>}
            </div>
            <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.5, marginTop: "8px" }}>📍 Start: {sw.start}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px" }}><div style={{ flex: 1, height: "5px", borderRadius: "5px", background: "#0a2240" }}><div style={{ width: `${(sw.filled / sw.spots) * 100}%`, height: "100%", borderRadius: "5px", background: sw.filled >= sw.spots ? "#E85D3A" : "#5A98E3" }} /></div><span style={{ fontSize: "11px", color: "#BDD6F4", fontWeight: 600 }}>{sw.filled}/{sw.spots}</span></div>
            {sw.filled < sw.spots && <button style={{ marginTop: "12px", width: "100%", padding: "11px", background: "linear-gradient(135deg,#5A98E3,#4080cc)", border: "none", borderRadius: "11px", color: "#F8F8F8", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'" }}>Join Walk</button>}
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   TAB 4: LEARN
   ═══════════════════════════════════════════════════════════════════ */
const LearnPage = () => {
  const [sel, setSel] = useState(null);
  return (
    <div style={{ padding: "0 16px 16px", overflowY: "auto", flex: 1 }}>
      <div style={{ padding: "24px 0 8px" }}>
        <div style={{ fontSize: "24px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'Playfair Display',serif" }}>Learn</div>
        <div style={{ fontSize: "13px", color: "#BDD6F4", opacity: 0.6, marginTop: "4px" }}>Build your skills, stay safe on the hill</div>
      </div>
      <div style={{ padding: "14px", marginBottom: "16px", borderRadius: "14px", background: "linear-gradient(135deg,rgba(90,152,227,0.12),rgba(107,203,119,0.06))", border: "1px solid rgba(90,152,227,0.15)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><div style={{ fontSize: "13px", fontWeight: 700, color: "#F8F8F8" }}>Your Progress</div><div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.6, marginTop: "2px" }}>3 of {MODULES.length} started \u00B7 1 completed</div></div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#5A98E3", fontFamily: "'JetBrains Mono'" }}>16%</div>
        </div>
        <div style={{ height: "5px", borderRadius: "5px", background: "#0a2240", marginTop: "10px" }}><div style={{ width: "16%", height: "100%", borderRadius: "5px", background: "linear-gradient(90deg,#5A98E3,#6BCB77)" }} /></div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {MODULES.map((m, i) => { const pct = Math.round((m.done / m.les) * 100); return (
          <div key={m.id} onClick={() => setSel(sel === m.id ? null : m.id)} style={{ background: "#0a2240", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(90,152,227,0.1)", cursor: "pointer", animation: `fi .3s ease ${i * .04}s both` }}>
            <div style={{ padding: "14px", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: pct === 100 ? "rgba(107,203,119,0.1)" : "#264f80", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", border: pct === 100 ? "1px solid rgba(107,203,119,0.2)" : "none" }}>{m.ic}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ fontSize: "13px", fontWeight: 700, color: "#F8F8F8" }}>{m.title}</span>{pct === 100 && <CheckCircle size={13} color="#6BCB77" />}</div>
                <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.5, marginTop: "2px" }}>{m.lvl} \u00B7 {m.les} lessons \u00B7 {m.time}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px" }}><div style={{ flex: 1, height: "3px", borderRadius: "3px", background: "#264f80" }}><div style={{ width: `${pct}%`, height: "100%", borderRadius: "3px", background: pct === 100 ? "#6BCB77" : "#5A98E3" }} /></div><span style={{ fontSize: "9px", color: "#BDD6F4", opacity: 0.5, fontWeight: 600 }}>{m.done}/{m.les}</span></div>
              </div>
              <ChevronRight size={16} color="#BDD6F4" style={{ opacity: 0.4, transform: sel === m.id ? "rotate(90deg)" : "none", transition: ".2s" }} />
            </div>
            {sel === m.id && <div style={{ padding: "0 14px 14px", borderTop: "1px solid rgba(90,152,227,0.1)", paddingTop: "12px" }}>
              <div style={{ fontSize: "12px", color: "#BDD6F4", lineHeight: 1.5, marginBottom: "12px" }}>{m.desc}</div>
              <button style={{ padding: "9px 22px", borderRadius: "10px", border: "none", background: pct === 100 ? "#264f80" : "linear-gradient(135deg,#5A98E3,#4080cc)", color: pct === 100 ? "#BDD6F4" : "#F8F8F8", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'" }}>{pct === 100 ? "Review" : pct > 0 ? "Continue" : "Start"}</button>
            </div>}
          </div>
        ); })}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   TAB 5: PROFILE
   ═══════════════════════════════════════════════════════════════════ */
const ProfilePage = () => {
  const [sec, setSec] = useState("lists");
  const [lbm, setLbm] = useState("m");
  const lists = [
    { k: "munros", ...ME.munros, c: CLS.munros }, { k: "corbetts", ...ME.corbetts, c: CLS.corbetts },
    { k: "wainwrights", ...ME.wainwrights, c: CLS.wainwrights }, { k: "hewitts", ...ME.hewitts, c: CLS.hewitts },
    { k: "donalds", ...ME.donalds, c: CLS.donalds },
  ];

  return (
    <div style={{ padding: "0 16px 16px", overflowY: "auto", flex: 1 }}>
      <div style={{ padding: "24px 0 16px", display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{ width: "58px", height: "58px", borderRadius: "50%", background: "linear-gradient(135deg,#264f80,#5A98E3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: 800, color: "#F8F8F8", border: "3px solid rgba(90,152,227,0.3)" }}>A</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "20px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'Playfair Display',serif" }}>{ME.name}</div>
          <div style={{ fontSize: "12px", color: "#BDD6F4", opacity: 0.6 }}>@{ME.user} \u00B7 {ME.loc}</div>
          <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
            <span style={{ fontSize: "11px", color: "#BDD6F4" }}><strong style={{ color: "#F8F8F8" }}>{ME.frs}</strong> followers</span>
            <span style={{ fontSize: "11px", color: "#BDD6F4" }}><strong style={{ color: "#F8F8F8" }}>{ME.fng}</strong> following</span>
          </div>
        </div>
        <button style={{ padding: "7px", borderRadius: "8px", background: "#0a2240", border: "1px solid rgba(90,152,227,0.12)", cursor: "pointer", color: "#BDD6F4" }}><Settings size={16} /></button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "16px" }}>
        {[[ME.walks, "Walks", "#E85D3A"], [`${ME.dist}km`, "Distance", "#5A98E3"], [`${(ME.elev / 1000).toFixed(1)}km`, "Elevation", "#6BCB77"]].map(([v, l, c]) => <div key={l} style={{ background: "#0a2240", borderRadius: "12px", padding: "14px", textAlign: "center", border: "1px solid rgba(90,152,227,0.1)" }}><div style={{ fontSize: "20px", fontWeight: 800, color: c, fontFamily: "'JetBrains Mono'" }}>{v}</div><div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.5, marginTop: "3px" }}>{l}</div></div>)}
      </div>

      <div style={{ display: "flex", gap: "3px", marginBottom: "14px", background: "#0a2240", borderRadius: "12px", padding: "3px" }}>
        {[["lists", "Lists"], ["badges", "Badges"], ["leaderboard", "Rankings"], ["posts", "Posts"]].map(([k, l]) => <button key={k} onClick={() => setSec(k)} style={{ flex: 1, padding: "8px", borderRadius: "10px", border: "none", background: sec === k ? "rgba(90,152,227,0.2)" : "transparent", color: sec === k ? "#5A98E3" : "#BDD6F4", fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'", opacity: sec === k ? 1 : 0.5 }}>{l}</button>)}
      </div>

      {sec === "lists" && <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {lists.map((l, i) => { const pct = Math.round((l.d / l.t) * 100); return (
          <div key={l.k} style={{ background: "#0a2240", borderRadius: "12px", padding: "14px", border: "1px solid rgba(90,152,227,0.1)", animation: `fi .3s ease ${i * .05}s both` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><div style={{ width: "10px", height: "10px", borderRadius: "50%", background: l.c.color }} /><span style={{ fontSize: "14px", fontWeight: 700, color: "#F8F8F8" }}>{l.c.name}</span><span style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.5 }}>{l.c.desc}</span></div>
              <span style={{ fontSize: "13px", fontWeight: 700, color: l.c.color }}>{pct}%</span>
            </div>
            <div style={{ height: "6px", borderRadius: "6px", background: "#264f80" }}><div style={{ width: `${pct}%`, height: "100%", borderRadius: "6px", background: `linear-gradient(90deg,${l.c.color},${l.c.color}88)` }} /></div>
            <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.5, marginTop: "5px" }}>{l.d} of {l.t} \u00B7 {l.t - l.d} remaining</div>
          </div>
        ); })}
      </div>}

      {sec === "badges" && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        {BADGES.map((b, i) => <div key={i} style={{ background: b.e ? "rgba(107,203,119,0.05)" : "#0a2240", borderRadius: "12px", padding: "14px", textAlign: "center", border: `1px solid ${b.e ? "rgba(107,203,119,0.12)" : "rgba(90,152,227,0.1)"}`, opacity: b.e ? 1 : .75, animation: `fi .3s ease ${i * .04}s both` }}>
          <div style={{ fontSize: "30px", marginBottom: "4px" }}>{b.i}</div>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#F8F8F8" }}>{b.n}</div>
          {b.e ? <div style={{ fontSize: "9px", color: "#6BCB77", fontWeight: 600, marginTop: "6px" }}><CheckCircle size={10} style={{ verticalAlign: "middle" }} /> Earned</div>
          : <div style={{ marginTop: "8px" }}><div style={{ height: "3px", borderRadius: "3px", background: "#264f80" }}><div style={{ width: `${b.p}%`, height: "100%", borderRadius: "3px", background: "#5A98E3" }} /></div><div style={{ fontSize: "9px", color: "#BDD6F4", opacity: 0.5, marginTop: "3px" }}>{b.p}%</div></div>}
        </div>)}
      </div>}

      {sec === "leaderboard" && <div>
        <div style={{ display: "flex", gap: "4px", marginBottom: "10px" }}>
          {[["m", "Munros"], ["d", "Distance"], ["e", "Elevation"]].map(([k, l]) => <button key={k} onClick={() => setLbm(k)} style={{ padding: "6px 14px", borderRadius: "10px", fontSize: "10px", cursor: "pointer", background: lbm === k ? "rgba(90,152,227,0.2)" : "#0a2240", border: `1px solid ${lbm === k ? "rgba(90,152,227,0.3)" : "rgba(90,152,227,0.1)"}`, color: lbm === k ? "#5A98E3" : "#BDD6F4", fontWeight: 700, fontFamily: "'DM Sans'" }}>{l}</button>)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {[...LB].sort((a, b) => b[lbm] - a[lbm]).map((u, i) => <div key={u.n} style={{ background: u.u ? "rgba(90,152,227,0.08)" : "#0a2240", borderRadius: "10px", padding: "10px 12px", border: `1px solid ${u.u ? "rgba(90,152,227,0.2)" : "rgba(90,152,227,0.08)"}`, display: "flex", alignItems: "center", gap: "10px", animation: `fi .3s ease ${i * .04}s both` }}>
            <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: i < 3 ? `${["#FFD700","#C0C0C0","#CD7F32"][i]}15` : "#264f80", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 800, color: i < 3 ? ["#FFD700","#C0C0C0","#CD7F32"][i] : "#BDD6F4" }}>{i + 1}</div>
            <span style={{ fontSize: "16px" }}>{u.av}</span>
            <div style={{ flex: 1 }}><div style={{ fontSize: "12px", fontWeight: 700, color: u.u ? "#5A98E3" : "#F8F8F8" }}>{u.n}</div></div>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'JetBrains Mono'" }}>{lbm === "d" ? `${u[lbm]}km` : lbm === "e" ? `${(u[lbm] / 1000).toFixed(1)}km` : u[lbm]}</div>
          </div>)}
        </div>
      </div>}

      {sec === "posts" && <div style={{ textAlign: "center", padding: "50px 20px" }}>
        <Camera size={36} color="#BDD6F4" style={{ opacity: 0.3, marginBottom: "14px" }} />
        <div style={{ fontSize: "15px", fontWeight: 700, color: "#F8F8F8" }}>Your Posts</div>
        <div style={{ fontSize: "12px", color: "#BDD6F4", opacity: 0.5, marginTop: "6px" }}>Share summit photos, route reviews, and walk reports with the community</div>
      </div>}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════════════ */
export default function TrailSync() {
  const [tab, setTab] = useState("home");
  const tabs = [
    { id: "home", icon: Home, label: "Home" },
    { id: "routes", icon: Route, label: "Routes" },
    { id: "map", icon: Map, label: "Map" },
    { id: "learn", icon: BookOpen, label: "Learn" },
    { id: "profile", icon: UserCircle, label: "Profile" },
  ];

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", background: "#041e3d", color: "#F8F8F8", fontFamily: "'DM Sans',system-ui,sans-serif", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800&family=Playfair+Display:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(90,152,227,.15); border-radius: 4px; }
        select option { background: #0a2240; color: #F8F8F8; }
        @keyframes fi { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes su { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fl { 0%,100% { transform: translate(-50%,-50%) scale(1); } 50% { transform: translate(-50%,-50%) scale(1.04); } }
        @keyframes glow { 0%,100% { box-shadow: 0 0 8px rgba(232,93,58,.25); } 50% { box-shadow: 0 0 18px rgba(232,93,58,.45); } }
      `}</style>

      {/* Header */}
      {tab !== "map" && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: "1px solid rgba(90,152,227,0.1)", background: "rgba(4,30,61,.92)", backdropFilter: "blur(12px)", zIndex: 30 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "linear-gradient(135deg,#E85D3A,#F49D37)", display: "flex", alignItems: "center", justifyContent: "center", animation: "glow 3s ease infinite" }}>
              <Mountain size={17} color="#F8F8F8" />
            </div>
            <div style={{ fontSize: "16px", fontWeight: 800, color: "#F8F8F8", letterSpacing: "-.3px" }}>TrailSync</div>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button style={{ position: "relative", background: "#0a2240", border: "1px solid rgba(90,152,227,0.12)", borderRadius: "8px", padding: "6px", color: "#BDD6F4", cursor: "pointer" }}>
              <Bell size={16} />
              <div style={{ position: "absolute", top: 1, right: 1, width: "7px", height: "7px", borderRadius: "50%", background: "#E85D3A", border: "1px solid #041e3d" }} />
            </button>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg,#264f80,#5A98E3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "#F8F8F8", border: "2px solid rgba(90,152,227,0.25)" }}>A</div>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {tab === "home" && <HomePage />}
        {tab === "routes" && <RoutesPage />}
        {tab === "map" && <MapPage goHome={() => setTab("home")} />}
        {tab === "learn" && <LearnPage />}
        {tab === "profile" && <ProfilePage />}
      </div>

      {/* Bottom nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", padding: "4px 6px 10px", borderTop: "1px solid rgba(90,152,227,0.1)", background: "rgba(4,30,61,.96)", backdropFilter: "blur(12px)", zIndex: 30 }}>
        {tabs.map((t, i) => {
          const I = t.icon; const a = tab === t.id; const ctr = i === 2;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ background: "none", border: "none", padding: ctr ? "0" : "4px 10px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", color: a ? (ctr ? "#F8F8F8" : "#E85D3A") : "#BDD6F4", transition: "color .2s", opacity: a ? 1 : 0.45 }}>
              {ctr ? (
                <div style={{ width: "46px", height: "46px", borderRadius: "50%", background: a ? "linear-gradient(135deg,#E85D3A,#d04a2a)" : "#264f80", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "-12px", border: `2px solid ${a ? "#E85D3A" : "rgba(90,152,227,0.2)"}`, boxShadow: a ? "0 4px 16px rgba(232,93,58,.35)" : "none", transition: "all .2s" }}>
                  <I size={20} color="#F8F8F8" />
                </div>
              ) : (
                <div style={{ padding: "3px", borderRadius: "8px", background: a ? "rgba(232,93,58,.1)" : "transparent" }}><I size={18} /></div>
              )}
              <span style={{ fontSize: "9px", fontWeight: a ? 700 : 500 }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
