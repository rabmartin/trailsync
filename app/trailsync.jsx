"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import {
  MapPin, Mountain, Cloud, Users, Trophy, Search, X, ChevronDown, ChevronRight,
  Star, Wind, Droplets, Eye, Thermometer, Navigation, Calendar, Clock,
  Heart, MessageCircle, Share2, Layers, AlertTriangle, Award,
  TrendingUp, Compass, CloudSnow, CheckCircle, Globe,
  BookOpen, Bell, User, Play, Pause, Route,
  Home, Map, UserCircle, ArrowRight, Camera,
  CloudRain, Sun, CloudSun, Snowflake, Settings, List, ArrowUpDown, Check, CircleDot,
  Shield, Mail, Apple, Sparkles, Zap, Plus
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
  "munro-tops": { name: "Munro Tops", count: 226, color: "#D08770", desc: "Subsidiary tops of Munros" },
  corbetts: { name: "Corbetts", count: 222, color: "#F49D37", desc: "Scottish 2,500-3,000ft" },
  grahams: { name: "Grahams", count: 224, color: "#7FB069", desc: "Scottish 2,000-2,500ft" },
  donalds: { name: "Donalds", count: 89, color: "#8FBCBB", desc: "Lowland Scotland over 2,000ft" },
  wainwrights: { name: "Wainwrights", count: 214, color: "#B48EAD", desc: "Lake District fells" },
  hewitts: { name: "Hewitts", count: 525, color: "#5A98E3", desc: "England & Wales over 2,000ft" },
  nuttalls: { name: "Nuttalls", count: 446, color: "#88C0D0", desc: "England & Wales 2,000ft+" },
  furths: { name: "Furths", count: 34, color: "#EBCB8B", desc: "3,000ft peaks outside Scotland" },
  "sub2000": { name: "Sub-2000", count: 573, color: "#88C0D0", desc: "Hills under 2,000ft" },
  "non-mountain": { name: "Non-Mountain", count: 0, color: "#7FB069", desc: "Valley, lochside & long-distance walks" },
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
  { id: 1, name: "Ben Nevis via the Mountain Track", cls: "munros", reg: "Ben Nevis & Mamores", diff: "Moderate", dist: 14.2, elev: 1350, time: "6-8h", peaks: ["Ben Nevis"], rat: 4.6, rev: 342, start: "Glen Nevis Visitor Centre", src: "ts" },
  { id: 2, name: "CMD Arete to Ben Nevis", cls: "munros", reg: "Ben Nevis & Mamores", diff: "Hard", dist: 16.8, elev: 1500, time: "8-10h", peaks: ["Carn Mor Dearg", "Ben Nevis"], rat: 4.9, rev: 187, start: "North Face Car Park", src: "ts" },
  { id: 3, name: "Buachaille Etive Mor via Coire na Tulaich", cls: "munros", reg: "Glen Coe", diff: "Hard", dist: 10.1, elev: 980, time: "5-7h", peaks: ["Buachaille Etive Mor"], rat: 4.8, rev: 256, start: "Altnafeadh Layby", src: "ts" },
  { id: 4, name: "Helvellyn via Striding Edge", cls: "wainwrights", reg: "Lake District", diff: "Hard", dist: 12.8, elev: 890, time: "5-7h", peaks: ["Helvellyn"], rat: 4.7, rev: 412, start: "Glenridding Car Park", src: "ts" },
  { id: 5, name: "Snowdon Horseshoe", cls: "hewitts", reg: "Snowdonia", diff: "Hard", dist: 11.5, elev: 1050, time: "6-8h", peaks: ["Crib Goch", "Snowdon"], rat: 4.8, rev: 289, start: "Pen-y-Pass Car Park", src: "ts" },
  { id: 6, name: "The Cobbler from Arrochar", cls: "corbetts", reg: "Arrochar Alps", diff: "Moderate", dist: 11.0, elev: 850, time: "5-6h", peaks: ["The Cobbler"], rat: 4.7, rev: 198, start: "Succoth Car Park", src: "ts" },
  { id: 7, name: "Liathach Traverse", cls: "munros", reg: "Torridon", diff: "Expert", dist: 12.4, elev: 1200, time: "7-9h", peaks: ["Liathach"], rat: 4.9, rev: 134, start: "Glen Torridon Layby", src: "ts" },
  { id: 8, name: "Ben Lomond via Ptarmigan Ridge", cls: "munros", reg: "Southern Highlands", diff: "Moderate", dist: 11.6, elev: 974, time: "5-6h", peaks: ["Ben Lomond"], rat: 4.5, rev: 523, start: "Rowardennan Car Park", src: "ts" },
  { id: 9, name: "Cairn Gorm & Ben Macdui", cls: "munros", reg: "Cairngorms", diff: "Hard", dist: 18.6, elev: 1120, time: "7-9h", peaks: ["Cairn Gorm", "Ben Macdui"], rat: 4.7, rev: 267, start: "Cairn Gorm Ski Centre", src: "ts" },
  { id: 10, name: "Pen y Fan Horseshoe", cls: "hewitts", reg: "Brecon Beacons", diff: "Easy", dist: 6.2, elev: 550, time: "2-3h", peaks: ["Pen y Fan", "Corn Du"], rat: 4.4, rev: 678, start: "Pont ar Daf Car Park", src: "ts" },
  { id: 11, name: "An Teallach Traverse", cls: "munros", reg: "Fisherfield", diff: "Expert", dist: 15.2, elev: 1300, time: "8-10h", peaks: ["An Teallach"], rat: 4.9, rev: 112, start: "Dundonnell Car Park", src: "ts" },
  { id: 12, name: "Schiehallion", cls: "munros", reg: "Southern Highlands", diff: "Easy", dist: 9.5, elev: 760, time: "4-5h", peaks: ["Schiehallion"], rat: 4.3, rev: 445, start: "Braes of Foss Car Park", src: "ts" },
  { id: 13, name: "West Highland Way (Full)", cls: "non-mountain", reg: "Southern Highlands", diff: "Moderate", dist: 154, elev: 4400, time: "6-8 days", peaks: [], rat: 4.8, rev: 890, start: "Milngavie Station", src: "ts" },
  { id: 14, name: "Loch an Eilein Circuit", cls: "non-mountain", reg: "Cairngorms", diff: "Easy", dist: 5.2, elev: 60, time: "1.5-2h", peaks: [], rat: 4.6, rev: 312, start: "Loch an Eilein Car Park", src: "ts" },
  { id: 15, name: "Glen Nevis Gorge Walk", cls: "non-mountain", reg: "Ben Nevis & Mamores", diff: "Easy", dist: 4.8, elev: 120, time: "1.5-2h", peaks: [], rat: 4.5, rev: 267, start: "Glen Nevis Lower Falls Car Park", src: "ts" },
  { id: 16, name: "Loch Muick Circuit", cls: "non-mountain", reg: "Cairngorms", diff: "Easy", dist: 12.0, elev: 180, time: "3-4h", peaks: [], rat: 4.4, rev: 198, start: "Spittal of Glenmuick Car Park", src: "ts" },
  { id: 17, name: "Great Glen Way", cls: "non-mountain", reg: "Ben Nevis & Mamores", diff: "Moderate", dist: 127, elev: 2200, time: "5-6 days", peaks: [], rat: 4.5, rev: 345, start: "Fort William", src: "ts" },
  { id: 18, name: "Trossachs Trail - Loch Katrine", cls: "non-mountain", reg: "Southern Highlands", diff: "Easy", dist: 21, elev: 280, time: "5-6h", peaks: [], rat: 4.3, rev: 178, start: "Trossachs Pier", src: "ts" },
  { id: 19, name: "Buachaille Etive Mor - South Ridge Variation", cls: "munros", reg: "Glen Coe", diff: "Expert", dist: 12.5, elev: 1100, time: "6-8h", peaks: ["Buachaille Etive Mor"], rat: 4.6, rev: 23, start: "Altnafeadh Layby", src: "community" },
  { id: 20, name: "Cairngorms Lairig Ghru Through-Walk", cls: "non-mountain", reg: "Cairngorms", diff: "Hard", dist: 30, elev: 640, time: "10-12h", peaks: [], rat: 4.7, rev: 45, start: "Linn of Dee Car Park", src: "community" },
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
  { id: 6, user: "Glencoe MRT", av: "🚁", time: "3h ago", type: "fundraiser", text: "Our volunteers responded to 127 callouts last year — every one of them unpaid. We need to replace our ageing stretcher equipment and upgrade radio systems. Every donation, no matter how small, helps us bring people home safe.", likes: 156, comments: 31, peaks: [], link: "https://gofundme.com/glencoe-mrt" },
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

