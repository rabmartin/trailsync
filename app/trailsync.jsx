"use client";
import { useState, useEffect, useMemo } from "react";
import {
  MapPin, Mountain, Cloud, Users, Trophy, Search, X, ChevronDown, ChevronRight,
  Star, Wind, Droplets, Eye, Thermometer, Navigation, Calendar, Clock,
  Heart, MessageCircle, Share2, Layers, AlertTriangle, Award,
  TrendingUp, Compass, CloudSnow, CheckCircle, Globe,
  BookOpen, Bell, User, Play, Pause, Route,
  Home, Map, UserCircle, ArrowRight, Camera,
  CloudRain, Sun, CloudSun, Snowflake, Settings, List, ArrowUpDown, Check, CircleDot,
  Shield, Mail, Apple, Sparkles
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
  { id: 1, name: "Ben Nevis", cls: "munros", ht: 1345, reg: "Ben Nevis & Mamores", lat: 56.797, lng: -5.004, w: { t: -3, f: -14, wi: 45, p: 2.5, v: "poor", sn: true }, done: true, date: "12 Oct 2025", log: "CMD Arete in perfect conditions. Incredible ridge walk." },
  { id: 2, name: "Ben Macdui", cls: "munros", ht: 1309, reg: "Cairngorms", lat: 57.070, lng: -3.669, w: { t: -5, f: -16, wi: 55, p: 3.0, v: "poor", sn: true }, done: true, date: "15 Feb 2026", log: "Full whiteout on the plateau. Navigation was everything." },
  { id: 3, name: "Braeriach", cls: "munros", ht: 1296, reg: "Cairngorms", lat: 57.078, lng: -3.729, w: { t: -4, f: -15, wi: 50, p: 2.8, v: "poor", sn: true }, done: false },
  { id: 4, name: "Buachaille Etive Mor", cls: "munros", ht: 1022, reg: "Glen Coe", lat: 56.652, lng: -4.954, w: { t: -1, f: -8, wi: 30, p: 1.2, v: "moderate", sn: true }, done: true, date: "2 Feb 2026", log: "Coire na Tulaich was icy but manageable. Views from the top were class." },
  { id: 5, name: "Liathach", cls: "munros", ht: 1055, reg: "Torridon", lat: 57.581, lng: -5.468, w: { t: 0, f: -6, wi: 25, p: 1.5, v: "moderate", sn: true }, done: false },
  { id: 6, name: "An Teallach", cls: "munros", ht: 1062, reg: "Fisherfield", lat: 57.806, lng: -5.238, w: { t: 1, f: -4, wi: 22, p: 0.8, v: "good", sn: false }, done: false },
  { id: 7, name: "Ben Lomond", cls: "munros", ht: 974, reg: "Southern Highlands", lat: 56.190, lng: -4.632, w: { t: 4, f: -1, wi: 12, p: 0, v: "good", sn: false }, done: true, date: "8 Mar 2025", log: "First Munro! Ptarmigan ridge route. Buzzing." },
  { id: 8, name: "Schiehallion", cls: "munros", ht: 1083, reg: "Southern Highlands", lat: 56.666, lng: -4.098, w: { t: 3, f: -2, wi: 14, p: 0, v: "good", sn: false }, done: true, date: "22 Apr 2025", log: "Boggy start but the ridge is brilliant." },
  { id: 9, name: "The Cobbler", cls: "corbetts", ht: 884, reg: "Arrochar Alps", lat: 56.219, lng: -4.819, w: { t: 3, f: -2, wi: 15, p: 0, v: "good", sn: false }, done: true, date: "14 Jun 2025", log: "Threading the needle on the summit. Class scramble." },
  { id: 10, name: "Scafell Pike", cls: "hewitts", ht: 978, reg: "Lake District", lat: 54.454, lng: -3.212, w: { t: 3, f: -1, wi: 22, p: 0.5, v: "moderate", sn: false }, done: true, date: "18 Jan 2026", log: "Corridor Route. Rocky and relentless but worth it." },
  { id: 11, name: "Helvellyn", cls: "wainwrights", ht: 950, reg: "Lake District", lat: 54.527, lng: -3.016, w: { t: 2, f: -3, wi: 28, p: 0.8, v: "moderate", sn: false }, done: true, date: "18 Jan 2026", log: "Striding Edge in winter. Crampons essential. Unreal experience." },
  { id: 12, name: "Snowdon", cls: "hewitts", ht: 1085, reg: "Snowdonia", lat: 53.068, lng: -4.076, w: { t: 4, f: 0, wi: 20, p: 0.2, v: "good", sn: false }, done: true, date: "5 Jan 2026", log: "Horseshoe route. Crib Goch was exposed but incredible." },
  { id: 13, name: "Pen y Fan", cls: "hewitts", ht: 886, reg: "Brecon Beacons", lat: 51.884, lng: -3.436, w: { t: 7, f: 4, wi: 14, p: 0.1, v: "good", sn: false }, done: false },
  { id: 14, name: "Merrick", cls: "donalds", ht: 843, reg: "Galloway Hills", lat: 55.146, lng: -4.615, w: { t: 5, f: 1, wi: 16, p: 0.3, v: "good", sn: false }, done: false },
  { id: 15, name: "Sgurr nan Gillean", cls: "munros", ht: 964, reg: "Skye Cuillin", lat: 57.254, lng: -6.196, w: { t: 1, f: -5, wi: 30, p: 1.0, v: "moderate", sn: false }, done: false },
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

const DISCOVER = [
  { id: 1, title: "The Lost Observatory of Ben Nevis", cat: "History", region: "Ben Nevis & Mamores", peak: "Ben Nevis", lat: 56.797, lng: -5.004, author: "Rachel M.", excerpt: "For twenty years, a team of scientists lived and worked at the summit of Britain's highest mountain, recording weather data that changed our understanding of Atlantic storms forever.", read: "8 min", icon: "🏛️" },
  { id: 2, title: "The Massacre of Glen Coe", cat: "History", region: "Glen Coe", peak: "Bidean nam Bian", lat: 56.652, lng: -5.1, author: "Rachel M.", excerpt: "On a frozen February morning in 1692, soldiers turned on the families who had sheltered them. The glen still carries the weight of that betrayal.", read: "10 min", icon: "⚔️" },
  { id: 3, title: "Torridon: Walking on the Oldest Rock in the World", cat: "Geology", region: "Torridon", peak: "Liathach", lat: 57.581, lng: -5.468, author: "Laura K.", excerpt: "The sandstone beneath your boots on Liathach is three billion years old. Before complex life, before oxygen, this rock was already ancient.", read: "6 min", icon: "🪨" },
  { id: 4, title: "The Grey Man of Ben Macdui", cat: "Folklore", region: "Cairngorms", peak: "Ben Macdui", lat: 57.070, lng: -3.669, author: "Rachel M.", excerpt: "Experienced mountaineers have reported footsteps behind them, a towering shadow in the mist, and an overwhelming urge to flee from the summit plateau.", read: "7 min", icon: "👻" },
  { id: 5, title: "Eagles Above Kintail", cat: "Wildlife", region: "Kintail & Affric", peak: "The Five Sisters", lat: 57.22, lng: -5.35, author: "Laura K.", excerpt: "The golden eagles that soar above the Five Sisters have hunted these ridges for thousands of years. Here's how to spot them without disturbing them.", read: "5 min", icon: "🦅" },
  { id: 6, title: "The Fairy Pools of Skye", cat: "Folklore", region: "Skye Cuillin", peak: "Sgurr nan Gillean", lat: 57.254, lng: -6.196, author: "Rachel M.", excerpt: "Crystal clear pools at the foot of the Black Cuillin, where legend says the fairy folk would bathe. The water is still ice cold, and the magic hasn't faded.", read: "5 min", icon: "🧚" },
  { id: 7, title: "How Striding Edge Was Formed", cat: "Geology", region: "Lake District", peak: "Helvellyn", lat: 54.527, lng: -3.016, author: "Laura K.", excerpt: "Two glaciers carved the mountain from both sides, leaving behind a knife-edge ridge that draws thousands of walkers each year.", read: "6 min", icon: "🧊" },
  { id: 8, title: "The Drovers' Roads of Galloway", cat: "History", region: "Galloway Hills", peak: "Merrick", lat: 55.146, lng: -4.615, author: "Rachel M.", excerpt: "Long before tarmac, cattle were driven through these hills on ancient paths. Some of our best walking routes follow their footsteps.", read: "7 min", icon: "🐄" },
  { id: 9, title: "Snowdon's Mining Heritage", cat: "History", region: "Snowdonia", peak: "Snowdon", lat: 53.068, lng: -4.076, author: "Laura K.", excerpt: "Copper mines once riddled the slopes of Snowdon. The ruins still stand as a reminder of the communities that lived and worked in these mountains.", read: "8 min", icon: "⛏️" },
  { id: 10, title: "Mountain Hares of the Cairngorms", cat: "Wildlife", region: "Cairngorms", peak: "Cairn Gorm", lat: 57.1, lng: -3.6, author: "Laura K.", excerpt: "They turn white in winter and blue-grey in summer. Spotting a mountain hare on the Cairngorm plateau is one of Scotland's great wildlife experiences.", read: "4 min", icon: "🐇" },
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
   PRIVACY POPUP
   ═══════════════════════════════════════════════════════════════════ */
const PrivacyPopup = ({ onClose }) => (
  <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(4,30,61,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={onClose}>
    <div onClick={e => e.stopPropagation()} style={{ background: "#0a2240", borderRadius: "18px", border: "1px solid rgba(90,152,227,0.2)", maxWidth: "400px", width: "100%", maxHeight: "80vh", overflow: "auto", animation: "su .3s ease" }}>
      <div style={{ padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(90,152,227,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Shield size={16} color="#5A98E3" />
          <span style={{ fontSize: "15px", fontWeight: 700, color: "#F8F8F8" }}>Your Data & Privacy</span>
        </div>
        <button onClick={onClose} style={{ background: "#264f80", border: "none", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", color: "#BDD6F4", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={14} /></button>
      </div>
      <div style={{ padding: "18px", fontSize: "12px", color: "#BDD6F4", lineHeight: 1.7 }}>
        <div style={{ fontWeight: 700, color: "#F8F8F8", fontSize: "13px", marginBottom: "8px" }}>What we collect</div>
        <div style={{ marginBottom: "14px" }}>
          We collect your name, email address, date of birth, and optionally your location. Your date of birth is used to enable age-range filtering on community walks and to ensure age-appropriate features. Your location, if provided, helps us personalise weather recommendations for areas near you.
        </div>
        <div style={{ fontWeight: 700, color: "#F8F8F8", fontSize: "13px", marginBottom: "8px" }}>How we store it</div>
        <div style={{ marginBottom: "14px" }}>
          Your data is stored securely on encrypted servers hosted by Supabase (EU region). We never sell your data to third parties. Your password is hashed and cannot be read by anyone, including us. Walk data and summit logs are linked to your account and are only visible to you unless you choose to share them.
        </div>
        <div style={{ fontWeight: 700, color: "#F8F8F8", fontSize: "13px", marginBottom: "8px" }}>How we use it</div>
        <div style={{ marginBottom: "14px" }}>
          Your data is used solely to provide and improve the TrailSync experience — personalised weather, peak tracking, community features, and your profile. We may use anonymised, aggregated data to understand how people use the app.
        </div>
        <div style={{ fontWeight: 700, color: "#F8F8F8", fontSize: "13px", marginBottom: "8px" }}>Requesting deletion</div>
        <div style={{ marginBottom: "6px" }}>
          You can request full deletion of your account and all associated data at any time by emailing <span style={{ color: "#5A98E3", fontWeight: 600 }}>privacy@trailsync.app</span> or through the Settings page in your profile. We will delete all your data within 30 days of your request, in compliance with UK GDPR.
        </div>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   AUTH: LOGIN SCREEN
   ═══════════════════════════════════════════════════════════════════ */
const LoginScreen = ({ onLogin, onGoSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", background: "#041e3d", minHeight: "100vh" }}>
      {/* Logo */}
      <div style={{ marginBottom: "32px", textAlign: "center", animation: "fi .5s ease" }}>
        <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: "linear-gradient(135deg,#E85D3A,#F49D37)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", animation: "glow 3s ease infinite" }}>
          <Mountain size={28} color="#F8F8F8" />
        </div>
        <div style={{ fontSize: "28px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'Playfair Display',serif" }}>TrailSync</div>
        <div style={{ fontSize: "13px", color: "#BDD6F4", opacity: 0.6, marginTop: "4px" }}>Summit · Track · Connect</div>
      </div>

      <div style={{ width: "100%", maxWidth: "360px", animation: "su .4s ease .1s both" }}>
        {/* Social sign-in buttons */}
        <button onClick={onLogin} style={{ width: "100%", padding: "13px", borderRadius: "12px", border: "1px solid rgba(90,152,227,0.15)", background: "#0a2240", color: "#F8F8F8", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontFamily: "'DM Sans'", marginBottom: "10px" }}>
          <Mail size={16} /> Sign in with email
        </button>
        <button onClick={onLogin} style={{ width: "100%", padding: "13px", borderRadius: "12px", border: "1px solid rgba(90,152,227,0.15)", background: "#0a2240", color: "#F8F8F8", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontFamily: "'DM Sans'", marginBottom: "10px" }}>
          <Apple size={16} /> Sign in with Apple
        </button>
        <button onClick={onLogin} style={{ width: "100%", padding: "13px", borderRadius: "12px", border: "1px solid rgba(90,152,227,0.15)", background: "#0a2240", color: "#F8F8F8", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontFamily: "'DM Sans'", marginBottom: "10px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Sign in with Google
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(90,152,227,0.12)" }} />
          <span style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.4 }}>or sign in with email</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(90,152,227,0.12)" }} />
        </div>

        {/* Email/password fields */}
        <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(90,152,227,0.2)", background: "#0a2240", color: "#F8F8F8", fontSize: "13px", outline: "none", fontFamily: "'DM Sans'", marginBottom: "10px" }} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(90,152,227,0.2)", background: "#0a2240", color: "#F8F8F8", fontSize: "13px", outline: "none", fontFamily: "'DM Sans'", marginBottom: "16px" }} />

        <button onClick={onLogin} style={{ width: "100%", padding: "13px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#E85D3A,#d04a2a)", color: "#F8F8F8", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'" }}>
          Sign In
        </button>

        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#BDD6F4", opacity: 0.6 }}>
          Don't have an account? <span onClick={onGoSignup} style={{ color: "#5A98E3", fontWeight: 700, cursor: "pointer", opacity: 1 }}>Sign up here</span>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   AUTH: SIGNUP SCREEN
   ═══════════════════════════════════════════════════════════════════ */
const SignupScreen = ({ onSignup, onGoLogin }) => {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [showPrivacy, setShowPrivacy] = useState(false);

  const isValid = name && dob && email && password;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", background: "#041e3d", minHeight: "100vh" }}>
      {showPrivacy && <PrivacyPopup onClose={() => setShowPrivacy(false)} />}

      {/* Logo */}
      <div style={{ marginBottom: "24px", textAlign: "center", animation: "fi .5s ease" }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "linear-gradient(135deg,#E85D3A,#F49D37)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", animation: "glow 3s ease infinite" }}>
          <Mountain size={24} color="#F8F8F8" />
        </div>
        <div style={{ fontSize: "22px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'Playfair Display',serif" }}>Create your account</div>
        <div style={{ fontSize: "12px", color: "#BDD6F4", opacity: 0.6, marginTop: "4px" }}>Join the TrailSync community</div>
      </div>

      <div style={{ width: "100%", maxWidth: "360px", animation: "su .4s ease .1s both" }}>
        {/* Name */}
        <div style={{ marginBottom: "10px" }}>
          <label style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.6, fontWeight: 600, display: "block", marginBottom: "4px" }}>Full name</label>
          <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(90,152,227,0.2)", background: "#0a2240", color: "#F8F8F8", fontSize: "13px", outline: "none", fontFamily: "'DM Sans'" }} />
        </div>

        {/* Date of birth */}
        <div style={{ marginBottom: "10px" }}>
          <label style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.6, fontWeight: 600, display: "block", marginBottom: "4px" }}>Date of birth</label>
          <input type="date" value={dob} onChange={e => setDob(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(90,152,227,0.2)", background: "#0a2240", color: "#F8F8F8", fontSize: "13px", outline: "none", fontFamily: "'DM Sans'" }} />
        </div>

        {/* Email */}
        <div style={{ marginBottom: "10px" }}>
          <label style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.6, fontWeight: 600, display: "block", marginBottom: "4px" }}>Email address</label>
          <input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(90,152,227,0.2)", background: "#0a2240", color: "#F8F8F8", fontSize: "13px", outline: "none", fontFamily: "'DM Sans'" }} />
        </div>

        {/* Password */}
        <div style={{ marginBottom: "10px" }}>
          <label style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.6, fontWeight: 600, display: "block", marginBottom: "4px" }}>Password</label>
          <input type="password" placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(90,152,227,0.2)", background: "#0a2240", color: "#F8F8F8", fontSize: "13px", outline: "none", fontFamily: "'DM Sans'" }} />
        </div>

        {/* Location */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.6, fontWeight: 600, display: "block", marginBottom: "4px" }}>Location</label>
          <input type="text" placeholder="(Optional)" value={location} onChange={e => setLocation(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(90,152,227,0.2)", background: "#0a2240", color: location ? "#F8F8F8" : "#BDD6F4", fontSize: "13px", outline: "none", fontFamily: "'DM Sans'" }} />
        </div>

        <button onClick={() => { if (isValid) onSignup(name); }} style={{ width: "100%", padding: "13px", borderRadius: "12px", border: "none", background: isValid ? "linear-gradient(135deg,#E85D3A,#d04a2a)" : "#264f80", color: isValid ? "#F8F8F8" : "#BDD6F4", fontSize: "14px", fontWeight: 700, cursor: isValid ? "pointer" : "default", fontFamily: "'DM Sans'", opacity: isValid ? 1 : 0.5, transition: "all .2s" }}>
          Create Account
        </button>

        {/* Privacy link */}
        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <span onClick={() => setShowPrivacy(true)} style={{ fontSize: "11px", color: "#5A98E3", cursor: "pointer", fontWeight: 600 }}>
            <Shield size={10} style={{ verticalAlign: "middle", marginRight: "4px" }} />
            How we collect, store, and protect your data
          </span>
        </div>

        <div style={{ textAlign: "center", marginTop: "14px", fontSize: "13px", color: "#BDD6F4", opacity: 0.6 }}>
          Already have an account? <span onClick={onGoLogin} style={{ color: "#5A98E3", fontWeight: 700, cursor: "pointer", opacity: 1 }}>Sign in</span>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   TAB 1: HOME
   ═══════════════════════════════════════════════════════════════════ */
const HomePage = ({ userName }) => {
  const [wxOpen, setWxOpen] = useState(true);
  const [ff, setFf] = useState("all");
  const [expandedArea, setExpandedArea] = useState(null);
  const [showSAIS, setShowSAIS] = useState(false);
  const sorted = [...WX_AREAS].sort((a, b) => b.score - a.score);

  return (
    <div style={{ padding: "0 16px 16px", overflowY: "auto", flex: 1 }}>
      {/* Greeting */}
      <div style={{ padding: "24px 0 14px", animation: "fi .5s ease" }}>
        <div style={{ fontSize: "17px", color: "#BDD6F4", fontWeight: 400 }}>{greet()}, <span style={{ fontWeight: 800, color: "#F8F8F8" }}>{userName}</span></div>
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
              <span>Ranked: wind 30% · feels-like 25% · precipitation 25% · vis 20%</span>
              <span>12 min ago</span>
            </div>
            {sorted.map((a, i) => {
              const isExpanded = expandedArea === i;
              const regionPeaks = PEAKS.filter(p => {
                const rLower = a.region.toLowerCase();
                const pLower = p.reg.toLowerCase();
                return pLower.includes(rLower) || rLower.includes(pLower.split(" ")[0]);
              });
              // If no exact match, show peaks matching the classification for that area
              const displayPeaks = regionPeaks.length > 0 ? regionPeaks : PEAKS.filter(p => p.cls === a.cls).slice(0, 4);

              return (
                <div key={i}>
                  <div onClick={() => setExpandedArea(isExpanded ? null : i)} style={{
                    padding: "12px 14px", display: "flex", alignItems: "center", gap: "12px",
                    borderTop: "1px solid rgba(90,152,227,0.1)", cursor: "pointer",
                    background: isExpanded ? "rgba(90,152,227,0.06)" : i === 0 ? "rgba(107,203,119,0.04)" : "transparent",
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
                        {a.peaks.join(" · ")}
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
                      <ChevronRight size={14} color="#BDD6F4" style={{ opacity: 0.4, transform: isExpanded ? "rotate(90deg)" : "none", transition: ".2s", flexShrink: 0 }} />
                    </div>
                  </div>

                  {/* Expanded region detail */}
                  {isExpanded && (
                    <div style={{ padding: "0 14px 14px", background: "rgba(90,152,227,0.04)", borderTop: "1px solid rgba(90,152,227,0.06)", animation: "fi .2s ease" }}>
                      <div style={{ padding: "10px 0 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: "#BDD6F4", opacity: 0.7 }}>Best mountains in {a.region}</div>
                        <div style={{ display: "flex", gap: "8px", fontSize: "10px", color: "#BDD6F4", opacity: 0.5 }}>
                          <span>Temp: {a.temp}°</span>
                          <span>Precip: {a.precip}mm</span>
                          <span>Vis: {a.vis}</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        {displayPeaks.map((pk, j) => (
                          <div key={pk.id} style={{
                            display: "flex", alignItems: "center", gap: "10px",
                            padding: "9px 10px", borderRadius: "10px",
                            background: "#041e3d", border: "1px solid rgba(90,152,227,0.08)",
                            animation: `fi .2s ease ${j * .05}s both`
                          }}>
                            <Mountain size={14} color={CLS[pk.cls]?.color} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: "12px", fontWeight: 700, color: "#F8F8F8" }}>{pk.name}</div>
                              <div style={{ fontSize: "9px", color: "#BDD6F4", opacity: 0.5 }}>{pk.ht}m · {pk.reg}</div>
                            </div>
                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                              <div style={{ textAlign: "center" }}>
                                <div style={{ fontSize: "11px", fontWeight: 700, color: pk.w.f < -5 ? "#BDD6F4" : "#F8F8F8" }}>{pk.w.f}°</div>
                                <div style={{ fontSize: "7px", color: "#BDD6F4", opacity: 0.4 }}>feels</div>
                              </div>
                              <div style={{ textAlign: "center" }}>
                                <div style={{ fontSize: "11px", fontWeight: 700, color: pk.w.wi > 35 ? "#E85D3A" : "#F8F8F8" }}>{pk.w.wi}<span style={{ fontSize: "8px" }}>mph</span></div>
                                <div style={{ fontSize: "7px", color: "#BDD6F4", opacity: 0.4 }}>wind</div>
                              </div>
                              {pk.w.sn && <Snowflake size={12} color="#BDD6F4" />}
                            </div>
                          </div>
                        ))}
                      </div>
                      {a.peaks.length > displayPeaks.length && (
                        <div style={{ fontSize: "10px", color: "#5A98E3", textAlign: "center", marginTop: "8px", fontWeight: 600, cursor: "pointer" }}>
                          + {a.peaks.length - displayPeaks.length} more peaks in this area
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SAIS Alert - only shows Dec-Apr when forecasts are active */}
      {(() => {
        const month = new Date().getMonth(); // 0-indexed
        const isSAISSeason = month >= 11 || month <= 3; // Dec-Apr
        if (!isSAISSeason) return null;
        return (
          <div style={{ marginBottom: "16px", animation: "su .4s ease .2s both" }}>
            <div onClick={() => setShowSAIS(!showSAIS)} style={{ padding: "10px 14px", borderRadius: showSAIS ? "12px 12px 0 0" : "12px", background: "rgba(232,93,58,0.08)", border: "1px solid rgba(232,93,58,0.2)", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", transition: "border-radius .2s" }}>
              <AlertTriangle size={16} color="#E85D3A" />
              <div style={{ flex: 1, fontSize: "11px", color: "#BDD6F4" }}><span style={{ fontWeight: 700, color: "#E85D3A" }}>SAIS Alert:</span> Considerable (3) hazard – Northern Cairngorms & Lochaber</div>
              <ChevronDown size={14} color="#BDD6F4" style={{ opacity: 0.5, transform: showSAIS ? "rotate(180deg)" : "none", transition: ".2s" }} />
            </div>
            {showSAIS && (
              <div style={{ padding: "12px 14px", background: "rgba(232,93,58,0.04)", borderRadius: "0 0 12px 12px", border: "1px solid rgba(232,93,58,0.15)", borderTop: "none", animation: "fi .2s ease" }}>
                <div style={{ fontSize: "11px", color: "#BDD6F4", lineHeight: 1.5, marginBottom: "12px" }}>
                  Unstable windslab on N-NE aspects above 900m across Northern Cairngorms and Lochaber. Cornices building on lee slopes. Avoid steep terrain in affected areas.
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <a href="https://www.sais.gov.uk" target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: "9px", borderRadius: "9px", background: "rgba(232,93,58,0.12)", border: "1px solid rgba(232,93,58,0.25)", color: "#E85D3A", fontSize: "11px", fontWeight: 700, cursor: "pointer", textAlign: "center", textDecoration: "none", fontFamily: "'DM Sans'" }}>
                    View on SAIS ↗
                  </a>
                  <a href="https://apps.apple.com/gb/app/be-avalanche-aware/id1477589689" target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: "9px", borderRadius: "9px", background: "#0a2240", border: "1px solid rgba(90,152,227,0.15)", color: "#BDD6F4", fontSize: "11px", fontWeight: 600, cursor: "pointer", textAlign: "center", textDecoration: "none", fontFamily: "'DM Sans'" }}>
                    Get SAIS App
                  </a>
                </div>
              </div>
            )}
          </div>
        );
      })()}

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
                <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.5, marginTop: "3px" }}>{r.reg} · Start: {r.start}</div>
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
              <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "8px", background: "rgba(90,152,227,0.1)", color: "#5A98E3", fontWeight: 600 }}>✓ Verified</span>
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
              <span style={{ color: h.st === "summit" ? "#6BCB77" : h.st === "ascending" ? "#5A98E3" : "#F49D37" }}>{h.st === "summit" ? "⛰️" : h.st === "ascending" ? "↗" : "↘"}</span>
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
              <div><div style={{ fontSize: "17px", fontWeight: 800, color: "#F8F8F8" }}>{sp.name}</div><div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.6, marginTop: "2px" }}>{sp.ht}m · {sp.reg}</div></div>
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
              {[`📅 ${sw.date}`, `🕐 ${sw.time}`, sw.type === "Female only" ? "♀️ Female only" : "👥 Mixed", sw.diff, `🎂 ${sw.age}`].map((l, i) => <span key={i} style={{ fontSize: "10px", padding: "3px 8px", borderRadius: "8px", background: l === sw.diff ? `${dc(sw.diff)}15` : "#0a2240", color: l === sw.diff ? dc(sw.diff) : "#BDD6F4", fontWeight: 500 }}>{l}</span>)}
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
  const [subTab, setSubTab] = useState("learn");
  const [discView, setDiscView] = useState("list");
  const [discCat, setDiscCat] = useState(null);
  const [selArticle, setSelArticle] = useState(null);

  const filteredArticles = DISCOVER.filter(a => !discCat || a.cat === discCat);
  const categories = [...new Set(DISCOVER.map(a => a.cat))];

  return (
    <div style={{ padding: "0 16px 16px", overflowY: "auto", flex: 1 }}>
      {/* Header with sub-tabs */}
      <div style={{ padding: "24px 0 12px", display: "flex", alignItems: "baseline", gap: "16px" }}>
        <div onClick={() => setSubTab("learn")} style={{ fontSize: "24px", fontWeight: 800, color: subTab === "learn" ? "#F8F8F8" : "#BDD6F4", fontFamily: "'Playfair Display',serif", cursor: "pointer", opacity: subTab === "learn" ? 1 : 0.4, transition: "all .2s" }}>Learn</div>
        <div onClick={() => setSubTab("discover")} style={{ fontSize: "24px", fontWeight: 800, color: subTab === "discover" ? "#F8F8F8" : "#BDD6F4", fontFamily: "'Playfair Display',serif", cursor: "pointer", opacity: subTab === "discover" ? 1 : 0.4, transition: "all .2s", display: "flex", alignItems: "center", gap: "8px" }}>
          Discover
          <Sparkles size={16} color={subTab === "discover" ? "#E85D3A" : "#BDD6F4"} style={{ opacity: subTab === "discover" ? 1 : 0.4 }} />
        </div>
      </div>

      {/* ═══ LEARN SUB-TAB ═══ */}
      {subTab === "learn" && (
        <div>
          <div style={{ fontSize: "13px", color: "#BDD6F4", opacity: 0.6, marginBottom: "14px" }}>Build your skills, stay safe on the hill</div>
          <div style={{ padding: "14px", marginBottom: "16px", borderRadius: "14px", background: "linear-gradient(135deg,rgba(90,152,227,0.12),rgba(107,203,119,0.06))", border: "1px solid rgba(90,152,227,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div style={{ fontSize: "13px", fontWeight: 700, color: "#F8F8F8" }}>Your Progress</div><div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.6, marginTop: "2px" }}>3 of {MODULES.length} started · 1 completed</div></div>
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
                    <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.5, marginTop: "2px" }}>{m.lvl} · {m.les} lessons · {m.time}</div>
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
      )}

      {/* ═══ DISCOVER SUB-TAB ═══ */}
      {subTab === "discover" && (
        <div>
          <div style={{ fontSize: "13px", color: "#BDD6F4", opacity: 0.6, marginBottom: "12px" }}>Stories, history, and hidden gems from the hills</div>

          {/* View toggle */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <div style={{ display: "flex", gap: "4px" }}>
              <button onClick={() => setDiscView("list")} style={{ padding: "5px 12px", borderRadius: "8px", border: "none", background: discView === "list" ? "rgba(90,152,227,0.2)" : "#0a2240", color: discView === "list" ? "#5A98E3" : "#BDD6F4", fontSize: "11px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontFamily: "'DM Sans'", opacity: discView === "list" ? 1 : 0.5 }}><List size={12} /> Articles</button>
              <button onClick={() => setDiscView("map")} style={{ padding: "5px 12px", borderRadius: "8px", border: "none", background: discView === "map" ? "rgba(90,152,227,0.2)" : "#0a2240", color: discView === "map" ? "#5A98E3" : "#BDD6F4", fontSize: "11px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontFamily: "'DM Sans'", opacity: discView === "map" ? 1 : 0.5 }}><Map size={12} /> Map</button>
            </div>
            <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.5 }}>{filteredArticles.length} stories</div>
          </div>

          {/* Category chips */}
          <div style={{ display: "flex", gap: "4px", marginBottom: "12px", flexWrap: "wrap" }}>
            <button onClick={() => setDiscCat(null)} style={{ padding: "4px 10px", borderRadius: "12px", border: `1px solid ${!discCat ? "rgba(248,248,248,0.2)" : "rgba(90,152,227,0.1)"}`, background: !discCat ? "rgba(248,248,248,0.08)" : "transparent", color: !discCat ? "#F8F8F8" : "#BDD6F4", fontSize: "10px", cursor: "pointer", fontWeight: !discCat ? 700 : 400, fontFamily: "'DM Sans'", opacity: discCat ? 0.5 : 1 }}>All</button>
            {categories.map(c => (
              <button key={c} onClick={() => setDiscCat(discCat === c ? null : c)} style={{ padding: "4px 10px", borderRadius: "12px", border: `1px solid ${discCat === c ? "#E85D3A" : "rgba(90,152,227,0.1)"}`, background: discCat === c ? "rgba(232,93,58,0.12)" : "transparent", color: discCat === c ? "#E85D3A" : "#BDD6F4", fontSize: "10px", cursor: "pointer", fontWeight: discCat === c ? 700 : 400, fontFamily: "'DM Sans'", opacity: discCat === c ? 1 : 0.5 }}>{c}</button>
            ))}
          </div>

          {/* ═══ LIST VIEW ═══ */}
          {discView === "list" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {filteredArticles.map((a, i) => (
                <div key={a.id} onClick={() => setSelArticle(selArticle?.id === a.id ? null : a)} style={{
                  background: "#0a2240", borderRadius: "14px", overflow: "hidden",
                  border: `1px solid ${selArticle?.id === a.id ? "rgba(232,93,58,0.2)" : "rgba(90,152,227,0.1)"}`,
                  cursor: "pointer", animation: `fi .3s ease ${i * .04}s both`
                }}>
                  <div style={{ padding: "14px", display: "flex", gap: "12px" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#264f80", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>{a.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#F8F8F8", lineHeight: 1.3 }}>{a.title}</div>
                      <div style={{ display: "flex", gap: "6px", marginTop: "4px", alignItems: "center", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "9px", padding: "1px 6px", borderRadius: "4px", background: "rgba(232,93,58,0.1)", color: "#E85D3A", fontWeight: 600 }}>{a.cat}</span>
                        <span style={{ fontSize: "9px", color: "#BDD6F4", opacity: 0.5 }}>{a.region}</span>
                        <span style={{ fontSize: "9px", color: "#BDD6F4", opacity: 0.4 }}>· {a.read}</span>
                      </div>
                    </div>
                  </div>
                  {selArticle?.id === a.id && (
                    <div style={{ padding: "0 14px 14px", borderTop: "1px solid rgba(90,152,227,0.08)", paddingTop: "12px" }}>
                      <div style={{ fontSize: "12px", color: "#BDD6F4", lineHeight: 1.6, marginBottom: "10px", fontStyle: "italic" }}>"{a.excerpt}"</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.5 }}>By <span style={{ color: "#5A98E3", fontWeight: 600 }}>{a.author}</span></div>
                        <button style={{ padding: "7px 16px", borderRadius: "8px", border: "none", background: "linear-gradient(135deg,#E85D3A,#d04a2a)", color: "#F8F8F8", fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'" }}>Read Story</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ═══ MAP VIEW ═══ */}
          {discView === "map" && (
            <div style={{ position: "relative", height: "380px", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(90,152,227,0.12)" }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #041e3d, #0a2848 30%, #082540 60%, #061e3a)" }}>
                {/* Contours */}
                {[...Array(12)].map((_, i) => <div key={i} style={{ position: "absolute", left: `${10 + (i * 6) % 75}%`, top: `${12 + (i * 8) % 60}%`, width: `${80 + i * 15}px`, height: `${50 + i * 10}px`, border: "1px solid rgba(90,152,227,0.06)", borderRadius: "50%" }} />)}

                {/* Discover bubbles */}
                {filteredArticles.map((a, i) => {
                  const x = ((a.lng + 8) / 12) * 100;
                  const y = ((58 - a.lat) / 7) * 100;
                  return (
                    <div key={a.id} onClick={() => setSelArticle(selArticle?.id === a.id ? null : a)} style={{
                      position: "absolute", left: `${Math.max(6, Math.min(90, x))}%`, top: `${Math.max(6, Math.min(88, y))}%`,
                      transform: "translate(-50%,-50%)", cursor: "pointer", zIndex: 10,
                      animation: `fi .3s ease ${i * .05}s both`
                    }}>
                      <div style={{
                        width: selArticle?.id === a.id ? "44px" : "38px",
                        height: selArticle?.id === a.id ? "44px" : "38px",
                        borderRadius: "50%", background: "#264f80",
                        border: `2px solid ${selArticle?.id === a.id ? "#E85D3A" : "rgba(90,152,227,0.3)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: selArticle?.id === a.id ? "20px" : "17px",
                        boxShadow: selArticle?.id === a.id ? "0 0 16px rgba(232,93,58,0.3)" : "0 2px 8px rgba(0,0,0,0.3)",
                        transition: "all .2s"
                      }}>{a.icon}</div>
                    </div>
                  );
                })}
              </div>

              {/* Selected article popup */}
              {selArticle && (
                <div style={{
                  position: "absolute", bottom: 10, left: 10, right: 10, zIndex: 20,
                  background: "rgba(4,30,61,0.97)", backdropFilter: "blur(16px)",
                  borderRadius: "14px", border: "1px solid rgba(90,152,227,0.15)",
                  animation: "su .25s ease", overflow: "hidden"
                }}>
                  <div style={{ height: "3px", background: "linear-gradient(90deg,#E85D3A,transparent)" }} />
                  <div style={{ padding: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "18px" }}>{selArticle.icon}</span>
                          <span style={{ fontSize: "14px", fontWeight: 800, color: "#F8F8F8" }}>{selArticle.title}</span>
                        </div>
                        <div style={{ display: "flex", gap: "6px", marginTop: "4px", alignItems: "center" }}>
                          <span style={{ fontSize: "9px", padding: "1px 6px", borderRadius: "4px", background: "rgba(232,93,58,0.1)", color: "#E85D3A", fontWeight: 600 }}>{selArticle.cat}</span>
                          <span style={{ fontSize: "9px", color: "#BDD6F4", opacity: 0.5 }}>{selArticle.region} · {selArticle.read}</span>
                        </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); setSelArticle(null); }} style={{ background: "#264f80", border: "none", borderRadius: "50%", width: "26px", height: "26px", cursor: "pointer", color: "#BDD6F4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><X size={12} /></button>
                    </div>
                    <div style={{ fontSize: "12px", color: "#BDD6F4", lineHeight: 1.6, marginTop: "8px", fontStyle: "italic" }}>"{selArticle.excerpt}"</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                      <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.5 }}>By <span style={{ color: "#5A98E3", fontWeight: 600 }}>{selArticle.author}</span></div>
                      <button style={{ padding: "8px 18px", borderRadius: "9px", border: "none", background: "linear-gradient(135deg,#E85D3A,#d04a2a)", color: "#F8F8F8", fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'" }}>Read Story</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   TAB 5: PROFILE
   ═══════════════════════════════════════════════════════════════════ */
const ProfilePage = () => {
  const [sec, setSec] = useState("mountains");
  const [lbm, setLbm] = useState("m");
  const [mtView, setMtView] = useState("map");
  const [mtCls, setMtCls] = useState(null);
  const [mtDone, setMtDone] = useState(null);
  const [mtSort, setMtSort] = useState("name");
  const [selPeak, setSelPeak] = useState(null);
  const [logging, setLogging] = useState(false);
  const [logDate, setLogDate] = useState("");
  const [logNote, setLogNote] = useState("");
  const [peakData, setPeakData] = useState(PEAKS);

  const lists = [
    { k: "munros", ...ME.munros, c: CLS.munros }, { k: "corbetts", ...ME.corbetts, c: CLS.corbetts },
    { k: "wainwrights", ...ME.wainwrights, c: CLS.wainwrights }, { k: "hewitts", ...ME.hewitts, c: CLS.hewitts },
    { k: "donalds", ...ME.donalds, c: CLS.donalds },
  ];

  const filteredPeaks = peakData.filter(p => {
    if (mtCls && p.cls !== mtCls) return false;
    if (mtDone === "done" && !p.done) return false;
    if (mtDone === "todo" && p.done) return false;
    return true;
  }).sort((a, b) => {
    if (mtSort === "height") return b.ht - a.ht;
    if (mtSort === "class") return a.cls.localeCompare(b.cls);
    return a.name.localeCompare(b.name);
  });

  const handleLog = (peakId) => {
    if (!logDate) return;
    setPeakData(prev => prev.map(p => p.id === peakId ? { ...p, done: true, date: logDate, log: logNote || "" } : p));
    setLogging(false);
    setLogDate("");
    setLogNote("");
    setSelPeak(prev => ({ ...prev, done: true, date: logDate, log: logNote || "" }));
  };

  return (
    <div style={{ padding: "0 16px 16px", overflowY: "auto", flex: 1 }}>
      <div style={{ padding: "24px 0 16px", display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{ width: "58px", height: "58px", borderRadius: "50%", background: "linear-gradient(135deg,#264f80,#5A98E3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: 800, color: "#F8F8F8", border: "3px solid rgba(90,152,227,0.3)" }}>A</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "20px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'Playfair Display',serif" }}>{ME.name}</div>
          <div style={{ fontSize: "12px", color: "#BDD6F4", opacity: 0.6 }}>@{ME.user} · {ME.loc}</div>
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
        {[["mountains", "Mountains"], ["badges", "Badges"], ["leaderboard", "Rankings"], ["posts", "Posts"]].map(([k, l]) => <button key={k} onClick={() => setSec(k)} style={{ flex: 1, padding: "8px", borderRadius: "10px", border: "none", background: sec === k ? "rgba(90,152,227,0.2)" : "transparent", color: sec === k ? "#5A98E3" : "#BDD6F4", fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'", opacity: sec === k ? 1 : 0.5 }}>{l}</button>)}
      </div>

      {/* ═══ MOUNTAINS SECTION ═══ */}
      {sec === "mountains" && (
        <div>
          {/* View toggle + filters */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <div style={{ display: "flex", gap: "4px" }}>
              <button onClick={() => setMtView("map")} style={{ padding: "5px 12px", borderRadius: "8px", border: "none", background: mtView === "map" ? "rgba(90,152,227,0.2)" : "#0a2240", color: mtView === "map" ? "#5A98E3" : "#BDD6F4", fontSize: "11px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontFamily: "'DM Sans'", opacity: mtView === "map" ? 1 : 0.5 }}><Map size={12} /> Map</button>
              <button onClick={() => setMtView("list")} style={{ padding: "5px 12px", borderRadius: "8px", border: "none", background: mtView === "list" ? "rgba(90,152,227,0.2)" : "#0a2240", color: mtView === "list" ? "#5A98E3" : "#BDD6F4", fontSize: "11px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontFamily: "'DM Sans'", opacity: mtView === "list" ? 1 : 0.5 }}><List size={12} /> List</button>
            </div>
            <div style={{ fontSize: "10px", color: "#6BCB77", fontWeight: 600 }}>
              {peakData.filter(p => p.done).length}/{peakData.length} logged
            </div>
          </div>

          {/* Classification chips */}
          <div style={{ display: "flex", gap: "4px", marginBottom: "10px", flexWrap: "wrap" }}>
            <button onClick={() => setMtCls(null)} style={{ padding: "4px 10px", borderRadius: "12px", border: `1px solid ${!mtCls ? "rgba(248,248,248,0.2)" : "rgba(90,152,227,0.1)"}`, background: !mtCls ? "rgba(248,248,248,0.08)" : "transparent", color: !mtCls ? "#F8F8F8" : "#BDD6F4", fontSize: "10px", cursor: "pointer", fontWeight: !mtCls ? 700 : 400, fontFamily: "'DM Sans'", opacity: mtCls ? 0.5 : 1 }}>All</button>
            {Object.entries(CLS).slice(0, 6).map(([k, c]) => (
              <button key={k} onClick={() => setMtCls(mtCls === k ? null : k)} style={{ padding: "4px 10px", borderRadius: "12px", border: `1px solid ${mtCls === k ? c.color : "rgba(90,152,227,0.1)"}`, background: mtCls === k ? `${c.color}18` : "transparent", color: mtCls === k ? c.color : "#BDD6F4", fontSize: "10px", cursor: "pointer", fontWeight: mtCls === k ? 700 : 400, fontFamily: "'DM Sans'", opacity: mtCls === k ? 1 : 0.5 }}>{c.name}</button>
            ))}
          </div>

          {/* Completed filter */}
          <div style={{ display: "flex", gap: "4px", marginBottom: "12px" }}>
            {[[null, "All"], ["done", "Completed"], ["todo", "To Do"]].map(([k, l]) => (
              <button key={l} onClick={() => setMtDone(k)} style={{ padding: "4px 10px", borderRadius: "10px", border: "none", background: mtDone === k ? "rgba(90,152,227,0.15)" : "#0a2240", color: mtDone === k ? "#5A98E3" : "#BDD6F4", fontSize: "10px", cursor: "pointer", fontWeight: 600, fontFamily: "'DM Sans'", opacity: mtDone === k ? 1 : 0.5 }}>
                {k === "done" && <span style={{ color: "#6BCB77", marginRight: "3px" }}>●</span>}
                {k === "todo" && <span style={{ color: "#E85D3A", marginRight: "3px" }}>●</span>}
                {l}
              </button>
            ))}
          </div>

          {/* ═══ MAP VIEW ═══ */}
          {mtView === "map" && (
            <div style={{ position: "relative", height: "340px", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(90,152,227,0.12)", marginBottom: "10px" }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #041e3d, #0a2848 30%, #082540 60%, #061e3a)" }}>
                {/* Contours */}
                {[...Array(12)].map((_, i) => <div key={i} style={{ position: "absolute", left: `${10 + (i * 6) % 75}%`, top: `${12 + (i * 8) % 60}%`, width: `${80 + i * 15}px`, height: `${50 + i * 10}px`, border: "1px solid rgba(90,152,227,0.06)", borderRadius: "50%" }} />)}

                {/* Peak dots */}
                {filteredPeaks.map((pk, i) => {
                  const x = ((pk.lng + 8) / 12) * 100;
                  const y = ((58 - pk.lat) / 7) * 100;
                  return (
                    <div key={pk.id} onClick={() => { setSelPeak(pk); setLogging(false); }} style={{
                      position: "absolute", left: `${Math.max(6, Math.min(92, x))}%`, top: `${Math.max(6, Math.min(90, y))}%`,
                      transform: "translate(-50%,-50%)", cursor: "pointer", zIndex: 10,
                      animation: `fi .3s ease ${i * .03}s both`
                    }}>
                      <div style={{
                        width: selPeak?.id === pk.id ? "18px" : "14px",
                        height: selPeak?.id === pk.id ? "18px" : "14px",
                        borderRadius: "50%",
                        background: pk.done ? "#6BCB77" : "#E85D3A",
                        border: `2px solid ${selPeak?.id === pk.id ? "#F8F8F8" : "rgba(248,248,248,0.5)"}`,
                        boxShadow: `0 0 ${selPeak?.id === pk.id ? "12px" : "6px"} ${pk.done ? "rgba(107,203,119,0.4)" : "rgba(232,93,58,0.4)"}`,
                        transition: "all .2s"
                      }} />
                      {selPeak?.id === pk.id && (
                        <div style={{ position: "absolute", top: "22px", left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap", fontSize: "9px", color: "#F8F8F8", textShadow: "0 1px 4px rgba(0,0,0,.9)", fontWeight: 700 }}>{pk.name}</div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Peak detail popup */}
              {selPeak && (
                <div style={{
                  position: "absolute", bottom: 10, left: 10, right: 10, zIndex: 20,
                  background: "rgba(4,30,61,0.97)", backdropFilter: "blur(16px)",
                  borderRadius: "14px", border: "1px solid rgba(90,152,227,0.15)",
                  animation: "su .25s ease", overflow: "hidden"
                }}>
                  <div style={{ height: "3px", background: selPeak.done ? "linear-gradient(90deg,#6BCB77,transparent)" : "linear-gradient(90deg,#E85D3A,transparent)" }} />
                  <div style={{ padding: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "15px", fontWeight: 800, color: "#F8F8F8" }}>{selPeak.name}</span>
                          <div style={{
                            width: "20px", height: "20px", borderRadius: "6px",
                            background: selPeak.done ? "rgba(107,203,119,0.15)" : "rgba(232,93,58,0.1)",
                            border: `1.5px solid ${selPeak.done ? "#6BCB77" : "rgba(232,93,58,0.3)"}`,
                            display: "flex", alignItems: "center", justifyContent: "center"
                          }}>
                            {selPeak.done && <Check size={12} color="#6BCB77" strokeWidth={3} />}
                          </div>
                        </div>
                        <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.6, marginTop: "2px" }}>{selPeak.ht}m · {selPeak.reg}</div>
                        <span style={{ fontSize: "9px", padding: "2px 7px", borderRadius: "5px", background: `${CLS[selPeak.cls]?.color}15`, color: CLS[selPeak.cls]?.color, fontWeight: 600, marginTop: "4px", display: "inline-block" }}>{CLS[selPeak.cls]?.name}</span>
                      </div>
                      <button onClick={() => { setSelPeak(null); setLogging(false); }} style={{ background: "#264f80", border: "none", borderRadius: "50%", width: "26px", height: "26px", cursor: "pointer", color: "#BDD6F4", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={12} /></button>
                    </div>

                    {/* If completed - show log */}
                    {selPeak.done && !logging && (
                      <div style={{ marginTop: "10px", padding: "10px", background: "rgba(107,203,119,0.06)", borderRadius: "10px", border: "1px solid rgba(107,203,119,0.12)" }}>
                        <div style={{ fontSize: "10px", color: "#6BCB77", fontWeight: 700, marginBottom: "4px" }}>Completed · {selPeak.date}</div>
                        {selPeak.log && <div style={{ fontSize: "11px", color: "#BDD6F4", lineHeight: 1.4 }}>{selPeak.log}</div>}
                      </div>
                    )}

                    {/* If not completed - show log button or logging form */}
                    {!selPeak.done && !logging && (
                      <button onClick={() => setLogging(true)} style={{
                        marginTop: "10px", width: "100%", padding: "10px",
                        background: "linear-gradient(135deg,#E85D3A,#d04a2a)",
                        border: "none", borderRadius: "10px", color: "#F8F8F8",
                        fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'"
                      }}>Log This Summit</button>
                    )}

                    {/* Logging form */}
                    {logging && (
                      <div style={{ marginTop: "10px" }}>
                        <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.6, fontWeight: 600, marginBottom: "4px" }}>Date completed</div>
                        <input type="date" value={logDate} onChange={e => setLogDate(e.target.value)} style={{
                          width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid rgba(90,152,227,0.2)",
                          background: "#0a2240", color: "#F8F8F8", fontSize: "12px", outline: "none", fontFamily: "'DM Sans'",
                          marginBottom: "8px"
                        }} />
                        <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.6, fontWeight: 600, marginBottom: "4px" }}>Log (optional)</div>
                        <textarea value={logNote} onChange={e => setLogNote(e.target.value)} placeholder="How was it? Conditions, route, memories..." rows={2} style={{
                          width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid rgba(90,152,227,0.2)",
                          background: "#0a2240", color: "#F8F8F8", fontSize: "12px", outline: "none", fontFamily: "'DM Sans'",
                          resize: "none", marginBottom: "8px"
                        }} />
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button onClick={() => setLogging(false)} style={{ flex: 1, padding: "9px", borderRadius: "9px", border: "1px solid rgba(90,152,227,0.15)", background: "transparent", color: "#BDD6F4", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'" }}>Cancel</button>
                          <button onClick={() => handleLog(selPeak.id)} style={{ flex: 1, padding: "9px", borderRadius: "9px", border: "none", background: logDate ? "linear-gradient(135deg,#6BCB77,#55a866)" : "#264f80", color: logDate ? "#F8F8F8" : "#BDD6F4", fontSize: "12px", fontWeight: 700, cursor: logDate ? "pointer" : "default", fontFamily: "'DM Sans'", opacity: logDate ? 1 : 0.5 }}>Done</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══ LIST VIEW ═══ */}
          {mtView === "list" && (
            <div>
              <div style={{ display: "flex", gap: "4px", marginBottom: "10px" }}>
                {[["name", "A-Z"], ["height", "Height"], ["class", "Class"]].map(([k, l]) => (
                  <button key={k} onClick={() => setMtSort(k)} style={{ padding: "4px 10px", borderRadius: "8px", border: "none", background: mtSort === k ? "rgba(90,152,227,0.15)" : "#0a2240", color: mtSort === k ? "#5A98E3" : "#BDD6F4", fontSize: "10px", cursor: "pointer", fontWeight: 600, fontFamily: "'DM Sans'", display: "flex", alignItems: "center", gap: "3px", opacity: mtSort === k ? 1 : 0.5 }}>
                    <ArrowUpDown size={10} /> {l}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {filteredPeaks.map((pk, i) => (
                  <div key={pk.id} onClick={() => { setSelPeak(pk); setMtView("map"); setLogging(false); }} style={{
                    background: "#0a2240", borderRadius: "10px", padding: "11px 12px",
                    border: "1px solid rgba(90,152,227,0.08)", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "10px",
                    animation: `fi .2s ease ${i * .02}s both`
                  }}>
                    <div style={{
                      width: "12px", height: "12px", borderRadius: "50%",
                      background: pk.done ? "#6BCB77" : "#E85D3A",
                      border: "2px solid rgba(248,248,248,0.3)",
                      boxShadow: `0 0 6px ${pk.done ? "rgba(107,203,119,0.3)" : "rgba(232,93,58,0.3)"}`,
                      flexShrink: 0
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#F8F8F8" }}>{pk.name}</div>
                      <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.5, marginTop: "1px" }}>{pk.reg}</div>
                    </div>
                    <span style={{ fontSize: "9px", padding: "2px 6px", borderRadius: "5px", background: `${CLS[pk.cls]?.color}12`, color: CLS[pk.cls]?.color, fontWeight: 600, flexShrink: 0 }}>{CLS[pk.cls]?.name}</span>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#BDD6F4", opacity: 0.6, minWidth: "42px", textAlign: "right", fontFamily: "'JetBrains Mono'" }}>{pk.ht}m</div>
                    <div style={{
                      width: "18px", height: "18px", borderRadius: "5px",
                      background: pk.done ? "rgba(107,203,119,0.12)" : "rgba(232,93,58,0.08)",
                      border: `1.5px solid ${pk.done ? "#6BCB77" : "rgba(232,93,58,0.25)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                    }}>
                      {pk.done && <Check size={11} color="#6BCB77" strokeWidth={3} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

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
   TUTORIAL OVERLAY
   ═══════════════════════════════════════════════════════════════════ */
const TUTORIAL_STEPS = [
  { tab: "map", title: "Welcome to TrailSync!", text: "This is your map. You can see peaks across the UK, who's on the hills right now, and community walks happening near you. Let's show you around.", highlight: "map" },
  { tab: "map", title: "Map Layers", text: "Tap the Layers button to switch between Standard, Topographical (OS/Harvey), and Satellite views. You can also toggle 3D terrain and weather overlays for wind, precipitation, and cloud cover.", highlight: "layers" },
  { tab: "map", title: "Peak Markers", text: "Each coloured pin is a mountain. Tap any peak to see its summit weather, height, classification, and a button to log it. Green community bubbles show upcoming group walks.", highlight: "peaks" },
  { tab: "map", title: "Live Hikers & Walks", text: "Use the bottom toggles to show or hide live hikers on the hills and community walk pins. See who's ascending, who's summited, and what walks are planned.", highlight: "toggles" },
  { tab: "home", title: "Best Weather Areas", text: "This is the heart of TrailSync. Weather areas are ranked by wind, feels-like temperature, and precipitation so you can instantly see where the best conditions are. Tap any region to see individual mountain forecasts.", highlight: "weather" },
  { tab: "home", title: "Community Feed", text: "Scroll down for summit posts, upcoming events, and safety alerts from SAIS during winter. Filter between summits, events, and news.", highlight: "feed" },
  { tab: "routes", title: "Discover Routes", text: "Browse TrailSync verified walks and community routes. Filter by classification, difficulty, and region. Each route shows the start point, distance, elevation, and reviews.", highlight: "routes" },
  { tab: "learn", title: "Build Your Skills", text: "Work through guided modules on navigation, winter skills, weather reading, first aid, and more. Track your progress and build your mountain knowledge.", highlight: "learn" },
  { tab: "profile", title: "Your Mountains", text: "Track every peak you've climbed. View them on a map with green (completed) and red (to do) dots, or switch to list view. Tap any peak to log it or review your notes.", highlight: "mountains" },
  { tab: "profile", title: "You're all set!", text: "That's the basics. Explore, log your peaks, check the weather, and connect with the community. Happy walking!", highlight: "done" },
];

const TutorialOverlay = ({ step, totalSteps, currentStep, onNext, onSkip }) => (
  <div style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(4,30,61,0.75)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "20px", pointerEvents: "auto" }}>
    <div style={{ background: "#0a2240", borderRadius: "18px", border: "1px solid rgba(90,152,227,0.2)", maxWidth: "400px", width: "100%", padding: "20px", animation: "su .3s ease", marginBottom: "60px" }}>
      {/* Progress dots */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "14px", justifyContent: "center" }}>
        {[...Array(totalSteps)].map((_, i) => (
          <div key={i} style={{ width: i === currentStep ? "20px" : "6px", height: "6px", borderRadius: "3px", background: i === currentStep ? "#E85D3A" : i < currentStep ? "#5A98E3" : "#264f80", transition: "all .3s" }} />
        ))}
      </div>

      <div style={{ fontSize: "16px", fontWeight: 800, color: "#F8F8F8", marginBottom: "8px", fontFamily: "'Playfair Display',serif" }}>{step.title}</div>
      <div style={{ fontSize: "13px", color: "#BDD6F4", lineHeight: 1.6, marginBottom: "18px" }}>{step.text}</div>

      <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={onSkip} style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "1px solid rgba(90,152,227,0.15)", background: "transparent", color: "#BDD6F4", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'" }}>
          Skip tutorial
        </button>
        <button onClick={onNext} style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "none", background: currentStep === totalSteps - 1 ? "linear-gradient(135deg,#6BCB77,#55a866)" : "linear-gradient(135deg,#E85D3A,#d04a2a)", color: "#F8F8F8", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'" }}>
          {currentStep === totalSteps - 1 ? "Get Started" : "Next"}
        </button>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════════════ */
export default function TrailSync() {
  const [authState, setAuthState] = useState("login"); // "login", "signup", "app", "tutorial"
  const [userName, setUserName] = useState("Alex");
  const [tab, setTab] = useState("map");
  const [tutStep, setTutStep] = useState(0);
  const tabs = [
    { id: "home", icon: Home, label: "Home" },
    { id: "routes", icon: Route, label: "Routes" },
    { id: "map", icon: Map, label: "Map" },
    { id: "learn", icon: BookOpen, label: "Learn" },
    { id: "profile", icon: UserCircle, label: "Profile" },
  ];

  // Handle tutorial step changes - auto switch tabs
  const handleTutNext = () => {
    if (tutStep >= TUTORIAL_STEPS.length - 1) {
      setAuthState("app");
      setTab("map");
      return;
    }
    const nextStep = tutStep + 1;
    setTutStep(nextStep);
    setTab(TUTORIAL_STEPS[nextStep].tab);
  };

  // Auth screens
  if (authState === "login") {
    return (
      <div style={{ width: "100%", height: "100vh", background: "#041e3d", fontFamily: "'DM Sans',system-ui,sans-serif", overflow: "hidden" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800&family=Playfair+Display:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          @keyframes fi { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes su { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes glow { 0%,100% { box-shadow: 0 0 8px rgba(232,93,58,.25); } 50% { box-shadow: 0 0 18px rgba(232,93,58,.45); } }
        `}</style>
        <LoginScreen onLogin={() => setAuthState("app")} onGoSignup={() => setAuthState("signup")} />
      </div>
    );
  }

  if (authState === "signup") {
    return (
      <div style={{ width: "100%", height: "100vh", background: "#041e3d", fontFamily: "'DM Sans',system-ui,sans-serif", overflow: "hidden" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800&family=Playfair+Display:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          @keyframes fi { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes su { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes glow { 0%,100% { box-shadow: 0 0 8px rgba(232,93,58,.25); } 50% { box-shadow: 0 0 18px rgba(232,93,58,.45); } }
        `}</style>
        <SignupScreen onSignup={(name) => { setUserName(name.split(" ")[0]); setAuthState("tutorial"); setTab("map"); setTutStep(0); }} onGoLogin={() => setAuthState("login")} />
      </div>
    );
  }

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
        {tab === "home" && <HomePage userName={userName} />}
        {tab === "routes" && <RoutesPage />}
        {tab === "map" && <MapPage goHome={() => setTab("home")} />}
        {tab === "learn" && <LearnPage />}
        {tab === "profile" && <ProfilePage />}
      </div>

      {/* Tutorial overlay */}
      {authState === "tutorial" && (
        <TutorialOverlay
          step={TUTORIAL_STEPS[tutStep]}
          totalSteps={TUTORIAL_STEPS.length}
          currentStep={tutStep}
          onNext={handleTutNext}
          onSkip={() => { setAuthState("app"); setTab("map"); }}
        />
      )}

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
