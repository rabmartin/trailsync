"use client";
// TrailSync v126 - build 2026-03-28

import {
  MapPin, Mountain, Cloud, Users, Trophy, Search, X, ChevronDown, ChevronRight, ChevronLeft,
  Star, Wind, Droplets, Eye, Thermometer, Navigation, Download, Calendar, Clock,
  Heart, MessageCircle, Share2, Layers, AlertTriangle, Award,
  TrendingUp, Compass, CloudSnow, CheckCircle, Globe,
  BookOpen, Bell, User, Play, Pause, Route,
  Home, Map, UserCircle, ArrowRight, Camera,
  CloudRain, Sun, CloudSun, Snowflake, Settings, List, ArrowUpDown, Check, CircleDot,
  Shield, Mail, Apple, Sparkles, Zap, Plus, Maximize2, Minimize2,
  Trash2, WifiOff, Navigation2
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect, useRef, useMemo } from "react";

/* Supabase client */
// Safari-safe in-memory storage fallback
const safariFallbackStorage = (() => {
  const store = {};
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = value; },
    removeItem: (key) => { delete store[key]; },
  };
})();

const storageAdapter = (() => {
  if (typeof window === "undefined") return safariFallbackStorage;
  try {
    localStorage.setItem("_ts_test", "1");
    localStorage.removeItem("_ts_test");
    return localStorage;
  } catch {
    return safariFallbackStorage;
  }
})();

const supabase = createClient(
  "https://mferkdgzpaaxixqlanzm.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_KEY || "",
  {
    auth: {
      storage: storageAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

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
  grahams: { name: "Grahams", count: 231, color: "#7FB069", desc: "Scottish 2,000-2,500ft" },
  donalds: { name: "Donalds", count: 59, color: "#8FBCBB", desc: "Lowland Scotland over 2,000ft" },
  wainwrights: { name: "Wainwrights", count: 214, color: "#B48EAD", desc: "Lake District fells" },
  hewitts: { name: "Hewitts", count: 426, color: "#5A98E3", desc: "England & Wales over 2,000ft" },
  nuttalls: { name: "Nuttalls", count: 109, color: "#88C0D0", desc: "England & Wales 2,000ft+" },
  furths: { name: "Furths", count: 1, color: "#EBCB8B", desc: "3,000ft peaks outside Scotland" },
  "sub2000": { name: "Sub-2000", count: 0, color: "#88C0D0", desc: "Hills under 2,000ft" },
  "non-mountain": { name: "Non-Mountain", count: 0, color: "#7FB069", desc: "Valley, lochside & long-distance walks" },
};

// Static region config — weather data fetched live from Open-Meteo
const WX_REGIONS = [
  { region: "Ben Nevis & Mamores", lat: 56.80, lng: -5.00, alt: 900, peaks: ["Ben Nevis", "Carn Mor Dearg", "Aonach Mor"], cls: "munros" },
  { region: "Southern Highlands",  lat: 56.19, lng: -4.63, alt: 600, peaks: ["Ben Lomond", "Ben Vorlich", "Stuc a' Chroin"], cls: "munros" },
  { region: "Arrochar Alps",       lat: 56.22, lng: -4.82, alt: 700, peaks: ["The Cobbler", "Ben Narnain", "Beinn Ime"], cls: "corbetts" },
  { region: "Glen Coe",            lat: 56.65, lng: -5.05, alt: 800, peaks: ["Buachaille Etive Mor", "Bidean nam Bian"], cls: "munros" },
  { region: "Cairngorms",          lat: 57.07, lng: -3.67, alt: 900, peaks: ["Cairn Gorm", "Ben Macdui", "Braeriach"], cls: "munros" },
  { region: "Torridon",            lat: 57.58, lng: -5.47, alt: 700, peaks: ["Liathach", "Beinn Eighe", "Beinn Alligin"], cls: "munros" },
  { region: "Kintail",             lat: 57.20, lng: -5.35, alt: 700, peaks: ["Sgùrr Fhuaran", "Sgùrr na Ciste Duibhe"], cls: "munros" },
  { region: "Snowdonia",           lat: 53.07, lng: -4.08, alt: 700, peaks: ["Snowdon", "Tryfan", "Glyder Fawr"], cls: "hewitts" },
  { region: "Lake District",       lat: 54.50, lng: -3.10, alt: 600, peaks: ["Helvellyn", "Scafell Pike", "Skiddaw"], cls: "wainwrights" },
  { region: "Brecon Beacons",      lat: 51.88, lng: -3.44, alt: 600, peaks: ["Pen y Fan", "Corn Du", "Cribyn"], cls: "hewitts" },
  { region: "Galloway Hills",      lat: 55.15, lng: -4.62, alt: 500, peaks: ["Merrick", "Corserine"], cls: "donalds" },
  { region: "Fisherfield",         lat: 57.80, lng: -5.24, alt: 800, peaks: ["An Teallach", "Beinn Dearg Mor"], cls: "munros" },
];

// Keep WX_AREAS as alias for backward compat with any refs
const WX_AREAS = WX_REGIONS.map(r => ({ ...r, score: 70, temp: 5, feels: 0, wind: 20, precip: 1, vis: "moderate", ic: "cloudsun" }));

/* ═══════════════════════════════════════════════════════════════════
   WEATHER ENGINE — Open-Meteo (free, no key required)
   ═══════════════════════════════════════════════════════════════════ */

// WMO weather code → icon type
function wxIcon(code) {
  if (code === 0) return "sun";
  if (code <= 2) return "cloudsun";
  if (code <= 48) return "cloud";
  if (code <= 67) return "cloudrain";
  if (code <= 77) return "snow";
  if (code <= 82) return "cloudrain";
  if (code <= 86) return "snow";
  return "cloudrain";
}

// Visibility from WMO code (rough)
function wxVis(code) {
  if (code <= 1) return "good";
  if (code <= 45) return "moderate";
  if (code <= 48) return "poor"; // fog
  if (code <= 55) return "moderate";
  return "poor";
}

// Altitude-adjusted feels-like: lapse rate ~6.5°C/1000m
function altAdjust(tempC, altM) {
  return Math.round(tempC - (altM / 1000) * 6.5);
}

// mph from km/h
const toMph = kph => Math.round(kph * 0.621371);

// Score a set of weather values (0-100, higher = better conditions)
function scoreWeather(feels, windMph, precipMm, vis) {
  const windScore  = Math.max(0, 100 - windMph * 2);         // 0mph=100, 50mph=0
  const feelsScore = Math.max(0, Math.min(100, 70 + feels));  // -30°=-100→0, 0°=70, +10°=80
  const precipScore = Math.max(0, 100 - precipMm * 40);      // 0mm=100, 2.5mm=0
  const visScore  = vis === "good" ? 100 : vis === "moderate" ? 60 : 20;
  return Math.round(windScore * 0.30 + feelsScore * 0.25 + precipScore * 0.25 + visScore * 0.20);
}

// Fetch weather for all regions for a given date offset (0=today, 1=tomorrow etc.)
// Returns array of enriched WX_AREAS entries sorted by score
const WX_CACHE = {}; // key: "YYYY-MM-DD-regionIndex"

async function fetchRegionWeather(region, dayOffset) {
  const dateKey = (() => {
    const d = new Date(); d.setDate(d.getDate() + dayOffset);
    return d.toISOString().split("T")[0];
  })();
  const cacheKey = `${dateKey}-${region.region}`;
  if (WX_CACHE[cacheKey] && Date.now() - WX_CACHE[cacheKey].ts < 30 * 60 * 1000) {
    return WX_CACHE[cacheKey].data;
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${region.lat}&longitude=${region.lng}` +
    `&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,` +
    `windspeed_10m_max,precipitation_sum,weathercode` +
    `&wind_speed_unit=kmh&timezone=Europe%2FLondon&forecast_days=7`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather fetch failed for ${region.region}`);
  const json = await res.json();
  const d = json.daily;

  // Build 7-day array
  const days = d.time.map((date, i) => {
    const tempC    = Math.round((d.temperature_2m_max[i] + d.temperature_2m_min[i]) / 2);
    const feelsRaw = Math.round((d.apparent_temperature_max[i] + d.apparent_temperature_min[i]) / 2);
    const feelsAdj = altAdjust(feelsRaw, region.alt);
    const windMph  = toMph(d.windspeed_10m_max[i]);
    const precip   = parseFloat((d.precipitation_sum[i] || 0).toFixed(1));
    const code     = d.weathercode[i];
    const vis      = wxVis(code);
    const score    = scoreWeather(feelsAdj, windMph, precip, vis);
    return { date, tempC, feels: feelsAdj, wind: windMph, precip, vis, code, ic: wxIcon(code), score };
  });

  // Best day in next 7
  const bestDay = days.reduce((best, day) => day.score > best.score ? day : best, days[0]);

  const result = { days, bestDay };
  WX_CACHE[cacheKey] = { data: result, ts: Date.now() };
  return result;
}

// Fetch weather for a single peak (for expanded view)
async function fetchPeakWeather(peak, dayOffset) {
  const safeOffset = Math.max(0, dayOffset); // dayOffset -1 (best day) treated as today
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${peak.lat}&longitude=${peak.lng}` +
    `&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_min,apparent_temperature_max,` +
    `windspeed_10m_max,windgusts_10m_max,precipitation_sum,precipitation_probability_max,weathercode,snowfall_sum,sunrise,sunset` +
    `&hourly=temperature_2m,apparent_temperature,windspeed_10m,precipitation_probability,weathercode` +
    `&wind_speed_unit=kmh&timezone=Europe%2FLondon&forecast_days=7`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    const d = json.daily;
    const i = safeOffset;
    const feelsRaw = Math.round((d.apparent_temperature_max[i] + d.apparent_temperature_min[i]) / 2);
    const feelsAdj = altAdjust(feelsRaw, peak.ht || 800);
    const tempAdj  = altAdjust(Math.round((d.temperature_2m_max[i] + d.temperature_2m_min[i]) / 2), peak.ht || 800);

    // Extract hourly data for this day (24 hours)
    const hourStart = i * 24;
    const hours = [];
    for (let h = 0; h < 24; h++) {
      const hi = hourStart + h;
      hours.push({
        hour: h,
        temp:  altAdjust(Math.round(json.hourly.temperature_2m[hi] ?? 0), peak.ht || 800),
        feels: altAdjust(Math.round(json.hourly.apparent_temperature[hi] ?? 0), peak.ht || 800),
        wind:  toMph(json.hourly.windspeed_10m[hi] ?? 0),
        precip: json.hourly.precipitation_probability[hi] ?? 0,
        code:  json.hourly.weathercode[hi] ?? 0,
      });
    }

    return {
      f:       feelsAdj,
      t:       tempAdj,
      wi:      toMph(d.windspeed_10m_max[i]),
      gusts:   toMph(d.windgusts_10m_max[i] ?? d.windspeed_10m_max[i]),
      p:       parseFloat((d.precipitation_sum[i] || 0).toFixed(1)),
      pct:     d.precipitation_probability_max[i] ?? 0,
      v:       wxVis(d.weathercode[i]),
      sn:      (d.snowfall_sum?.[i] || 0) > 0,
      code:    d.weathercode[i],
      ic:      wxIcon(d.weathercode[i]),
      sunrise: d.sunrise[i] ? new Date(d.sunrise[i]).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "--:--",
      sunset:  d.sunset[i]  ? new Date(d.sunset[i]).toLocaleTimeString("en-GB",  { hour: "2-digit", minute: "2-digit" }) : "--:--",
      hours,
    };
  } catch { return null; }
}

const PEAKS_FALLBACK = [
  { id: 1,  name: "Ben Nevis",              cls: "munros",      ht: 1345, reg: "Ben Nevis & Mamores", lat: 56.797, lng: -5.004, done: false },
  { id: 2,  name: "Ben Macdui",             cls: "munros",      ht: 1309, reg: "Cairngorms",          lat: 57.070, lng: -3.669, done: false },
  { id: 3,  name: "Braeriach",              cls: "munros",      ht: 1296, reg: "Cairngorms",          lat: 57.078, lng: -3.729, done: false },
  { id: 4,  name: "Buachaille Etive Mor",   cls: "munros",      ht: 1022, reg: "Glen Coe",            lat: 56.652, lng: -4.954, done: false },
  { id: 5,  name: "Liathach",               cls: "munros",      ht: 1055, reg: "Torridon",            lat: 57.581, lng: -5.468, done: false },
  { id: 6,  name: "An Teallach",            cls: "munros",      ht: 1062, reg: "Fisherfield",         lat: 57.806, lng: -5.238, done: false },
  { id: 7,  name: "Ben Lomond",             cls: "munros",      ht: 974,  reg: "Southern Highlands",  lat: 56.190, lng: -4.632, done: false },
  { id: 8,  name: "Schiehallion",           cls: "munros",      ht: 1083, reg: "Southern Highlands",  lat: 56.666, lng: -4.098, done: false },
  { id: 9,  name: "The Cobbler",            cls: "corbetts",    ht: 884,  reg: "Arrochar Alps",       lat: 56.219, lng: -4.819, done: false },
  { id: 10, name: "Scafell Pike",           cls: "hewitts",     ht: 978,  reg: "Lake District",       lat: 54.454, lng: -3.212, done: false },
  { id: 11, name: "Helvellyn",              cls: "wainwrights", ht: 950,  reg: "Lake District",       lat: 54.527, lng: -3.016, done: false },
  { id: 12, name: "Great Gable",            cls: "wainwrights", ht: 899,  reg: "Lake District",       lat: 54.482, lng: -3.219, done: false },
  { id: 13, name: "Scafell",               cls: "wainwrights", ht: 964,  reg: "Lake District",       lat: 54.449, lng: -3.229, done: false },
  { id: 14, name: "Blencathra",             cls: "wainwrights", ht: 868,  reg: "Lake District",       lat: 54.639, lng: -3.054, done: false },
  { id: 15, name: "Snowdon",               cls: "hewitts",     ht: 1085, reg: "Snowdonia",            lat: 53.068, lng: -4.076, done: false },
  { id: 16, name: "Tryfan",                cls: "hewitts",     ht: 918,  reg: "Snowdonia",            lat: 53.086, lng: -3.991, done: false },
  { id: 17, name: "Pen y Fan",             cls: "hewitts",     ht: 886,  reg: "Brecon Beacons",       lat: 51.884, lng: -3.436, done: false },
  { id: 18, name: "Merrick",               cls: "donalds",     ht: 843,  reg: "Galloway Hills",       lat: 55.146, lng: -4.615, done: false },
  { id: 19, name: "Sgurr nan Gillean",     cls: "munros",      ht: 964,  reg: "Skye Cuillin",         lat: 57.254, lng: -6.196, done: false },
  { id: 20, name: "Sgùrr na Ciste Duibhe", cls: "munros",      ht: 1027, reg: "Kintail",              lat: 57.204, lng: -5.321, done: false },
  { id: 21, name: "Sgùrr na Càrnach",      cls: "munros",      ht: 1002, reg: "Kintail",              lat: 57.202, lng: -5.333, done: false },
  { id: 22, name: "Sgùrr Fhuaran",         cls: "munros",      ht: 1067, reg: "Kintail",              lat: 57.199, lng: -5.349, done: false },
];
// PEAKS will be populated from Supabase in the main app component
let PEAKS;
PEAKS = PEAKS_FALLBACK;

// ROUTES populated from Supabase on mount; fallback hardcoded data kept as default
let ROUTES = [
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
  { id: 21, name: "The Five Sisters of Kintail", cls: "munros", reg: "Kintail", diff: "Expert", dist: 15.0, elev: 1775, time: "8-10h", peaks: ["Sgùrr na Ciste Duibhe", "Sgùrr na Càrnach", "Sgùrr Fhuaran"], rat: 4.8, rev: 156, start: "Shiel Bridge Car Park", src: "ts" },
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
  { id: 1, name: "Jamie M.", peak: "Ben Nevis", st: "ascending", av: "🧑‍🦰", lat: 56.797, lng: -5.004 },
  { id: 2, name: "Sarah K.", peak: "Buachaille Etive Mor", st: "summit", av: "👩", lat: 56.652, lng: -4.954 },
  { id: 3, name: "Alistair D.", peak: "An Teallach", st: "ascending", av: "🧔", lat: 57.806, lng: -5.238 },
  { id: 4, name: "Fiona R.", peak: "Liathach", st: "descending", av: "👩‍🦱", lat: 57.581, lng: -5.468 },
  { id: 5, name: "Craig B.", peak: "Ben Lomond", st: "ascending", av: "🧑", lat: 56.190, lng: -4.632 },
  { id: 6, name: "Eilidh T.", peak: "Helvellyn", st: "summit", av: "👩‍🦰", lat: 54.527, lng: -3.016 },
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

const ME = { name: "Explorer", user: "", loc: "", frs: 0, fng: 0, walks: 0, dist: 0, elev: 0, munros: { d: 0, t: 282 }, corbetts: { d: 0, t: 222 }, wainwrights: { d: 0, t: 214 }, hewitts: { d: 0, t: 525 }, donalds: { d: 0, t: 89 } };

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

/* ═══════════════════════════════════════════════════════════════════
   GPX HELPERS
   ═══════════════════════════════════════════════════════════════════ */

/** Fetch GPX XML text from a full URL (gpx_url column) */
async function fetchGpxText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GPX fetch failed: ${res.status}`);
  return res.text();
}

/** Parse GPX XML string → array of [lng, lat, ele?] coordinates */
function parseGpxCoords(gpxText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(gpxText, "application/xml");
  if (doc.querySelector("parsererror")) throw new Error("Invalid GPX XML");

  // Use getElementsByTagName with wildcard namespace to handle namespaced GPX
  // (querySelector fails on namespace-prefixed elements in some browsers)
  const getEls = (name) => {
    // Try non-namespaced first, then wildcard namespace
    let els = doc.getElementsByTagName(name);
    if (!els.length) els = doc.getElementsByTagNameNS("*", name);
    return Array.from(els);
  };

  const trkpts = getEls("trkpt");
  const pts = trkpts.length > 0 ? trkpts : getEls("rtept");

  const coords = [];
  pts.forEach(pt => {
    const lon = parseFloat(pt.getAttribute("lon"));
    const lat = parseFloat(pt.getAttribute("lat"));
    // Get ele using getElementsByTagName to handle namespace
    const eleEls = pt.getElementsByTagName("ele");
    const eleElsNS = eleEls.length ? eleEls : pt.getElementsByTagNameNS("*", "ele");
    const ele = eleElsNS.length ? parseFloat(eleElsNS[0].textContent) : null;
    if (isNaN(lon) || isNaN(lat)) return;
    coords.push(ele !== null ? [lon, lat, ele] : [lon, lat]);
  });
  return coords;
}

/** Compute [west, south, east, north] bounding box from coordinate array */
function coordsBbox(coords) {
  let w = Infinity, s = Infinity, e = -Infinity, n = -Infinity;
  coords.forEach(([lon, lat]) => {
    if (lon < w) w = lon; if (lon > e) e = lon;
    if (lat < s) s = lat; if (lat > n) n = lat;
  });
  return [[w, s], [e, n]];
}

/**
 * Draw a GPX route line on a Mapbox map instance.
 * Removes any previous route line for this id first.
 * @param {mapboxgl.Map} map
 * @param {string}       id       unique key (route db id)
 * @param {Array}        coords   [[lng,lat], ...]
 * @param {object}       opts     { color, width, fitBounds, fitPadding }
 */
function drawGpxOnMap(map, id, coords, opts = {}) {
  const {
    color = "#E85D3A",
    width = 3.5,
    fitBounds = true,
    fitPadding = 60,
  } = opts;

  const sourceId = `gpx-${id}`;

  // Remove old layers/source for this route
  [`${sourceId}-casing`, `${sourceId}-line`].forEach(l => {
    if (map.getLayer(l)) map.removeLayer(l);
  });
  if (map.getSource(sourceId)) map.removeSource(sourceId);

  map.addSource(sourceId, {
    type: "geojson",
    data: { type: "Feature", geometry: { type: "LineString", coordinates: coords }, properties: {} },
  });

  // White casing underneath for legibility on any basemap
  map.addLayer({
    id: `${sourceId}-casing`,
    type: "line",
    source: sourceId,
    layout: { "line-join": "round", "line-cap": "round" },
    paint: { "line-color": "#ffffff", "line-width": width + 3, "line-opacity": 0.6 },
  });

  // Animate the line in by going from 0 to target width
  map.addLayer({
    id: `${sourceId}-line`,
    type: "line",
    source: sourceId,
    layout: { "line-join": "round", "line-cap": "round" },
    paint: { "line-color": color, "line-width": 0, "line-opacity": 0.95 },
  });

  // Cubic ease-out animation over 700ms
  const start = performance.now();
  const duration = 700;
  const lineLayerId = `${sourceId}-line`;
  const animate = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    if (map.getLayer(lineLayerId)) map.setPaintProperty(lineLayerId, "line-width", eased * width);
    if (t < 1) requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);

  if (fitBounds && coords.length > 1) {
    map.fitBounds(coordsBbox(coords), { padding: fitPadding, duration: 1000 });
  }
}