const LB_DATA = {
  daily: [
    { n: "FellRunner_Tom", d: 28, e: 1240, pts: 85, av: "🏃" },
    { n: "You", d: 14, e: 890, pts: 52, av: "⭐", u: true },
    { n: "MountainMeg", d: 12, e: 780, pts: 45, av: "🥾" },
    { n: "HighlandHiker", d: 0, e: 0, pts: 10, av: "🧗" },
    { n: "WinterSummits", d: 0, e: 0, pts: 5, av: "❄️" },
    { n: "ScotWalks", d: 0, e: 0, pts: 0, av: "🏔️" },
  ],
  weekly: [
    { n: "FellRunner_Tom", d: 82, e: 4200, pts: 340, av: "🏃" },
    { n: "MountainMeg", d: 45, e: 3100, pts: 210, av: "🥾" },
    { n: "HighlandHiker", d: 38, e: 2800, pts: 195, av: "🧗" },
    { n: "CairnGormCarl", d: 35, e: 2600, pts: 180, av: "🏔️" },
    { n: "You", d: 22, e: 1450, pts: 120, av: "⭐", u: true },
    { n: "WinterSummits", d: 18, e: 1200, pts: 95, av: "❄️" },
  ],
  monthly: [
    { n: "FellRunner_Tom", d: 320, e: 18500, pts: 1420, av: "🏃" },
    { n: "HighlandHiker", d: 245, e: 14200, pts: 1180, av: "🧗" },
    { n: "MountainMeg", d: 189, e: 12100, pts: 950, av: "🥾" },
    { n: "RidgeWalker_Jen", d: 178, e: 11800, pts: 890, av: "⛰️" },
    { n: "ScotWalks", d: 156, e: 9500, pts: 780, av: "🏔️" },
    { n: "You", d: 62, e: 4800, pts: 340, av: "⭐", u: true },
  ],
  "6month": [
    { n: "FellRunner_Tom", d: 1800, e: 62000, pts: 3200, av: "🏃" },
    { n: "HighlandHiker", d: 1400, e: 52000, pts: 2800, av: "🧗" },
    { n: "MountainMeg", d: 1050, e: 41000, pts: 2200, av: "🥾" },
    { n: "ScotWalks", d: 980, e: 38000, pts: 2050, av: "🏔️" },
    { n: "WinterSummits", d: 890, e: 35000, pts: 1800, av: "❄️" },
    { n: "TorridonTrek", d: 720, e: 28000, pts: 1500, av: "🥾" },
    { n: "You", d: 380, e: 15200, pts: 820, av: "⭐", u: true },
  ],
  yearly: [
    { n: "FellRunner_Tom", d: 3200, e: 95600, pts: 5100, av: "🏃" },
    { n: "HighlandHiker", d: 2450, e: 89200, pts: 4820, av: "🧗" },
    { n: "ScotWalks", d: 2100, e: 68500, pts: 3780, av: "🏔️" },
    { n: "MountainMeg", d: 1890, e: 72100, pts: 3950, av: "🥾" },
    { n: "WinterSummits", d: 1560, e: 62300, pts: 3200, av: "❄️" },
    { n: "SkywalkSarah", d: 1320, e: 48000, pts: 2600, av: "🌤️" },
    { n: "You", d: 620, e: 24800, pts: 1340, av: "⭐", u: true },
  ],
  all: [
    { n: "FellRunner_Tom", d: 8400, e: 245000, pts: 12800, av: "🏃" },
    { n: "HighlandHiker", d: 6800, e: 198000, pts: 10500, av: "🧗" },
    { n: "ScotWalks", d: 5200, e: 162000, pts: 8900, av: "🏔️" },
    { n: "MountainMeg", d: 4500, e: 148000, pts: 7800, av: "🥾" },
    { n: "WinterSummits", d: 3800, e: 128000, pts: 6500, av: "❄️" },
    { n: "OldSchoolHill", d: 3200, e: 112000, pts: 5800, av: "🧭" },
    { n: "You", d: 620, e: 24800, pts: 1340, av: "⭐", u: true },
  ],
};

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
   MINI MAP COMPONENT (reusable for Routes, Discover, Mountain Tracker)
   ═══════════════════════════════════════════════════════════════════ */