/** Remove a previously drawn GPX route from the map */
function removeGpxFromMap(map, id) {
  const sourceId = `gpx-${id}`;
  [`${sourceId}-casing`, `${sourceId}-line`].forEach(l => { if (map.getLayer(l)) map.removeLayer(l); });
  if (map.getSource(sourceId)) map.removeSource(sourceId);
}
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
const timeAgo = (ts) => {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

/* ═══════════════════════════════════════════════════════════════════
   MINI MAP COMPONENT (reusable for Routes, Discover, Mountain Tracker)
   ═══════════════════════════════════════════════════════════════════ */
const MiniMap = ({ height, center, zoom, markers, onMarkerClick, showGPS, onMapReady, children }) => {
  const containerRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const mapboxRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  // Initialize map once (delayed so container has computed size)
  useEffect(() => {
    if (mapInstance.current || !containerRef.current) return;
    const timer = setTimeout(() => {
      if (!containerRef.current || containerRef.current.clientHeight === 0) return;
      import("mapbox-gl").then(mod => {
        const mapboxgl = mod.default;
        mapboxRef.current = mapboxgl;
        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
        const map = new mapboxgl.Map({
          container: containerRef.current,
          style: "mapbox://styles/mapbox/outdoors-v12",
          center: center || [-4.5, 56.5],
          zoom: zoom || 5.5,
          interactive: true,
        });
        mapInstance.current = map;
        if (showGPS) {
          map.addControl(new mapboxgl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: true, showUserHeading: true }), "bottom-right");
        }
        map.on("load", () => { setMapReady(true); if (onMapReady) onMapReady(map); });
      });
    }, 150);
    return () => { clearTimeout(timer); if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; } };
  }, []);

  // Update markers using GeoJSON layer for performance (no DOM elements per marker)
  useEffect(() => {
    if (!mapReady || !mapInstance.current) return;
    const map = mapInstance.current;

    const geojson = {
      type: "FeatureCollection",
      features: (markers || []).filter(m => m.lat && m.lng).map((m, i) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [m.lng, m.lat] },
        properties: {
          color: m.color || "#E85D3A",
          idx: i,
          done: m.data?.done || false,
          peakData: JSON.stringify(m.data || {}),
        },
      })),
    };

    if (map.getSource("minimap-markers")) {
      map.getSource("minimap-markers").setData(geojson);
    } else {
      map.addSource("minimap-markers", { type: "geojson", data: geojson });
      // Triangle dots via symbol layer using ▲ unicode
      map.addLayer({
        id: "minimap-markers-layer",
        type: "symbol",
        source: "minimap-markers",
        layout: {
          "text-field": "▲",
          "text-size": 30,
          "text-allow-overlap": true,
          "text-ignore-placement": true,
        },
        paint: {
          "text-color": ["get", "color"],
          "text-halo-color": "rgba(255,255,255,0.6)",
          "text-halo-width": 1,
        },
      });
      if (onMarkerClick) {
        map.on("click", "minimap-markers-layer", (e) => {
          const props = e.features[0].properties;
          try {
            const data = JSON.parse(props.peakData || "{}");
            const coords = e.features[0].geometry.coordinates;
            onMarkerClick({ lat: coords[1], lng: coords[0], color: props.color, data }, props.idx);
          } catch(err) {}
        });
        map.on("mouseenter", "minimap-markers-layer", () => { map.getCanvas().style.cursor = "pointer"; });
        map.on("mouseleave", "minimap-markers-layer", () => { map.getCanvas().style.cursor = ""; });
      }
    }
  }, [markers, mapReady]);

  return (
    <div style={{ position: "relative", height: height === "100%" ? "100%" : (height || "380px"), flex: height === "100%" ? 1 : undefined, minHeight: height === "100%" ? "200px" : undefined, borderRadius: height === "100%" ? 0 : "14px", overflow: "hidden", border: height === "100%" ? "none" : "1px solid rgba(90,152,227,0.12)" }}>
      <div ref={containerRef} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%" }} />
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
   USERNAME PROMPT (shown once after signup if no username set)
   ═══════════════════════════════════════════════════════════════════ */
const UsernamePrompt = ({ onDone, fullName }) => {
  const [username, setUsername] = useState("");
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState(null); // null | true | false
  const [saving, setSaving] = useState(false);
  const debounceRef = useRef(null);

  const checkAvailability = (val) => {
    setAvailable(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val || val.length < 3) return;
    debounceRef.current = setTimeout(async () => {
      setChecking(true);
      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", val.toLowerCase())
        .maybeSingle();
      setChecking(false);
      setAvailable(!data);
    }, 500);
  };

  const handleChange = (val) => {
    const clean = val.toLowerCase().replace(/[^a-z0-9_]/g, "");
    setUsername(clean);
    checkAvailability(clean);
  };

  const handleSave = async () => {
    if (!available || !username) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.auth.updateUser({ data: { ...user.user_metadata, username } });
      await supabase.from("profiles").upsert({ id: user.id, username, full_name: user.user_metadata?.full_name, location: user.user_metadata?.location }, { onConflict: "id" });
    }
    onDone(username);
  };

  const handleSkip = () => onDone(null);

  const statusColor = checking ? "#BDD6F4" : available === true ? "#6BCB77" : available === false ? "#E85D3A" : "#BDD6F4";
  const statusText = checking ? "Checking…" : available === true ? "✓ Available" : available === false ? "✗ Already taken" : username.length > 0 && username.length < 3 ? "At least 3 characters" : "";

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", background: "#041e3d", minHeight: "100vh" }}>
      <div style={{ width: "100%", maxWidth: "360px", animation: "su .4s ease" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "linear-gradient(135deg,#E85D3A,#F49D37)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", animation: "glow 3s ease infinite" }}>
            <Mountain size={26} color="#F8F8F8" />
          </div>
          <div style={{ fontSize: "22px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'Playfair Display',serif" }}>Choose a username</div>
          <div style={{ fontSize: "13px", color: "#BDD6F4", opacity: 0.6, marginTop: "6px" }}>
            How the community will find you.<br />You can skip this for now.
          </div>
        </div>

        <div style={{ marginBottom: "6px" }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "13px", color: "#BDD6F4", opacity: 0.5 }}>@</span>
            <input
              type="text"
              placeholder="yourname"
              value={username}
              onChange={e => handleChange(e.target.value)}
              maxLength={30}
              style={{ width: "100%", padding: "12px 14px 12px 28px", borderRadius: "10px", border: `1px solid ${available === true ? "rgba(107,203,119,0.4)" : available === false ? "rgba(232,93,58,0.4)" : "rgba(90,152,227,0.2)"}`, background: "#0a2240", color: "#F8F8F8", fontSize: "13px", outline: "none", fontFamily: "'DM Sans'", transition: "border .2s" }}
            />
          </div>
          {statusText && <div style={{ fontSize: "11px", color: statusColor, marginTop: "5px", paddingLeft: "4px" }}>{statusText}</div>}
        </div>

        <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.4, marginBottom: "20px", paddingLeft: "4px" }}>
          Letters, numbers and underscores only
        </div>

        <button onClick={handleSave} disabled={!available || saving} style={{ width: "100%", padding: "13px", borderRadius: "12px", border: "none", background: available ? "linear-gradient(135deg,#E85D3A,#d04a2a)" : "#264f80", color: "#F8F8F8", fontSize: "14px", fontWeight: 700, cursor: available ? "pointer" : "default", fontFamily: "'DM Sans'", opacity: available ? 1 : 0.4, marginBottom: "10px", transition: "all .2s" }}>
          {saving ? "Saving…" : "Set Username"}
        </button>

        <button onClick={handleSkip} style={{ width: "100%", padding: "11px", borderRadius: "12px", border: "1px solid rgba(90,152,227,0.15)", background: "transparent", color: "#BDD6F4", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'" }}>
          Skip for now — use {fullName || "my name"}
        </button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   AUTH: LOGIN SCREEN
   ═══════════════════════════════════════════════════════════════════ */
const LoginScreen = ({ onLogin, onGoSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true);
    setError("");
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        const msg = typeof authError.message === "string" && authError.message
          ? authError.message
          : "Invalid email or password. Please try again.";
        setError(msg);
        return;
      }
      if (data?.user) onLogin(data.user);
    } catch (e) {
      setError(typeof e?.message === "string" ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(90,152,227,0.2)", background: "#0a2240", color: "#F8F8F8", fontSize: "13px", outline: "none", fontFamily: "'DM Sans'", marginBottom: "16px" }} />

        {error && (
          <div style={{ padding: "10px 12px", borderRadius: "8px", background: "rgba(232,93,58,0.1)", border: "1px solid rgba(232,93,58,0.2)", marginBottom: "12px", fontSize: "12px", color: "#E85D3A" }}>
            {error}
          </div>
        )}

        <button onClick={handleLogin} disabled={loading} style={{ width: "100%", padding: "13px", borderRadius: "12px", border: "none", background: loading ? "#264f80" : "linear-gradient(135deg,#E85D3A,#d04a2a)", color: "#F8F8F8", fontSize: "14px", fontWeight: 700, cursor: loading ? "default" : "pointer", fontFamily: "'DM Sans'", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Signing in…" : "Sign In"}
        </button>

        <div style={{ textAlign: "center", marginTop: "14px" }}>
          <span onClick={async () => {
            if (!email) { setError("Enter your email address above first."); return; }
            setLoading(true);
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
              redirectTo: window.location.origin + "/?reset=true",
            });
            setLoading(false);
            if (resetError) setError(resetError.message || "Could not send reset email.");
            else setError("✓ Password reset email sent — check your inbox.");
          }} style={{ fontSize: "12px", color: "#5A98E3", cursor: "pointer", fontWeight: 600 }}>
            Forgot your password?
          </span>
        </div>

        <div style={{ textAlign: "center", marginTop: "14px", fontSize: "13px", color: "#BDD6F4", opacity: 0.6 }}>
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValid = name && dob && email && password;

  const handleSignup = async () => {
    if (!isValid) return;
    // Under-13 check
    const birthDate = new Date(dob);
    const age = Math.floor((Date.now() - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
    if (age < 13) {
      setError("You must be 13 or older to create a TrailSync account.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            date_of_birth: dob,
            location: location || null,
          }
        }
      });
      if (authError) {
        console.error("RAW AUTH ERROR:", JSON.stringify(authError));
        const msg = authError?.message || authError?.error_description || authError?.msg || JSON.stringify(authError);
        setError(msg || "Could not create account. Please try again.");
        return;
      }
      if (data?.user) {
        // Supabase may require email confirmation — check
        if (data.session) {
          // Logged in immediately — no email confirmation required
          onSignup(name, username);
        } else {
          // Email confirmation sent
          setError("Please check your email to confirm your account, then sign in.");
        }
      } else {
        setError("Could not create account. Please try again.");
      }
    } catch (e) {
      const msg = typeof e?.message === "string" && e.message ? e.message : "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

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

        {error && (
          <div style={{ padding: "10px 12px", borderRadius: "8px", background: error.includes("check your email") ? "rgba(107,203,119,0.1)" : "rgba(232,93,58,0.1)", border: `1px solid ${error.includes("check your email") ? "rgba(107,203,119,0.2)" : "rgba(232,93,58,0.2)"}`, marginBottom: "12px", fontSize: "12px", color: error.includes("check your email") ? "#6BCB77" : "#E85D3A", lineHeight: 1.5 }}>
            {error}
          </div>
        )}

        <button onClick={handleSignup} disabled={!isValid || loading} style={{ width: "100%", padding: "13px", borderRadius: "12px", border: "none", background: isValid && !loading ? "linear-gradient(135deg,#E85D3A,#d04a2a)" : "#264f80", color: isValid ? "#F8F8F8" : "#BDD6F4", fontSize: "14px", fontWeight: 700, cursor: isValid && !loading ? "pointer" : "default", fontFamily: "'DM Sans'", opacity: isValid ? 1 : 0.5, transition: "all .2s" }}>
          {loading ? "Creating account…" : "Create Account"}
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
const HomePage = ({ userName, initialFilter, userId, followingIds, setFollowingIds, setFollowingCount, headerSearch, setHeaderSearch, openRoute, searchResults, setSearchResults, searching, setSearching }) => {
  const [wxOpen, setWxOpen] = useState(false);
  const [ff, setFf] = useState(initialFilter || "all");
  const [expandedArea, setExpandedArea] = useState(null);
  const [showSAIS, setShowSAIS] = useState(false);

  // Live posts
  const [livePosts, setLivePosts] = useState(FEED);
  const [postsLoading, setPostsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pullY, setPullY] = useState(0);
  const pullStartY = useRef(null);
  const feedRef = useRef(null);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [commentOpen, setCommentOpen] = useState(null); // postId
  const [commentText, setCommentText] = useState("");
  const [postComments, setPostComments] = useState({}); // { postId: [{user, text, time}] }
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const [confirmDeletePost, setConfirmDeletePost] = useState(null); // post id to delete

  // Run search whenever headerSearch changes
  useEffect(() => {
    if (headerSearch !== undefined) {
      handleSearch(headerSearch);
    }
  }, [headerSearch]);

  // Fetch posts once on mount — no auth needed, posts are public
  const fetchPosts = async () => {
    try {
      const { data, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (postsError) console.error("POSTS FETCH ERROR:", JSON.stringify(postsError));
      const liveMapped = (data || []).map(p => ({
        id: p.id,
        user_id: p.user_id,
        user: p.username || p.name || "TrailSyncer",
        av: (p.username || p.name || "T")[0].toUpperCase(),
        time: timeAgo(p.created_at),
        type: p.type || "summit",
        text: p.text,
        likes: p.likes || 0,
        comments: 0,
        peaks: p.peaks || [],
      }));
      const liveIds = new Set(liveMapped.map(p => String(p.id)));
      const hardcoded = FEED.filter(p => !liveIds.has(String(p.id)));
      const seen = new Set();
      const deduped = liveMapped.filter(p => {
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      });
      setLivePosts([...deduped, ...hardcoded]);
    } catch (e) {
      console.error("Failed to load posts:", e);
      setLivePosts(FEED);
    } finally {
      setPostsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // Fetch posts once auth is confirmed - fixes browser session timing
    if (userId) fetchPosts();
  }, [userId]);

  // Pull to refresh handler
  const handleTouchStart = (e) => {
    if (feedRef.current?.scrollTop === 0) {
      pullStartY.current = e.touches[0].clientY;
    }
  };
  const handleTouchMove = (e) => {
    if (pullStartY.current === null) return;
    const dy = e.touches[0].clientY - pullStartY.current;
    if (dy > 0 && dy < 100) setPullY(dy);
  };
  const handleTouchEnd = () => {
    if (pullY > 60) {
      setRefreshing(true);
      setPostsLoading(true);
      setPullY(0);
      pullStartY.current = null;
      fetchPosts();
    } else {
      setPullY(0);
      pullStartY.current = null;
    }
  };

  // Separately load liked posts once userId is known
  useEffect(() => {
    if (!userId) return;
    async function fetchLikes() {
      try {
        const { data: likes } = await supabase.from("post_likes").select("post_id").eq("user_id", userId);
        if (likes) setLikedPosts(new Set(likes.map(l => l.post_id)));
      } catch (e) {
        console.error("Failed to load liked posts:", e);
      }
    }
    fetchLikes();
  }, [userId]);

  const handleLike = async (postId) => {
    if (!userId) return;
    const liked = likedPosts.has(postId);
    // Optimistic update
    setLikedPosts(prev => {
      const next = new Set(prev);
      liked ? next.delete(postId) : next.add(postId);
      return next;
    });
    setLivePosts(prev => prev.map(p => p.id === postId ? { ...p, likes: Math.max(0, p.likes + (liked ? -1 : 1)) } : p));
    if (liked) {
      await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", userId);
      // Get current likes then decrement
      const { data: post } = await supabase.from("posts").select("likes").eq("id", postId).single();
      if (post) await supabase.from("posts").update({ likes: Math.max(0, (post.likes || 0) - 1) }).eq("id", postId);
    } else {
      await supabase.from("post_likes").insert({ post_id: postId, user_id: userId });
      const { data: post } = await supabase.from("posts").select("likes").eq("id", postId).single();
      if (post) await supabase.from("posts").update({ likes: (post.likes || 0) + 1 }).eq("id", postId);
    }
  };

  const handleFollowInSearch = async (targetId) => {
    if (!userId || !targetId) return;
    const isFollowing = followingIds?.has(targetId);
    setFollowingIds(prev => {
      const next = new Set(prev);
      isFollowing ? next.delete(targetId) : next.add(targetId);
      return next;
    });
    if (!isFollowing) {
      setFollowingCount && setFollowingCount(c => c + 1);
      await supabase.from("follows").upsert({ follower_id: userId, following_id: targetId }, { onConflict: "follower_id,following_id" });
    } else {
      setFollowingCount && setFollowingCount(c => Math.max(0, c - 1));
      await supabase.from("follows").delete().eq("follower_id", userId).eq("following_id", targetId);
    }
  };

  const handleSearch = async (q) => {
    setSearchQuery(q);
    if (!q || q.length < 2) { setSearchResults({ posts: [], users: [], routes: [], peaks: [] }); return; }
    setSearching(true);
    try {
      const ql = q.toLowerCase();

      // Live DB queries — posts and people
      const [postsRes, usersRes] = await Promise.all([
        supabase.from("posts").select("*").or(`text.ilike.%${q}%`).order("created_at", { ascending: false }).limit(8),
        supabase.from("profiles").select("*").or("username.ilike.%" + q + "%,name.ilike.%" + q + "%").limit(6),
      ]);

      // Also search hardcoded FEED posts (events, fundraisers, summits)
      const feedMatches = FEED.filter(p =>
        p.text?.toLowerCase().includes(ql) ||
        p.user?.toLowerCase().includes(ql) ||
        p.peaks?.some(pk => pk.toLowerCase().includes(ql)) ||
        p.type?.toLowerCase().includes(ql)
      );

      // Search routes from ROUTES array
      const routeMatches = ROUTES.filter(r =>
        r.name?.toLowerCase().includes(ql) ||
        r.reg?.toLowerCase().includes(ql) ||
        r.peaks?.some(pk => pk.toLowerCase().includes(ql)) ||
        r.cls?.toLowerCase().includes(ql)
      ).slice(0, 6);

      // Search peaks from PEAKS array
      const peakMatches = PEAKS.filter(p =>
        p.name?.toLowerCase().includes(ql) ||
        p.reg?.toLowerCase().includes(ql) ||
        p.cls?.toLowerCase().includes(ql)
      ).slice(0, 5);

      // Merge live + hardcoded posts, deduplicate by id
      const livePostsMapped = (postsRes.data || []).map(p => ({
        id: p.id, user: p.username || p.name || "TrailSyncer",
        av: (p.username || p.name || "T")[0].toUpperCase(),
        time: timeAgo(p.created_at), type: p.type || "summit",
        text: p.text, likes: p.likes || 0, comments: 0, peaks: p.peaks || [],
        isLive: true,
      }));
      const liveIds = new Set(livePostsMapped.map(p => String(p.id)));
      const hardcodedMatches = feedMatches.filter(p => !liveIds.has(String(p.id)));
      const allPosts = [...livePostsMapped, ...hardcodedMatches].slice(0, 10);

      setSearchResults({
        posts: allPosts,
        users: usersRes.data || [],
        routes: routeMatches,
        peaks: peakMatches,
      });
    } catch (e) { console.error(e); }
    finally { setSearching(false); }
  };

  // Weather state
  const [wxDay, setWxDay] = useState(0);          // 0=today, 1=tomorrow, -1=best of week
  const [wxData, setWxData] = useState({});        // region → {days, bestDay}
  const [wxLoading, setWxLoading] = useState(true);
  const [wxError, setWxError] = useState(null);
  const [wxUpdated, setWxUpdated] = useState(null);
  const [peakWx, setPeakWx] = useState({});        // "peakName-day" → weather obj
  const [peakWxLoading, setPeakWxLoading] = useState({});
  const [selPeakWx, setSelPeakWx] = useState(null); // { peak, wx } — drives weather card modal

  useEffect(() => {
    if (initialFilter) setFf(initialFilter);
  }, [initialFilter]);

  // Fetch all region weather on mount and every 30 mins
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setWxLoading(true);
      setWxError(null);
      try {
        const results = await Promise.all(
          WX_REGIONS.map(r => fetchRegionWeather(r, 0).then(data => ({ region: r.region, data })))
        );
        if (cancelled) return;
        const map = {};
        results.forEach(({ region, data }) => { map[region] = data; });
        setWxData(map);
        setWxUpdated(new Date());
      } catch (e) {
        if (!cancelled) setWxError("Weather unavailable — check your connection");
      } finally {
        if (!cancelled) setWxLoading(false);
      }
    }
    load();
    const iv = setInterval(load, 30 * 60 * 1000);
    return () => { cancelled = true; clearInterval(iv); };
  }, []);

  // Build sorted area list from live data
  const sorted = WX_REGIONS.map(region => {
    const data = wxData[region.region];
    if (!data) return { ...region, score: 0, temp: 0, feels: 0, wind: 0, precip: 0, vis: "moderate", ic: "cloud", loading: true };
    const day = wxDay === -1 ? data.bestDay : (data.days[wxDay] || data.days[0]);
    return {
      ...region,
      score:  day.score,
      temp:   day.tempC,
      feels:  day.feels,
      wind:   day.wind,
      precip: day.precip,
      vis:    day.vis,
      ic:     day.ic,
      loading: false,
      isBestDay: wxDay === -1,
      bestDayName: wxDay === -1 ? new Date(data.bestDay.date).toLocaleDateString("en-GB", { weekday: "short" }) : null,
    };
  }).sort((a, b) => b.score - a.score);

  // Fetch peak weather when a region is expanded
  useEffect(() => {
    if (expandedArea === null) return;
    const area = sorted[expandedArea];
    if (!area) return;
    const regionPeaks = (() => {
      const exact = PEAKS_FALLBACK.filter(p => p.reg === area.region);
      if (exact.length > 0) return exact.slice(0, 6);
      const rWords = area.region.toLowerCase().split(" ").filter(w => w.length > 3);
      return PEAKS_FALLBACK.filter(p => rWords.some(w => p.reg.toLowerCase().includes(w))).slice(0, 6);
    })();

    regionPeaks.forEach(pk => {
      const key = `${pk.id}-${wxDay}`;
      if (peakWx[key] || peakWxLoading[key]) return;
      setPeakWxLoading(prev => ({ ...prev, [key]: true }));
      const offset = wxDay === -1 ? 0 : wxDay;
      fetchPeakWeather(pk, offset).then(w => {
        if (w) setPeakWx(prev => ({ ...prev, [key]: w }));
        setPeakWxLoading(prev => ({ ...prev, [key]: false }));
      });
    });
  }, [expandedArea, wxDay, wxData]);

  return (
    <div
        ref={feedRef}
        onTouchStart={handleTouchStart}
        onTouchMove={(e) => { handleTouchMove(e); if (pullY > 0) e.preventDefault(); }}
        onTouchEnd={handleTouchEnd}
        style={{ padding: "0 16px 16px", overflowY: "auto", flex: 1, position: "relative", overscrollBehavior: "none" }}>

        {/* Pull to refresh indicator */}
        <div style={{
          display: "flex", justifyContent: "center", alignItems: "center",
          height: refreshing ? "52px" : `${Math.min(pullY * 0.6, 52)}px`,
          overflow: "hidden", transition: refreshing ? "none" : "height 0.2s ease",
          opacity: refreshing ? 1 : Math.min(pullY / 60, 1),
        }}>
          <div style={{
            width: "28px", height: "28px", borderRadius: "50%",
            border: "2.5px solid rgba(90,152,227,0.2)",
            borderTop: "2.5px solid #5A98E3",
            animation: refreshing ? "spin 0.7s linear infinite" : "none",
            transform: refreshing ? "none" : `rotate(${pullY * 3}deg)`,
            transition: refreshing ? "none" : "transform 0.05s linear",
          }} />
        </div>
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
            {wxLoading ? (
              <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "8px", background: "rgba(90,152,227,0.15)", color: "#BDD6F4", fontWeight: 600 }}>Loading…</span>
            ) : wxError ? (
              <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "8px", background: "rgba(232,93,58,0.12)", color: "#E85D3A", fontWeight: 600 }}>Offline</span>
            ) : (
              <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "8px", background: "rgba(107,203,119,0.15)", color: "#6BCB77", fontWeight: 600 }}>Live</span>
            )}
          </span>
          <ChevronDown size={18} style={{ transform: wxOpen ? "rotate(180deg)" : "none", transition: ".3s", color: "#BDD6F4" }} />
        </button>
        {wxOpen && (
          <div style={{ background: "#0a2240", borderRadius: "0 0 14px 14px", border: "1px solid rgba(90,152,227,0.15)", borderTop: "none" }}>
            {/* Day picker */}
            <div style={{ padding: "10px 14px 6px", display: "flex", gap: "4px", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: "4px" }}>
                {[[-1, "Best day"], [0, "Today"], [1, "Tomorrow"], [2, "Day after"]].map(([d, label]) => (
                  <button key={d} onClick={() => { setWxDay(d); setExpandedArea(null); }} style={{
                    padding: "4px 10px", borderRadius: "8px", border: "none", cursor: "pointer",
                    background: wxDay === d ? "rgba(90,152,227,0.2)" : "transparent",
                    color: wxDay === d ? "#5A98E3" : "#BDD6F4",
                    fontSize: "10px", fontWeight: wxDay === d ? 700 : 500, fontFamily: "'DM Sans'"
                  }}>{label}</button>
                ))}
              </div>
              {wxUpdated && !wxLoading && (
                <span style={{ fontSize: "9px", color: "#BDD6F4", opacity: 0.4 }}>
                  {wxUpdated.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
            </div>
            <div style={{ padding: "0 14px 4px", fontSize: "10px", color: "#BDD6F4", opacity: 0.5 }}>
              Ranked: wind 30% · feels-like 25% · precip 25% · vis 20% · summit altitude adjusted
            </div>
            {sorted.map((a, i) => {
              const isExpanded = expandedArea === i;
              // Always use PEAKS_FALLBACK for weather display — Supabase peaks use different region names
              const regionPeaks = PEAKS_FALLBACK.filter(p => p.reg === a.region);
              const loosePeaks = regionPeaks.length > 0 ? regionPeaks : PEAKS_FALLBACK.filter(p => {
                const rWords = a.region.toLowerCase().split(" ").filter(w => w.length > 3);
                return rWords.some(w => p.reg.toLowerCase().includes(w));
              });
              const displayPeaks = loosePeaks.slice(0, 6);

              return (
                <div key={i}>
                  <div onClick={() => !a.loading && setExpandedArea(isExpanded ? null : i)} style={{
                    padding: "12px 14px", display: "flex", alignItems: "center", gap: "12px",
                    borderTop: "1px solid rgba(90,152,227,0.1)", cursor: a.loading ? "default" : "pointer",
                    background: isExpanded ? "rgba(90,152,227,0.06)" : i === 0 && !a.loading ? "rgba(107,203,119,0.04)" : "transparent",
                    animation: `fi .3s ease ${i * .04}s both`,
                    transition: "background .2s", opacity: a.loading ? 0.5 : 1
                  }}>
                    <div style={{
                      width: "30px", height: "30px", borderRadius: "9px",
                      background: a.loading ? "rgba(90,152,227,0.08)" :
                        a.score >= 85 ? "rgba(107,203,119,0.12)" : a.score >= 70 ? "rgba(235,203,139,0.12)" : "rgba(232,93,58,0.12)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "12px", fontWeight: 800,
                      color: a.loading ? "#BDD6F4" : a.score >= 85 ? "#6BCB77" : a.score >= 70 ? "#EBCB8B" : "#E85D3A"
                    }}>{a.loading ? "—" : a.score}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 700, color: "#F8F8F8" }}>{a.region}</span>
                        <span style={{ fontSize: "9px", padding: "1px 6px", borderRadius: "4px", background: `${CLS[a.cls]?.color}18`, color: CLS[a.cls]?.color, fontWeight: 600 }}>
                          {CLS[a.cls]?.name}
                        </span>
                        {a.isBestDay && a.bestDayName && !a.loading && (
                          <span style={{ fontSize: "9px", padding: "1px 6px", borderRadius: "4px", background: "rgba(107,203,119,0.12)", color: "#6BCB77", fontWeight: 600 }}>
                            {a.bestDayName}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.6, marginTop: "1px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {a.peaks.join(" · ")}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center", flexShrink: 0 }}>
                      {a.loading ? (
                        <div style={{ width: "60px", height: "28px", borderRadius: "6px", background: "rgba(90,152,227,0.08)" }} />
                      ) : (
                        <>
                          <WI type={a.ic} size={18} />
                          <div style={{ textAlign: "right", minWidth: "42px" }}>
                            <div style={{ fontSize: "12px", fontWeight: 700, color: a.feels < -5 ? "#BDD6F4" : "#F8F8F8" }}>{a.feels}°</div>
                            <div style={{ fontSize: "8px", color: "#BDD6F4", opacity: 0.5 }}>feels</div>
                          </div>
                          <div style={{ textAlign: "right", minWidth: "36px" }}>
                            <div style={{ fontSize: "12px", fontWeight: 700, color: a.wind > 35 ? "#E85D3A" : a.wind >= 20 ? "#F49D37" : "#F8F8F8" }}>{a.wind}</div>
                            <div style={{ fontSize: "8px", color: "#BDD6F4", opacity: 0.5 }}>mph</div>
                          </div>
                        </>
                      )}
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
                          <span>Wind: {a.wind}mph</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        {displayPeaks.map((pk, j) => {
                          const key = `${pk.id}-${wxDay}`;
                          const lw = peakWx[key];
                          const loading = peakWxLoading[key];
                          return (
                          <div key={pk.id}
                            onClick={() => {
                              // Open card immediately — fetch if not yet loaded
                              setSelPeakWx({ peak: pk, wx: lw || null });
                              if (!lw && !loading) {
                                const offset = Math.max(0, wxDay);
                                setPeakWxLoading(prev => ({ ...prev, [key]: true }));
                                fetchPeakWeather(pk, offset).then(w => {
                                  if (w) {
                                    setPeakWx(prev => ({ ...prev, [key]: w }));
                                    setSelPeakWx({ peak: pk, wx: w });
                                  }
                                  setPeakWxLoading(prev => ({ ...prev, [key]: false }));
                                });
                              }
                            }}
                            style={{
                              display: "flex", alignItems: "center", gap: "10px",
                              padding: "9px 10px", borderRadius: "10px",
                              background: "#041e3d", border: "1px solid rgba(90,152,227,0.08)",
                              animation: `fi .2s ease ${j * .05}s both`,
                              cursor: "pointer",
                              transition: "border .15s"
                            }}>
                            <Mountain size={14} color={CLS[pk.cls]?.color} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: "12px", fontWeight: 700, color: "#F8F8F8" }}>{pk.name}</div>
                              <div style={{ fontSize: "9px", color: "#BDD6F4", opacity: 0.5 }}>{pk.ht}m · {pk.reg}</div>
                            </div>
                            {loading && <div style={{ width: "70px", height: "28px", borderRadius: "6px", background: "rgba(90,152,227,0.08)" }} />}
                            {!loading && lw && lw.wi !== undefined && (
                              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                <WI type={lw.ic || "cloudsun"} size={14} />
                                <div style={{ textAlign: "center" }}>
                                  <div style={{ fontSize: "11px", fontWeight: 700, color: lw.f < -5 ? "#BDD6F4" : "#F8F8F8" }}>{lw.f}°</div>
                                  <div style={{ fontSize: "7px", color: "#BDD6F4", opacity: 0.4 }}>feels</div>
                                </div>
                                <div style={{ textAlign: "center" }}>
                                  <div style={{ fontSize: "11px", fontWeight: 700, color: lw.wi > 35 ? "#E85D3A" : lw.wi >= 20 ? "#F49D37" : "#F8F8F8" }}>{lw.wi}<span style={{ fontSize: "8px" }}>mph</span></div>
                                  <div style={{ fontSize: "7px", color: "#BDD6F4", opacity: 0.4 }}>wind</div>
                                </div>
                                {lw.sn && <Snowflake size={12} color="#BDD6F4" />}
                                <ChevronRight size={12} color="#BDD6F4" style={{ opacity: 0.4 }} />
                              </div>
                            )}
                          </div>
                        );})}
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

      {/* ═══ PEAK WEATHER CARD MODAL ═══ */}
      {selPeakWx && (
        <div onClick={() => setSelPeakWx(null)} style={{
          position: "fixed", inset: 0, zIndex: 60,
          background: "rgba(4,30,61,0.7)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "flex-end", justifyContent: "center",
          padding: "0 0 0 0", animation: "fi .2s ease"
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width: "100%", maxWidth: "480px",
            background: "#0a2240", borderRadius: "20px 20px 0 0",
            border: "1px solid rgba(90,152,227,0.2)", borderBottom: "none",
            animation: "su .3s ease", maxHeight: "88vh", display: "flex", flexDirection: "column"
          }}>
            {/* Drag handle — tap to close */}
            <div onClick={() => setShowFollowers(null)} style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px", cursor: "pointer" }}>
              <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "rgba(90,152,227,0.35)" }} />
            </div>

            {/* Header — always shown */}
            <div style={{ padding: "4px 18px 14px", borderBottom: "1px solid rgba(90,152,227,0.1)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div>
                  <div style={{ fontSize: "18px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'Playfair Display',serif" }}>{selPeakWx.peak.name}</div>
                  <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.6, marginTop: "2px" }}>{selPeakWx.peak.ht}m · {selPeakWx.peak.reg} · {CLS[selPeakWx.peak.cls]?.name}</div>
                </div>
                <button onClick={() => setSelPeakWx(null)} style={{ background: "#264f80", border: "none", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", color: "#BDD6F4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><X size={13} /></button>
              </div>

              {/* Hero weather or loading */}
              {selPeakWx.wx ? (
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "14px" }}>
                  <WI type={selPeakWx.wx.ic} size={48} />
                  <div>
                    <div style={{ fontSize: "42px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'JetBrains Mono'", lineHeight: 1 }}>{selPeakWx.wx.t}°</div>
                    <div style={{ fontSize: "13px", color: "#BDD6F4", marginTop: "2px" }}>Feels like <span style={{ color: selPeakWx.wx.f < -10 ? "#5A98E3" : selPeakWx.wx.f < 0 ? "#BDD6F4" : "#F8F8F8", fontWeight: 700 }}>{selPeakWx.wx.f}°</span></div>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "14px" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(90,152,227,0.08)" }} />
                  <div>
                    <div style={{ width: "80px", height: "32px", borderRadius: "8px", background: "rgba(90,152,227,0.08)", marginBottom: "6px" }} />
                    <div style={{ width: "100px", height: "14px", borderRadius: "6px", background: "rgba(90,152,227,0.06)" }} />
                  </div>
                </div>
              )}
            </div>

            <div style={{ overflowY: "auto", flex: 1 }}>
              {!selPeakWx.wx ? (
                /* Loading state */
                <div style={{ padding: "30px", textAlign: "center" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#5A98E3", margin: "0 auto", animation: "pulse 1s ease infinite" }} />
                  <div style={{ fontSize: "12px", color: "#BDD6F4", opacity: 0.5, marginTop: "10px" }}>Fetching summit forecast…</div>
                </div>
              ) : (
                <>
                  {/* Stats grid */}
                  <div style={{ padding: "14px 18px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                    {[
                      ["Wind", `${selPeakWx.wx.wi}mph`, selPeakWx.wx.wi > 35 ? "#E85D3A" : selPeakWx.wx.wi >= 20 ? "#F49D37" : "#F8F8F8"],
                      ["Gusts", `${selPeakWx.wx.gusts}mph`, selPeakWx.wx.gusts > 50 ? "#E85D3A" : selPeakWx.wx.gusts > 30 ? "#F49D37" : "#F8F8F8"],
                      ["Rain %", `${selPeakWx.wx.pct}%`, selPeakWx.wx.pct > 70 ? "#5A98E3" : "#F8F8F8"],
                      ["Precip", `${selPeakWx.wx.p}mm`, "#5A98E3"],
                      ["Sunrise", selPeakWx.wx.sunrise, "#F49D37"],
                      ["Sunset", selPeakWx.wx.sunset, "#E85D3A"],
                      ["Visibility", selPeakWx.wx.v, selPeakWx.wx.v === "poor" ? "#E85D3A" : selPeakWx.wx.v === "moderate" ? "#F49D37" : "#6BCB77"],
                      ["Snow", selPeakWx.wx.sn ? "Yes" : "No", selPeakWx.wx.sn ? "#BDD6F4" : "#6BCB77"],
                      ["Feels", `${selPeakWx.wx.f}°`, selPeakWx.wx.f < -10 ? "#5A98E3" : selPeakWx.wx.f < 0 ? "#BDD6F4" : "#F8F8F8"],
                    ].map(([label, val, color]) => (
                      <div key={label} style={{ background: "#041e3d", borderRadius: "10px", padding: "10px", textAlign: "center" }}>
                        <div style={{ fontSize: "14px", fontWeight: 700, color, fontFamily: "'JetBrains Mono'" }}>{val}</div>
                        <div style={{ fontSize: "9px", color: "#BDD6F4", opacity: 0.5, marginTop: "3px" }}>{label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Hourly forecast */}
                  {selPeakWx.wx.hours && (
                    <div style={{ padding: "0 18px 24px" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#BDD6F4", opacity: 0.6, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Hour by hour</div>
                      <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "6px" }}>
                        {selPeakWx.wx.hours.filter(h => h.hour >= 5 && h.hour <= 21).map(h => (
                          <div key={h.hour} style={{
                            flexShrink: 0, width: "54px", textAlign: "center",
                            background: "#041e3d", borderRadius: "10px", padding: "8px 4px",
                            border: "1px solid rgba(90,152,227,0.06)"
                          }}>
                            <div style={{ fontSize: "9px", color: "#BDD6F4", opacity: 0.5, marginBottom: "5px" }}>
                              {h.hour < 12 ? `${h.hour}am` : h.hour === 12 ? "12pm" : `${h.hour - 12}pm`}
                            </div>
                            <WI type={wxIcon(h.code)} size={16} />
                            <div style={{ fontSize: "12px", fontWeight: 700, color: "#F8F8F8", marginTop: "5px" }}>{h.temp}°</div>
                            <div style={{ fontSize: "9px", fontWeight: 600, color: h.wind > 35 ? "#E85D3A" : h.wind >= 20 ? "#F49D37" : "#BDD6F4", marginTop: "3px" }}>{h.wind}mph</div>
                            <div style={{ fontSize: "8px", color: "#5A98E3", marginTop: "2px" }}>{h.precip}%</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize: "9px", color: "#BDD6F4", opacity: 0.35, marginTop: "6px" }}>
                        temp · wind · rain chance · altitude adjusted
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══ POST DELETE CONFIRM ═══ */}
      {confirmDeletePost && (
        <div style={{ position: "fixed", inset: 0, zIndex: 80, background: "rgba(4,30,61,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", animation: "fi .15s ease" }}>
          <div style={{ background: "#0a2240", borderRadius: "16px", border: "1px solid rgba(232,93,58,0.2)", padding: "24px", width: "100%", maxWidth: "320px", textAlign: "center" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(232,93,58,0.1)", border: "1px solid rgba(232,93,58,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <Trash2 size={20} color="#E85D3A" />
            </div>
            <div style={{ fontSize: "16px", fontWeight: 800, color: "#F8F8F8", marginBottom: "8px" }}>Delete Post?</div>
            <div style={{ fontSize: "13px", color: "#BDD6F4", opacity: 0.6, marginBottom: "20px" }}>This can't be undone.</div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setConfirmDeletePost(null)} style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "1px solid rgba(90,152,227,0.2)", background: "transparent", color: "#BDD6F4", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'" }}>
                Cancel
              </button>
              <button onClick={async () => {
                const postId = confirmDeletePost;
                setConfirmDeletePost(null);
                await supabase.from("posts").delete().eq("id", postId).eq("user_id", userId);
                setLivePosts(prev => prev.filter(p => p.id !== postId));
              }} style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#E85D3A,#d04a2a)", color: "#F8F8F8", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'" }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

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
        {livePosts.filter(p => ff === "all" || (ff === "summits" && p.type === "summit") || (ff === "events" && p.type === "event") || (ff === "news" && p.type === "news") || (ff === "fundraiser" && p.type === "fundraiser")).map((p, i) => (
          <div key={p.id} style={{
            background: "#0a2240", borderRadius: "14px", padding: "14px",
            border: "1px solid rgba(90,152,227,0.1)", animation: `su .3s ease ${.35 + i * .05}s both`
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <div onClick={() => p.user_id && onViewProfile && onViewProfile({ id: p.user_id, name: p.user, username: p.user })} style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg,#264f80,#5A98E3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "17px", fontWeight: 700, color: "#F8F8F8", cursor: p.user_id ? "pointer" : "default", flexShrink: 0 }}>{p.av}</div>
              <div style={{ flex: 1 }}>
                <div onClick={() => p.user_id && onViewProfile && onViewProfile({ id: p.user_id, name: p.user, username: p.user })} style={{ fontSize: "13px", fontWeight: 700, color: "#F8F8F8", cursor: p.user_id ? "pointer" : "default", display: "inline-block" }}>{p.user}</div>
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
              <button onClick={() => handleLike(p.id)} style={{ background: "none", border: "none", color: likedPosts.has(p.id) ? "#E85D3A" : "#BDD6F4", opacity: likedPosts.has(p.id) ? 1 : 0.5, fontSize: "11px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontFamily: "'DM Sans'" }}><Heart size={14} fill={likedPosts.has(p.id) ? "#E85D3A" : "none"} /> {p.likes}</button>
              <button onClick={() => setCommentOpen(commentOpen === p.id ? null : p.id)} style={{ background: "none", border: "none", color: commentOpen === p.id ? "#5A98E3" : "#BDD6F4", opacity: commentOpen === p.id ? 1 : 0.5, fontSize: "11px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontFamily: "'DM Sans'" }}><MessageCircle size={14} /> {(postComments[p.id] || []).length || p.comments || 0}</button>
              <button style={{ background: "none", border: "none", color: "#BDD6F4", opacity: 0.5, fontSize: "11px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontFamily: "'DM Sans'" }}><Share2 size={14} /></button>
              {p.user_id === userId && (
                <button onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDeletePost(p.id);
                }} style={{ background: "none", border: "none", color: "#E85D3A", opacity: 0.5, fontSize: "11px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontFamily: "'DM Sans'", marginLeft: "auto" }}><Trash2 size={13} /></button>
              )}
            </div>

            {/* Comment section */}
            {commentOpen === p.id && (
              <div style={{ marginTop: "10px", borderTop: "1px solid rgba(90,152,227,0.08)", paddingTop: "10px" }}>
                {(postComments[p.id] || []).map((c, ci) => (
                  <div key={ci} style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "flex-start" }}>
                    <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "linear-gradient(135deg,#264f80,#5A98E3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "#F8F8F8", flexShrink: 0 }}>{c.av}</div>
                    <div style={{ flex: 1, background: "rgba(90,152,227,0.06)", borderRadius: "10px", padding: "7px 10px" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#5A98E3", marginBottom: "2px" }}>{c.user}</div>
                      <div style={{ fontSize: "12px", color: "#BDD6F4", lineHeight: 1.4 }}>{c.text}</div>
                    </div>
                  </div>
                ))}
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "6px" }}>
                  <input
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    onKeyDown={async e => {
                      if (e.key === "Enter" && commentText.trim()) {
                        const txt = commentText.trim();
                        setPostComments(prev => ({ ...prev, [p.id]: [...(prev[p.id] || []), { user: userName, av: (userName||"U")[0].toUpperCase(), text: txt }] }));
                        setCommentText("");
                        await supabase.from("post_comments").insert({ post_id: p.id, user_id: userId, username: userName, text: txt }).catch(() => {});
                      }
                    }}
                    placeholder="Add a comment…"
                    style={{ flex: 1, padding: "8px 12px", borderRadius: "20px", border: "1px solid rgba(90,152,227,0.15)", background: "#0a2240", color: "#F8F8F8", fontSize: "12px", fontFamily: "'DM Sans'", outline: "none" }}
                  />
                  <button onClick={async () => {
                    if (!commentText.trim()) return;
                    const txt = commentText.trim();
                    setPostComments(prev => ({ ...prev, [p.id]: [...(prev[p.id] || []), { user: userName, av: (userName||"U")[0].toUpperCase(), text: txt }] }));
                    setCommentText("");
                    await supabase.from("post_comments").insert({ post_id: p.id, user_id: userId, username: userName, text: txt }).catch(() => {});
                  }} style={{ padding: "8px 14px", borderRadius: "20px", border: "none", background: "linear-gradient(135deg,#5A98E3,#264f80)", color: "#F8F8F8", fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'", flexShrink: 0 }}>Post</button>
                </div>
              </div>
            )}
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
  { name: "Kintail", lat: 57.1987, lng: -5.3487, routes: [] },
];

/* ═══════════════════════════════════════════════════════════════════
   ROUTES CLUSTER MAP (native Mapbox clustering)
   ═══════════════════════════════════════════════════════════════════ */
const RoutesClusterMap = ({ filtered, selRegion, setSelRegion, onMapReady }) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [activeGpxId, setActiveGpxId] = useState(null);
  const [gpxLoading, setGpxLoading] = useState(false);

  async function loadRouteGpx(route) {
    if (!mapRef.current) return;
    if (!route.gpx_file) return;
    if (activeGpxId === route.id) {
      removeGpxFromMap(mapRef.current, route.id);
      setActiveGpxId(null);
      return;
    }
    if (activeGpxId) removeGpxFromMap(mapRef.current, activeGpxId);
    setGpxLoading(true);
    try {
      const xml = await fetchGpxText(route.gpx_file);
      const coords = parseGpxCoords(xml);
      if (coords.length > 1) {
        drawGpxOnMap(mapRef.current, route.id, coords, { color: "#E85D3A", fitBounds: true });
        setActiveGpxId(route.id);
      }
    } catch (err) {
      console.error("GPX draw error:", err);
    } finally {
      setGpxLoading(false);
    }
  }

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;
    const timer = setTimeout(() => {
      if (!containerRef.current || containerRef.current.clientHeight === 0) return;
      import("mapbox-gl").then(mod => {
        const mapboxgl = mod.default;
        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
        const map = new mapboxgl.Map({
          container: containerRef.current,
          style: "mapbox://styles/mapbox/outdoors-v12",
          center: [-4.5, 56.5],
          zoom: 5.5,
          interactive: true,
        });
        map.addControl(new mapboxgl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: true, showUserHeading: true }), "bottom-right");
        mapRef.current = map;

        map.on("load", () => {
          if (onMapReady) onMapReady(map);
          // Build GeoJSON from routes with small offsets so they spread when zoomed
          const features = filtered.map((r, i) => {
            // Use first matched peak coords for accuracy, fall back to region centre
            const peakMatch = PEAKS.find(p => r.peaks && r.peaks.includes(p.name));
            const region = ROUTE_REGIONS.find(rr => rr.name === r.reg);
            const baseLat = peakMatch?.lat ?? region?.lat ?? 56.5;
            const baseLng = peakMatch?.lng ?? region?.lng ?? -4.5;
            // Tiny offset so multiple routes on the same peak spread slightly
            const offset = 0.008;
            const angle = (i / Math.max(filtered.length, 1)) * Math.PI * 2;
            const routeIdx = filtered.filter(x => x.reg === r.reg).indexOf(r);
            return {
              type: "Feature",
              properties: { id: r.id, name: r.name, dist: r.dist, elev: r.elev, diff: r.diff, cls: r.cls, time: r.time, region: r.reg },
              geometry: { type: "Point", coordinates: [baseLng + Math.cos(angle) * offset * (routeIdx + 1), baseLat + Math.sin(angle) * offset * (routeIdx + 1)] }
            };
          });

          map.addSource("routes", {
            type: "geojson",
            data: { type: "FeatureCollection", features },
            cluster: true,
            clusterMaxZoom: 12,
            clusterRadius: 50,
          });

          // Cluster circle layer
          map.addLayer({
            id: "clusters",
            type: "circle",
            source: "routes",
            filter: ["has", "point_count"],
            paint: {
              "circle-color": "#264f80",
              "circle-radius": ["step", ["get", "point_count"], 22, 5, 28, 10, 34],
              "circle-stroke-width": 2,
              "circle-stroke-color": "rgba(90,152,227,0.4)",
            }
          });

          // Cluster count label
          map.addLayer({
            id: "cluster-count",
            type: "symbol",
            source: "routes",
            filter: ["has", "point_count"],
            layout: {
              "text-field": ["get", "point_count_abbreviated"],
              "text-font": ["DIN Pro Medium", "Arial Unicode MS Bold"],
              "text-size": 14,
            },
            paint: { "text-color": "#F8F8F8" }
          });

          // Individual route dots
          map.addLayer({
            id: "unclustered-point",
            type: "circle",
            source: "routes",
            filter: ["!", ["has", "point_count"]],
            paint: {
              "circle-color": "#E85D3A",
              "circle-radius": 8,
              "circle-stroke-width": 2,
              "circle-stroke-color": "rgba(255,255,255,0.8)",
            }
          });

          // Click on cluster - zoom in
          map.on("click", "clusters", (e) => {
            const features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });
            const clusterId = features[0].properties.cluster_id;
            map.getSource("routes").getClusterExpansionZoom(clusterId, (err, zoom) => {
              if (err) return;
              map.easeTo({ center: features[0].geometry.coordinates, zoom: zoom });
            });
          });

          // Click on individual route - show details
          map.on("click", "unclustered-point", (e) => {
            const props = e.features[0].properties;
            const regionRoutes = filtered.filter(r => r.reg === props.region);
            const region = ROUTE_REGIONS.find(rr => rr.name === props.region);
            if (region) {
              setSelRegion({ ...region, routes: regionRoutes.length === 1 ? regionRoutes : filtered.filter(r => r.id === props.id) });
            }
          });

          // Cursor changes
          map.on("mouseenter", "clusters", () => { map.getCanvas().style.cursor = "pointer"; });
          map.on("mouseleave", "clusters", () => { map.getCanvas().style.cursor = ""; });
          map.on("mouseenter", "unclustered-point", () => { map.getCanvas().style.cursor = "pointer"; });
          map.on("mouseleave", "unclustered-point", () => { map.getCanvas().style.cursor = ""; });
        });
      });
    }, 150);
    return () => { clearTimeout(timer); if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, []);

  // Update source data when filtered routes change
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const source = map.getSource("routes");
    if (!source) return;

    const features = filtered.map((r, i) => {
      const peakMatch = PEAKS.find(p => r.peaks && r.peaks.includes(p.name));
      const region = ROUTE_REGIONS.find(rr => rr.name === r.reg);
      const baseLat = peakMatch?.lat ?? region?.lat ?? 56.5;
      const baseLng = peakMatch?.lng ?? region?.lng ?? -4.5;
      const offset = 0.008;
      const angle = (i / Math.max(filtered.length, 1)) * Math.PI * 2;
      const routeIdx = filtered.filter(x => x.reg === r.reg).indexOf(r);
      return {
        type: "Feature",
        properties: { id: r.id, name: r.name, dist: r.dist, elev: r.elev, diff: r.diff, cls: r.cls, time: r.time, region: r.reg },
        geometry: { type: "Point", coordinates: [baseLng + Math.cos(angle) * offset * (routeIdx + 1), baseLat + Math.sin(angle) * offset * (routeIdx + 1)] }
      };
    });
    source.setData({ type: "FeatureCollection", features });
  }, [filtered]);

  return (
    <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
      <div ref={containerRef} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} />
      {gpxLoading && (
        <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", zIndex: 25,
          background: "rgba(4,30,61,0.92)", backdropFilter: "blur(10px)", borderRadius: "20px",
          padding: "6px 16px", border: "1px solid rgba(90,152,227,0.2)", display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#E85D3A", animation: "pulse 1s ease infinite" }} />
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#BDD6F4", fontFamily: "'DM Sans'" }}>Loading route…</span>
        </div>
      )}
      {activeGpxId && (
        <div style={{ position: "absolute", top: 12, right: 12, zIndex: 25 }}>
          <button onClick={() => { removeGpxFromMap(mapRef.current, activeGpxId); setActiveGpxId(null); }}
            style={{ background: "rgba(4,30,61,0.92)", backdropFilter: "blur(10px)", border: "1px solid rgba(232,93,58,0.3)",
              borderRadius: "20px", padding: "5px 12px", color: "#E85D3A", fontSize: "11px", fontWeight: 600,
              cursor: "pointer", fontFamily: "'DM Sans'", display: "flex", alignItems: "center", gap: "5px" }}>
            <X size={11} /> Clear route
          </button>
        </div>
      )}
      {/* Pass loadRouteGpx up via a hidden div data attribute is not ideal —
          instead RoutesPage passes it down and the panel calls it directly */}
      <div style={{ display: "none" }} ref={el => { if (el) el._loadGpx = loadRouteGpx; }} />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   OFFLINE BANNER
   ═══════════════════════════════════════════════════════════════════ */
const OfflineIndicator = () => {
  const [offline, setOffline] = useState(false); // set properly in useEffect
  useEffect(() => {
    const go = () => setOffline(true);
    const back = () => setOffline(false);
    window.addEventListener("offline", go);
    window.addEventListener("online", back);
    return () => { window.removeEventListener("offline", go); window.removeEventListener("online", back); };
  }, []);
  if (!offline) return null;
  return (
    <div title="No internet connection" style={{ padding: "5px 8px", borderRadius: "7px", background: "rgba(244,157,55,0.12)", border: "1px solid rgba(244,157,55,0.25)", display: "flex", alignItems: "center", gap: "4px" }}>
      <WifiOff size={13} color="#F49D37" />
      <span style={{ fontSize: "10px", color: "#F49D37", fontWeight: 700, fontFamily: "'DM Sans'" }}>Offline</span>
    </div>
  );
};

const OfflineBanner = () => {
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline  = () => setOffline(false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online",  goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online",  goOnline);
    };
  }, []);
  if (!offline) return null;
  return (
    <div style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(244,157,55,0.1)", border: "1px solid rgba(244,157,55,0.25)", display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", animation: "fi .3s ease" }}>
      <WifiOff size={14} color="#F49D37" />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "12px", fontWeight: 700, color: "#F49D37" }}>You're offline</div>
        <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.6, marginTop: "1px" }}>Cached routes and data are still available</div>
      </div>
    </div>
  );
};

const RoutesPage = ({ openRoute }) => {
  const [cf, setCf] = useState(null);
  const [df, setDf] = useState(null);
  const [showCommunity, setShowCommunity] = useState(true);
  const [subTab, setSubTab] = useState("list");
  const [selRegion, setSelRegion] = useState(null);
  // GPX drawing now happens on main map via openRoute prop

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
    <div style={{ padding: subTab === "map" ? "0 16px 0" : "0 16px 16px", overflowY: subTab === "map" ? "hidden" : "auto", flex: 1, display: "flex", flexDirection: "column" }}>
      {/* Header with sub-tabs */}
      <div style={{ padding: "24px 0 12px", display: "flex", alignItems: "baseline", gap: "16px" }}>
        <div onClick={() => setSubTab("list")} style={{ fontSize: "24px", fontWeight: 800, color: subTab === "list" ? "#F8F8F8" : "#BDD6F4", fontFamily: "'Playfair Display',serif", cursor: "pointer", opacity: subTab === "list" ? 1 : 0.4, transition: "all .2s" }}>Routes</div>
        <div onClick={() => setSubTab("map")} style={{ fontSize: "24px", fontWeight: 800, color: subTab === "map" ? "#F8F8F8" : "#BDD6F4", fontFamily: "'Playfair Display',serif", cursor: "pointer", opacity: subTab === "map" ? 1 : 0.4, transition: "all .2s", display: "flex", alignItems: "center", gap: "8px" }}>
          Map
          <Map size={16} color={subTab === "map" ? "#5A98E3" : "#BDD6F4"} style={{ opacity: subTab === "map" ? 1 : 0.4 }} />
        </div>
        <div onClick={() => setSubTab("downloaded")} style={{ fontSize: "24px", fontWeight: 800, color: subTab === "downloaded" ? "#F8F8F8" : "#BDD6F4", fontFamily: "'Playfair Display',serif", cursor: "pointer", opacity: subTab === "downloaded" ? 1 : 0.4, transition: "all .2s", display: "flex", alignItems: "center", gap: "8px" }}>
          Downloaded
          <Download size={16} color={subTab === "downloaded" ? "#5A98E3" : "#BDD6F4"} style={{ opacity: subTab === "downloaded" ? 1 : 0.4 }} />
        </div>
      </div>

      {/* Shared filters */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "10px", flexWrap: "wrap", alignItems: "center" }}>
        {subTab !== "downloaded" && (
          <select value={cf || ""} onChange={e => setCf(e.target.value || null)} style={{ padding: "7px 12px", borderRadius: "10px", fontSize: "11px", fontWeight: 600, background: cf ? "rgba(232,93,58,0.1)" : "#0a2240", border: `1px solid ${cf ? "rgba(232,93,58,0.3)" : "rgba(90,152,227,0.12)"}`, color: cf ? "#E85D3A" : "#BDD6F4", outline: "none", cursor: "pointer", fontFamily: "'DM Sans'" }}>
            <option value="">All Classifications</option>
            {Object.entries(CLS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
          </select>
        )}
        <select value={df || ""} onChange={e => setDf(e.target.value || null)} style={{ padding: "7px 12px", borderRadius: "10px", fontSize: "11px", fontWeight: 600, background: df ? "rgba(90,152,227,0.1)" : "#0a2240", border: `1px solid ${df ? "rgba(90,152,227,0.3)" : "rgba(90,152,227,0.12)"}`, color: df ? "#5A98E3" : "#BDD6F4", outline: "none", cursor: "pointer", fontFamily: "'DM Sans'" }}>
          <option value="">All Difficulty</option>
          {["Easy", "Moderate", "Hard", "Expert"].map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        {subTab !== "map" && <button onClick={() => setShowCommunity(!showCommunity)} style={{ padding: "7px 12px", borderRadius: "10px", fontSize: "11px", fontWeight: 600, background: showCommunity ? "rgba(90,152,227,0.12)" : "#0a2240", border: `1px solid ${showCommunity ? "rgba(90,152,227,0.25)" : "rgba(90,152,227,0.12)"}`, color: showCommunity ? "#5A98E3" : "#BDD6F4", cursor: "pointer", fontFamily: "'DM Sans'", display: "flex", alignItems: "center", gap: "4px", opacity: showCommunity ? 1 : 0.5 }}>
          <Users size={12} /> Community
        </button>}
      </div>

      <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.4, marginBottom: "12px" }}>{filtered.length} routes found</div>

      {/* ═══ LIST VIEW ═══ */}
      {subTab === "list" && (
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {filtered.map((r, i) => (
              <div key={r.id}
                onClick={() => openRoute(r, subTab === "map" ? "routes-map" : "routes-list")}
                style={{ background: "#0a2240", borderRadius: "14px", padding: "14px",
                  border: "1px solid rgba(90,152,227,0.1)",
                  cursor: r.gpx_file ? "pointer" : "default", animation: `fi .3s ease ${i * .04}s both` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "8px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#F8F8F8", lineHeight: 1.3 }}>{r.name}</div>
                    <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.5, marginTop: "3px" }}>{r.reg} · Start: {r.start}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                    {(r.gpx_file || ROUTES.find(x => x.name === r.name && x.gpx_file)) && (
                      <span style={{ fontSize: "9px", padding: "2px 8px", borderRadius: "8px",
                        background: "rgba(232,93,58,0.12)", color: "#E85D3A", fontWeight: 700 }}>
                        View on map →
                      </span>
                    )}
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
                  <span style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.6, display: "flex", alignItems: "center", gap: "4px" }}><Navigation size={12} /> {r.dist}km</span>
                  <span style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.6, display: "flex", alignItems: "center", gap: "4px" }}><TrendingUp size={12} /> {r.elev}m</span>
                  <span style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.6, display: "flex", alignItems: "center", gap: "4px" }}><Clock size={12} /> {r.time}</span>
                </div>
                {r.peaks && r.peaks.length > 0 && <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>{r.peaks.map(pk => <span key={pk} style={{ fontSize: "9px", padding: "2px 6px", borderRadius: "5px", background: "rgba(232,93,58,0.08)", color: "#E85D3A", fontWeight: 600 }}>⛰️ {pk}</span>)}</div>}
              </div>
            ))}
          </div>
          <div style={{ padding: "14px 0", fontSize: "10px", color: "#BDD6F4", opacity: 0.4, textAlign: "center", fontStyle: "italic" }}>Community routes are not regulated. Please use at your own risk and always carry appropriate navigation equipment.</div>
        </div>
      )}

      {/* ═══ MAP VIEW ═══ */}
      {subTab === "map" && (
        <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column" }}>
        <RoutesClusterMap filtered={filtered} selRegion={selRegion} setSelRegion={setSelRegion} />

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
                    <div key={r.id}
                      onClick={() => openRoute(r, "routes-map")}
                      style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        padding: "8px 10px", borderRadius: "10px",
                        background: "#0a2240",
                        border: "1px solid rgba(90,152,227,0.08)",
                        animation: `fi .2s ease ${j * .04}s both`, cursor: r.gpx_file ? "pointer" : "default"
                      }}>
                      <Route size={14} color={CLS[r.cls]?.color} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "#F8F8F8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</div>
                        <div style={{ fontSize: "9px", color: "#BDD6F4", opacity: 0.5, marginTop: "1px" }}>{r.dist}km · {r.elev}m · {r.time}</div>
                      </div>
                      <div style={{ display: "flex", gap: "4px", flexShrink: 0, alignItems: "center" }}>
                        <span style={{ fontSize: "9px", padding: "1px 5px", borderRadius: "4px", background: `${CLS[r.cls]?.color}15`, color: CLS[r.cls]?.color, fontWeight: 600 }}>{CLS[r.cls]?.name}</span>
                        <span style={{ fontSize: "9px", padding: "1px 5px", borderRadius: "4px", background: `${dc(r.diff)}15`, color: dc(r.diff), fontWeight: 600 }}>{r.diff}</span>
                        {(r.gpx_file || ROUTES.find(x => x.name === r.name && x.gpx_file)) && (
                          <span style={{ fontSize: "9px", padding: "1px 6px", borderRadius: "4px",
                            background: "rgba(232,93,58,0.12)", color: "#E85D3A", fontWeight: 700 }}>
                            View →
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Downloaded tab */}
      {subTab === "downloaded" && (
        <div style={{ flex: 1, overflowY: "auto" }}>

          {/* Offline status banner */}
          <OfflineBanner />

          {/* Coming in native app callout */}
          <div style={{ margin: "16px 0", padding: "16px", borderRadius: "14px", background: "linear-gradient(135deg, rgba(90,152,227,0.08), rgba(90,152,227,0.04))", border: "1px solid rgba(90,152,227,0.15)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(90,152,227,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Download size={18} color="#5A98E3" />
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#F8F8F8" }}>Offline Routes</div>
                <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.6 }}>Download routes to use without signal</div>
              </div>
            </div>
            <div style={{ fontSize: "12px", color: "#BDD6F4", opacity: 0.7, lineHeight: 1.6, marginBottom: "12px" }}>
              Full offline route downloads — including OS map tiles, GPX tracks and elevation data — are coming with the TrailSync native app. Routes you download will be available even in areas with no signal.
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {["OS Map tiles", "GPX tracks", "Elevation data", "Peak info", "Weather cache"].map(f => (
                <span key={f} style={{ fontSize: "10px", padding: "3px 8px", borderRadius: "6px", background: "rgba(90,152,227,0.1)", color: "#5A98E3", fontWeight: 600 }}>{f}</span>
              ))}
            </div>
          </div>

          {/* Recently viewed — cached automatically */}
          <div style={{ marginBottom: "14px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#BDD6F4", opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>
              Cached from recent browsing
            </div>
            <div style={{ background: "#0a2240", borderRadius: "12px", border: "1px solid rgba(90,152,227,0.1)", overflow: "hidden" }}>
              {ROUTES.filter(r => r.gpx_file).slice(0, 3).map((r, i) => (
                <div key={r.id} style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: "12px", borderBottom: i < 2 ? "1px solid rgba(90,152,227,0.08)" : "none" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: "rgba(107,203,119,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Map size={16} color="#6BCB77" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#F8F8F8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</div>
                    <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.5, marginTop: "1px" }}>{r.dist}km · {r.elev}m · Partial cache</div>
                  </div>
                  <div style={{ fontSize: "9px", padding: "2px 7px", borderRadius: "5px", background: "rgba(107,203,119,0.1)", color: "#6BCB77", fontWeight: 600, flexShrink: 0 }}>Cached</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.35, marginTop: "6px", paddingLeft: "2px" }}>
              Routes you've viewed are partially cached. Full offline download available in the native app.
            </div>
          </div>

          {/* Storage info */}
          <div style={{ padding: "12px 14px", borderRadius: "12px", background: "#0a2240", border: "1px solid rgba(90,152,227,0.1)", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "#BDD6F4", marginBottom: "4px" }}>Cache storage</div>
              <div style={{ height: "4px", borderRadius: "2px", background: "rgba(90,152,227,0.1)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: "18%", borderRadius: "2px", background: "linear-gradient(90deg,#5A98E3,#6BCB77)" }} />
              </div>
              <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.4, marginTop: "4px" }}>~12 MB used of browser cache</div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   TAB 3: MAP
   ═══════════════════════════════════════════════════════════════════ */
const MapPage = ({ goHome, goProfile, onSaveWalk, openRoute, gpxRoute, onCloseGpx, dbPeaks }) => {
  const [layer, setLayer] = useState("standard");
  const [lm, setLm] = useState(false);
  const [wo, setWo] = useState(null);
  const [sh, setSh] = useState(false);
  const [sc, setSc] = useState(false);
  const [sp, setSp] = useState(null);
  const [sw, setSw] = useState(null);
  const [cf, setCf] = useState(null);
  const [d3, setD3] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  // Build searchable items
  const searchItems = useMemo(() => {
    const items = [];
    PEAKS.forEach(pk => items.push({ type: "peak", name: pk.name, sub: `${pk.ht}m · ${CLS[pk.cls]?.name || ""} · ${pk.reg}`, lat: pk.lat, lng: pk.lng, zoom: 13, color: CLS[pk.cls]?.color, data: pk }));
    ROUTES.forEach(r => items.push({ type: "route", name: r.name, sub: `${r.dist}km · ${r.diff} · ${r.reg}`, lat: ROUTE_REGIONS.find(rr => rr.name === r.reg)?.lat || 56.5, lng: ROUTE_REGIONS.find(rr => rr.name === r.reg)?.lng || -4.5, zoom: 11, color: "#5A98E3", data: r }));
    ROUTE_REGIONS.forEach(rr => items.push({ type: "area", name: rr.name, sub: "Region", lat: rr.lat, lng: rr.lng, zoom: 10, color: "#BDD6F4" }));
    return items;
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    return searchItems.filter(item => item.name.toLowerCase().includes(q)).slice(0, 8);
  }, [searchQuery, searchItems]);

  const handleSearchSelect = (item) => {
    if (item.type === "route" && item.data && item.data.gpx_file) {
      // Route with GPX — open directly on main map
      openRoute && openRoute(item.data, "search");
    } else if (item.type === "route" && item.data) {
      // Route without GPX — try resolving by name from full ROUTES list
      openRoute && openRoute(item.data, "search");
    } else {
      if (mapRef.current) {
        mapRef.current.flyTo({ center: [item.lng, item.lat], zoom: item.zoom, duration: 1500 });
      }
      if (item.type === "peak" && item.data) {
        setSp(item.data);
        setSw(null);
      }
    }
    setSearchQuery("");
    setSearchFocused(false);
  };
  const [mapGpxLoading, setMapGpxLoading] = useState(false);
  const mapGpxIdRef = useRef(null);

  const [trackMode, setTrackMode] = useState(false);
  const [recording, setRecording] = useState(false);
  // Guided route walk state
  const [gpxRouteActive, setGpxRouteActive] = useState(false);
  const [gpxRouteCoords, setGpxRouteCoords] = useState(null); // parsed coords from GPX
  const [gpxRouteDistDone, setGpxRouteDistDone] = useState(0);
  const [gpxRouteProgress, setGpxRouteProgress] = useState(0);
  const [gpxRouteElapsed, setGpxRouteElapsed] = useState("0:00");
  const [gpxRouteEta, setGpxRouteEta] = useState("--");
  const gpxRouteStartRef = useRef(null);
  const gpxRouteWatchRef = useRef(null);
  const gpxRouteElapsedRef = useRef(null);
  const gpxUserMarkerRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [finished, setFinished] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [actName, setActName] = useState("");
  const [actDesc, setActDesc] = useState("");
  const [actPhotos, setActPhotos] = useState(0);
  const [saved, setSaved] = useState(false);

  // Real GPS tracking state
  const [realDist, setRealDist] = useState(0);       // km, cumulative
  const [realElev, setRealElev] = useState(0);        // m gain, cumulative
  const [realSpeed, setRealSpeed] = useState(0);      // kph, current
  const [currentAlt, setCurrentAlt] = useState(null); // m above sea level
  const [gpsError, setGpsError] = useState(null);
  const [detectedPeaks, setDetectedPeaks] = useState([]);
  const watchIdRef = useRef(null);
  const trackPointsRef = useRef([]);    // [{lng, lat, alt, t}]
  const lastAltRef = useRef(null);
  const movingTimeRef = useRef(0);      // seconds actually moving
  const movingTimerRef = useRef(null);

  const fp = PEAKS.filter(p => !cf || p.cls === cf);

  // Haversine distance between two [lng,lat] points in km
  const haversineDist = (a, b) => {
    const R = 6371;
    const dLat = (b[1] - a[1]) * Math.PI / 180;
    const dLon = (b[0] - a[0]) * Math.PI / 180;
    const x = Math.sin(dLat/2)**2 + Math.cos(a[1]*Math.PI/180) * Math.cos(b[1]*Math.PI/180) * Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
  };

  // Check if current position is near a known peak (within 150m)
  const checkNearPeak = (lat, lng) => {
    PEAKS.forEach(pk => {
      const d = haversineDist([lng, lat], [pk.lng, pk.lat]) * 1000; // metres
      if (d < 150) {
        setDetectedPeaks(prev => prev.find(p => p.id === pk.id) ? prev : [...prev, pk]);
      }
    });
  };

  const locationMarkerRef = useRef(null);

  // Create the pulsing blue location dot element
  const createLocationDot = () => {
    const el = document.createElement("div");
    el.style.cssText = `
      position: relative;
      width: 20px;
      height: 20px;
    `;
    // Outer pulse ring
    const pulse = document.createElement("div");
    pulse.style.cssText = `
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 40px; height: 40px;
      border-radius: 50%;
      background: rgba(90,152,227,0.2);
      animation: locationPulse 2s ease-out infinite;
    `;
    // Inner dot
    const dot = document.createElement("div");
    dot.style.cssText = `
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 16px; height: 16px;
      border-radius: 50%;
      background: #5A98E3;
      border: 3px solid #ffffff;
      box-shadow: 0 2px 8px rgba(90,152,227,0.6);
    `;
    el.appendChild(pulse);
    el.appendChild(dot);
    return el;
  };

  // Draw/update live track on map
  const updateLiveTrack = (points) => {
    const map = mapRef.current;
    if (!map) return;

    // Update location dot
    const latest = points[points.length - 1];
    if (latest) {
      import("mapbox-gl").then(mod => {
        const mapboxgl = mod.default;
        if (locationMarkerRef.current) {
          locationMarkerRef.current.setLngLat([latest.lng, latest.lat]);
        } else {
          const el = createLocationDot();
          locationMarkerRef.current = new mapboxgl.Marker({ element: el, anchor: "center" })
            .setLngLat([latest.lng, latest.lat])
            .addTo(map);
        }
      });
    }

    if (points.length < 2) return;
    const coords = points.map(p => [p.lng, p.lat]);
    const geojson = { type: "Feature", geometry: { type: "LineString", coordinates: coords }, properties: {} };
    if (map.getSource("live-track")) {
      map.getSource("live-track").setData(geojson);
    } else {
      map.addSource("live-track", { type: "geojson", data: geojson });
      map.addLayer({ id: "live-track-casing", type: "line", source: "live-track",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#fff", "line-width": 6, "line-opacity": 0.5 } });
      map.addLayer({ id: "live-track-line", type: "line", source: "live-track",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#5A98E3", "line-width": 3.5, "line-opacity": 0.95 } });
    }
  };

  // Clear live track and location dot from map
  const clearLiveTrack = () => {
    const map = mapRef.current;
    if (!map) return;
    ["live-track-casing", "live-track-line"].forEach(l => { if (map.getLayer(l)) map.removeLayer(l); });
    if (map.getSource("live-track")) map.removeSource("live-track");
    if (locationMarkerRef.current) {
      locationMarkerRef.current.remove();
      locationMarkerRef.current = null;
    }
  };

  // Start GPS watch
  const startGps = () => {
    if (!navigator.geolocation) { setGpsError("GPS not available on this device"); return; }
    setGpsError(null);
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lng, altitude: alt, speed } = pos.coords;
        const now = Date.now();
        const prev = trackPointsRef.current[trackPointsRef.current.length - 1];

        // Calculate segment distance
        if (prev) {
          const segDist = haversineDist([prev.lng, prev.lat], [lng, lat]);
          // Filter out GPS jumps > 500m in < 10s (noise)
          const timeDelta = (now - prev.t) / 1000;
          if (segDist < 0.5) {
            setRealDist(d => parseFloat((d + segDist).toFixed(3)));
            if (speed != null) setRealSpeed(parseFloat((speed * 3.6).toFixed(1)));
            else if (timeDelta > 0) setRealSpeed(parseFloat(((segDist / timeDelta) * 3600).toFixed(1)));
          }
        }

        // Elevation gain
        if (alt !== null) {
          setCurrentAlt(Math.round(alt));
          if (lastAltRef.current !== null && alt > lastAltRef.current) {
            setRealElev(e => e + (alt - lastAltRef.current));
          }
          lastAltRef.current = alt;
        }

        const point = { lng, lat, alt: alt ?? null, t: now };
        trackPointsRef.current = [...trackPointsRef.current, point];
        updateLiveTrack(trackPointsRef.current);
        checkNearPeak(lat, lng);

        // Pan map to follow user while recording
        if (mapRef.current) {
          mapRef.current.easeTo({ center: [lng, lat], duration: 800 });
        }
      },
      (err) => {
        if (err.code === 1) setGpsError("Location permission denied. Please enable in your browser settings.");
        else if (err.code === 2) setGpsError("GPS signal lost. Move to an open area.");
        else setGpsError("GPS unavailable. Check your connection.");
      },
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 15000 }
    );

    // Moving time counter — only ticks when we have recent GPS activity
    movingTimerRef.current = setInterval(() => {
      const pts = trackPointsRef.current;
      if (pts.length < 2) return;
      const last = pts[pts.length - 1];
      const secondAgo = pts[pts.length - 2];
      const moved = haversineDist([secondAgo.lng, secondAgo.lat], [last.lng, last.lat]);
      if (moved > 0.001) movingTimeRef.current += 1; // only count if moved > 1m
    }, 1000);
  };

  // Stop GPS watch
  const stopGps = () => {
    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (movingTimerRef.current) {
      clearInterval(movingTimerRef.current);
      movingTimerRef.current = null;
    }
  };

  // Reset all tracking state
  const resetTracking = () => {
    stopGps();
    clearLiveTrack();
    trackPointsRef.current = [];
    lastAltRef.current = null;
    movingTimeRef.current = 0;
    setRealDist(0);
    setRealElev(0);
    setRealSpeed(0);
    setCurrentAlt(null);
    setDetectedPeaks([]);
    setGpsError(null);
    setElapsed(0);
    setRecording(false);
    setPaused(false);
    setFinished(false);
    setSaved(false);
    setActName("");
    setActDesc("");
    setActPhotos(0);
  };

  // Timer for total elapsed time
  useEffect(() => {
    if (!recording) return;
    const iv = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(iv);
  }, [recording]);

  // Start/stop GPS watch based on recording state
  useEffect(() => {
    if (recording) startGps();
    else stopGps();
    return () => stopGps();
  }, [recording]);

  const fmtTime = (s) => `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const realDistDisplay = realDist.toFixed(2);
  const realElevDisplay = Math.round(realElev);
  const realSpeedDisplay = realSpeed.toFixed(1);

  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const geolocateRef = useRef(null);
  const mapLoadedRef = useRef(false);
  const gpxRouteRef = useRef(gpxRoute);
  useEffect(() => { gpxRouteRef.current = gpxRoute; }, [gpxRoute]);

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
    map.addControl(new mapboxgl.NavigationControl(), "bottom-left");
    const geolocate = new mapboxgl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: true, showUserHeading: true });
    map.addControl(geolocate, "bottom-right");
    mapRef.current = map;
    geolocateRef.current = geolocate;

    map.on("load", () => {
      mapLoadedRef.current = true;
      // Only auto-geolocate if no GPX route is waiting to be drawn
      if (!gpxRouteRef.current) {
        setTimeout(() => { try { geolocate.trigger(); } catch(e) {} }, 1000);
      }


    });

    }); return () => {
      mapLoadedRef.current = false;
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);



  // Live hikers overlay
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoadedRef.current) return;
    const sourceId = "live-hikers";
    const layerId = "live-hikers-layer";

    if (map.getLayer(layerId)) map.removeLayer(layerId);
    if (map.getSource(sourceId)) map.removeSource(sourceId);
    if (!sh) return;

    const geojson = {
      type: "FeatureCollection",
      features: HIKERS.map(h => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [h.lng, h.lat] },
        properties: { name: h.name, peak: h.peak, st: h.st, av: h.av },
      })),
    };
    map.addSource(sourceId, { type: "geojson", data: geojson });
    map.addLayer({
      id: layerId, type: "circle", source: sourceId,
      paint: {
        "circle-radius": 9,
        "circle-color": ["case", ["==", ["get", "st"], "summit"], "#F49D37", "#6BCB77"],
        "circle-stroke-color": "#fff",
        "circle-stroke-width": 2.5,
        "circle-opacity": 0.95,
      },
    });

    // Click handler
    const onHikerClick = (e) => {
      const p = e.features[0].properties;
      setSw({ type: "hiker", title: `${p.av} ${p.name}`, host: p.name, date: p.st === "summit" ? `At summit of ${p.peak}` : p.st === "descending" ? `Descending ${p.peak}` : `Ascending ${p.peak}`, time: "Live now", spots: null });
    };
    map.on("click", layerId, onHikerClick);
    map.on("mouseenter", layerId, () => { map.getCanvas().style.cursor = "pointer"; });
    map.on("mouseleave", layerId, () => { map.getCanvas().style.cursor = ""; });

    return () => { map.off("click", layerId, onHikerClick); };
  }, [sh, mapLoadedRef.current]);

  // Community walks overlay — hardcoded C_WALKS + live events from Supabase
  const [dbEvents, setDbEvents] = useState([]);
  useEffect(() => {
    // Fetch real community events from posts table
    supabase.from("posts").select("*").eq("type", "event").limit(20)
      .then(({ data }) => {
        if (data) setDbEvents(data.filter(e => e.lat && e.lng));
      });
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoadedRef.current) return;
    const sourceId = "community-walks";
    const layerId = "community-walks-layer";

    // Remove existing
    if (map.getLayer(layerId)) map.removeLayer(layerId);
    if (map.getSource(sourceId)) map.removeSource(sourceId);

    if (!sc) return;

    // Merge hardcoded C_WALKS + live DB events into point markers
    const allWalks = [
      ...C_WALKS.map(w => ({ lat: w.lat, lng: w.lng, title: w.title, host: w.host, date: w.date, spots: w.spots, filled: w.filled, diff: w.diff })),
      ...dbEvents.map(e => ({ lat: e.lat, lng: e.lng, title: e.text?.slice(0, 40) || "Community Walk", host: e.username || "TrailSync", date: "Upcoming", spots: null, filled: null, diff: null })),
    ].filter(w => w.lat && w.lng);

    if (allWalks.length === 0) return;

    const geojson = {
      type: "FeatureCollection",
      features: allWalks.map((w, i) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [w.lng, w.lat] },
        properties: { title: w.title, host: w.host, date: w.date, spots: w.spots, filled: w.filled, diff: w.diff, idx: i },
      })),
    };

    map.addSource(sourceId, { type: "geojson", data: geojson });
    map.addLayer({
      id: layerId, type: "circle", source: sourceId,
      paint: {
        "circle-radius": 10,
        "circle-color": "#5A98E3",
        "circle-stroke-color": "#fff",
        "circle-stroke-width": 2,
        "circle-opacity": 0.9,
      },
    });

    // Click handler for community walk markers
    const onClick = (e) => {
      const props = e.features[0].properties;
      setSw({ type: "event", title: props.title, host: props.host, date: props.date, spots: props.spots, filled: props.filled, diff: props.diff });
    };
    map.on("click", layerId, onClick);
    map.on("mouseenter", layerId, () => { map.getCanvas().style.cursor = "pointer"; });
    map.on("mouseleave", layerId, () => { map.getCanvas().style.cursor = ""; });

    return () => {
      map.off("click", layerId, onClick);
    };
  }, [sc, dbEvents, mapLoadedRef.current]);

  // Draw GPX route when gpxRoute prop is set (or changes)
  useEffect(() => {
    if (!gpxRoute?.route?.gpx_file) return;
    const route = gpxRoute.route;

    const doDraw = (map) => {
      if (mapGpxIdRef.current) {
        removeGpxFromMap(map, mapGpxIdRef.current);
        mapGpxIdRef.current = null;
      }
      setMapGpxLoading(true);
      fetchGpxText(route.gpx_file).then(xml => {
        const coords = parseGpxCoords(xml);
        if (coords.length > 1) {
          drawGpxOnMap(map, route.id, coords, { color: "#E85D3A", fitBounds: true, fitPadding: 80 });
          mapGpxIdRef.current = route.id;
          setGpxRouteCoords(coords); // store for guided walk
        }
      }).catch(err => console.error("GPX draw error:", err))
        .finally(() => setMapGpxLoading(false));
    };

    const tryDraw = () => {
      const map = mapRef.current;
      if (!map) { setTimeout(tryDraw, 150); return; }
      // If style isn't loaded yet, wait for it
      if (!map.isStyleLoaded()) {
        map.once("styledata", () => doDraw(map));
        return;
      }
      doDraw(map);
    };
    tryDraw();
  }, [gpxRoute]);

  // Clear GPX when gpxRoute is dismissed
  useEffect(() => {
    if (!gpxRoute && mapGpxIdRef.current && mapRef.current) {
      removeGpxFromMap(mapRef.current, mapGpxIdRef.current);
      mapGpxIdRef.current = null;
    }
  }, [gpxRoute]);

  // ── Guided route walk: start/stop GPS tracking along GPX line ──
  useEffect(() => {
    if (!gpxRouteActive || !gpxRoute) {
      // Stop tracking
      if (gpxRouteWatchRef.current) navigator.geolocation.clearWatch(gpxRouteWatchRef.current);
      if (gpxRouteElapsedRef.current) clearInterval(gpxRouteElapsedRef.current);
      if (gpxUserMarkerRef.current) { gpxUserMarkerRef.current.remove(); gpxUserMarkerRef.current = null; }
      gpxRouteWatchRef.current = null;
      gpxRouteElapsedRef.current = null;
      return;
    }

    // Parse coords from the already-drawn GPX (use stored coords)
    const coords = gpxRouteCoords;
    if (!coords || coords.length < 2) return;

    gpxRouteStartRef.current = Date.now();

    // Elapsed timer
    gpxRouteElapsedRef.current = setInterval(() => {
      const secs = Math.floor((Date.now() - gpxRouteStartRef.current) / 1000);
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      setGpxRouteElapsed(`${m}:${String(s).padStart(2, "0")}`);
    }, 1000);

    // Helper: haversine distance between two [lng,lat] points in km
    const haversine = ([lng1, lat1], [lng2, lat2]) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLng = (lng2 - lng1) * Math.PI / 180;
      const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    };

    // Total route distance
    let totalKm = 0;
    for (let i = 1; i < coords.length; i++) totalKm += haversine(coords[i-1], coords[i]);

    // Watch GPS position
    gpxRouteWatchRef.current = navigator.geolocation.watchPosition(pos => {
      const userLng = pos.coords.longitude;
      const userLat = pos.coords.latitude;

      // Find closest point on route
      let minDist = Infinity, closestIdx = 0;
      for (let i = 0; i < coords.length; i++) {
        const d = haversine([userLng, userLat], coords[i]);
        if (d < minDist) { minDist = d; closestIdx = i; }
      }

      // Distance done = sum of segments up to closest point
      let donKm = 0;
      for (let i = 1; i <= closestIdx; i++) donKm += haversine(coords[i-1], coords[i]);
      setGpxRouteDistDone(donKm);
      const pct = Math.min(100, Math.round((donKm / totalKm) * 100));
      setGpxRouteProgress(pct);

      // ETA
      const elapsed = (Date.now() - gpxRouteStartRef.current) / 1000 / 60; // mins
      const pace = donKm > 0.1 ? elapsed / donKm : null;
      const remaining = totalKm - donKm;
      if (pace && remaining > 0) {
        const etaMins = Math.round(pace * remaining);
        setGpxRouteEta(`${Math.floor(etaMins/60)}h ${etaMins%60}m`);
      }

      // Update user marker on map
      if (mapRef.current) {
        import("mapbox-gl").then(mod => {
          const mapboxgl = mod.default;
          if (gpxUserMarkerRef.current) {
            gpxUserMarkerRef.current.setLngLat([userLng, userLat]);
          } else {
            const el = document.createElement("div");
            el.style.cssText = "width:18px;height:18px;border-radius:50%;background:#5A98E3;border:3px solid #fff;box-shadow:0 0 0 3px rgba(90,152,227,0.3);animation:locationPulse 1.5s ease infinite;";
            gpxUserMarkerRef.current = new mapboxgl.Marker({ element: el }).setLngLat([userLng, userLat]).addTo(mapRef.current);
          }

          // Grey out completed portion of route
          if (closestIdx > 1 && mapGpxIdRef.current) {
            const doneCoords = coords.slice(0, closestIdx + 1);
            const doneSourceId = `gpx-${mapGpxIdRef.current}-done`;
            if (mapRef.current.getSource(doneSourceId)) {
              mapRef.current.getSource(doneSourceId).setData({ type: "Feature", geometry: { type: "LineString", coordinates: doneCoords }, properties: {} });
            } else {
              mapRef.current.addSource(doneSourceId, { type: "geojson", data: { type: "Feature", geometry: { type: "LineString", coordinates: doneCoords }, properties: {} } });
              mapRef.current.addLayer({ id: `${doneSourceId}-line`, type: "line", source: doneSourceId, layout: { "line-join": "round", "line-cap": "round" }, paint: { "line-color": "#6B7280", "line-width": 4, "line-opacity": 0.7 } });
            }
          }
        });
      }
    }, err => console.warn("GPS error:", err), { enableHighAccuracy: true, maximumAge: 3000 });

    return () => {
      if (gpxRouteWatchRef.current) navigator.geolocation.clearWatch(gpxRouteWatchRef.current);
      if (gpxRouteElapsedRef.current) clearInterval(gpxRouteElapsedRef.current);
    };
  }, [gpxRouteActive, gpxRoute]);

  // Store parsed GPX coords when route loads
  useEffect(() => {
    if (!gpxRoute) { setGpxRouteCoords(null); setGpxRouteActive(false); setGpxRouteDistDone(0); setGpxRouteProgress(0); setGpxRouteElapsed("0:00"); setGpxRouteEta("--"); return; }
  }, [gpxRoute]);

  // Update map style when layer changes
  useEffect(() => {
    if (!mapRef.current) return;
    const styles = {
      standard: "mapbox://styles/mapbox/outdoors-v12",
      topo: "mapbox://styles/mapbox/outdoors-v12",
      satellite: "mapbox://styles/mapbox/satellite-streets-v12",
      // Note: outdoors-v12 is Mapbox's best topo — includes contours, elevation, terrain
    };
    const newStyle = styles[layer] || styles.standard;
    mapRef.current.once("styledata", () => {
      if (d3) applyTerrain(mapRef.current);
      // Add contour lines for topo mode
      if (layer === "topo") {
        const map = mapRef.current;
        if (!map.getSource("contours")) {
          map.addSource("contours", {
            type: "vector",
            url: "mapbox://mapbox.mapbox-terrain-v2",
          });
          map.addLayer({
            id: "contour-lines",
            type: "line",
            source: "contours",
            "source-layer": "contour",
            paint: {
              "line-color": ["interpolate", ["linear"], ["get", "ele"],
                0, "#4a7c59",
                500, "#6b8f5e",
                1000, "#8b6a3c",
                2000, "#a0856b",
              ],
              "line-width": ["interpolate", ["linear"], ["get", "ele"],
                0, 0.5,
                500, 0.75,
                1000, 1,
              ],
              "line-opacity": 0.6,
            },
          });
          map.addLayer({
            id: "contour-labels",
            type: "symbol",
            source: "contours",
            "source-layer": "contour",
            filter: ["==", ["%", ["get", "ele"], 100], 0],
            layout: {
              "symbol-placement": "line",
              "text-field": ["concat", ["get", "ele"], "m"],
              "text-size": 9,
              "text-font": ["DIN Pro Regular", "Arial Unicode MS Regular"],
            },
            paint: { "text-color": "#6b5e4e", "text-halo-color": "#fff", "text-halo-width": 1 },
          });
        }
      } else {
        // Remove contours when switching away from topo
        const map = mapRef.current;
        ["contour-labels", "contour-lines"].forEach(l => { if (map.getLayer(l)) map.removeLayer(l); });
        if (map.getSource("contours")) map.removeSource("contours");
      }
    });
    mapRef.current.setStyle(newStyle);
  }, [layer]);

  // 3D terrain toggle
  const applyTerrain = (map) => {
    if (!map) return;
    if (!map.getSource("mapbox-dem")) {
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });
    }
    map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });
    map.easeTo({ pitch: 55, duration: 600 });
  };

  const removeTerrain = (map) => {
    if (!map) return;
    map.setTerrain(null);
    map.easeTo({ pitch: 0, duration: 600 });
  };

  useEffect(() => {
    if (!mapRef.current) return;
    if (d3) applyTerrain(mapRef.current);
    else removeTerrain(mapRef.current);
  }, [d3]);

  return (
    <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
      {/* Real Mapbox Map */}
      <div ref={mapContainer} style={{ position: "absolute", inset: 0 }} />

      {/* Top controls */}
      <div style={{ position: "absolute", top: 10, left: 10, right: 10, display: "flex", gap: "6px", zIndex: 20 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <div style={{ background: "rgba(4,30,61,.88)", backdropFilter: "blur(12px)", borderRadius: "12px", padding: "9px 14px", display: "flex", alignItems: "center", gap: "8px", border: `1px solid ${searchFocused ? "rgba(90,152,227,0.3)" : "rgba(90,152,227,0.15)"}` }}>
            <Search size={14} color="#BDD6F4" style={{ opacity: 0.4 }} />
            <input
              type="text"
              placeholder="Search peaks, routes, areas..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#F8F8F8", fontSize: "16px", fontFamily: "'DM Sans'" }}
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(""); setSearchFocused(false); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#BDD6F4", padding: 0, display: "flex" }}><X size={14} /></button>
            )}
          </div>
          {/* Search results dropdown */}
          {searchFocused && searchResults.length > 0 && (
            <div style={{ position: "absolute", top: "110%", left: 0, right: 0, background: "rgba(4,30,61,.97)", backdropFilter: "blur(16px)", borderRadius: "12px", border: "1px solid rgba(90,152,227,0.2)", overflow: "hidden", zIndex: 30 }}>
              {searchResults.map((item, i) => (
                <button key={`${item.type}-${item.name}-${i}`} onClick={() => handleSearchSelect(item)} style={{
                  width: "100%", padding: "10px 14px", border: "none",
                  borderBottom: i < searchResults.length - 1 ? "1px solid rgba(90,152,227,0.08)" : "none",
                  background: "transparent", color: "#F8F8F8", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "10px", textAlign: "left", fontFamily: "'DM Sans'"
                }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: item.color || "#5A98E3", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "12px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                    <div style={{ fontSize: "9px", color: "#BDD6F4", opacity: 0.5, marginTop: "1px" }}>{item.sub}</div>
                  </div>
                  <span style={{ fontSize: "8px", padding: "2px 6px", borderRadius: "4px", background: "rgba(90,152,227,0.1)", color: "#BDD6F4", fontWeight: 600, textTransform: "uppercase", flexShrink: 0 }}>{item.type}</span>
                </button>
              ))}
            </div>
          )}
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

      {/* GPX route banner — shown when a route is active or loading */}
      {(gpxRoute || mapGpxLoading) && (
        <div style={{ position: "absolute", top: 56, left: 10, right: 10, zIndex: 22,
          background: "rgba(4,30,61,0.96)", backdropFilter: "blur(12px)", borderRadius: "14px",
          border: "1px solid rgba(232,93,58,0.25)", animation: "su .25s ease", overflow: "hidden" }}>
          <div style={{ height: "2px", background: "linear-gradient(90deg,#E85D3A,transparent)" }} />
          <div style={{ padding: "10px 12px", display: "flex", alignItems: "center", gap: "10px" }}>
            <button onClick={onCloseGpx} style={{ background: "rgba(90,152,227,0.1)", border: "1px solid rgba(90,152,227,0.2)",
              borderRadius: "8px", padding: "5px 10px", color: "#BDD6F4", fontSize: "11px", fontWeight: 600,
              cursor: "pointer", fontFamily: "'DM Sans'", display: "flex", alignItems: "center", gap: "5px", flexShrink: 0 }}>
              ← Back
            </button>
            {mapGpxLoading ? (
              <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#E85D3A", animation: "pulse 1s ease infinite" }} />
                <span style={{ fontSize: "12px", color: "#BDD6F4", fontFamily: "'DM Sans'" }}>Loading route…</span>
              </div>
            ) : gpxRoute && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#F8F8F8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{gpxRoute.route.name}</div>
                <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.6, marginTop: "1px" }}>
                  {gpxRoute.route.dist}km · {gpxRoute.route.elev}m · {gpxRoute.route.diff}
                </div>
              </div>
            )}
            {gpxRoute && !gpxRouteActive && (
              <button onClick={() => setGpxRouteActive(true)} style={{ padding: "7px 14px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#E85D3A,#d04a2a)", color: "#F8F8F8", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'", flexShrink: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                <Play size={12} /> Start
              </button>
            )}
            {gpxRoute && gpxRouteActive && (
              <button onClick={() => setGpxRouteActive(false)} style={{ padding: "7px 14px", borderRadius: "10px", border: "1px solid rgba(232,93,58,0.3)", background: "rgba(232,93,58,0.1)", color: "#E85D3A", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'", flexShrink: 0 }}>
                Stop
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── GUIDED ROUTE STATS BAR ── */}
      {gpxRoute && gpxRouteActive && (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 24, background: "rgba(4,30,61,0.97)", backdropFilter: "blur(16px)", borderRadius: "16px 16px 0 0", border: "1px solid rgba(232,93,58,0.2)", borderBottom: "none", padding: "14px 16px 20px" }}>
          <div style={{ height: "3px", borderRadius: "2px", background: "#0a2240", marginBottom: "14px", overflow: "hidden" }}>
            <div style={{ height: "100%", background: "linear-gradient(90deg,#E85D3A,#F49D37)", borderRadius: "2px", width: `${gpxRouteProgress}%`, transition: "width 1s linear" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "10px" }}>
            {[
              ["Distance", `${gpxRouteDistDone.toFixed(1)}/${gpxRoute.route.dist}km`],
              ["Elapsed", gpxRouteElapsed],
              ["Est. Left", gpxRouteEta],
            ].map(([label, val]) => (
              <div key={label} style={{ textAlign: "center", padding: "10px 4px", background: "#0a2240", borderRadius: "10px" }}>
                <div style={{ fontSize: "13px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'JetBrains Mono'" }}>{val}</div>
                <div style={{ fontSize: "8px", color: "#BDD6F4", opacity: 0.4, marginTop: "3px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.4, textAlign: "center" }}>
            Your position updates as you move · GPS must be enabled
          </div>
        </div>
      )}
      {/* Track button (when not in track mode) */}
      {!trackMode && !sp && !sw && (
        <button onClick={() => setTrackMode(true)} style={{
          position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)",
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
                    ["Distance", `${realDistDisplay}km`, Navigation],
                    ["Time", (recording || paused) ? fmtTime(elapsed) : "00:00:00", Clock],
                    ["Elevation", currentAlt ? `${currentAlt}m` : `+${realElevDisplay}m`, TrendingUp],
                    ["Speed", `${realSpeedDisplay}kph`, Zap],
                  ].map(([label, val]) => (
                    <div key={label} style={{ textAlign: "center", padding: "8px 4px", background: "#0a2240", borderRadius: "10px" }}>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#F8F8F8", fontFamily: "'JetBrains Mono'" }}>{val}</div>
                      <div style={{ fontSize: "8px", color: "#BDD6F4", opacity: 0.4 }}>{label}</div>
                    </div>
                  ))}
                </div>

                {/* GPS error */}
                {gpsError && (
                  <div style={{ padding: "8px 12px", borderRadius: "8px", background: "rgba(232,93,58,0.1)",
                    border: "1px solid rgba(232,93,58,0.2)", marginBottom: "10px",
                    fontSize: "11px", color: "#E85D3A", display: "flex", alignItems: "center", gap: "6px" }}>
                    <AlertTriangle size={12} /> {gpsError}
                  </div>
                )}

                {/* Control buttons */}
                <div style={{ display: "flex", gap: "8px" }}>
                  {!recording && !paused && (
                    <>
                      <button onClick={() => { resetTracking(); setTrackMode(false); }} style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "1px solid rgba(90,152,227,0.15)", background: "transparent", color: "#BDD6F4", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'" }}>Cancel</button>
                      <button onClick={() => { setRecording(true); }} style={{ flex: 2, padding: "11px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#6BCB77,#55a866)", color: "#F8F8F8", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
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
                        <div style={{ fontSize: "8px", color: "#BDD6F4", opacity: 0.5 }}>
                          {gpxRoute ? "Est. finish" : "Pace"}
                        </div>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#5A98E3", fontFamily: "'JetBrains Mono'" }}>
                          {(() => {
                            // Need at least 60s and 50m travelled for a reliable pace
                            if (elapsed < 60 || realDist < 0.05) return "--:--";
                            const paceSecPerKm = elapsed / realDist; // sec/km current pace
                            if (gpxRoute?.route?.dist) {
                              // Following a route — project remaining time
                              const totalKm = gpxRoute.route.dist;
                              const remainKm = Math.max(0, totalKm - realDist);
                              if (remainKm <= 0) return "Done!";
                              const remainSec = remainKm * paceSecPerKm;
                              const h = Math.floor(remainSec / 3600);
                              const m = Math.floor((remainSec % 3600) / 60);
                              return h > 0 ? `${h}h ${m}m` : `${m}m`;
                            } else {
                              // Free tracking — show current pace per km
                              const paceMin = Math.floor(paceSecPerKm / 60);
                              const paceSec = Math.floor(paceSecPerKm % 60);
                              return `${paceMin}:${String(paceSec).padStart(2,"0")}/km`;
                            }
                          })()}
                        </div>
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
                    ["Distance", `${realDistDisplay}km`],
                    ["Elev Gain", `+${realElevDisplay}m`],
                    ["Avg Speed", `${realDist > 0 && elapsed > 0 ? (realDist / (elapsed / 3600)).toFixed(1) : "0.0"}kph`],
                  ].map(([label, val]) => (
                    <div key={label} style={{ textAlign: "center", padding: "10px 4px", background: "#0a2240", borderRadius: "10px" }}>
                      <div style={{ fontSize: "15px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'JetBrains Mono'" }}>{val}</div>
                      <div style={{ fontSize: "9px", color: "#BDD6F4", opacity: 0.4 }}>{label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "14px" }}>
                  {[
                    ["Moving Time", fmtTime(movingTimeRef.current)],
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
                    {detectedPeaks.length > 0 ? detectedPeaks.map(pk => (
                      <span key={pk.id} style={{ fontSize: "10px", padding: "3px 8px", borderRadius: "6px", background: "rgba(107,203,119,0.1)", color: "#6BCB77", fontWeight: 600, display: "flex", alignItems: "center", gap: "3px" }}>
                        <CheckCircle size={10} /> {pk.name}
                      </span>
                    )) : (
                      <span style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.5 }}>No peaks detected on this route</span>
                    )}
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
                  <button onClick={() => { resetTracking(); setTrackMode(false); }} style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "1px solid rgba(90,152,227,0.15)", background: "transparent", color: "#BDD6F4", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'" }}>Discard</button>
                  <button onClick={() => { if (onSaveWalk) onSaveWalk({ name: actName || "Untitled Walk", desc: actDesc, dist: realDistDisplay, elev: realElevDisplay, time: fmtTime(elapsed), movingTime: fmtTime(movingTimeRef.current), avgSpeed: (realDist > 0 && elapsed > 0 ? (realDist / (elapsed / 3600)).toFixed(1) : "0.0"), peaks: detectedPeaks.map(p => p.name), photos: actPhotos, date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) }); setSaved(true); }} style={{ flex: 2, padding: "11px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#E85D3A,#d04a2a)", color: "#F8F8F8", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'" }}>Save & Publish</button>
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
              <button onClick={() => { setSp(null); }} style={{ background: "#264f80", border: "none", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", color: "#BDD6F4", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={13} /></button>
            </div>
            <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}><span style={{ fontSize: "9px", padding: "2px 8px", borderRadius: "6px", background: `${CLS[sp.cls]?.color}15`, color: CLS[sp.cls]?.color, fontWeight: 700 }}>{CLS[sp.cls]?.name}</span></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "8px", marginTop: "12px" }}>
              {[["Feels", `${sp.w.f}°`, Thermometer, sp.w.f < -5 ? "#BDD6F4" : "#F8F8F8"], ["Wind", `${sp.w.wi}mph`, Wind, sp.w.wi > 35 ? "#E85D3A" : sp.w.wi >= 20 ? "#F49D37" : "#F8F8F8"], ["Rain", `${sp.w.p}mm`, Droplets, sp.w.p > 2 ? "#5A98E3" : "#F8F8F8"], ["Vis", sp.w.v, Eye, "#F8F8F8"]].map(([l, v, I, c]) => <div key={l} style={{ textAlign: "center", padding: "10px 4px", background: "#0a2240", borderRadius: "10px" }}><I size={14} color="#BDD6F4" style={{ opacity: 0.5 }} /><div style={{ fontSize: "14px", fontWeight: 700, color: c, marginTop: "3px" }}>{v}</div><div style={{ fontSize: "8px", color: "#BDD6F4", opacity: 0.4, marginTop: "1px" }}>{l}</div></div>)}
            </div>
            <button style={{ marginTop: "14px", width: "100%", padding: "11px", background: "linear-gradient(135deg,#E85D3A,#d04a2a)", border: "none", borderRadius: "11px", color: "#F8F8F8", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'" }}>Log This Summit ⛰️</button>
            {/* Routes for this peak */}
            {(() => {
              const peakRoutes = ROUTES.filter(r => r.peaks && r.peaks.includes(sp.name));
              if (!peakRoutes.length) return null;
              return (
                <div style={{ marginTop: "10px", borderTop: "1px solid rgba(90,152,227,0.08)", paddingTop: "10px" }}>
                  <div style={{ fontSize: "9px", color: "#BDD6F4", opacity: 0.5, fontWeight: 700, marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Routes</div>
                  {peakRoutes.map(r => (
                    <div key={r.id} onClick={() => openRoute && openRoute(r, "search")} style={{
                      display: "flex", alignItems: "center", gap: "6px", marginTop: "4px",
                      padding: "6px 9px", borderRadius: "8px", cursor: r.gpx_file ? "pointer" : "default",
                      background: "rgba(90,152,227,0.06)",
                      border: "1px solid rgba(90,152,227,0.1)",
                      transition: "all .15s"
                    }}>
                      <Route size={10} color="#5A98E3" />
                      <span style={{ flex: 1, fontSize: "10px", fontWeight: 600, color: "#5A98E3", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</span>
                      <span style={{ fontSize: "9px", color: "#BDD6F4", opacity: 0.5 }}>{r.dist}km · {r.diff}</span>
                      {r.gpx_file && (
                        <span style={{ fontSize: "8px", padding: "1px 5px", borderRadius: "3px",
                          background: "rgba(232,93,58,0.15)", color: "#E85D3A", fontWeight: 700 }}>
                          View route →
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              );
            })()}
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
const LearnPage = ({ courseProgress = {}, onCourseProgress }) => {
  const [sel, setSel] = useState(null);
  const [subTab, setSubTab] = useState("learn");
  const [discView, setDiscView] = useState("list");
  const [discCat, setDiscCat] = useState(null);
  const [selArticle, setSelArticle] = useState(null);

  const filteredArticles = DISCOVER.filter(a => !discCat || a.cat === discCat);
  const categories = [...new Set(DISCOVER.map(a => a.cat))];

  return (
    <div style={{ padding: (subTab === "discover" && discView === "map") ? "0 16px 0" : "0 16px 16px", overflowY: (subTab === "discover" && discView === "map") ? "hidden" : "auto", flex: 1, display: "flex", flexDirection: "column" }}>
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
            {MODULES.map((m, i) => { const doneLessons = courseProgress[m.id] ?? m.done; const pct = Math.round((doneLessons / m.les) * 100); return (
              <div key={m.id} onClick={() => setSel(sel === m.id ? null : m.id)} style={{ background: "#0a2240", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(90,152,227,0.1)", cursor: "pointer", animation: `fi .3s ease ${i * .04}s both` }}>
                <div style={{ padding: "14px", display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: pct === 100 ? "rgba(107,203,119,0.1)" : "#264f80", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", border: pct === 100 ? "1px solid rgba(107,203,119,0.2)" : "none" }}>{m.ic}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ fontSize: "13px", fontWeight: 700, color: "#F8F8F8" }}>{m.title}</span>{pct === 100 && <CheckCircle size={13} color="#6BCB77" />}</div>
                    <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.5, marginTop: "2px" }}>{m.lvl} · {m.les} lessons · {m.time}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px" }}><div style={{ flex: 1, height: "3px", borderRadius: "3px", background: "#264f80" }}><div style={{ width: `${pct}%`, height: "100%", borderRadius: "3px", background: pct === 100 ? "#6BCB77" : "#5A98E3" }} /></div><span style={{ fontSize: "9px", color: "#BDD6F4", opacity: 0.5, fontWeight: 600 }}>{doneLessons}/{m.les}</span></div>
                  </div>
                  <ChevronRight size={16} color="#BDD6F4" style={{ opacity: 0.4, transform: sel === m.id ? "rotate(90deg)" : "none", transition: ".2s" }} />
                </div>
                {sel === m.id && <div style={{ padding: "0 14px 14px", borderTop: "1px solid rgba(90,152,227,0.1)", paddingTop: "12px" }}>
                  <div style={{ fontSize: "12px", color: "#BDD6F4", lineHeight: 1.5, marginBottom: "12px" }}>{m.desc}</div>
                  <button onClick={() => { if (pct < 100 && onCourseProgress) { const next = Math.min(doneLessons + 1, m.les); onCourseProgress(m.id, next); } }} style={{ padding: "9px 22px", borderRadius: "10px", border: "none", background: pct === 100 ? "#264f80" : "linear-gradient(135deg,#5A98E3,#4080cc)", color: pct === 100 ? "#BDD6F4" : "#F8F8F8", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'" }}>{pct === 100 ? "Review" : pct > 0 ? "Continue" : "Start"}</button>
                </div>}
              </div>
            ); })}
          </div>
        </div>
      )}

      {/* ═══ DISCOVER SUB-TAB ═══ */}
      {subTab === "discover" && (
        <div style={discView === "map" ? { flex: 1, display: "flex", flexDirection: "column" } : {}}>
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
            <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column" }}>
            <MiniMap height="100%" markers={filteredArticles.map(a => ({ lat: a.lat, lng: a.lng, color: "#264f80", html: `<span style="font-size:17px">${a.icon}</span>`, data: a, style: "width:38px;height:38px;border-radius:50%;background:#264f80;border:2px solid rgba(90,152,227,0.3);cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);" }))} onMarkerClick={(m) => setSelArticle(selArticle?.id === m.data.id ? null : m.data)}>

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
const ProfilePage = ({ initialSec, onSecChange, goMap, goHome, goRoutes, openRoute, onSignOut, savedWalks, setSavedWalks, dbPeaks, userName, userLocation, setUserLocation, followerCount, followingCount, followingIds, setFollowingIds, setFollowerCount, setFollowingCount, userId, onViewProfile }) => {
  const [showFollowers, setShowFollowers] = useState(null); // null | "followers" | "following"
  const [followerFilter, setFollowerFilter] = useState("recent");
  const [followerList, setFollowerList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  // Walk detail — self-contained
  const [selWalk, setSelWalk] = useState(null);
  const [confirmDeleteWalk, setConfirmDeleteWalk] = useState(false);
  const [deletingWalk, setDeletingWalk] = useState(false);
  // Walk photo uploads
  const [walkPhotos, setWalkPhotos] = useState({}); // walkId -> [url, ...]
  const [uploadingPhoto, setUploadingPhoto] = useState(null); // walkId uploading
  // Walk comments (local for now)
  const [walkComments, setWalkComments] = useState({}); // walkId -> comment text
  // Profile photo
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Upload a photo for a walk to Supabase Storage
  const handleWalkPhotoUpload = async (walkId, file) => {
    if (!file || !userId) return;
    setUploadingPhoto(walkId);
    try {
      const ext = file.name.split(".").pop();
      const path = `walks/${userId}/${walkId}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("walk-photos").upload(path, file, { upsert: true });
      if (error) { console.error("Photo upload error:", error); return; }
      const { data: { publicUrl } } = supabase.storage.from("walk-photos").getPublicUrl(path);
      setWalkPhotos(prev => ({ ...prev, [walkId]: [...(prev[walkId] || []), publicUrl] }));
    } catch (e) { console.error(e); }
    finally { setUploadingPhoto(null); }
  };

  // Upload profile photo
  const handleAvatarUpload = async (file) => {
    if (!file || !userId) return;
    setUploadingAvatar(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `avatars/${userId}.${ext}`;
      const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (error) { console.error("Avatar upload error:", error); return; }
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
      setAvatarUrl(publicUrl);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.auth.updateUser({ data: { ...user.user_metadata, avatar_url: publicUrl } });
        await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", userId);
      }
    } catch (e) { console.error(e); }
    finally { setUploadingAvatar(false); }
  };

  // Load avatar on mount
  useEffect(() => {
    if (!userId) return;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata?.avatar_url) setAvatarUrl(user.user_metadata.avatar_url);
    });
  }, [userId]);

  // Load walk photos on mount
  useEffect(() => {
    if (!userId || !savedWalks?.length) return;
    savedWalks.forEach(async (w) => {
      if (!w.id) return;
      const { data } = await supabase.storage.from("walk-photos").list(`walks/${userId}/${w.id}`);
      if (data && data.length > 0) {
        const urls = data.map(f => supabase.storage.from("walk-photos").getPublicUrl(`walks/${userId}/${w.id}/${f.name}`).data.publicUrl);
        setWalkPhotos(prev => ({ ...prev, [w.id]: urls }));
      }
    });
  }, [userId, savedWalks]);

  // Load followers/following list when modal opens
  useEffect(() => {
    if (!showFollowers || !userId) return;
    setListLoading(true);
    async function loadList() {
      try {
        if (showFollowers === "followers") {
          // Get follower IDs first, then fetch their profiles
          const { data: followData } = await supabase
            .from("follows")
            .select("follower_id")
            .eq("following_id", userId)
            .order("created_at", { ascending: followerFilter === "recent" ? false : true });
          if (followData && followData.length > 0) {
            const ids = followData.map(f => f.follower_id);
            const { data: profiles } = await supabase.from("profiles").select("id, username, name, location").in("id", ids);
            setFollowerList(profiles || []);
          } else {
            setFollowerList([]);
          }
        } else {
          // Get following IDs first, then fetch their profiles
          const { data: followData } = await supabase
            .from("follows")
            .select("following_id")
            .eq("follower_id", userId)
            .order("created_at", { ascending: followerFilter === "recent" ? false : true });
          if (followData && followData.length > 0) {
            const ids = followData.map(f => f.following_id);
            const { data: profiles } = await supabase.from("profiles").select("id, username, name, location").in("id", ids);
            setFollowingList(profiles || []);
            // Sync followingIds so Follow/Following buttons show correctly
            setFollowingIds(new Set(ids));
            setFollowingCount(ids.length);
          } else {
            setFollowingList([]);
            setFollowingIds(new Set());
            setFollowingCount(0);
          }
        }
      } catch (e) { console.error(e); }
      finally { setListLoading(false); }
    }
    loadList();
  }, [showFollowers, followerFilter, userId]);

  // Follow / unfollow a user
  const handleFollow = async (targetId) => {
    if (!userId || !targetId || userId === targetId) return;
    const isFollowing = followingIds?.has(targetId);
    // Optimistic update
    setFollowingIds(prev => {
      const next = new Set(prev);
      isFollowing ? next.delete(targetId) : next.add(targetId);
      return next;
    });
    if (!isFollowing) {
      setFollowingCount(c => c + 1);
      await supabase.from("follows").upsert({ follower_id: userId, following_id: targetId }, { onConflict: "follower_id,following_id" });
    } else {
      setFollowingCount(c => Math.max(0, c - 1));
      await supabase.from("follows").delete().eq("follower_id", userId).eq("following_id", targetId);
    }
    // Refresh list
    setFollowerList(prev => prev);
  };
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
  const [mtExpanded, setMtExpanded] = useState(false);
  const [mtCls, setMtCls] = useState("munros");
  const [mtDone, setMtDone] = useState(null);
  const [mtSort, setMtSort] = useState("name");
  const [selPeak, setSelPeak] = useState(null);
  const [logging, setLogging] = useState(false);
  const [logDate, setLogDate] = useState("");
  const [logNote, setLogNote] = useState("");
  const [peakData, setPeakData] = useState(PEAKS_FALLBACK);
  const mtMapRef = useRef(null);
  const [mtActiveGpxId, setMtActiveGpxId] = useState(null);
  const [mtGpxLoading, setMtGpxLoading] = useState(false);

  async function handleMtDrawGpx(route) {
    if (!mtMapRef.current || !route.gpx_file) return;
    if (mtActiveGpxId === route.id) {
      removeGpxFromMap(mtMapRef.current, route.id);
      setMtActiveGpxId(null);
      return;
    }
    if (mtActiveGpxId) removeGpxFromMap(mtMapRef.current, mtActiveGpxId);
    setMtGpxLoading(true);
    try {
      const xml = await fetchGpxText(route.gpx_file);
      const coords = parseGpxCoords(xml);
      if (coords.length > 1) {
        drawGpxOnMap(mtMapRef.current, route.id, coords, { color: "#E85D3A", fitBounds: true, fitPadding: 40 });
        setMtActiveGpxId(route.id);
      }
    } catch (err) {
      console.error("MT GPX draw error:", err);
    } finally {
      setMtGpxLoading(false);
    }
  }

  // Update peakData when Supabase peaks load
  useEffect(() => {
    if (dbPeaks && dbPeaks.length > 0) {
      setPeakData(dbPeaks);
    }
  }, [dbPeaks]);
  const [showCreate, setShowCreate] = useState(false);
  const [createType, setCreateType] = useState(null);
  const [postText, setPostText] = useState("");
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

  const handleLog = async (peakId) => {
    if (!logDate) return;
    const peak = peakData.find(p => p.id === peakId);
    // Update local state immediately
    setPeakData(prev => prev.map(p => p.id === peakId ? { ...p, done: true, date: logDate, log: logNote || "" } : p));
    setLogging(false);
    setLogDate("");
    setLogNote("");
    setSelPeak(prev => ({ ...prev, done: true, date: logDate, log: logNote || "" }));
    // Save to Supabase
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from("user_peaks").upsert({
        user_id: user.id,
        peak_id: String(peakId),
        peak_name: peak?.name || "",
        done: true,
        date_completed: logDate,
        notes: logNote || null,
      }, { onConflict: "user_id,peak_id" });
    } catch (e) { console.error("Failed to save peak:", e); }
  };

  const handleUnlogPeak = async (peakId) => {
    setPeakData(prev => prev.map(p => p.id === peakId ? { ...p, done: false, date: undefined, log: undefined } : p));
    setSelPeak(prev => ({ ...prev, done: false, date: undefined, log: undefined }));
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from("user_peaks").delete().eq("user_id", user.id).eq("peak_id", String(peakId));
    } catch (e) { console.error("Failed to unlog peak:", e); }
  };

  return (
    <>
    <div style={{ padding: "0 16px 16px", overflowY: "auto", flex: 1 }}>

      {/* ═══ FOLLOWERS / FOLLOWING — FULL PAGE ═══ */}
      {showFollowers && (
        <div style={{ position: "fixed", inset: 0, zIndex: 60, background: "#041e3d", display: "flex", flexDirection: "column", animation: "fi .2s ease" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", borderBottom: "1px solid rgba(90,152,227,0.1)", background: "rgba(4,30,61,0.95)", backdropFilter: "blur(12px)" }}>
            <button onClick={() => setShowFollowers(null)} style={{ background: "rgba(90,152,227,0.1)", border: "1px solid rgba(90,152,227,0.2)", borderRadius: "10px", padding: "7px 12px", color: "#BDD6F4", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Sans'" }}>
              <ChevronLeft size={16} /> Back
            </button>
            <div style={{ flex: 1, display: "flex", gap: "6px" }}>
              {["followers", "following"].map(t => (
                <button key={t} onClick={() => setShowFollowers(t)} style={{ flex: 1, padding: "8px", borderRadius: "10px", border: "none", background: showFollowers === t ? "rgba(90,152,227,0.15)" : "transparent", color: showFollowers === t ? "#5A98E3" : "#BDD6F4", fontSize: "13px", fontWeight: showFollowers === t ? 700 : 500, cursor: "pointer", fontFamily: "'DM Sans'", textTransform: "capitalize" }}>
                  {t} <span style={{ fontSize: "11px", opacity: 0.6 }}>({t === "followers" ? (followerCount ?? 0) : (followingCount ?? 0)})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: "6px", padding: "10px 16px 8px", borderBottom: "1px solid rgba(90,152,227,0.07)" }}>
            {[["recent", "Recent"], ["area", "By Area"], ["interacted", "Most Interacted"]].map(([k, l]) => (
              <button key={k} onClick={() => setFollowerFilter(k)} style={{ padding: "5px 12px", borderRadius: "8px", border: "none", background: followerFilter === k ? "rgba(90,152,227,0.15)" : "rgba(90,152,227,0.05)", color: followerFilter === k ? "#5A98E3" : "#BDD6F4", fontSize: "11px", fontWeight: followerFilter === k ? 700 : 500, cursor: "pointer", fontFamily: "'DM Sans'" }}>{l}</button>
            ))}
          </div>

          {/* User list */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {listLoading ? (
              <div style={{ padding: "60px", textAlign: "center" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#5A98E3", margin: "0 auto", animation: "pulse 1s ease infinite" }} />
                <div style={{ fontSize: "12px", color: "#BDD6F4", opacity: 0.4, marginTop: "12px" }}>Loading…</div>
              </div>
            ) : (showFollowers === "followers" ? followerList : followingList).length === 0 ? (
              <div style={{ padding: "60px 24px", textAlign: "center" }}>
                <Users size={40} color="#5A98E3" style={{ opacity: 0.2, marginBottom: "16px" }} />
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#F8F8F8", marginBottom: "8px" }}>No {showFollowers} yet</div>
                <div style={{ fontSize: "13px", color: "#BDD6F4", opacity: 0.4, lineHeight: 1.5 }}>
                  {showFollowers === "followers" ? "When people follow you they'll appear here." : "Search for hikers and follow them to see their walks and summits."}
                </div>
              </div>
            ) : (showFollowers === "followers" ? followerList : followingList).map(u => (
              <div key={u.id} onClick={() => { setShowFollowers(null); if (onViewProfile) onViewProfile(u); }} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", borderBottom: "1px solid rgba(90,152,227,0.07)", cursor: "pointer" }}>
                <div style={{ width: "46px", height: "46px", borderRadius: "50%", background: "linear-gradient(135deg,#264f80,#5A98E3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 700, color: "#F8F8F8", flexShrink: 0 }}>
                  {(u.username || u.name || "?")[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#F8F8F8" }}>{u.name || u.username}</div>
                  <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.5, marginTop: "2px" }}>
                    {u.username ? `@${u.username}` : ""}{u.location ? ` · ${u.location}` : ""}
                  </div>
                </div>
                {u.id !== userId && (
                  <button onClick={() => handleFollow(u.id)} style={{
                    padding: "7px 16px", borderRadius: "10px", cursor: "pointer", flexShrink: 0,
                    background: followingIds?.has(u.id) ? "transparent" : "linear-gradient(135deg,#E85D3A,#d04a2a)",
                    color: followingIds?.has(u.id) ? "#5A98E3" : "#F8F8F8",
                    fontSize: "12px", fontWeight: 700, fontFamily: "'DM Sans'",
                    border: followingIds?.has(u.id) ? "1px solid rgba(90,152,227,0.3)" : "none",
                  }}>
                    {followingIds?.has(u.id) ? "Following" : "Follow"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}



      <div style={{ padding: "24px 0 16px", display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{ position: "relative", width: "58px", height: "58px", flexShrink: 0 }}>
          <div style={{ width: "58px", height: "58px", borderRadius: "50%", background: avatarUrl ? "transparent" : "linear-gradient(135deg,#264f80,#5A98E3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: 800, color: "#F8F8F8", border: "3px solid rgba(90,152,227,0.3)", overflow: "hidden" }}>
            {avatarUrl ? <img src={avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (userName || "A")[0].toUpperCase()}
          </div>
          {/* Camera overlay button */}
          <label style={{ position: "absolute", bottom: 0, right: 0, width: "20px", height: "20px", borderRadius: "50%", background: "#E85D3A", border: "2px solid #041e3d", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Camera size={10} color="#F8F8F8" />
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files?.[0]) handleAvatarUpload(e.target.files[0]); }} />
          </label>
          {uploadingAvatar && <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(4,30,61,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#5A98E3", animation: "pulse 1s ease infinite" }} /></div>}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "20px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'Playfair Display',serif" }}>{userName || ME.name}</div>
          <div style={{ fontSize: "12px", color: "#BDD6F4", opacity: 0.6, display: "flex", alignItems: "center", gap: "6px" }}>
              <span>@{userName?.toLowerCase().replace(/\s+/g, "_") || ME.user}</span>
              {userLocation ? (
                <span>· {userLocation}</span>
              ) : (
                <span onClick={async () => {
                  const loc = prompt("Add your location (e.g. Dundee, Scotland)");
                  if (!loc) return;
                  setUserLocation(loc);
                  const { data: { user } } = await supabase.auth.getUser();
                  if (user) await supabase.auth.updateUser({ data: { ...user.user_metadata, location: loc } });
                }} style={{ color: "#5A98E3", cursor: "pointer", fontWeight: 600 }}>+ Add location</span>
              )}
            </div>
          <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
            <span onClick={() => setShowFollowers("followers")} style={{ fontSize: "11px", color: "#BDD6F4", cursor: "pointer" }}><strong style={{ color: "#F8F8F8" }}>{followerCount ?? 0}</strong> followers</span>
            <span onClick={() => setShowFollowers("following")} style={{ fontSize: "11px", color: "#BDD6F4", cursor: "pointer" }}><strong style={{ color: "#F8F8F8" }}>{followingCount ?? 0}</strong> following</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
              <button onClick={onSignOut} style={{ padding: "6px 12px", borderRadius: "8px", background: "#0a2240", border: "1px solid rgba(90,152,227,0.12)", cursor: "pointer", color: "#BDD6F4", fontSize: "11px", fontWeight: 600, display: "flex", alignItems: "center", gap: "5px", fontFamily: "'DM Sans'" }}>
                <ArrowRight size={13} style={{ transform: "rotate(180deg)" }} /> Sign out
              </button>
              <button style={{ padding: "7px", borderRadius: "8px", background: "#0a2240", border: "1px solid rgba(90,152,227,0.12)", cursor: "pointer", color: "#BDD6F4" }}><Settings size={16} /></button>
            </div>
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
              <button onClick={() => { setMtView("list"); if (!mtCls) setMtCls("munros"); }} style={{ padding: "5px 12px", borderRadius: "8px", border: "none", background: mtView === "list" ? "rgba(90,152,227,0.2)" : "#0a2240", color: mtView === "list" ? "#5A98E3" : "#BDD6F4", fontSize: "11px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontFamily: "'DM Sans'", opacity: mtView === "list" ? 1 : 0.5 }}><List size={12} /> List</button>
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

          {/* Classification dropdown */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
            <select value={mtCls || ""} onChange={e => setMtCls(e.target.value || null)} style={{ padding: "7px 12px", borderRadius: "10px", fontSize: "11px", fontWeight: 600, background: mtCls ? `${CLS[mtCls]?.color}15` : "#0a2240", border: `1px solid ${mtCls ? CLS[mtCls]?.color : "rgba(90,152,227,0.12)"}`, color: mtCls ? CLS[mtCls]?.color : "#BDD6F4", outline: "none", cursor: "pointer", fontFamily: "'DM Sans'" }}>
              {Object.entries(CLS).filter(([k]) => k !== "non-mountain").map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
            </select>
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
            <div style={mtExpanded ? { position: "fixed", inset: 0, zIndex: 50, background: "#041e3d", display: "flex", flexDirection: "column" } : { marginBottom: "10px" }}>
              {/* Expand/collapse controls */}
              {mtExpanded && (
                <div style={{ padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                  <select value={mtCls || ""} onChange={e => setMtCls(e.target.value || null)} style={{ padding: "7px 12px", borderRadius: "10px", fontSize: "11px", fontWeight: 600, background: mtCls ? `${CLS[mtCls]?.color}15` : "#0a2240", border: `1px solid ${mtCls ? CLS[mtCls]?.color : "rgba(90,152,227,0.12)"}`, color: mtCls ? CLS[mtCls]?.color : "#BDD6F4", outline: "none", cursor: "pointer", fontFamily: "'DM Sans'" }}>
                    <option value="">All Classifications</option>
                    {Object.entries(CLS).filter(([k]) => k !== "non-mountain").map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                  </select>
                  <div style={{ fontSize: "10px", color: "#6BCB77", fontWeight: 600 }}>{mtCls ? `${filteredPeaks.filter(p => p.done).length}/${CLS[mtCls]?.count || filteredPeaks.length} logged` : ""}</div>
                  <button onClick={() => setMtExpanded(false)} style={{ background: "rgba(4,30,61,0.88)", border: "1px solid rgba(90,152,227,0.2)", borderRadius: "8px", padding: "6px", color: "#BDD6F4", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Minimize2 size={14} /></button>
                </div>
              )}
              <div style={mtExpanded ? { flex: 1, position: "relative", display: "flex", flexDirection: "column" } : { position: "relative" }}>
                {!mtExpanded && <button onClick={() => setMtExpanded(true)} style={{ position: "absolute", top: 10, right: 10, zIndex: 22, background: "rgba(4,30,61,0.88)", backdropFilter: "blur(8px)", border: "1px solid rgba(90,152,227,0.2)", borderRadius: "8px", padding: "6px", color: "#BDD6F4", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Maximize2 size={14} /></button>}

              {mtActiveGpxId && (
                <button onClick={() => { removeGpxFromMap(mtMapRef.current, mtActiveGpxId); setMtActiveGpxId(null); }}
                  style={{ position: "absolute", top: 10, left: 10, zIndex: 22, background: "rgba(4,30,61,0.88)", backdropFilter: "blur(8px)",
                    border: "1px solid rgba(232,93,58,0.3)", borderRadius: "20px", padding: "5px 12px",
                    color: "#E85D3A", fontSize: "11px", fontWeight: 600, cursor: "pointer",
                    fontFamily: "'DM Sans'", display: "flex", alignItems: "center", gap: "5px" }}>
                  <X size={11} /> Clear route
                </button>
              )}
              {mtGpxLoading && (
                <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", zIndex: 22,
                  background: "rgba(4,30,61,0.92)", backdropFilter: "blur(10px)", borderRadius: "20px",
                  padding: "5px 14px", border: "1px solid rgba(90,152,227,0.2)", display: "flex", alignItems: "center", gap: "7px" }}>
                  <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#E85D3A", animation: "pulse 1s ease infinite" }} />
                  <span style={{ fontSize: "10px", fontWeight: 600, color: "#BDD6F4", fontFamily: "'DM Sans'" }}>Loading route…</span>
                </div>
              )}
                <MiniMap key={mtExpanded ? "expanded" : "compact"} height={mtExpanded ? "100%" : "340px"} showGPS={true} onMapReady={map => { mtMapRef.current = map; }} markers={filteredPeaks.filter(pk => pk.lat && pk.lng).slice(0, 400).map(pk => ({ lat: pk.lat, lng: pk.lng, color: pk.done ? "#6BCB77" : "#E85D3A", data: pk, style: `width:14px;height:14px;border-radius:50%;background:${pk.done ? "#6BCB77" : "#E85D3A"};border:2px solid rgba(255,255,255,0.5);cursor:pointer;box-shadow:0 0 6px ${pk.done ? "rgba(107,203,119,0.4)" : "rgba(232,93,58,0.4)"};` }))} onMarkerClick={(m) => { setSelPeak(m.data); setLogging(false); if (mtActiveGpxId) { removeGpxFromMap(mtMapRef.current, mtActiveGpxId); setMtActiveGpxId(null); } }}>
                {selPeak && (
                  <div style={{ position: "absolute", bottom: 10, left: 10, right: 10, zIndex: 20, background: "rgba(4,30,61,0.97)", backdropFilter: "blur(16px)", borderRadius: "14px", border: "1px solid rgba(90,152,227,0.15)", animation: "su .25s ease", overflow: "hidden" }}>
                    <div style={{ height: "3px", background: selPeak.done ? "linear-gradient(90deg,#6BCB77,transparent)" : "linear-gradient(90deg,#E85D3A,transparent)" }} />
                    <div style={{ padding: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "15px", fontWeight: 800, color: "#F8F8F8" }}>{selPeak.name}</span>
                            <div onClick={(e) => { e.stopPropagation(); if (selPeak.done && !logging) { handleUnlogPeak(selPeak.id); setLogging(false); } else if (!selPeak.done) { const today = new Date().toISOString().split("T")[0]; setPeakData(prev => prev.map(p => p.id === selPeak.id ? { ...p, done: true, date: today, log: "" } : p)); setSelPeak(prev => ({ ...prev, done: true, date: today, log: "" })); setLogDate(today); setLogNote(""); setLogging(true); } }} style={{ width: "22px", height: "22px", borderRadius: "6px", background: selPeak.done ? "rgba(107,203,119,0.15)" : "rgba(232,93,58,0.1)", border: `2px solid ${selPeak.done ? "#6BCB77" : "rgba(232,93,58,0.3)"}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all .2s" }}>{selPeak.done && <Check size={13} color="#6BCB77" strokeWidth={3} />}</div>
                          </div>
                          <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.6, marginTop: "2px" }}>{selPeak.ht}m · {selPeak.reg}</div>
                          <span style={{ fontSize: "9px", padding: "2px 7px", borderRadius: "5px", background: `${CLS[selPeak.cls]?.color}15`, color: CLS[selPeak.cls]?.color, fontWeight: 600, marginTop: "4px", display: "inline-block" }}>{CLS[selPeak.cls]?.name}</span>
                          {(() => { const matchedRoutes = ROUTES.filter(r => r.peaks && r.peaks.includes(selPeak.name)); return matchedRoutes.length > 0 ? (
                            <div style={{ marginTop: "6px" }}>
                              <div style={{ fontSize: "9px", color: "#BDD6F4", opacity: 0.5, fontWeight: 600, marginBottom: "3px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Routes</div>
                              {matchedRoutes.map(r => (
                                <div key={r.id} onClick={() => openRoute && openRoute(r, "mountain-tracker")} style={{
                                  fontSize: "10px", cursor: r.gpx_file ? "pointer" : "default",
                                  fontWeight: 600, display: "flex", alignItems: "center", gap: "4px", marginTop: "3px",
                                  padding: "5px 8px", borderRadius: "7px",
                                  background: "rgba(90,152,227,0.06)",
                                  border: "1px solid rgba(90,152,227,0.1)",
                                  color: "#5A98E3",
                                  transition: "all .15s"
                                }}>
                                  <Route size={10} />
                                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</span>
                                  <span style={{ opacity: 0.6, fontWeight: 400 }}>{r.dist}km · {r.diff}</span>
                                  {r.gpx_file && <span style={{ fontSize: "8px", padding: "1px 4px", borderRadius: "3px",
                                    background: "rgba(232,93,58,0.15)", color: "#E85D3A", fontWeight: 700 }}>
                                    View route →
                                  </span>}
                                </div>
                              ))}
                            </div>
                          ) : null; })()}
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
            </div>
          )}

          {/* ═══ LIST VIEW ═══ */}
          {mtView === "list" && (
            <div>
              {!mtCls ? (
                <div style={{ padding: "32px 16px", textAlign: "center", background: "#0a2240", borderRadius: "14px", border: "1px solid rgba(90,152,227,0.1)", marginBottom: "10px" }}>
                  <Mountain size={32} color="#5A98E3" style={{ opacity: 0.3, marginBottom: "12px" }} />
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#F8F8F8", marginBottom: "6px" }}>Select a classification</div>
                  <div style={{ fontSize: "12px", color: "#BDD6F4", opacity: 0.5, lineHeight: 1.5 }}>Choose a classification above to browse peaks in list view — loading all at once is too slow.</div>
                </div>
              ) : (
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
                      <div key={pk.id} onClick={() => { setSelPeak(pk); setMtView("map"); setLogging(false); }} style={{ background: "#0a2240", borderRadius: "10px", padding: "11px 12px", border: "1px solid rgba(90,152,227,0.08)", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", animation: `fi .2s ease ${i * .02}s both` }}>
                        <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: pk.done ? "#6BCB77" : "#E85D3A", border: "2px solid rgba(248,248,248,0.3)", boxShadow: `0 0 6px ${pk.done ? "rgba(107,203,119,0.3)" : "rgba(232,93,58,0.3)"}`, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: "13px", fontWeight: 700, color: "#F8F8F8" }}>{pk.name}</div>
                          <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.5, marginTop: "1px" }}>{pk.reg}</div>
                        </div>
                        <span style={{ fontSize: "9px", padding: "2px 6px", borderRadius: "5px", background: `${CLS[pk.cls]?.color}12`, color: CLS[pk.cls]?.color, fontWeight: 600, flexShrink: 0 }}>{CLS[pk.cls]?.name}</span>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "#BDD6F4", opacity: 0.6, minWidth: "42px", textAlign: "right", fontFamily: "'JetBrains Mono'" }}>{pk.ht}m</div>
                        <div style={{ width: "18px", height: "18px", borderRadius: "5px", background: pk.done ? "rgba(107,203,119,0.12)" : "rgba(232,93,58,0.08)", border: `1.5px solid ${pk.done ? "#6BCB77" : "rgba(232,93,58,0.25)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {pk.done && <Check size={11} color="#6BCB77" strokeWidth={3} />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
            <textarea placeholder="What's on your mind? Share a summit story, trail tip, or photo..." rows={3} value={postText} onChange={e => setPostText(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(90,152,227,0.2)", background: "#041e3d", color: "#F8F8F8", fontSize: "12px", outline: "none", fontFamily: "'DM Sans'", resize: "none", marginBottom: "10px" }} />
            <div style={{ display: "flex", gap: "8px" }}>
              <button style={{ flex: 1, padding: "9px", borderRadius: "8px", border: "1px dashed rgba(90,152,227,0.2)", background: "transparent", color: "#BDD6F4", fontSize: "11px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", fontFamily: "'DM Sans'" }}><Camera size={13} /> Photo</button>
              <button onClick={async () => {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                  const meta = user.user_metadata || {};
                  await supabase.from("posts").insert({
                    user_id: user.id,
                    username: meta.username || null,
                    full_name: meta.full_name || null,
                    type: "summit",
                    text: postText,
                    peaks: [],
                  });
                }
                setCreateType(null); setShowCreate(false); setPostText(""); if (goHome) goHome("all");
              }} style={{ flex: 1, padding: "9px", borderRadius: "8px", border: "none", background: "linear-gradient(135deg,#E85D3A,#d04a2a)", color: "#F8F8F8", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'" }}>Post</button>
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
                  <div key={i} style={{ background: "#0a2240", borderRadius: "16px", border: "1px solid rgba(90,152,227,0.12)", overflow: "hidden", animation: `fi .3s ease ${i * .05}s both` }}>
                    <div style={{ height: "3px", background: "linear-gradient(90deg,#6BCB77,#5A98E3)" }} />
                    <div style={{ padding: "14px" }}>

                      {/* Header — avatar + name + date */}
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: avatarUrl ? "transparent" : "linear-gradient(135deg,#264f80,#5A98E3)", overflow: "hidden", flexShrink: 0, border: "2px solid rgba(90,152,227,0.2)" }}>
                          {avatarUrl ? <img src={avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 800, color: "#F8F8F8" }}>{(userName||"A")[0].toUpperCase()}</div>}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "13px", fontWeight: 700, color: "#F8F8F8" }}>{userName}</div>
                          <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.5 }}>{w.date} · Tracked walk</div>
                        </div>
                        <button onClick={() => setSelWalk(w)} style={{ background: "rgba(90,152,227,0.08)", border: "1px solid rgba(90,152,227,0.15)", borderRadius: "8px", padding: "5px 10px", color: "#5A98E3", fontSize: "10px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'" }}>View</button>
                      </div>

                      {/* Walk name */}
                      <div style={{ fontSize: "15px", fontWeight: 800, color: "#F8F8F8", marginBottom: "4px" }}>{w.name}</div>

                      {/* Stats row */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px", marginBottom: "12px" }}>
                        {[["Distance", `${w.dist ?? 0}km`], ["Elevation", `${w.elev ?? 0}m`], ["Moving", w.movingTime || "--"]].map(([label, val]) => (
                          <div key={label} style={{ textAlign: "center", padding: "8px 4px", background: "#041e3d", borderRadius: "8px" }}>
                            <div style={{ fontSize: "12px", fontWeight: 700, color: "#F8F8F8", fontFamily: "'JetBrains Mono'" }}>{val}</div>
                            <div style={{ fontSize: "8px", color: "#BDD6F4", opacity: 0.4, marginTop: "2px" }}>{label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Peaks */}
                      {w.peaks?.length > 0 && (
                        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "12px" }}>
                          {w.peaks.map(pk => <span key={pk} style={{ fontSize: "9px", padding: "2px 7px", borderRadius: "6px", background: "rgba(107,203,119,0.1)", color: "#6BCB77", fontWeight: 600 }}>⛰️ {pk}</span>)}
                        </div>
                      )}

                      {/* Photo grid — uploaded photos + add more slots */}
                      {(() => {
                        const photos = walkPhotos[w.id] || [];
                        const emptySlots = Math.max(0, 3 - photos.length);
                        return (
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px", marginBottom: "12px" }}>
                            {photos.map((url, pi) => (
                              <div key={pi} style={{ aspectRatio: "1", borderRadius: "10px", overflow: "hidden", background: "#041e3d" }}>
                                <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              </div>
                            ))}
                            {Array.from({ length: emptySlots }).map((_, si) => (
                              <label key={`slot-${si}`} style={{ aspectRatio: "1", borderRadius: "10px", border: "1.5px dashed rgba(90,152,227,0.25)", background: "rgba(90,152,227,0.04)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", gap: "4px" }}>
                                {uploadingPhoto === w.id ? (
                                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#5A98E3", animation: "pulse 1s ease infinite" }} />
                                ) : (
                                  <>
                                    <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "rgba(90,152,227,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                      <Plus size={16} color="#5A98E3" />
                                    </div>
                                    <span style={{ fontSize: "8px", color: "#BDD6F4", opacity: 0.4, fontWeight: 600 }}>Add photo</span>
                                  </>
                                )}
                                <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files?.[0] && w.id) handleWalkPhotoUpload(w.id, e.target.files[0]); }} />
                              </label>
                            ))}
                          </div>
                        );
                      })()}

                      {/* Comment box */}
                      <div style={{ marginBottom: "12px" }}>
                        <textarea
                          placeholder="Add a note about this walk..."
                          rows={2}
                          value={walkComments[w.id] || w.desc || ""}
                          onChange={e => setWalkComments(prev => ({ ...prev, [w.id]: e.target.value }))}
                          style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid rgba(90,152,227,0.15)", background: "#041e3d", color: "#F8F8F8", fontSize: "12px", outline: "none", fontFamily: "'DM Sans'", resize: "none", lineHeight: 1.5 }}
                        />
                      </div>

                      {/* Social actions */}
                      <div style={{ display: "flex", gap: "16px", borderTop: "1px solid rgba(90,152,227,0.08)", paddingTop: "10px" }}>
                        <button style={{ background: "none", border: "none", color: "#BDD6F4", opacity: 0.45, fontSize: "11px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontFamily: "'DM Sans'" }}><Heart size={14} /></button>
                        <button style={{ background: "none", border: "none", color: "#BDD6F4", opacity: 0.45, fontSize: "11px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontFamily: "'DM Sans'" }}><MessageCircle size={14} /></button>
                        <button style={{ background: "none", border: "none", color: "#BDD6F4", opacity: 0.45, fontSize: "11px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontFamily: "'DM Sans'" }}><Share2 size={14} /></button>
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

    </div> {/* end scroll container */}

      {/* ═══ WALK DETAIL FULL-SCREEN MODAL ═══ */}
      {selWalk && (
        <div style={{ position: "fixed", inset: 0, zIndex: 70, background: "#041e3d", display: "flex", flexDirection: "column", animation: "fi .2s ease" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", borderBottom: "1px solid rgba(90,152,227,0.1)", background: "rgba(4,30,61,0.95)", backdropFilter: "blur(12px)", flexShrink: 0 }}>
            <button onClick={() => { setSelWalk(null); setConfirmDeleteWalk(false); }} style={{ background: "rgba(90,152,227,0.1)", border: "1px solid rgba(90,152,227,0.2)", borderRadius: "10px", padding: "7px 12px", color: "#BDD6F4", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Sans'" }}>
              <ChevronLeft size={16} /> Back
            </button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "15px", fontWeight: 800, color: "#F8F8F8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selWalk.name}</div>
              <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.5, marginTop: "1px" }}>{selWalk.date}</div>
            </div>
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 40px" }}>
            <div style={{ height: "3px", borderRadius: "2px", background: "linear-gradient(90deg,#6BCB77,#5A98E3)", marginBottom: "20px" }} />

            {/* Distance · Elevation · Speed */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "10px" }}>
              {[
                ["Distance", `${selWalk.dist ?? 0}km`],
                ["Elev Gain", `${selWalk.elev ?? 0}m`],
                ["Avg Speed", `${selWalk.avgSpeed ?? 0}kph`],
              ].map(([label, val]) => (
                <div key={label} style={{ textAlign: "center", padding: "14px 6px", background: "#0a2240", borderRadius: "14px", border: "1px solid rgba(90,152,227,0.1)" }}>
                  <div style={{ fontSize: "17px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'JetBrains Mono'" }}>{val}</div>
                  <div style={{ fontSize: "9px", color: "#BDD6F4", opacity: 0.4, marginTop: "5px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Total time · Moving time */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
              {[
                ["Total Time", selWalk.time || "--"],
                ["Moving Time", selWalk.movingTime || "--"],
              ].map(([label, val]) => (
                <div key={label} style={{ textAlign: "center", padding: "14px 6px", background: "#0a2240", borderRadius: "14px", border: "1px solid rgba(90,152,227,0.1)" }}>
                  <div style={{ fontSize: "17px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'JetBrains Mono'" }}>{val}</div>
                  <div style={{ fontSize: "9px", color: "#BDD6F4", opacity: 0.4, marginTop: "5px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Pace — calculated from distance + moving time */}
            {(() => {
              try {
                const parts = (selWalk.movingTime || "").match(/(\d+)h\s*(\d+)m|(\d+)h|(\d+)m/);
                const dist = parseFloat(selWalk.dist);
                if (!parts || !dist) return null;
                const hours = parts[1] ? parseInt(parts[1]) : 0;
                const mins = parts[2] ? parseInt(parts[2]) : (parts[3] ? parseInt(parts[3]) * 60 : (parts[4] ? parseInt(parts[4]) : 0));
                const totalMins = hours * 60 + mins;
                if (!totalMins) return null;
                const paceMin = Math.floor(totalMins / dist);
                const paceSec = Math.round(((totalMins / dist) - paceMin) * 60);
                return (
                  <div style={{ padding: "14px 16px", background: "#0a2240", borderRadius: "14px", border: "1px solid rgba(90,152,227,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                    <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.5px" }}>Pace</div>
                    <div style={{ fontSize: "18px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'JetBrains Mono'" }}>
                      {paceMin}:{String(paceSec).padStart(2, "0")} <span style={{ fontSize: "11px", fontWeight: 500, color: "#BDD6F4", opacity: 0.5 }}>min/km</span>
                    </div>
                  </div>
                );
              } catch { return null; }
            })()}

            {/* Notes */}
            {selWalk.desc ? (
              <div style={{ padding: "14px", background: "#0a2240", borderRadius: "14px", border: "1px solid rgba(90,152,227,0.08)", marginBottom: "10px" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, color: "#BDD6F4", opacity: 0.5, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Notes</div>
                <div style={{ fontSize: "13px", color: "#BDD6F4", lineHeight: 1.6 }}>{selWalk.desc}</div>
              </div>
            ) : null}

            {/* Peaks bagged */}
            {selWalk.peaks && selWalk.peaks.length > 0 ? (
              <div style={{ padding: "14px", background: "rgba(107,203,119,0.05)", borderRadius: "14px", border: "1px solid rgba(107,203,119,0.12)", marginBottom: "10px" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, color: "#6BCB77", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>⛰️ Peaks Bagged</div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {selWalk.peaks.map(pk => (
                    <span key={pk} style={{ fontSize: "12px", padding: "5px 12px", borderRadius: "10px", background: "rgba(107,203,119,0.12)", color: "#6BCB77", fontWeight: 600 }}>{pk}</span>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Delete */}
            {!confirmDeleteWalk ? (
              <button onClick={() => setConfirmDeleteWalk(true)} style={{ width: "100%", padding: "13px", borderRadius: "14px", border: "1px solid rgba(232,93,58,0.2)", background: "rgba(232,93,58,0.05)", color: "#E85D3A", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "8px" }}>
                <Trash2 size={15} /> Delete Walk
              </button>
            ) : (
              <div style={{ marginTop: "8px", padding: "18px", background: "rgba(232,93,58,0.06)", borderRadius: "14px", border: "1px solid rgba(232,93,58,0.2)", textAlign: "center" }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#F8F8F8", marginBottom: "6px" }}>Delete this walk?</div>
                <div style={{ fontSize: "12px", color: "#BDD6F4", opacity: 0.5, marginBottom: "16px" }}>This can't be undone.</div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => setConfirmDeleteWalk(false)} style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "1px solid rgba(90,152,227,0.2)", background: "transparent", color: "#BDD6F4", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'" }}>Cancel</button>
                  <button disabled={deletingWalk} onClick={async () => {
                    setDeletingWalk(true);
                    try {
                      if (selWalk?.id) {
                        const { data: { user } } = await supabase.auth.getUser();
                        if (user) await supabase.from("user_walks").delete().eq("id", selWalk.id).eq("user_id", user.id);
                      }
                      setSavedWalks(prev => prev.filter(w => w !== selWalk));
                      setSelWalk(null);
                      setConfirmDeleteWalk(false);
                    } catch (e) { console.error(e); }
                    finally { setDeletingWalk(false); }
                  }} style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#E85D3A,#d04a2a)", color: "#F8F8F8", fontSize: "13px", fontWeight: 700, cursor: deletingWalk ? "default" : "pointer", fontFamily: "'DM Sans'", opacity: deletingWalk ? 0.6 : 1 }}>
                    {deletingWalk ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
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
   USER PROFILE MODAL
   ═══════════════════════════════════════════════════════════════════ */
const UserProfileModal = ({ user, userId, followingIds, onFollow, onClose }) => {
  const [posts, setPosts] = useState([]);
  const [walks, setWalks] = useState([]);
  const [peakCount, setPeakCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [followerCount, setFollowerCount] = useState(user.follower_count || 0);
  const [followingCount, setFollowingCount] = useState(user.following_count || 0);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        // Load their posts
        const { data: postData } = await supabase.from("posts").select("*")
          .eq("user_id", user.id).order("created_at", { ascending: false }).limit(10);
        if (postData) setPosts(postData);

        // Load their walk count
        const { data: walkData } = await supabase.from("user_walks").select("id")
          .eq("user_id", user.id);
        if (walkData) setWalks(walkData);

        // Load their peak count
        const { data: peakData } = await supabase.from("user_peaks").select("id")
          .eq("user_id", user.id).eq("done", true);
        if (peakData) setPeakCount(peakData.length);

        // Load follower/following counts from profile
        const { data: profileData } = await supabase.from("profiles")
          .select("follower_count, following_count").eq("id", user.id).maybeSingle();
        if (profileData) {
          setFollowerCount(profileData.follower_count || 0);
          setFollowingCount(profileData.following_count || 0);
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    loadProfile();
  }, [user.id]);

  const isFollowing = followingIds?.has(user.id);
  const isOwnProfile = userId === user.id;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 80, background: "#041e3d", display: "flex", flexDirection: "column", animation: "fi .2s ease" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", borderBottom: "1px solid rgba(90,152,227,0.1)", background: "rgba(4,30,61,0.95)", backdropFilter: "blur(12px)", flexShrink: 0 }}>
        <button onClick={onClose} style={{ background: "rgba(90,152,227,0.1)", border: "1px solid rgba(90,152,227,0.2)", borderRadius: "10px", padding: "7px 12px", color: "#BDD6F4", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Sans'" }}>
          <ChevronLeft size={16} /> Back
        </button>
        <div style={{ flex: 1 }} />
        {!isOwnProfile && (
          <button onClick={() => onFollow(user.id)} style={{ padding: "8px 18px", borderRadius: "10px", border: isFollowing ? "1px solid rgba(90,152,227,0.3)" : "none", background: isFollowing ? "transparent" : "linear-gradient(135deg,#E85D3A,#d04a2a)", color: isFollowing ? "#5A98E3" : "#F8F8F8", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'" }}>
            {isFollowing ? "Following" : "Follow"}
          </button>
        )}
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px" }}>
        {/* Avatar + name */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg,#264f80,#5A98E3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", fontWeight: 800, color: "#F8F8F8", border: "3px solid rgba(90,152,227,0.3)", flexShrink: 0 }}>
            {(user.username || user.name || "?")[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: "20px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'Playfair Display',serif" }}>{user.name || user.username}</div>
            {user.username && <div style={{ fontSize: "12px", color: "#BDD6F4", opacity: 0.6, marginTop: "2px" }}>@{user.username}</div>}
            {user.location && <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.4, marginTop: "2px" }}>📍 {user.location}</div>}
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "20px" }}>
          {[
            [walks.length, "Walks"],
            [peakCount, "Peaks"],
            [followerCount, "Followers"],
          ].map(([val, label]) => (
            <div key={label} style={{ textAlign: "center", padding: "12px 4px", background: "#0a2240", borderRadius: "12px", border: "1px solid rgba(90,152,227,0.1)" }}>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'JetBrains Mono'" }}>{val}</div>
              <div style={{ fontSize: "9px", color: "#BDD6F4", opacity: 0.4, marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Their posts */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#5A98E3", margin: "0 auto", animation: "pulse 1s ease infinite" }} />
            <div style={{ fontSize: "12px", color: "#BDD6F4", opacity: 0.4, marginTop: "12px" }}>Loading…</div>
          </div>
        ) : posts.length > 0 ? (
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#BDD6F4", opacity: 0.4, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>Posts</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {posts.map(p => (
                <div key={p.id} style={{ background: "#0a2240", borderRadius: "14px", padding: "14px", border: "1px solid rgba(90,152,227,0.1)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "9px", padding: "1px 7px", borderRadius: "5px", background: p.type === "fundraiser" ? "rgba(107,203,119,0.12)" : p.type === "event" ? "rgba(90,152,227,0.12)" : "rgba(232,93,58,0.1)", color: p.type === "fundraiser" ? "#6BCB77" : p.type === "event" ? "#5A98E3" : "#E85D3A", fontWeight: 600 }}>{p.type || "post"}</span>
                    <span style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.4 }}>{timeAgo(p.created_at)}</span>
                  </div>
                  <div style={{ fontSize: "13px", color: "#BDD6F4", lineHeight: 1.5 }}>{p.text}</div>
                  {p.peaks?.length > 0 && (
                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "8px" }}>
                      {p.peaks.map(pk => <span key={pk} style={{ fontSize: "9px", padding: "2px 7px", borderRadius: "5px", background: "rgba(232,93,58,0.1)", color: "#E85D3A", fontWeight: 600 }}>⛰️ {pk}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <Users size={36} color="#BDD6F4" style={{ opacity: 0.2, marginBottom: "12px" }} />
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#F8F8F8", marginBottom: "6px" }}>No posts yet</div>
            <div style={{ fontSize: "12px", color: "#BDD6F4", opacity: 0.4 }}>{user.name || user.username} hasn't posted anything yet.</div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   PWA INSTALL BANNER
   ═══════════════════════════════════════════════════════════════════ */
const PWAInstallBanner = ({ onDismiss }) => (
  <div style={{ position: "fixed", bottom: 80, left: 12, right: 12, zIndex: 90, background: "rgba(4,30,61,0.97)", backdropFilter: "blur(16px)", borderRadius: "16px", border: "1px solid rgba(90,152,227,0.25)", padding: "14px 16px", boxShadow: "0 8px 32px rgba(0,0,0,0.4)", animation: "su .3s ease" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg,#E85D3A,#d04a2a)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Mountain size={22} color="#F8F8F8" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "13px", fontWeight: 800, color: "#F8F8F8", marginBottom: "2px" }}>Add TrailSync to your home screen</div>
        <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.6, lineHeight: 1.4 }}>Works better as an app — faster, offline-ready, full screen</div>
      </div>
      <button onClick={onDismiss} style={{ background: "none", border: "none", color: "#BDD6F4", opacity: 0.4, cursor: "pointer", padding: "4px", flexShrink: 0 }}><X size={16} /></button>
    </div>
    <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
      <div style={{ flex: 1, background: "rgba(90,152,227,0.08)", borderRadius: "10px", padding: "10px 12px" }}>
        <div style={{ fontSize: "10px", fontWeight: 700, color: "#5A98E3", marginBottom: "4px" }}>📱 iPhone / iPad</div>
        <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.6, lineHeight: 1.5 }}>Tap <strong style={{ color: "#F8F8F8" }}>Share</strong> then <strong style={{ color: "#F8F8F8" }}>Add to Home Screen</strong></div>
      </div>
      <div style={{ flex: 1, background: "rgba(90,152,227,0.08)", borderRadius: "10px", padding: "10px 12px" }}>
        <div style={{ fontSize: "10px", fontWeight: 700, color: "#5A98E3", marginBottom: "4px" }}>🤖 Android</div>
        <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.6, lineHeight: 1.5 }}>Tap <strong style={{ color: "#F8F8F8" }}>⋮ Menu</strong> then <strong style={{ color: "#F8F8F8" }}>Add to Home Screen</strong></div>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════════════ */
export default function TrailSync() {
  // Start as loading, then resolve from Supabase session
  const [authState, setAuthState] = useState("loading");
  const [userName, setUserName] = useState("Alex");
  const [tab, setTab] = useState(() => {
    try { return (typeof window !== "undefined" ? sessionStorage.getItem("ts_tab") : null) || "map"; } catch { return "map"; }
  });

  // Persist tab to sessionStorage on change
  useEffect(() => {
    try { sessionStorage.setItem("ts_tab", tab); } catch {}
  }, [tab]);

  // Register service worker for PWA offline support
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(err => {
        console.log("SW registration failed:", err);
      });
    }
  }, []);

  // Check Supabase session on mount
  useEffect(() => {
    // Fallback: if INITIAL_SESSION hasn't fired within 4s, drop to login screen
    const loadingTimeout = setTimeout(() => {
      setAuthState(prev => prev === "loading" ? "login" : prev);
    }, 4000);

    // Use onAuthStateChange as single source of truth — handles all browsers including Safari
    // INITIAL_SESSION fires immediately with either a session or null
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      clearTimeout(loadingTimeout);
      if (session?.user) {
        const meta = session.user.user_metadata || {};
        const displayName = meta.username || meta.full_name?.split(" ")[0] || session.user.email?.split("@")[0] || "Explorer";
        setUserName(displayName);
        setUserLocation(meta.location || null);
        setUserId(session.user.id);
        setAuthState("app");
        // Load followingIds immediately on auth so buttons show correctly
        supabase.from("follows").select("following_id").eq("follower_id", session.user.id)
          .then(({ data }) => {
            if (data) {
              setFollowingIds(new Set(data.map(f => f.following_id)));
              setFollowingCount(data.length);
            }
          });
      } else {
        // Covers INITIAL_SESSION with no session, SIGNED_OUT, TOKEN_REFRESH_FAILURE
        setAuthState("login");
        if (_event === "SIGNED_OUT") {
          setUserName("Alex");
          setUserId(null);
        }
      }
    });
    return () => { clearTimeout(loadingTimeout); subscription.unsubscribe(); };
  }, []);

  // Auth state managed by Supabase session only — no localStorage sync needed
  const [profileSec, setProfileSec] = useState("mountains");
  const [feedFilter, setFeedFilter] = useState("all");
  const [savedWalks, setSavedWalks] = useState([]);
  const [tutStep, setTutStep] = useState(0);
  const [dbPeaks, setDbPeaks] = useState(null);
  const [dbRoutes, setDbRoutes] = useState(null);
  const [gpxRoute, setGpxRoute] = useState(null); //
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [headerSearch, setHeaderSearch] = useState("");
  const [searchResults, setSearchResults] = useState({ posts: [], users: [], routes: [], peaks: [] });
  const [searching, setSearching] = useState(false);
  const [viewingProfile, setViewingProfile] = useState(null); // { id, name, username, location }
  const [showPWABanner, setShowPWABanner] = useState(false);

  // Show PWA install banner if not already installed and not dismissed
  useEffect(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
    const dismissed = localStorage.getItem("pwa-banner-dismissed");
    if (!isStandalone && !dismissed) {
      setTimeout(() => setShowPWABanner(true), 3000); // show after 3s
    }
  }, []);

  // Follow/unfollow from header search
  // Re-fetch followingIds when browser tab regains focus (fixes Safari session timing)
  useEffect(() => {
    const onFocus = async () => {
      if (!userId) return;
      const { data } = await supabase.from("follows").select("following_id").eq("follower_id", userId);
      if (data && data.length > 0) {
        setFollowingIds(new Set(data.map(f => f.following_id)));
        setFollowingCount(data.length);
      }
    };
    document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") onFocus(); });
    return () => document.removeEventListener("visibilitychange", onFocus);
  }, [userId]);

  const handleFollowFromSearch = async (targetId) => {
    if (!userId || !targetId || userId === targetId) return;
    const isFollowing = followingIds?.has(targetId);
    setFollowingIds(prev => {
      const next = new Set(prev);
      isFollowing ? next.delete(targetId) : next.add(targetId);
      return next;
    });
    if (!isFollowing) {
      setFollowingCount(c => c + 1);
      const { error } = await supabase.from("follows").insert(
        { follower_id: userId, following_id: targetId }
      );
      if (error) {
        // Ignore duplicate key errors (already following)
        if (error.code === "23505") {
          console.log("Already following — row exists");
        } else {
          console.error("FOLLOW INSERT ERROR:", JSON.stringify(error));
          setFollowingIds(prev => { const next = new Set(prev); next.delete(targetId); return next; });
          setFollowingCount(c => Math.max(0, c - 1));
        }
      }
    } else {
      setFollowingCount(c => Math.max(0, c - 1));
      const { error } = await supabase.from("follows").delete().eq("follower_id", userId).eq("following_id", targetId);
      if (error) {
        console.error("UNFOLLOW DELETE ERROR:", JSON.stringify(error));
        setFollowingIds(prev => { const next = new Set(prev); next.add(targetId); return next; });
        setFollowingCount(c => c + 1);
      }
    }
  };

  const [userCourseProgress, setUserCourseProgress] = useState({});
  const [userLocation, setUserLocation] = useState(null);
  const [userId, setUserId] = useState(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followingIds, setFollowingIds] = useState(new Set()); // set of user IDs this user follows

  // Navigate to main map and draw a GPX route
  // Accepts a full route object or just an id
  function openRouteOnMap(routeOrId, from) {
    let route = typeof routeOrId === "object" ? routeOrId : ROUTES.find(r => String(r.id) === String(routeOrId));
    if (!route) return;
    // If this hardcoded route has no gpx_file, check if a Supabase version (by name) does
    if (!route.gpx_file) {
      const withGpx = ROUTES.find(r => r.name === route.name && r.gpx_file);
      if (withGpx) route = withGpx;
    }
    if (!route.gpx_file) return; // truly no GPX available
    setGpxRoute({ route, from: from || "routes-list" });
    setTab("map");
  }

  function closeGpxRoute() {
    if (!gpxRoute) return;
    const from = gpxRoute.from;
    setGpxRoute(null);
    if (from === "routes-list") { setTab("routes"); }
    else if (from === "routes-map") { setTab("routes"); }
    else if (from === "search") { setTab("map"); }
    else if (from === "mountain-tracker") { setTab("profile"); }
    else { setTab("map"); }
  }


  // Fetch routes from Supabase on mount
  useEffect(() => {
    async function fetchRoutes() {
      try {
        const { data, error } = await supabase.from("routes").select("*").order("name");
        if (error) { console.error("Supabase routes error:", error); return; }
        if (data && data.length > 0) {
          const mapped = data.map(r => ({
            // Supabase id kept as-is (used for GPX lookup)
            id: r.id,
            name: r.name,
            cls: r.classification || r.cls || "munros",
            reg: r.region || r.reg || "",
            diff: r.difficulty || r.diff || "Moderate",
            dist: r.distance_km || r.dist || 0,
            elev: r.elevation_gain_m || r.elev || 0,
            time: r.estimated_time || r.time || "",
            peaks: r.peaks || [],
            rat: r.rating || r.rat || 0,
            rev: r.reviews || r.rev || 0,
            start: r.start_point || r.start || "",
            src: r.source || r.src || "ts",
            gpx_file: r.gpx_url || null,  // column is gpx_url in DB
          }));
          // Merge: Supabase rows fill in gpx_file on hardcoded routes by name match.
          // Only fields that are actually populated in Supabase override the hardcoded values.
          // This means distance, elevation, time etc. stay from the hardcoded data.
          const supabaseByName = {};
          mapped.forEach(r => { supabaseByName[r.name] = r; });

          ROUTES = ROUTES.map(r => {
            const sb = supabaseByName[r.name];
            if (!sb) return r;
            // Merge: keep hardcoded fields unless Supabase has a real value
            return {
              ...r,
              id: sb.id,                                          // use Supabase id for GPX lookup
              gpx_file: sb.gpx_file || r.gpx_file || null,
              dist: sb.dist || r.dist,
              elev: sb.elev || r.elev,
              time: sb.time || r.time,
              rat: sb.rat || r.rat,
              rev: sb.rev || r.rev,
              cls: sb.cls !== "munros" || r.cls === "munros" ? (sb.cls || r.cls) : r.cls,
              diff: sb.diff !== "Moderate" || r.diff === "Moderate" ? (sb.diff || r.diff) : r.diff,
              reg: sb.reg || r.reg,
              start: sb.start || r.start,
              src: sb.src || r.src,
            };
          });

          // Append any Supabase routes not in hardcoded list
          const hardcodedNames = new Set(ROUTES.map(r => r.name));
          mapped.forEach(r => { if (!hardcodedNames.has(r.name)) ROUTES.push(r); });

          setDbRoutes([...ROUTES]);
          console.log(`Routes merged: ${ROUTES.length} total`);
        }
      } catch (err) {
        console.error("Failed to fetch routes:", err);
      }
    }
    fetchRoutes();
  }, []);

  const tabs = [
    { id: "home", icon: Home, label: "Home" },
    { id: "routes", icon: Route, label: "Routes" },
    { id: "map", icon: Map, label: "Map" },
    { id: "learn", icon: BookOpen, label: "Learn" },
    { id: "profile", icon: UserCircle, label: "Profile" },
  ];

  // Handle tutorial step changes - auto switch tabs
  // ── Load user data from Supabase on mount / auth change ──
  useEffect(() => {
    if (authState !== "app") return;

    async function loadUserData() {
      // Get session directly - more reliable than getUser() for RLS
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) { console.log("loadUserData: no session user"); return; }
      // Clear previous user data before loading new user's data
      setSavedWalks([]);
      setDbPeaks(null);

      // Fetch all peaks from Supabase
      // Fetch all peaks in two batches to bypass the 1000 row default limit
      const [batch1, batch2] = await Promise.all([
        supabase.from("peaks").select("id, name, classification, height, region, latitude, longitude").order("name").range(0, 999),
        supabase.from("peaks").select("id, name, classification, height, region, latitude, longitude").order("name").range(1000, 1999),
      ]);
      const allPeaks = [...(batch1.data || []), ...(batch2.data || [])];

      // Fetch this user's logged peaks
      const { data: userPeaks } = await supabase
        .from("user_peaks")
        .select("*")
        .eq("user_id", user.id);

      if (allPeaks && allPeaks.length > 0) {
        const peakMap = {};
        if (userPeaks) userPeaks.forEach(p => { peakMap[String(p.peak_id)] = p; });
        const merged = allPeaks.map(p => {
          const saved = peakMap[String(p.id)];
          return {
            id: p.id,
            name: p.name,
            cls: p.classification,
            ht: Math.round(p.height),
            reg: p.region,
            lat: p.latitude,
            lng: p.longitude,
            done: saved ? saved.done : false,
            date: saved?.date_completed || null,
            log: saved?.notes || "",
          };
        });
        PEAKS = merged;
        setDbPeaks(merged);
      } else {
        // Fallback if Supabase peaks unavailable
        setDbPeaks(PEAKS_FALLBACK.map(pk => ({ ...pk, done: false })));
      }

      // Load saved walks
      const { data: walks } = await supabase
        .from("user_walks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (walks && walks.length > 0) {
        setSavedWalks(walks.map(w => ({
          name: w.name,
          desc: w.description,
          dist: w.distance_km,
          elev: w.elevation_m,
          time: w.duration,
          movingTime: w.moving_time,
          avgSpeed: w.avg_speed_kph,
          peaks: w.peaks || [],
          photos: w.photos || 0,
          date: w.date_walked ? new Date(w.date_walked).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "",
          id: w.id,
        })));
      }

      // Load course progress
      const { data: courses } = await supabase
        .from("user_courses")
        .select("*")
        .eq("user_id", user.id);

      if (courses && courses.length > 0) {
        const courseMap = {};
        courses.forEach(c => { courseMap[c.course_id] = c.lessons_completed; });
        setUserCourseProgress(courseMap);
      }

      // Load follower/following counts + who this user follows
      const { data: profile } = await supabase
        .from("profiles")
        .select("follower_count, following_count")
        .eq("id", user.id)
        .maybeSingle();
      if (profile) {
        setFollowerCount(profile.follower_count || 0);
        setFollowingCount(profile.following_count || 0);
      }

      // Load following list - retry up to 3 times to handle auth timing
      let followingList = null;
      for (let attempt = 0; attempt < 3; attempt++) {
        await new Promise(resolve => setTimeout(resolve, attempt * 500));
        const { data, error } = await supabase
          .from("follows")
          .select("following_id")
          .eq("follower_id", user.id);
        if (error) { console.error("FOLLOWING LOAD ERROR attempt", attempt, JSON.stringify(error)); continue; }
        followingList = data;
        break;
      }
      if (followingList) {
        setFollowingIds(new Set(followingList.map(f => f.following_id)));
        setFollowingCount(followingList.length);
      }
    }

    loadUserData();
  }, [authState]);

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
  if (authState === "username-prompt") {
    return (
      <div style={{ width: "100%", height: "100vh", background: "#041e3d", fontFamily: "'DM Sans',system-ui,sans-serif", overflow: "hidden" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          @keyframes fi { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes su { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes glow { 0%,100% { box-shadow: 0 0 8px rgba(232,93,58,.25); } 50% { box-shadow: 0 0 18px rgba(232,93,58,.45); } }
        `}</style>
        <UsernamePrompt
          fullName={userName}
          onDone={(chosenUsername) => {
            if (chosenUsername) setUserName(chosenUsername);
            setAuthState("tutorial");
            setTab("map");
            setTutStep(0);
          }}
        />
      </div>
    );
  }

  if (authState === "loading") {
    return (
      <div style={{ width: "100%", height: "100vh", background: "#041e3d", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "linear-gradient(135deg,#E85D3A,#F49D37)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", animation: "glow 3s ease infinite" }}>
            <Mountain size={24} color="#F8F8F8" />
          </div>
          <div style={{ fontSize: "13px", color: "#BDD6F4", opacity: 0.5 }}>Loading TrailSync…</div>
        </div>
      </div>
    );
  }

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
        <LoginScreen onLogin={(user) => { setUserName(user.user_metadata?.full_name?.split(" ")[0] || user.email.split("@")[0]); setAuthState("app"); }} onGoSignup={() => setAuthState("signup")} />
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
        <SignupScreen onSignup={(name, username) => { setUserName(username || name.split(" ")[0]); setAuthState("username-prompt"); }} onGoLogin={() => setAuthState("login")} />
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", background: "#041e3d", color: "#F8F8F8", fontFamily: "'DM Sans',system-ui,sans-serif", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800&family=Playfair+Display:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input, select, textarea { font-size: 16px !important; }
        ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(90,152,227,.15); border-radius: 4px; }
        select option { background: #0a2240; color: #F8F8F8; }
        @keyframes fi { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes su { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fl { 0%,100% { transform: translate(-50%,-50%) scale(1); } 50% { transform: translate(-50%,-50%) scale(1.04); } }
        @keyframes glow { 0%,100% { box-shadow: 0 0 8px rgba(232,93,58,.25); } 50% { box-shadow: 0 0 18px rgba(232,93,58,.45); } }
        @keyframes pulse { 0%,100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.08); } }
        @keyframes locationPulse { 0% { transform: translate(-50%,-50%) scale(0.5); opacity: 0.8; } 100% { transform: translate(-50%,-50%) scale(2.5); opacity: 0; } }
      `}</style>

      {/* Header */}
      {tab !== "map" && (
        <div style={{ borderBottom: "1px solid rgba(90,152,227,0.1)", background: "rgba(4,30,61,.92)", backdropFilter: "blur(12px)", zIndex: 30 }}>
          {/* Top row: logo + bell + avatar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "linear-gradient(135deg,#E85D3A,#F49D37)", display: "flex", alignItems: "center", justifyContent: "center", animation: "glow 3s ease infinite" }}>
              <Mountain size={17} color="#F8F8F8" />
            </div>
            <div style={{ fontSize: "16px", fontWeight: 800, color: "#F8F8F8", letterSpacing: "-.3px" }}>TrailSync</div>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <OfflineIndicator />
            <button style={{ position: "relative", background: "#0a2240", border: "1px solid rgba(90,152,227,0.12)", borderRadius: "8px", padding: "6px", color: "#BDD6F4", cursor: "pointer" }}>
              <Bell size={16} />
              <div style={{ position: "absolute", top: 1, right: 1, width: "7px", height: "7px", borderRadius: "50%", background: "#E85D3A", border: "1px solid #041e3d" }} />
            </button>
            <div style={{ position: "relative" }}>
              <div onClick={() => setShowUserMenu(m => !m)} style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg,#264f80,#5A98E3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "#F8F8F8", border: "2px solid rgba(90,152,227,0.25)", cursor: "pointer" }}>
                {userName ? userName[0].toUpperCase() : "A"}
              </div>
              {showUserMenu && (
                <>
                  {/* Backdrop to close menu */}
                  <div onClick={() => setShowUserMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
                  <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 41, background: "rgba(4,30,61,0.97)", backdropFilter: "blur(16px)", borderRadius: "12px", border: "1px solid rgba(90,152,227,0.2)", minWidth: "160px", overflow: "hidden", animation: "fi .15s ease" }}>
                    <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(90,152,227,0.1)" }}>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: "#F8F8F8" }}>{userName}</div>
                      <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.5, marginTop: "1px" }}>Signed in</div>
                    </div>
                    <button onClick={() => { setShowUserMenu(false); setTab("profile"); }} style={{ width: "100%", padding: "10px 14px", border: "none", background: "transparent", color: "#BDD6F4", fontSize: "12px", fontWeight: 600, cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans'", display: "flex", alignItems: "center", gap: "8px" }}>
                      <UserCircle size={14} /> Profile
                    </button>
                    <button onClick={async () => {
                      setShowUserMenu(false);
                      await supabase.auth.signOut();
                      try { localStorage.clear(); } catch {}
                      setUserName("Alex");
                      setSavedWalks([]);
                      setDbPeaks(null);
                      setAuthState("login");
                    }} style={{ width: "100%", padding: "10px 14px", border: "none", borderTop: "1px solid rgba(90,152,227,0.08)", background: "transparent", color: "#E85D3A", fontSize: "12px", fontWeight: 600, cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans'", display: "flex", alignItems: "center", gap: "8px" }}>
                      <ArrowRight size={14} style={{ transform: "rotate(180deg)" }} /> Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          </div>
          {/* Search row — only on home tab */}
          {tab === "home" && (
            <div style={{ padding: "0 16px 10px", position: "relative" }}>
              <div style={{ background: "#0a2240", borderRadius: "10px", padding: "8px 12px", display: "flex", alignItems: "center", gap: "8px", border: "1px solid rgba(90,152,227,0.15)" }}>
                <Search size={13} color="#BDD6F4" style={{ opacity: 0.45, flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Search people, walks, mountains…"
                  value={headerSearch}
                  onChange={e => setHeaderSearch(e.target.value)}
                  style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#F8F8F8", fontSize: "13px", fontFamily: "'DM Sans'" }}
                />
                {headerSearch && <button onClick={() => setHeaderSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#BDD6F4", padding: 0, display: "flex" }}><X size={13} /></button>}
              </div>

              {/* ── Search dropdown — anchored to header search bar ── */}
              {headerSearch && headerSearch.length >= 2 && (
                <div style={{ position: "absolute", top: "calc(100% - 2px)", left: "16px", right: "16px", background: "rgba(4,30,61,0.99)", backdropFilter: "blur(20px)", borderRadius: "14px", border: "1px solid rgba(90,152,227,0.25)", zIndex: 100, overflow: "hidden", maxHeight: "70vh", overflowY: "auto", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
                  {searching && <div style={{ padding: "14px", textAlign: "center", fontSize: "12px", color: "#BDD6F4", opacity: 0.5 }}>Searching…</div>}
                  {!searching && searchResults.posts.length === 0 && searchResults.users.length === 0 && searchResults.routes.length === 0 && searchResults.peaks.length === 0 && (
                    <div style={{ padding: "24px 14px", textAlign: "center" }}>
                      <div style={{ fontSize: "13px", color: "#BDD6F4", opacity: 0.4, marginBottom: "4px" }}>No results for "{headerSearch}"</div>
                      <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.25 }}>Try a mountain name, person, or post topic</div>
                    </div>
                  )}
                  {searchResults.users.length > 0 && (
                    <div>
                      <div style={{ padding: "10px 14px 4px", fontSize: "9px", color: "#BDD6F4", opacity: 0.4, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>People</div>
                      {searchResults.users.map(u => (
                        <div key={u.id} style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid rgba(90,152,227,0.06)", cursor: "pointer" }} onClick={() => { setViewingProfile(u); setHeaderSearch(""); }}>
                          <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg,#264f80,#5A98E3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 700, color: "#F8F8F8", flexShrink: 0 }}>
                            {(u.username || u.name || "?")[0].toUpperCase()}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: "13px", fontWeight: 700, color: "#F8F8F8" }}>{u.name || u.username}</div>
                            {u.username && <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.5 }}>@{u.username}{u.location ? ` · ${u.location}` : ""}</div>}
                          </div>
                          {u.id !== userId && (
                            <button onClick={e => { e.stopPropagation(); handleFollowFromSearch(u.id); }} style={{ padding: "5px 12px", borderRadius: "8px", cursor: "pointer", flexShrink: 0, background: followingIds?.has(u.id) ? "rgba(90,152,227,0.12)" : "linear-gradient(135deg,#E85D3A,#d04a2a)", color: followingIds?.has(u.id) ? "#5A98E3" : "#F8F8F8", fontSize: "11px", fontWeight: 700, fontFamily: "'DM Sans'", border: followingIds?.has(u.id) ? "1px solid rgba(90,152,227,0.2)" : "none" }}>
                              {followingIds?.has(u.id) ? "Following" : "Follow"}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {searchResults.routes.length > 0 && (
                    <div>
                      <div style={{ padding: "10px 14px 4px", fontSize: "9px", color: "#BDD6F4", opacity: 0.4, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Routes</div>
                      {searchResults.routes.map(r => (
                        <div key={r.id} onClick={() => { setHeaderSearch(""); if (r.gpx_file && openRoute) openRoute(r, "search"); }} style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid rgba(90,152,227,0.06)", cursor: r.gpx_file ? "pointer" : "default" }}>
                          <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "rgba(232,93,58,0.1)", border: "1px solid rgba(232,93,58,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Route size={16} color="#E85D3A" />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: "13px", fontWeight: 700, color: "#F8F8F8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</div>
                            <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.5 }}>{r.reg} · {r.dist}km · {r.diff}</div>
                          </div>
                          {r.gpx_file && <span style={{ fontSize: "9px", padding: "2px 7px", borderRadius: "5px", background: "rgba(232,93,58,0.12)", color: "#E85D3A", fontWeight: 700, flexShrink: 0 }}>View on map →</span>}
                        </div>
                      ))}
                    </div>
                  )}
                  {searchResults.peaks.length > 0 && (
                    <div>
                      <div style={{ padding: "10px 14px 4px", fontSize: "9px", color: "#BDD6F4", opacity: 0.4, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Mountains</div>
                      {searchResults.peaks.map(p => (
                        <div key={p.id} style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid rgba(90,152,227,0.06)" }}>
                          <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: `${CLS[p.cls]?.color}15`, border: `1px solid ${CLS[p.cls]?.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Mountain size={16} color={CLS[p.cls]?.color || "#5A98E3"} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: "13px", fontWeight: 700, color: "#F8F8F8" }}>{p.name}</div>
                            <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.5 }}>{p.ht}m · {p.reg}</div>
                          </div>
                          <span style={{ fontSize: "9px", padding: "2px 7px", borderRadius: "5px", background: `${CLS[p.cls]?.color}15`, color: CLS[p.cls]?.color, fontWeight: 700, flexShrink: 0 }}>{CLS[p.cls]?.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {searchResults.posts.length > 0 && (
                    <div>
                      <div style={{ padding: "10px 14px 4px", fontSize: "9px", color: "#BDD6F4", opacity: 0.4, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Posts & Events</div>
                      {searchResults.posts.map(p => (
                        <div key={p.id} style={{ padding: "10px 14px", borderBottom: "1px solid rgba(90,152,227,0.06)", cursor: "pointer" }} onClick={() => setHeaderSearch("")}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                            <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: p.type === "fundraiser" ? "rgba(107,203,119,0.15)" : p.type === "event" ? "rgba(90,152,227,0.15)" : "#264f80", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "#F8F8F8", flexShrink: 0 }}>
                              {p.av}
                            </div>
                            <span style={{ fontSize: "12px", fontWeight: 700, color: "#F8F8F8" }}>{p.user}</span>
                            <span style={{ fontSize: "9px", padding: "1px 6px", borderRadius: "4px", background: p.type === "fundraiser" ? "rgba(107,203,119,0.12)" : p.type === "event" ? "rgba(90,152,227,0.12)" : "rgba(232,93,58,0.1)", color: p.type === "fundraiser" ? "#6BCB77" : p.type === "event" ? "#5A98E3" : "#E85D3A", fontWeight: 600 }}>{p.type}</span>
                            <span style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.35, marginLeft: "auto" }}>{p.time}</span>
                          </div>
                          <div style={{ fontSize: "12px", color: "#BDD6F4", lineHeight: 1.45, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{p.text}</div>
                          {p.peaks?.length > 0 && <div style={{ display: "flex", gap: "4px", marginTop: "5px", flexWrap: "wrap" }}>{p.peaks.map(pk => <span key={pk} style={{ fontSize: "9px", padding: "1px 6px", borderRadius: "4px", background: "rgba(232,93,58,0.1)", color: "#E85D3A", fontWeight: 600 }}>⛰️ {pk}</span>)}</div>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {tab === "home" && <HomePage userName={userName} initialFilter={feedFilter} userId={userId} followingIds={followingIds} setFollowingIds={setFollowingIds} setFollowingCount={setFollowingCount} headerSearch={headerSearch} setHeaderSearch={setHeaderSearch} openRoute={openRouteOnMap} searchResults={searchResults} setSearchResults={setSearchResults} searching={searching} setSearching={setSearching} onViewProfile={setViewingProfile} />}
        {tab === "routes" && <RoutesPage openRoute={openRouteOnMap} />}
        {tab === "map" && <MapPage dbPeaks={dbPeaks} goHome={() => setTab("home")} goProfile={(sec) => { setProfileSec(sec || "mountains"); setTab("profile"); }} onSaveWalk={async (walk) => {
              setSavedWalks(prev => [walk, ...prev]);
              try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;
                await supabase.from("user_walks").insert({
                  user_id: user.id,
                  name: walk.name,
                  description: walk.desc || null,
                  distance_km: parseFloat(walk.dist) || 0,
                  elevation_m: parseInt(walk.elev) || 0,
                  duration: walk.time,
                  moving_time: walk.movingTime,
                  avg_speed_kph: parseFloat(walk.avgSpeed) || 0,
                  peaks: walk.peaks || [],
                  photos: walk.photos || 0,
                  date_walked: new Date().toISOString().split("T")[0],
                });
              } catch (e) { console.error("Failed to save walk:", e); }
            }} openRoute={openRouteOnMap} gpxRoute={gpxRoute} onCloseGpx={closeGpxRoute} />}
        {tab === "learn" && <LearnPage courseProgress={userCourseProgress} onCourseProgress={async (courseId, lessonsCompleted) => { setUserCourseProgress(prev => ({ ...prev, [courseId]: lessonsCompleted })); const { data: { user } } = await supabase.auth.getUser(); if (!user) return; await supabase.from("user_courses").upsert({ user_id: user.id, course_id: courseId, lessons_completed: lessonsCompleted, updated_at: new Date().toISOString() }, { onConflict: "user_id,course_id" }); }} />}
        {tab === "profile" && <ProfilePage initialSec={profileSec} onSecChange={setProfileSec} goMap={() => setTab("map")} goHome={(filter) => { setFeedFilter(filter || "all"); setTab("home"); }} goRoutes={() => setTab("routes")} openRoute={openRouteOnMap} savedWalks={savedWalks} setSavedWalks={setSavedWalks} dbPeaks={dbPeaks} userName={userName} userLocation={userLocation} setUserLocation={setUserLocation} followerCount={followerCount} followingCount={followingCount} followingIds={followingIds} setFollowingIds={setFollowingIds} setFollowerCount={setFollowerCount} setFollowingCount={setFollowingCount} userId={userId} onViewProfile={setViewingProfile} onSignOut={async () => {
  await supabase.auth.signOut();
  try { localStorage.clear(); } catch {}
  setUserName("Alex");
  setSavedWalks([]);
  setDbPeaks(null);
  setAuthState("login");
}} />}
      </div>

      {/* ── PWA INSTALL BANNER ── */}
      {showPWABanner && authState === "app" && (
        <PWAInstallBanner onDismiss={() => {
          setShowPWABanner(false);
          localStorage.setItem("pwa-banner-dismissed", "1");
        }} />
      )}

      {/* ── USER PROFILE VIEWER ── */}
      {viewingProfile && (
        <UserProfileModal
          user={viewingProfile}
          userId={userId}
          followingIds={followingIds}
          onFollow={handleFollowFromSearch}
          onClose={() => setViewingProfile(null)}
        />
      )}

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