const MiniMap = ({ height, center, zoom, markers, onMarkerClick, children }) => {
  const containerRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (mapInstance.current || !containerRef.current) return;
    import("mapbox-gl").then(mod => {
      const mapboxgl = mod.default;
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/outdoors-v12",
        center: center || [-4.5, 56.5],
        zoom: zoom || 5.5,
        interactive: true,
      });
      mapInstance.current = map;

      map.on("load", () => {
        if (markers) {
          markers.forEach((m, i) => {
            const el = document.createElement("div");
            el.style.cssText = m.style || `width:20px;height:20px;border-radius:50%;background:${m.color || "#E85D3A"};border:2px solid rgba(255,255,255,0.8);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;color:#fff;box-shadow:0 2px 6px rgba(0,0,0,0.3);`;
            if (m.label) el.textContent = m.label;
            if (m.html) el.innerHTML = m.html;
            if (onMarkerClick) el.addEventListener("click", () => onMarkerClick(m, i));
            new mapboxgl.Marker({ element: el }).setLngLat([m.lng, m.lat]).addTo(map);
          });
        }
      });
    });
    return () => { if (mapInstance.current) mapInstance.current.remove(); };
  }, []);

  return (
    <div style={{ position: "relative", height: height || "380px", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(90,152,227,0.12)" }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />
      {children}
    </div>
  );
};

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
const HomePage = ({ userName, initialFilter }) => {
  const [wxOpen, setWxOpen] = useState(true);
  const [ff, setFf] = useState(initialFilter || "all");
  const [expandedArea, setExpandedArea] = useState(null);
  const [showSAIS, setShowSAIS] = useState(false);

  useEffect(() => {
    if (initialFilter) setFf(initialFilter);
  }, [initialFilter]);
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
                        <div style={{ fontSize: "12px", fontWeight: 700, color: a.wind > 35 ? "#E85D3A" : a.wind >= 20 ? "#F49D37" : "#F8F8F8" }}>{a.wind}</div>
                        <div style={{ fontSize: "8px", color: "#BDD6F4", opacity: 0.5 }}>mph</div>
                      </div>
                      <ChevronRight size={14} color="#F8F8F8" style={{ opacity: 0.8, transform: isExpanded ? "rotate(90deg)" : "none", transition: ".2s", flexShrink: 0 }} />
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
                                <div style={{ fontSize: "11px", fontWeight: 700, color: pk.w.wi > 35 ? "#E85D3A" : pk.w.wi >= 20 ? "#F49D37" : "#F8F8F8" }}>{pk.w.wi}<span style={{ fontSize: "8px" }}>mph</span></div>
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
        {[["all", "For You"], ["summits", "Summits"], ["events", "Events"], ["news", "News"], ["fundraiser", "Fundraiser"]].map(([k, l]) => (
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
        {FEED.filter(p => ff === "all" || (ff === "summits" && p.type === "summit") || (ff === "events" && p.type === "event") || (ff === "news" && p.type === "news") || (ff === "fundraiser" && p.type === "fundraiser")).map((p, i) => (
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
              {p.type === "fundraiser" && <span style={{ fontSize: "9px", padding: "2px 8px", borderRadius: "6px", background: "rgba(107,203,119,0.12)", color: "#6BCB77", fontWeight: 700 }}>FUNDRAISER</span>}
            </div>
            <div style={{ fontSize: "13px", color: "#BDD6F4", lineHeight: 1.55 }}>{p.text}</div>
            {p.type === "fundraiser" && p.link && (
              <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ display: "block", marginTop: "10px", padding: "10px", borderRadius: "10px", background: "linear-gradient(135deg,#6BCB77,#55a866)", color: "#F8F8F8", fontSize: "12px", fontWeight: 700, textAlign: "center", textDecoration: "none", fontFamily: "'DM Sans'" }}>
                Donate to {p.user} ❤️
              </a>
            )}
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
const ROUTE_REGIONS = [
  { name: "Ben Nevis & Mamores", lat: 56.80, lng: -5.00, routes: [] },
  { name: "Glen Coe", lat: 56.65, lng: -5.05, routes: [] },
  { name: "Cairngorms", lat: 57.07, lng: -3.67, routes: [] },
  { name: "Southern Highlands", lat: 56.30, lng: -4.40, routes: [] },
  { name: "Torridon", lat: 57.58, lng: -5.47, routes: [] },
  { name: "Fisherfield", lat: 57.80, lng: -5.24, routes: [] },
  { name: "Arrochar Alps", lat: 56.22, lng: -4.82, routes: [] },
  { name: "Lake District", lat: 54.50, lng: -3.10, routes: [] },
  { name: "Snowdonia", lat: 53.07, lng: -4.08, routes: [] },
  { name: "Brecon Beacons", lat: 51.88, lng: -3.44, routes: [] },
  { name: "Skye Cuillin", lat: 57.25, lng: -6.20, routes: [] },
  { name: "Galloway Hills", lat: 55.15, lng: -4.62, routes: [] },
];

const RoutesPage = () => {
  const [cf, setCf] = useState(null);
  const [df, setDf] = useState(null);
  const [showCommunity, setShowCommunity] = useState(true);
  const [subTab, setSubTab] = useState("list");
  const [selRegion, setSelRegion] = useState(null);

  const filtered = ROUTES.filter(r => {
    if (cf && r.cls !== cf) return false;
    if (df && r.diff !== df) return false;
    if (!showCommunity && r.src === "community") return false;
    return true;
  });

  // Group filtered routes by region for map view
  const regionClusters = ROUTE_REGIONS.map(reg => ({
    ...reg,
    routes: filtered.filter(r => r.reg === reg.name)
  })).filter(reg => reg.routes.length > 0);

  return (
    <div style={{ padding: "0 16px 16px", overflowY: "auto", flex: 1 }}>
      {/* Header with sub-tabs */}
      <div style={{ padding: "24px 0 12px", display: "flex", alignItems: "baseline", gap: "16px" }}>
        <div onClick={() => setSubTab("list")} style={{ fontSize: "24px", fontWeight: 800, color: subTab === "list" ? "#F8F8F8" : "#BDD6F4", fontFamily: "'Playfair Display',serif", cursor: "pointer", opacity: subTab === "list" ? 1 : 0.4, transition: "all .2s" }}>Routes</div>
        <div onClick={() => setSubTab("map")} style={{ fontSize: "24px", fontWeight: 800, color: subTab === "map" ? "#F8F8F8" : "#BDD6F4", fontFamily: "'Playfair Display',serif", cursor: "pointer", opacity: subTab === "map" ? 1 : 0.4, transition: "all .2s", display: "flex", alignItems: "center", gap: "8px" }}>
          Map
          <Map size={16} color={subTab === "map" ? "#5A98E3" : "#BDD6F4"} style={{ opacity: subTab === "map" ? 1 : 0.4 }} />
        </div>
      </div>

      {/* Shared filters */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "10px", flexWrap: "wrap", alignItems: "center" }}>
        <select value={cf || ""} onChange={e => setCf(e.target.value || null)} style={{ padding: "7px 12px", borderRadius: "10px", fontSize: "11px", fontWeight: 600, background: cf ? "rgba(232,93,58,0.1)" : "#0a2240", border: `1px solid ${cf ? "rgba(232,93,58,0.3)" : "rgba(90,152,227,0.12)"}`, color: cf ? "#E85D3A" : "#BDD6F4", outline: "none", cursor: "pointer", fontFamily: "'DM Sans'" }}>
          <option value="">All Classifications</option>
          {Object.entries(CLS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
        </select>
        <select value={df || ""} onChange={e => setDf(e.target.value || null)} style={{ padding: "7px 12px", borderRadius: "10px", fontSize: "11px", fontWeight: 600, background: df ? "rgba(90,152,227,0.1)" : "#0a2240", border: `1px solid ${df ? "rgba(90,152,227,0.3)" : "rgba(90,152,227,0.12)"}`, color: df ? "#5A98E3" : "#BDD6F4", outline: "none", cursor: "pointer", fontFamily: "'DM Sans'" }}>
          <option value="">All Difficulty</option>
          {["Easy", "Moderate", "Hard", "Expert"].map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <button onClick={() => setShowCommunity(!showCommunity)} style={{ padding: "7px 12px", borderRadius: "10px", fontSize: "11px", fontWeight: 600, background: showCommunity ? "rgba(90,152,227,0.12)" : "#0a2240", border: `1px solid ${showCommunity ? "rgba(90,152,227,0.25)" : "rgba(90,152,227,0.12)"}`, color: showCommunity ? "#5A98E3" : "#BDD6F4", cursor: "pointer", fontFamily: "'DM Sans'", display: "flex", alignItems: "center", gap: "4px", opacity: showCommunity ? 1 : 0.5 }}>
          <Users size={12} /> Community
        </button>
      </div>

      <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.4, marginBottom: "12px" }}>{filtered.length} routes found</div>

      {/* ═══ LIST VIEW ═══ */}
      {subTab === "list" && (
        <div>
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
                  {r.src === "ts" ? (
                    <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "8px", background: "rgba(90,152,227,0.1)", color: "#5A98E3", fontWeight: 600 }}>✓ Verified</span>
                  ) : (
                    <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "8px", background: "rgba(244,157,55,0.1)", color: "#F49D37", fontWeight: 600 }}>Community</span>
                  )}
                </div>
                <div style={{ display: "flex", gap: "16px" }}>
                  {[[Navigation, `${r.dist}km`], [TrendingUp, `${r.elev}m`], [Clock, r.time]].map(([I, v], j) => <span key={j} style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.6, display: "flex", alignItems: "center", gap: "4px" }}><I size={12} /> {v}</span>)}
                </div>
                {r.peaks.length > 0 && <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>{r.peaks.map(pk => <span key={pk} style={{ fontSize: "9px", padding: "2px 6px", borderRadius: "5px", background: "rgba(232,93,58,0.08)", color: "#E85D3A", fontWeight: 600 }}>⛰️ {pk}</span>)}</div>}
              </div>
            ))}
          </div>
          <div style={{ padding: "14px 0", fontSize: "10px", color: "#BDD6F4", opacity: 0.4, textAlign: "center", fontStyle: "italic" }}>Community routes are not regulated. Please use at your own risk and always carry appropriate navigation equipment.</div>
        </div>
      )}

      {/* ═══ MAP VIEW ═══ */}
      {subTab === "map" && (
        <MiniMap height="420px" markers={regionClusters.map(reg => ({ lat: reg.lat, lng: reg.lng, color: "#264f80", label: String(reg.routes.length), data: reg }))} onMarkerClick={(m) => setSelRegion(selRegion?.name === m.data.name ? null : m.data)}>

          {/* Selected region route list */}
          {selRegion && (
            <div style={{
              position: "absolute", bottom: 10, left: 10, right: 10, zIndex: 20,
              background: "rgba(4,30,61,0.97)", backdropFilter: "blur(16px)",
              borderRadius: "14px", border: "1px solid rgba(90,152,227,0.15)",
              animation: "su .25s ease", maxHeight: "200px", overflow: "auto"
            }}>
              <div style={{ height: "3px", background: "linear-gradient(90deg,#E85D3A,transparent)" }} />
              <div style={{ padding: "10px 12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <div style={{ fontSize: "13px", fontWeight: 800, color: "#F8F8F8" }}>{selRegion.name} · {selRegion.routes.length} routes</div>
                  <button onClick={() => setSelRegion(null)} style={{ background: "#264f80", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", color: "#BDD6F4", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={11} /></button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {selRegion.routes.map((r, j) => (
                    <div key={r.id} style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      padding: "8px 10px", borderRadius: "10px",
                      background: "#0a2240", border: "1px solid rgba(90,152,227,0.08)",
                      animation: `fi .2s ease ${j * .04}s both`
                    }}>
                      <Route size={14} color={CLS[r.cls]?.color} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "#F8F8F8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</div>
                        <div style={{ fontSize: "9px", color: "#BDD6F4", opacity: 0.5, marginTop: "1px" }}>{r.dist}km · {r.elev}m · {r.time}</div>
                      </div>
                      <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                        <span style={{ fontSize: "9px", padding: "1px 5px", borderRadius: "4px", background: `${CLS[r.cls]?.color}15`, color: CLS[r.cls]?.color, fontWeight: 600 }}>{CLS[r.cls]?.name}</span>
                        <span style={{ fontSize: "9px", padding: "1px 5px", borderRadius: "4px", background: `${dc(r.diff)}15`, color: dc(r.diff), fontWeight: 600 }}>{r.diff}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </MiniMap>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   TAB 3: MAP
   ═══════════════════════════════════════════════════════════════════ */
const MapPage = ({ goHome, goProfile, onSaveWalk }) => {
  const [layer, setLayer] = useState("standard");
  const [lm, setLm] = useState(false);
  const [wo, setWo] = useState(null);
  const [sh, setSh] = useState(false);
  const [sc, setSc] = useState(false);
  const [sp, setSp] = useState(null);
  const [sw, setSw] = useState(null);
  const [cf, setCf] = useState(null);
  const [d3, setD3] = useState(false);
  const [trackMode, setTrackMode] = useState(false);
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [finished, setFinished] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [actName, setActName] = useState("");
  const [actDesc, setActDesc] = useState("");
  const [actPhotos, setActPhotos] = useState(0);
  const [saved, setSaved] = useState(false);
  const fp = PEAKS.filter(p => !cf || p.cls === cf);

  // Timer for recording
  useEffect(() => {
    if (!recording) return;
    const iv = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(iv);
  }, [recording]);

  const fmtTime = (s) => `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const simDist = (elapsed * 0.0014).toFixed(2);
  const simSpeed = recording ? (elapsed > 5 ? (4.2 + Math.sin(elapsed / 30) * 0.8).toFixed(1) : "0.0") : "0.0";
  const simElev = Math.floor(320 + elapsed * 0.35);

  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  // Initialize Mapbox map
  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;
    import("mapbox-gl").then(mod => { const mapboxgl = mod.default;
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [-4.5, 56.5],
      zoom: 5.8,
      pitch: d3 ? 45 : 0,
    });
    map.addControl(new mapboxgl.NavigationControl(), "top-left");
    map.addControl(new mapboxgl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: true, showUserHeading: true }), "top-left");
    mapRef.current = map;

    // Add peak markers once map loads
    map.on("load", () => {
      PEAKS.forEach(pk => {
        const cls = CLS[pk.cls];
        const el = document.createElement("div");
        el.style.cssText = `width:24px;height:24px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${cls?.color || "#E85D3A"};border:2px solid rgba(255,255,255,0.85);cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px ${cls?.color || "#E85D3A"}40;`;
        el.innerHTML = `<svg style="transform:rotate(45deg)" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="m8 3 4 8 5-5 2 19H2L8 3z"/></svg>`;
        el.addEventListener("click", () => { setSp(pk); setSw(null); });
        new mapboxgl.Marker({ element: el }).setLngLat([pk.lng, pk.lat]).addTo(map);
      });
    });

    }); return () => { if (mapRef.current) mapRef.current.remove(); };
  }, []);

  // Update map style when layer changes
  useEffect(() => {
    if (!mapRef.current) return;
    const styles = {
      standard: "mapbox://styles/mapbox/outdoors-v12",
      topo: "mapbox://styles/mapbox/outdoors-v12",
      satellite: "mapbox://styles/mapbox/satellite-streets-v12",
    };
    mapRef.current.setStyle(styles[layer] || styles.standard);
  }, [layer]);

  // Update 3D pitch
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.easeTo({ pitch: d3 ? 55 : 0, duration: 600 });
  }, [d3]);

  return (
    <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
      {/* Real Mapbox Map */}
      <div ref={mapContainer} style={{ position: "absolute", inset: 0 }} />

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
              <div style={{ height: "1px", background: "rgba(90,152,227,0.1)", margin: "4px 0" }} />
              <div style={{ padding: "6px 12px 4px", fontSize: "9px", color: "#BDD6F4", opacity: 0.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Community</div>
              <button onClick={() => setSh(!sh)} style={{ display: "flex", width: "100%", padding: "8px 12px", borderRadius: "8px", border: "none", alignItems: "center", gap: "8px", background: sh ? "rgba(90,152,227,0.15)" : "transparent", color: sh ? "#5A98E3" : "#BDD6F4", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans'" }}><Eye size={12} /> Live Hikers ({HIKERS.length})</button>
              <button onClick={() => setSc(!sc)} style={{ display: "flex", width: "100%", padding: "8px 12px", borderRadius: "8px", border: "none", alignItems: "center", gap: "8px", background: sc ? "rgba(90,152,227,0.15)" : "transparent", color: sc ? "#5A98E3" : "#BDD6F4", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans'" }}><Users size={12} /> Community Walks ({C_WALKS.length})</button>
            </div>
          )}
        </div>
      </div>

      {/* Unsure prompt */}
      {wo && <div onClick={goHome} style={{ position: "absolute", top: 56, left: "50%", transform: "translateX(-50%)", background: "rgba(232,93,58,.92)", backdropFilter: "blur(8px)", borderRadius: "20px", padding: "7px 18px", zIndex: 20, display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", animation: "fi .4s ease", border: "1px solid rgba(248,248,248,.15)" }}><span style={{ fontSize: "12px", color: "#F8F8F8", fontWeight: 600 }}>Unsure where to go?</span><ArrowRight size={14} color="#F8F8F8" /></div>}

      {/* Track button (when not in track mode) */}
      {!trackMode && !sp && !sw && (
        <button onClick={() => setTrackMode(true)} style={{
          position: "absolute", bottom: 42, left: "50%", transform: "translateX(-50%)",
          zIndex: 21, padding: "8px 20px", borderRadius: "20px",
          background: "rgba(4,30,61,0.9)", backdropFilter: "blur(8px)",
          border: "1px solid rgba(90,152,227,0.2)",
          color: "#F8F8F8", fontSize: "12px", fontWeight: 700, cursor: "pointer",
          display: "flex", alignItems: "center", gap: "6px", fontFamily: "'DM Sans'"
        }}>
          <Navigation size={14} /> Track Walk
        </button>
      )}

      {/* Recording mode UI */}
      {trackMode && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 25,
          background: "rgba(4,30,61,0.97)", backdropFilter: "blur(16px)",
          borderRadius: "16px 16px 0 0", border: "1px solid rgba(90,152,227,0.15)",
          borderBottom: "none", animation: "su .3s ease"
        }}>
          {(recording || paused) && !finished && <div style={{ height: "3px", background: recording ? "linear-gradient(90deg,#6BCB77,#5A98E3)" : "linear-gradient(90deg,#F49D37,#E85D3A)", animation: recording ? "pulse 2s ease infinite" : "none" }} />}
          {finished && <div style={{ height: "3px", background: "linear-gradient(90deg,#6BCB77,transparent)" }} />}

          <div style={{ padding: "14px 16px", maxHeight: "70vh", overflowY: "auto" }}>

            {/* ═══ ACTIVE RECORDING / PAUSED VIEW ═══ */}
            {!finished && !saved && (
              <>
                {/* Timer */}
                {(recording || paused) && (
                  <div style={{ textAlign: "center", marginBottom: "12px" }}>
                    <div style={{ fontSize: "32px", fontWeight: 800, color: paused ? "#F49D37" : "#F8F8F8", fontFamily: "'JetBrains Mono'", letterSpacing: "2px" }}>{fmtTime(elapsed)}</div>
                    {paused && <div style={{ fontSize: "10px", color: "#F49D37", fontWeight: 600, marginTop: "2px" }}>PAUSED</div>}
                  </div>
                )}

                {/* Stats grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "8px", marginBottom: "14px" }}>
                  {[
                    ["Distance", `${simDist}km`, Navigation],
                    ["Time", (recording || paused) ? fmtTime(elapsed) : "00:00:00", Clock],
                    ["Elevation", `${simElev}m`, TrendingUp],
                    ["Speed", `${simSpeed}kph`, Zap],
                  ].map(([label, val, Icon]) => (
                    <div key={label} style={{ textAlign: "center", padding: "8px 4px", background: "#0a2240", borderRadius: "10px" }}>
                      <Icon size={13} color="#BDD6F4" style={{ opacity: 0.5 }} />
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#F8F8F8", marginTop: "2px", fontFamily: "'JetBrains Mono'" }}>{val}</div>
                      <div style={{ fontSize: "8px", color: "#BDD6F4", opacity: 0.4 }}>{label}</div>
                    </div>
                  ))}
                </div>

                {/* Control buttons */}
                <div style={{ display: "flex", gap: "8px" }}>
                  {!recording && !paused && (
                    <>
                      <button onClick={() => { setTrackMode(false); setElapsed(0); }} style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "1px solid rgba(90,152,227,0.15)", background: "transparent", color: "#BDD6F4", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'" }}>Cancel</button>
                      <button onClick={() => setRecording(true)} style={{ flex: 2, padding: "11px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#6BCB77,#55a866)", color: "#F8F8F8", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                        <Play size={16} /> Start Recording
                      </button>
                    </>
                  )}
                  {recording && (
                    <>
                      <button onClick={() => { setRecording(false); setPaused(true); }} style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#E85D3A,#d04a2a)", color: "#F8F8F8", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                        <Pause size={14} /> Stop
                      </button>
                      <div style={{ flex: 1, padding: "8px", borderRadius: "10px", background: "#0a2240", textAlign: "center" }}>
                        <div style={{ fontSize: "8px", color: "#BDD6F4", opacity: 0.5 }}>Est. finish</div>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#5A98E3", fontFamily: "'JetBrains Mono'" }}>{elapsed > 10 ? `${Math.floor(3 + elapsed / 600)}h ${Math.floor((elapsed / 10) % 60)}m` : "--:--"}</div>
                      </div>
                    </>
                  )}
                  {paused && (
                    <>
                      <button onClick={() => { setPaused(false); setRecording(true); }} style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#6BCB77,#55a866)", color: "#F8F8F8", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                        <Play size={14} /> Resume
                      </button>
                      <button onClick={() => { setPaused(false); setFinished(true); }} style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#5A98E3,#4080cc)", color: "#F8F8F8", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                        <CheckCircle size={14} /> Finish
                      </button>
                    </>
                  )}
                </div>
              </>
            )}

            {/* ═══ FINISHED SUMMARY VIEW ═══ */}
            {finished && !saved && (
              <>
                <div style={{ textAlign: "center", marginBottom: "14px" }}>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'Playfair Display',serif" }}>Walk Complete!</div>
                  <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.6, marginTop: "2px" }}>Great effort out there</div>
                </div>

                {/* Summary stats */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "12px" }}>
                  {[
                    ["Distance", `${simDist}km`],
                    ["Elevation", `${simElev}m`],
                    ["Avg Speed", `${(parseFloat(simDist) / (elapsed / 3600) || 0).toFixed(1)}kph`],
                  ].map(([label, val]) => (
                    <div key={label} style={{ textAlign: "center", padding: "10px 4px", background: "#0a2240", borderRadius: "10px" }}>
                      <div style={{ fontSize: "15px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'JetBrains Mono'" }}>{val}</div>
                      <div style={{ fontSize: "9px", color: "#BDD6F4", opacity: 0.4 }}>{label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "14px" }}>
                  {[
                    ["Moving Time", fmtTime(Math.floor(elapsed * 0.88))],
                    ["Total Time", fmtTime(elapsed)],
                  ].map(([label, val]) => (
                    <div key={label} style={{ textAlign: "center", padding: "10px 4px", background: "#0a2240", borderRadius: "10px" }}>
                      <div style={{ fontSize: "15px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'JetBrains Mono'" }}>{val}</div>
                      <div style={{ fontSize: "9px", color: "#BDD6F4", opacity: 0.4 }}>{label}</div>
                    </div>
                  ))}
                </div>

                {/* Peaks detected */}
                <div style={{ padding: "10px", background: "rgba(107,203,119,0.06)", borderRadius: "10px", border: "1px solid rgba(107,203,119,0.12)", marginBottom: "14px" }}>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#6BCB77", marginBottom: "6px" }}>Peaks Detected</div>
                  <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                    {["Ben Lomond"].map(pk => (
                      <span key={pk} style={{ fontSize: "10px", padding: "3px 8px", borderRadius: "6px", background: "rgba(107,203,119,0.1)", color: "#6BCB77", fontWeight: 600, display: "flex", alignItems: "center", gap: "3px" }}>
                        <CheckCircle size={10} /> {pk}
                      </span>
                    ))}
                  </div>
                  <div style={{ fontSize: "9px", color: "#BDD6F4", opacity: 0.4, marginTop: "6px", fontStyle: "italic" }}>Peaks are auto-detected based on your route. You can adjust this in your summit log.</div>
                </div>

                {/* Activity name */}
                <div style={{ marginBottom: "10px" }}>
                  <label style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.6, fontWeight: 600, display: "block", marginBottom: "4px" }}>Activity Name</label>
                  <input type="text" placeholder="e.g. Ben Lomond via Ptarmigan Ridge" value={actName} onChange={e => setActName(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(90,152,227,0.2)", background: "#0a2240", color: "#F8F8F8", fontSize: "12px", outline: "none", fontFamily: "'DM Sans'" }} />
                </div>

                {/* Description */}
                <div style={{ marginBottom: "10px" }}>
                  <label style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.6, fontWeight: 600, display: "block", marginBottom: "4px" }}>Description (optional)</label>
                  <textarea placeholder="How was the walk? Conditions, highlights, memorable moments..." value={actDesc} onChange={e => setActDesc(e.target.value)} rows={3} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(90,152,227,0.2)", background: "#0a2240", color: "#F8F8F8", fontSize: "12px", outline: "none", fontFamily: "'DM Sans'", resize: "none" }} />
                </div>

                {/* Add photos */}
                <button onClick={() => setActPhotos(p => p + 1)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px dashed rgba(90,152,227,0.25)", background: "transparent", color: "#BDD6F4", fontSize: "11px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontFamily: "'DM Sans'", marginBottom: "14px" }}>
                  <Camera size={14} /> {actPhotos > 0 ? `${actPhotos} photo${actPhotos > 1 ? "s" : ""} added — tap to add more` : "Add Photos"}
                </button>

                {/* Save buttons */}
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => { setFinished(false); setTrackMode(false); setElapsed(0); setActName(""); setActDesc(""); setActPhotos(0); }} style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "1px solid rgba(90,152,227,0.15)", background: "transparent", color: "#BDD6F4", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'" }}>Discard</button>
                  <button onClick={() => { if (onSaveWalk) onSaveWalk({ name: actName || "Untitled Walk", desc: actDesc, dist: simDist, elev: simElev, time: fmtTime(elapsed), movingTime: fmtTime(Math.floor(elapsed * 0.88)), avgSpeed: (parseFloat(simDist) / (elapsed / 3600) || 0).toFixed(1), peaks: ["Ben Lomond"], photos: actPhotos, date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) }); setSaved(true); }} style={{ flex: 2, padding: "11px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#E85D3A,#d04a2a)", color: "#F8F8F8", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'" }}>Save & Publish</button>
                </div>
              </>
            )}

            {/* ═══ SAVED CONFIRMATION ═══ */}
            {saved && (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: "36px", marginBottom: "10px" }}>🎉</div>
                <div style={{ fontSize: "16px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'Playfair Display',serif" }}>Walk Saved!</div>
                <div style={{ fontSize: "12px", color: "#BDD6F4", opacity: 0.6, marginTop: "4px", marginBottom: "16px" }}>Published to your profile and the community feed</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <button onClick={() => { setTrackMode(false); setFinished(false); setSaved(false); setRecording(false); setPaused(false); setElapsed(0); setActName(""); setActDesc(""); setActPhotos(0); goProfile("posts"); }} style={{ width: "100%", padding: "11px 24px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#E85D3A,#d04a2a)", color: "#F8F8F8", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'" }}>View Activity</button>
                  <button onClick={() => { setTrackMode(false); setFinished(false); setSaved(false); setRecording(false); setPaused(false); setElapsed(0); setActName(""); setActDesc(""); setActPhotos(0); }} style={{ width: "100%", padding: "11px 24px", borderRadius: "10px", border: "1px solid rgba(90,152,227,0.15)", background: "transparent", color: "#BDD6F4", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'" }}>Back to Map</button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

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
              {[["Feels", `${sp.w.f}°`, Thermometer, sp.w.f < -5 ? "#BDD6F4" : "#F8F8F8"], ["Wind", `${sp.w.wi}mph`, Wind, sp.w.wi > 35 ? "#E85D3A" : sp.w.wi >= 20 ? "#F49D37" : "#F8F8F8"], ["Rain", `${sp.w.p}mm`, Droplets, sp.w.p > 2 ? "#5A98E3" : "#F8F8F8"], ["Vis", sp.w.v, Eye, "#F8F8F8"]].map(([l, v, I, c]) => <div key={l} style={{ textAlign: "center", padding: "10px 4px", background: "#0a2240", borderRadius: "10px" }}><I size={14} color="#BDD6F4" style={{ opacity: 0.5 }} /><div style={{ fontSize: "14px", fontWeight: 700, color: c, marginTop: "3px" }}>{v}</div><div style={{ fontSize: "8px", color: "#BDD6F4", opacity: 0.4, marginTop: "1px" }}>{l}</div></div>)}
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
            <MiniMap height="380px" markers={filteredArticles.map(a => ({ lat: a.lat, lng: a.lng, color: "#264f80", html: `<span style="font-size:17px">${a.icon}</span>`, data: a, style: "width:38px;height:38px;border-radius:50%;background:#264f80;border:2px solid rgba(90,152,227,0.3);cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);" }))} onMarkerClick={(m) => setSelArticle(selArticle?.id === m.data.id ? null : m.data)}>

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
            </MiniMap>
          )}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   TAB 5: PROFILE
   ═══════════════════════════════════════════════════════════════════ */
const ProfilePage = ({ initialSec, onSecChange, goMap, goHome, savedWalks }) => {
  const [sec, setSec] = useState(initialSec || "mountains");

  // Sync with parent when initialSec changes
  useEffect(() => {
    if (initialSec) setSec(initialSec);
  }, [initialSec]);

  // Notify parent when sec changes
  const handleSecChange = (newSec) => {
    setSec(newSec);
    if (onSecChange) onSecChange(newSec);
  };
  const [lbm, setLbm] = useState("d");
  const [lbTime, setLbTime] = useState("all");
  const [mtView, setMtView] = useState("map");
  const [mtCls, setMtCls] = useState(null);
  const [mtDone, setMtDone] = useState(null);
  const [mtSort, setMtSort] = useState("name");
  const [selPeak, setSelPeak] = useState(null);
  const [logging, setLogging] = useState(false);
  const [logDate, setLogDate] = useState("");
  const [logNote, setLogNote] = useState("");
  const [peakData, setPeakData] = useState(PEAKS);
  const [showCreate, setShowCreate] = useState(false);
  const [createType, setCreateType] = useState(null);
  const [evName, setEvName] = useState("");
  const [evDate, setEvDate] = useState("");
  const [evTime, setEvTime] = useState("");
  const [evAge, setEvAge] = useState("Any");
  const [evGender, setEvGender] = useState("Mixed");
  const [evRegion, setEvRegion] = useState("");
  const [evRoute, setEvRoute] = useState("");
  const [evGpx, setEvGpx] = useState(false);
  const [evDiff, setEvDiff] = useState("Moderate");
  const [evSpots, setEvSpots] = useState("8");
  const [evCreated, setEvCreated] = useState(false);

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
        {[["mountains", "Mountains"], ["posts", "Posts"], ["leaderboard", "Rankings"], ["badges", "Badges"]].map(([k, l]) => <button key={k} onClick={() => handleSecChange(k)} style={{ flex: 1, padding: "8px", borderRadius: "10px", border: "none", background: sec === k ? "rgba(90,152,227,0.2)" : "transparent", color: sec === k ? "#5A98E3" : "#BDD6F4", fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'", opacity: sec === k ? 1 : 0.5 }}>{l}</button>)}
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
              {(() => {
                if (!mtCls) return "";
                const fp = peakData.filter(p => p.cls === mtCls);
                const done = fp.filter(p => p.done).length;
                const total = CLS[mtCls]?.count || fp.length;
                return `${done}/${total} logged`;
              })()}
            </div>
          </div>

          {/* Classification chips */}
          <div style={{ display: "flex", gap: "4px", marginBottom: "10px", flexWrap: "wrap" }}>
            <button onClick={() => setMtCls(null)} style={{ padding: "4px 10px", borderRadius: "12px", border: `1px solid ${!mtCls ? "rgba(248,248,248,0.2)" : "rgba(90,152,227,0.1)"}`, background: !mtCls ? "rgba(248,248,248,0.08)" : "transparent", color: !mtCls ? "#F8F8F8" : "#BDD6F4", fontSize: "10px", cursor: "pointer", fontWeight: !mtCls ? 700 : 400, fontFamily: "'DM Sans'", opacity: mtCls ? 0.5 : 1 }}>All</button>
            {Object.entries(CLS).filter(([k]) => k !== "non-mountain").map(([k, c]) => (
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
            <div style={{ marginBottom: "10px" }}>
              <MiniMap height="340px" markers={filteredPeaks.map(pk => ({ lat: pk.lat, lng: pk.lng, color: pk.done ? "#6BCB77" : "#E85D3A", data: pk, style: `width:14px;height:14px;border-radius:50%;background:${pk.done ? "#6BCB77" : "#E85D3A"};border:2px solid rgba(255,255,255,0.5);cursor:pointer;box-shadow:0 0 6px ${pk.done ? "rgba(107,203,119,0.4)" : "rgba(232,93,58,0.4)"};` }))} onMarkerClick={(m) => { setSelPeak(m.data); setLogging(false); }}>
              {selPeak && (
                <div style={{ position: "absolute", bottom: 10, left: 10, right: 10, zIndex: 20, background: "rgba(4,30,61,0.97)", backdropFilter: "blur(16px)", borderRadius: "14px", border: "1px solid rgba(90,152,227,0.15)", animation: "su .25s ease", overflow: "hidden" }}>
                  <div style={{ height: "3px", background: selPeak.done ? "linear-gradient(90deg,#6BCB77,transparent)" : "linear-gradient(90deg,#E85D3A,transparent)" }} />
                  <div style={{ padding: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "15px", fontWeight: 800, color: "#F8F8F8" }}>{selPeak.name}</span>
                          <div onClick={(e) => { e.stopPropagation(); if (selPeak.done && !logging) { setPeakData(prev => prev.map(p => p.id === selPeak.id ? { ...p, done: false, date: undefined, log: undefined } : p)); setSelPeak(prev => ({ ...prev, done: false, date: undefined, log: undefined })); setLogging(false); } else if (!selPeak.done) { const today = new Date().toISOString().split("T")[0]; setPeakData(prev => prev.map(p => p.id === selPeak.id ? { ...p, done: true, date: today, log: "" } : p)); setSelPeak(prev => ({ ...prev, done: true, date: today, log: "" })); setLogDate(today); setLogNote(""); setLogging(true); } }} style={{ width: "22px", height: "22px", borderRadius: "6px", background: selPeak.done ? "rgba(107,203,119,0.15)" : "rgba(232,93,58,0.1)", border: `2px solid ${selPeak.done ? "#6BCB77" : "rgba(232,93,58,0.3)"}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all .2s" }}>{selPeak.done && <Check size={13} color="#6BCB77" strokeWidth={3} />}</div>
                        </div>
                        <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.6, marginTop: "2px" }}>{selPeak.ht}m · {selPeak.reg}</div>
                        <span style={{ fontSize: "9px", padding: "2px 7px", borderRadius: "5px", background: `${CLS[selPeak.cls]?.color}15`, color: CLS[selPeak.cls]?.color, fontWeight: 600, marginTop: "4px", display: "inline-block" }}>{CLS[selPeak.cls]?.name}</span>
                      </div>
                      <button onClick={() => { setSelPeak(null); setLogging(false); }} style={{ background: "#264f80", border: "none", borderRadius: "50%", width: "26px", height: "26px", cursor: "pointer", color: "#BDD6F4", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={12} /></button>
                    </div>
                    {selPeak.done && !logging && (<div style={{ marginTop: "10px", padding: "10px", background: "rgba(107,203,119,0.06)", borderRadius: "10px", border: "1px solid rgba(107,203,119,0.12)" }}><div style={{ fontSize: "10px", color: "#6BCB77", fontWeight: 700, marginBottom: "4px" }}>Completed · {selPeak.date}</div>{selPeak.log && <div style={{ fontSize: "11px", color: "#BDD6F4", lineHeight: 1.4 }}>{selPeak.log}</div>}</div>)}
                    {!selPeak.done && !logging && (<button onClick={() => { const today = new Date().toISOString().split("T")[0]; setPeakData(prev => prev.map(p => p.id === selPeak.id ? { ...p, done: true, date: today, log: "" } : p)); setSelPeak(prev => ({ ...prev, done: true, date: today, log: "" })); setLogDate(today); setLogNote(""); setLogging(true); }} style={{ marginTop: "10px", width: "100%", padding: "10px", background: "linear-gradient(135deg,#E85D3A,#d04a2a)", border: "none", borderRadius: "10px", color: "#F8F8F8", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'" }}>Log This Summit</button>)}
                    {logging && (<div style={{ marginTop: "10px" }}><div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.6, fontWeight: 600, marginBottom: "4px" }}>Date completed</div><input type="date" value={logDate} onChange={e => setLogDate(e.target.value)} style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid rgba(90,152,227,0.2)", background: "#0a2240", color: "#F8F8F8", fontSize: "12px", outline: "none", fontFamily: "'DM Sans'", marginBottom: "8px" }} /><div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.6, fontWeight: 600, marginBottom: "4px" }}>Log (optional)</div><textarea value={logNote} onChange={e => setLogNote(e.target.value)} placeholder="How was it? Conditions, route, memories..." rows={2} style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid rgba(90,152,227,0.2)", background: "#0a2240", color: "#F8F8F8", fontSize: "12px", outline: "none", fontFamily: "'DM Sans'", resize: "none", marginBottom: "10px" }} /><div style={{ display: "flex", gap: "6px" }}><button onClick={() => setLogging(false)} style={{ flex: 1, padding: "9px", borderRadius: "9px", border: "1px solid rgba(90,152,227,0.15)", background: "transparent", color: "#BDD6F4", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'" }}>Cancel</button><button onClick={() => handleLog(selPeak.id)} style={{ flex: 1, padding: "9px", borderRadius: "9px", border: "none", background: logDate ? "linear-gradient(135deg,#6BCB77,#55a866)" : "#264f80", color: logDate ? "#F8F8F8" : "#BDD6F4", fontSize: "12px", fontWeight: 700, cursor: logDate ? "pointer" : "default", fontFamily: "'DM Sans'", opacity: logDate ? 1 : 0.5 }}>Done</button></div></div>)}
                  </div>
                </div>
              )}
              </MiniMap>
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
        {/* Time period filter */}
        <div style={{ display: "flex", gap: "3px", marginBottom: "10px", background: "#0a2240", borderRadius: "10px", padding: "3px", overflowX: "auto" }}>
          {[["daily", "Day"], ["weekly", "Week"], ["monthly", "Month"], ["6month", "6 Month"], ["yearly", "Year"], ["all", "All Time"]].map(([k, l]) => <button key={k} onClick={() => setLbTime(k)} style={{ padding: "5px 10px", borderRadius: "8px", border: "none", background: lbTime === k ? "rgba(90,152,227,0.2)" : "transparent", color: lbTime === k ? "#5A98E3" : "#BDD6F4", fontSize: "10px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'", opacity: lbTime === k ? 1 : 0.4, whiteSpace: "nowrap" }}>{l}</button>)}
        </div>
        {/* Metric filter */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "10px" }}>
          {[["d", "Distance"], ["e", "Elevation"], ["pts", "Points"]].map(([k, l]) => <button key={k} onClick={() => setLbm(k)} style={{ padding: "6px 14px", borderRadius: "10px", fontSize: "10px", cursor: "pointer", background: lbm === k ? "rgba(90,152,227,0.2)" : "#0a2240", border: `1px solid ${lbm === k ? "rgba(90,152,227,0.3)" : "rgba(90,152,227,0.1)"}`, color: lbm === k ? "#5A98E3" : "#BDD6F4", fontWeight: 700, fontFamily: "'DM Sans'" }}>{l}</button>)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {[...(LB_DATA[lbTime] || LB_DATA.all)].sort((a, b) => b[lbm] - a[lbm]).map((u, i) => <div key={u.n} style={{ background: u.u ? "rgba(90,152,227,0.08)" : "#0a2240", borderRadius: "10px", padding: "10px 12px", border: `1px solid ${u.u ? "rgba(90,152,227,0.2)" : "rgba(90,152,227,0.08)"}`, display: "flex", alignItems: "center", gap: "10px", animation: `fi .3s ease ${i * .04}s both` }}>
            <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: i < 3 ? `${["#FFD700","#C0C0C0","#CD7F32"][i]}15` : "#264f80", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 800, color: i < 3 ? ["#FFD700","#C0C0C0","#CD7F32"][i] : "#BDD6F4" }}>{i + 1}</div>
            <span style={{ fontSize: "16px" }}>{u.av}</span>
            <div style={{ flex: 1 }}><div style={{ fontSize: "12px", fontWeight: 700, color: u.u ? "#5A98E3" : "#F8F8F8" }}>{u.n}</div></div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "14px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'JetBrains Mono'" }}>{lbm === "d" ? `${u[lbm]}km` : lbm === "e" ? `${(u[lbm] / 1000).toFixed(1)}km` : u[lbm].toLocaleString()}</div>
              <div style={{ fontSize: "8px", color: "#BDD6F4", opacity: 0.4 }}>{lbm === "d" ? "distance" : lbm === "e" ? "elevation" : "points"}</div>
            </div>
          </div>)}
        </div>
      </div>}

      {sec === "posts" && <div>
        {/* Create button */}
        <div style={{ position: "relative", marginBottom: "14px" }}>
          <button onClick={() => setShowCreate(!showCreate)} style={{ width: "100%", padding: "11px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#E85D3A,#d04a2a)", color: "#F8F8F8", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <Plus size={16} /> Create
          </button>
          {showCreate && !createType && (
            <div style={{ marginTop: "6px", background: "#0a2240", borderRadius: "12px", border: "1px solid rgba(90,152,227,0.15)", overflow: "hidden", animation: "fi .2s ease" }}>
              {[["post", "📝 Post", "Share an update or photo"], ["event", "📅 Event", "Schedule a community walk"], ["fundraiser", "❤️ Fundraiser", "Support a local MRT or cause"]].map(([k, icon, desc]) => (
                <button key={k} onClick={() => setCreateType(k)} style={{ width: "100%", padding: "12px 14px", border: "none", borderBottom: "1px solid rgba(90,152,227,0.08)", background: "transparent", color: "#F8F8F8", fontSize: "13px", fontWeight: 600, cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans'", display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "16px" }}>{icon.split(" ")[0]}</span>
                  <div><div>{icon.split(" ").slice(1).join(" ")}</div><div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.5, fontWeight: 400 }}>{desc}</div></div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ═══ EVENT CREATOR ═══ */}
        {createType === "event" && !evCreated && (
          <div style={{ background: "#0a2240", borderRadius: "14px", border: "1px solid rgba(90,152,227,0.12)", overflow: "hidden", animation: "su .3s ease" }}>
            <div style={{ height: "3px", background: "linear-gradient(90deg,#5A98E3,transparent)" }} />
            <div style={{ padding: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                <button onClick={() => { setCreateType(null); setShowCreate(false); }} style={{ background: "#264f80", border: "none", borderRadius: "50%", width: "26px", height: "26px", cursor: "pointer", color: "#BDD6F4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><X size={12} /></button>
                <div style={{ fontSize: "15px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'Playfair Display',serif" }}>Schedule a Walk</div>
              </div>

              <div style={{ marginBottom: "10px" }}>
                <label style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.6, fontWeight: 600, display: "block", marginBottom: "4px" }}>Walk Name</label>
                <input type="text" placeholder="e.g. Beginner Munro - Ben Lomond" value={evName} onChange={e => setEvName(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(90,152,227,0.2)", background: "#041e3d", color: "#F8F8F8", fontSize: "12px", outline: "none", fontFamily: "'DM Sans'" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "10px" }}>
                <div>
                  <label style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.6, fontWeight: 600, display: "block", marginBottom: "4px" }}>Date</label>
                  <input type="date" value={evDate} onChange={e => setEvDate(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(90,152,227,0.2)", background: "#041e3d", color: "#F8F8F8", fontSize: "12px", outline: "none", fontFamily: "'DM Sans'" }} />
                </div>
                <div>
                  <label style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.6, fontWeight: 600, display: "block", marginBottom: "4px" }}>Time</label>
                  <input type="time" value={evTime} onChange={e => setEvTime(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(90,152,227,0.2)", background: "#041e3d", color: "#F8F8F8", fontSize: "12px", outline: "none", fontFamily: "'DM Sans'" }} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "10px" }}>
                <div>
                  <label style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.6, fontWeight: 600, display: "block", marginBottom: "4px" }}>Age Range</label>
                  <select value={evAge} onChange={e => setEvAge(e.target.value)} style={{ width: "100%", padding: "10px 8px", borderRadius: "8px", border: "1px solid rgba(90,152,227,0.2)", background: "#041e3d", color: "#F8F8F8", fontSize: "11px", outline: "none", fontFamily: "'DM Sans'" }}>
                    {["Any", "18+", "21+", "18-30", "25-45", "30-50", "40+", "50+"].map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.6, fontWeight: 600, display: "block", marginBottom: "4px" }}>Gender</label>
                  <select value={evGender} onChange={e => setEvGender(e.target.value)} style={{ width: "100%", padding: "10px 8px", borderRadius: "8px", border: "1px solid rgba(90,152,227,0.2)", background: "#041e3d", color: "#F8F8F8", fontSize: "11px", outline: "none", fontFamily: "'DM Sans'" }}>
                    {["Mixed", "Female only", "Male only"].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.6, fontWeight: 600, display: "block", marginBottom: "4px" }}>Spots</label>
                  <select value={evSpots} onChange={e => setEvSpots(e.target.value)} style={{ width: "100%", padding: "10px 8px", borderRadius: "8px", border: "1px solid rgba(90,152,227,0.2)", background: "#041e3d", color: "#F8F8F8", fontSize: "11px", outline: "none", fontFamily: "'DM Sans'" }}>
                    {["4", "6", "8", "10", "12", "15", "20"].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "10px" }}>
                <div>
                  <label style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.6, fontWeight: 600, display: "block", marginBottom: "4px" }}>Difficulty {evRoute && <span style={{ color: "#6BCB77", fontSize: "8px" }}>(auto)</span>}</label>
                  <select value={evDiff} onChange={e => { if (!evRoute) setEvDiff(e.target.value); }} disabled={!!evRoute} style={{ width: "100%", padding: "10px 8px", borderRadius: "8px", border: `1px solid ${evRoute ? "rgba(107,203,119,0.2)" : "rgba(90,152,227,0.2)"}`, background: evRoute ? "rgba(107,203,119,0.06)" : "#041e3d", color: "#F8F8F8", fontSize: "11px", outline: "none", fontFamily: "'DM Sans'", opacity: evRoute ? 0.7 : 1 }}>
                    {["Easy", "Moderate", "Hard", "Expert"].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.6, fontWeight: 600, display: "block", marginBottom: "4px" }}>Region</label>
                  <select value={evRegion} onChange={e => { setEvRegion(e.target.value); setEvRoute(""); setEvGpx(false); }} style={{ width: "100%", padding: "10px 8px", borderRadius: "8px", border: "1px solid rgba(90,152,227,0.2)", background: "#041e3d", color: "#F8F8F8", fontSize: "11px", outline: "none", fontFamily: "'DM Sans'" }}>
                    <option value="">Select region</option>
                    {[...new Set(ROUTES.map(r => r.reg))].sort().map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              {/* Route selection - only shows when region is selected */}
              {evRegion && (
                <div style={{ marginBottom: "10px" }}>
                  <label style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.6, fontWeight: 600, display: "block", marginBottom: "4px" }}>Route</label>
                  <select value={evRoute} onChange={e => { const val = e.target.value; setEvRoute(val); if (val) { setEvGpx(false); const route = ROUTES.find(r => r.name === val); if (route) setEvDiff(route.diff); } }} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(90,152,227,0.2)", background: "#041e3d", color: "#F8F8F8", fontSize: "12px", outline: "none", fontFamily: "'DM Sans'" }}>
                    <option value="">Select a verified route (or upload GPX below)</option>
                    {ROUTES.filter(r => r.reg === evRegion && r.src === "ts").map(r => <option key={r.id} value={r.name}>{r.name} ({r.dist}km · {r.diff})</option>)}
                  </select>
                </div>
              )}

              {/* GPX upload - required if no verified route selected */}
              {evRegion && !evRoute && (
                <div style={{ marginBottom: "10px" }}>
                  <button onClick={() => setEvGpx(!evGpx)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: `1px dashed ${evGpx ? "#6BCB77" : "rgba(90,152,227,0.25)"}`, background: evGpx ? "rgba(107,203,119,0.06)" : "transparent", color: evGpx ? "#6BCB77" : "#BDD6F4", fontSize: "11px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontFamily: "'DM Sans'" }}>
                    {evGpx ? <><CheckCircle size={14} /> GPX file uploaded</> : <><Navigation size={14} /> Upload GPX file (required)</>}
                  </button>
                  {!evGpx && (
                    <div style={{ fontSize: "9px", color: "#E85D3A", opacity: 0.8, marginTop: "4px", fontStyle: "italic" }}>
                      A GPX file is required when not using a verified route, so participants know exactly what they're signing up for.
                    </div>
                  )}
                </div>
              )}

              {/* Create button */}
              {(() => {
                const canCreate = evName && evDate && evTime && evRegion && (evRoute || evGpx);
                return (
                  <button onClick={() => { if (canCreate) setEvCreated(true); }} style={{ width: "100%", padding: "11px", borderRadius: "10px", border: "none", background: canCreate ? "linear-gradient(135deg,#E85D3A,#d04a2a)" : "#264f80", color: canCreate ? "#F8F8F8" : "#BDD6F4", fontSize: "13px", fontWeight: 700, cursor: canCreate ? "pointer" : "default", fontFamily: "'DM Sans'", opacity: canCreate ? 1 : 0.5, transition: "all .2s" }}>
                    Create Walk Event
                  </button>
                );
              })()}
            </div>
          </div>
        )}

        {/* Event created confirmation */}
        {createType === "event" && evCreated && (
          <div style={{ background: "#0a2240", borderRadius: "14px", border: "1px solid rgba(107,203,119,0.15)", padding: "20px", textAlign: "center", animation: "su .3s ease" }}>
            <div style={{ fontSize: "36px", marginBottom: "10px" }}>🥾</div>
            <div style={{ fontSize: "16px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'Playfair Display',serif" }}>Walk Scheduled!</div>
            <div style={{ fontSize: "12px", color: "#BDD6F4", opacity: 0.6, marginTop: "4px", marginBottom: "4px" }}>{evName}</div>
            <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.5, marginBottom: "16px" }}>{evDate} · {evTime} · {evRegion} · {evGender} · {evAge}</div>
            <div style={{ fontSize: "10px", color: "#6BCB77", marginBottom: "16px" }}>Published to the community map and feed</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button onClick={() => { setCreateType(null); setShowCreate(false); setEvCreated(false); setEvName(""); setEvDate(""); setEvTime(""); setEvAge("Any"); setEvGender("Mixed"); setEvRegion(""); setEvRoute(""); setEvGpx(false); setEvDiff("Moderate"); setEvSpots("8"); if (goHome) goHome("events"); }} style={{ width: "100%", padding: "10px 24px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#E85D3A,#d04a2a)", color: "#F8F8F8", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'" }}>View Event</button>
              <button onClick={() => { setCreateType(null); setShowCreate(false); setEvCreated(false); setEvName(""); setEvDate(""); setEvTime(""); setEvAge("Any"); setEvGender("Mixed"); setEvRegion(""); setEvRoute(""); setEvGpx(false); setEvDiff("Moderate"); setEvSpots("8"); }} style={{ width: "100%", padding: "10px 24px", borderRadius: "10px", border: "1px solid rgba(90,152,227,0.15)", background: "transparent", color: "#BDD6F4", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'" }}>Done</button>
            </div>
          </div>
        )}

        {/* Post creator placeholder */}
        {createType === "post" && (
          <div style={{ background: "#0a2240", borderRadius: "14px", border: "1px solid rgba(90,152,227,0.12)", padding: "14px", animation: "su .3s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <button onClick={() => { setCreateType(null); setShowCreate(false); }} style={{ background: "#264f80", border: "none", borderRadius: "50%", width: "26px", height: "26px", cursor: "pointer", color: "#BDD6F4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><X size={12} /></button>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#F8F8F8" }}>Create Post</div>
            </div>
            <textarea placeholder="What's on your mind? Share a summit story, trail tip, or photo..." rows={3} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(90,152,227,0.2)", background: "#041e3d", color: "#F8F8F8", fontSize: "12px", outline: "none", fontFamily: "'DM Sans'", resize: "none", marginBottom: "10px" }} />
            <div style={{ display: "flex", gap: "8px" }}>
              <button style={{ flex: 1, padding: "9px", borderRadius: "8px", border: "1px dashed rgba(90,152,227,0.2)", background: "transparent", color: "#BDD6F4", fontSize: "11px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", fontFamily: "'DM Sans'" }}><Camera size={13} /> Photo</button>
              <button onClick={() => { setCreateType(null); setShowCreate(false); if (goHome) goHome("all"); }} style={{ flex: 1, padding: "9px", borderRadius: "8px", border: "none", background: "linear-gradient(135deg,#E85D3A,#d04a2a)", color: "#F8F8F8", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'" }}>Post</button>
            </div>
          </div>
        )}

        {/* Fundraiser creator placeholder */}
        {createType === "fundraiser" && (
          <div style={{ background: "#0a2240", borderRadius: "14px", border: "1px solid rgba(90,152,227,0.12)", padding: "14px", animation: "su .3s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <button onClick={() => { setCreateType(null); setShowCreate(false); }} style={{ background: "#264f80", border: "none", borderRadius: "50%", width: "26px", height: "26px", cursor: "pointer", color: "#BDD6F4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><X size={12} /></button>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#F8F8F8" }}>Create Fundraiser</div>
            </div>
            <input type="text" placeholder="Organisation name (e.g. Glencoe MRT)" style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(90,152,227,0.2)", background: "#041e3d", color: "#F8F8F8", fontSize: "12px", outline: "none", fontFamily: "'DM Sans'", marginBottom: "8px" }} />
            <textarea placeholder="Tell people why this matters..." rows={2} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(90,152,227,0.2)", background: "#041e3d", color: "#F8F8F8", fontSize: "12px", outline: "none", fontFamily: "'DM Sans'", resize: "none", marginBottom: "8px" }} />
            <input type="url" placeholder="GoFundMe or donation link" style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(90,152,227,0.2)", background: "#041e3d", color: "#F8F8F8", fontSize: "12px", outline: "none", fontFamily: "'DM Sans'", marginBottom: "10px" }} />
            <button onClick={() => { setCreateType(null); setShowCreate(false); if (goHome) goHome("fundraiser"); }} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "none", background: "linear-gradient(135deg,#6BCB77,#55a866)", color: "#F8F8F8", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'" }}>Publish Fundraiser</button>
          </div>
        )}

        {/* Saved walks and empty state */}
        {!createType && !showCreate && (
          <div>
            {savedWalks && savedWalks.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {savedWalks.map((w, i) => (
                  <div key={i} style={{ background: "#0a2240", borderRadius: "14px", border: "1px solid rgba(90,152,227,0.1)", overflow: "hidden", animation: `fi .3s ease ${i * .05}s both` }}>
                    <div style={{ height: "3px", background: "linear-gradient(90deg,#6BCB77,#5A98E3)" }} />
                    <div style={{ padding: "14px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "8px" }}>
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: 700, color: "#F8F8F8" }}>{w.name}</div>
                          <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.5, marginTop: "2px" }}>{w.date}</div>
                        </div>
                        {w.photos > 0 && <span style={{ fontSize: "9px", padding: "2px 7px", borderRadius: "6px", background: "rgba(90,152,227,0.1)", color: "#5A98E3", fontWeight: 600 }}><Camera size={10} style={{ verticalAlign: "middle" }} /> {w.photos}</span>}
                      </div>

                      {w.desc && <div style={{ fontSize: "12px", color: "#BDD6F4", lineHeight: 1.5, marginBottom: "10px" }}>{w.desc}</div>}

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px", marginBottom: "10px" }}>
                        {[
                          ["Distance", `${w.dist}km`, Navigation],
                          ["Elevation", `${w.elev}m`, TrendingUp],
                          ["Avg Speed", `${w.avgSpeed}kph`, Zap],
                        ].map(([label, val, Icon]) => (
                          <div key={label} style={{ textAlign: "center", padding: "8px 4px", background: "#041e3d", borderRadius: "8px" }}>
                            <Icon size={12} color="#BDD6F4" style={{ opacity: 0.4 }} />
                            <div style={{ fontSize: "12px", fontWeight: 700, color: "#F8F8F8", marginTop: "2px", fontFamily: "'JetBrains Mono'" }}>{val}</div>
                            <div style={{ fontSize: "8px", color: "#BDD6F4", opacity: 0.4 }}>{label}</div>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
                        <span style={{ fontSize: "9px", padding: "2px 7px", borderRadius: "6px", background: "rgba(90,152,227,0.08)", color: "#BDD6F4", fontWeight: 500 }}>Total: {w.time}</span>
                        <span style={{ fontSize: "9px", padding: "2px 7px", borderRadius: "6px", background: "rgba(90,152,227,0.08)", color: "#BDD6F4", fontWeight: 500 }}>Moving: {w.movingTime}</span>
                      </div>

                      {w.peaks && w.peaks.length > 0 && (
                        <div style={{ display: "flex", gap: "4px" }}>
                          {w.peaks.map(pk => (
                            <span key={pk} style={{ fontSize: "9px", padding: "2px 7px", borderRadius: "6px", background: "rgba(107,203,119,0.1)", color: "#6BCB77", fontWeight: 600 }}>⛰️ {pk}</span>
                          ))}
                        </div>
                      )}

                      <div style={{ display: "flex", gap: "16px", marginTop: "10px", borderTop: "1px solid rgba(90,152,227,0.08)", paddingTop: "10px" }}>
                        {[[Heart, 0], [MessageCircle, 0], [Share2, ""]].map(([Icon, val], j) => (
                          <button key={j} style={{ background: "none", border: "none", color: "#BDD6F4", opacity: 0.4, fontSize: "11px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontFamily: "'DM Sans'" }}>
                            <Icon size={14} /> {val || ""}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <Camera size={36} color="#BDD6F4" style={{ opacity: 0.3, marginBottom: "14px" }} />
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#F8F8F8" }}>Your Posts</div>
                <div style={{ fontSize: "12px", color: "#BDD6F4", opacity: 0.5, marginTop: "6px" }}>Share summit photos, schedule walks, and support your local MRT</div>
              </div>
            )}
          </div>
        )}
      </div>}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   TUTORIAL OVERLAY
   ═══════════════════════════════════════════════════════════════════ */
const TUTORIAL_STEPS = [
  { tab: "map", title: "Welcome to TrailSync!", text: "This is your interactive map. Every peak in the UK is plotted here by classification. Let's show you how it all works.", pos: "center", arrow: null },
  { tab: "map", title: "Map Layers", text: "Tap Layers to switch between Standard, Topographical (OS/Harvey), and Satellite views. Toggle 3D terrain and weather overlays for wind, precipitation, and cloud cover.", pos: "top-left", arrow: "top-right" },
  { tab: "map", title: "Community Layer", text: "Inside Layers, you'll find the Community section. Toggle on Live Hikers to see who's on the hills right now, and Community Walks to see planned group hikes. Sharing your status is always optional.", pos: "top-left", arrow: "top-right" },
  { tab: "map", title: "Peak Markers", text: "Each coloured pin is a mountain — colour-coded by classification. Tap any peak to see its summit weather, height, and a button to log it as bagged.", pos: "center", arrow: "center" },
  { tab: "map", title: "Filter by Classification", text: "Use these chips to filter the map by Munros, Corbetts, Wainwrights, and more. Quickly find exactly what you're looking for.", pos: "top", arrow: "bottom-center" },
  { tab: "home", title: "Best Weather Areas", text: "This is the heart of TrailSync. Areas ranked by wind, feels-like temperature, and precipitation. Tap any region to see individual mountain forecasts. Find where the best conditions are in seconds.", pos: "bottom", arrow: "top-center" },
  { tab: "home", title: "Community Feed", text: "Scroll down for summit posts, events, and safety alerts including SAIS avalanche warnings during winter. Filter by summits, events, and news.", pos: "center", arrow: null },
  { tab: "routes", title: "Discover Routes", text: "Browse verified walks and community routes. Filter by classification (including non-mountain walks), difficulty, and toggle community routes on or off. Every route shows the start point, distance, and reviews.", pos: "center", arrow: null },
  { tab: "learn", title: "Learn & Discover", text: "Build your mountain skills with guided modules, or switch to Discover for local history, folklore, wildlife, and geology stories pinned to places on the map.", pos: "center", arrow: null },
  { tab: "profile", title: "Your Mountains", text: "Track every peak you've bagged. Map view shows green (done) and red (to do) dots — tap to log or review. Switch to list view to sort and filter. Tick and untick peaks anytime.", pos: "center", arrow: null },
  { tab: "profile", title: "You're all set!", text: "Explore, bag peaks, check the weather, and connect with the community. Happy walking! You can replay this guide anytime from Settings.", pos: "center", arrow: null },
];

const TutorialOverlay = ({ step, totalSteps, currentStep, onNext, onSkip }) => {
  // Position the card based on what we're pointing at
  const getCardStyle = () => {
    const base = { background: "rgba(10,34,64,0.95)", backdropFilter: "blur(12px)", borderRadius: "16px", border: "1px solid rgba(90,152,227,0.25)", maxWidth: "340px", width: "calc(100% - 32px)", padding: "18px", animation: "su .3s ease", position: "absolute", zIndex: 92 };
    if (step.pos === "top" || step.pos === "top-left") return { ...base, top: "60px", left: "16px" };
    if (step.pos === "bottom") return { ...base, bottom: "80px", left: "16px" };
    return { ...base, top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
  };

  // Arrow pointing to the UI element
  const getArrow = () => {
    if (!step.arrow) return null;
    const arrowBase = { position: "absolute", zIndex: 91 };
    if (step.arrow === "top-right") return (
      <div style={{ ...arrowBase, top: "52px", right: "80px" }}>
        <svg width="60" height="30" viewBox="0 0 60 30"><path d="M5 25 Q30 5 55 8" stroke="#E85D3A" strokeWidth="2" fill="none" strokeDasharray="4 3" /><polygon points="55,3 60,10 52,10" fill="#E85D3A" /></svg>
      </div>
    );
    if (step.arrow === "bottom-center") return (
      <div style={{ ...arrowBase, bottom: "50px", left: "50%", transform: "translateX(-50%)" }}>
        <svg width="30" height="40" viewBox="0 0 30 40"><path d="M15 5 Q15 20 15 35" stroke="#E85D3A" strokeWidth="2" fill="none" strokeDasharray="4 3" /><polygon points="10,35 20,35 15,42" fill="#E85D3A" /></svg>
      </div>
    );
    if (step.arrow === "top-center") return (
      <div style={{ ...arrowBase, top: "55px", left: "50%", transform: "translateX(-50%)" }}>
        <svg width="30" height="40" viewBox="0 0 30 40"><path d="M15 35 Q15 20 15 5" stroke="#E85D3A" strokeWidth="2" fill="none" strokeDasharray="4 3" /><polygon points="10,5 20,5 15,-2" fill="#E85D3A" /></svg>
      </div>
    );
    if (step.arrow === "center") return (
      <div style={{ ...arrowBase, top: "45%", left: "50%", transform: "translate(-50%, -50%)" }}>
        <div style={{ width: "120px", height: "120px", borderRadius: "50%", border: "2px dashed rgba(232,93,58,0.4)", animation: "pulse 2s ease-in-out infinite" }} />
      </div>
    );
    return null;
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 89, pointerEvents: "auto" }}>
      {/* Semi-transparent overlay */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(4,30,61,0.6)" }} />

      {/* Arrow */}
      {getArrow()}

      {/* Card */}
      <div style={getCardStyle()}>
        {/* Progress dots */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "12px", justifyContent: "center" }}>
          {[...Array(totalSteps)].map((_, i) => (
            <div key={i} style={{ width: i === currentStep ? "18px" : "6px", height: "5px", borderRadius: "3px", background: i === currentStep ? "#E85D3A" : i < currentStep ? "#5A98E3" : "#264f80", transition: "all .3s" }} />
          ))}
        </div>

        <div style={{ fontSize: "15px", fontWeight: 800, color: "#F8F8F8", marginBottom: "6px", fontFamily: "'Playfair Display',serif" }}>{step.title}</div>
        <div style={{ fontSize: "12px", color: "#BDD6F4", lineHeight: 1.6, marginBottom: "16px" }}>{step.text}</div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={onSkip} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid rgba(90,152,227,0.15)", background: "transparent", color: "#BDD6F4", fontSize: "11px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'" }}>
            Skip
          </button>
          <button onClick={onNext} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", background: currentStep === totalSteps - 1 ? "linear-gradient(135deg,#6BCB77,#55a866)" : "linear-gradient(135deg,#E85D3A,#d04a2a)", color: "#F8F8F8", fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'" }}>
            {currentStep === totalSteps - 1 ? "Get Started" : `Next (${currentStep + 1}/${totalSteps})`}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════════════ */
export default function TrailSync() {
  const [authState, setAuthState] = useState("login"); // "login", "signup", "app", "tutorial"
  const [userName, setUserName] = useState("Alex");
  const [tab, setTab] = useState("map");
  const [profileSec, setProfileSec] = useState("mountains");
  const [feedFilter, setFeedFilter] = useState("all");
  const [savedWalks, setSavedWalks] = useState([]);
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
        @keyframes pulse { 0%,100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.08); } }
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
        {tab === "home" && <HomePage userName={userName} initialFilter={feedFilter} />}
        {tab === "routes" && <RoutesPage />}
        {tab === "map" && <MapPage goHome={() => setTab("home")} goProfile={(sec) => { setProfileSec(sec || "mountains"); setTab("profile"); }} onSaveWalk={(walk) => setSavedWalks(prev => [walk, ...prev])} />}
        {tab === "learn" && <LearnPage />}
        {tab === "profile" && <ProfilePage initialSec={profileSec} onSecChange={setProfileSec} goMap={() => setTab("map")} goHome={(filter) => { setFeedFilter(filter || "all"); setTab("home"); }} savedWalks={savedWalks} />}
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
