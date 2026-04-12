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
      detectSessionInUrl: true,
      flowType: "pkce",
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
let PEAKS = PEAKS_FALLBACK;

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
  { id: 19, name: "Buachaille Etive Mor - Curved Ridge", cls: "munros", reg: "Glen Coe", diff: "Expert", dist: 10.5, elev: 1020, time: "5-7h", peaks: ["Buachaille Etive Mor"], rat: 4.9, rev: 67, start: "Altnafeadh Layby", src: "community" },
  { id: 20, name: "Cairngorms Lairig Ghru Through-Walk", cls: "non-mountain", reg: "Cairngorms", diff: "Hard", dist: 30, elev: 640, time: "10-12h", peaks: [], rat: 4.7, rev: 45, start: "Linn of Dee Car Park", src: "community" },
  { id: 22, name: "Ben Challum", cls: "munros", reg: "Southern Highlands", diff: "Moderate", dist: 13.5, elev: 1025, time: "5-6h", peaks: ["Ben Challum"], rat: 4.6, rev: 38, start: "Kirkton Farm, Tyndrum", src: "ts", gpx_file: "https://mferkdgzpaaxixqlanzm.supabase.co/storage/v1/object/public/gpx-files/Ben_Challum.gpx" },
  { id: 23, name: "Stob Bàn & Mullach nan Coirean", cls: "munros", reg: "Ben Nevis & Mamores", diff: "Hard", dist: 16.5, elev: 1350, time: "6-8h", peaks: ["Stob Bàn", "Mullach nan Coirean"], rat: 4.8, rev: 52, start: "Glen Nevis Car Park", src: "ts", gpx_file: "https://mferkdgzpaaxixqlanzm.supabase.co/storage/v1/object/public/gpx-files/Stob_Ban_%26_Mullach_nan_Coirean.gpx" },
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
  { id: 1, title: "The Lost Observatory of Ben Nevis", cat: "History", region: "Ben Nevis & Mamores", peak: "Ben Nevis", lat: 56.797, lng: -5.004, author: "Rachel M.", excerpt: "For twenty years, a team of scientists lived and worked at the summit of Britain's highest mountain, recording weather data that changed our understanding of Atlantic storms forever.", read: "8 min", icon: "🏛️",
    body: ["In 1883, the Scottish Meteorological Society completed one of the most ambitious scientific projects in Victorian Britain: a permanent weather observatory on the summit of Ben Nevis, 1,344 metres above sea level. The building sat metres from the cliff edge of the north face, buffeted by winds exceeding 100 mph and buried under snow for months at a time.", "The observatory was staffed year-round by rotating observers who lived on the summit for weeks at a stretch. Their stone accommodation was connected by a hand-rail rope to the observatory itself, which they followed blind in whiteout conditions. In winter, they recorded temperatures of -17°C with ferocious winds — some of the harshest conditions ever measured in Britain.", "The twenty years of data collected here transformed meteorological science. The observers made four readings every day without exception, building an unbroken record that revealed how Atlantic storms develop and intensify before hitting mainland Britain. Their findings directly influenced the development of modern weather forecasting across Europe.", "The observatory closed in 1904, a victim of funding cuts. The equipment was removed but the stone walls were left standing. Today the ruins — a low rectangle of frost-shattered masonry just east of the summit cairn — are visible to every walker who reaches the top. Look for the emergency shelter nearby, and spare a thought for the men who lived here through Highland winters.", "A small museum in Fort William tells the full story, including the personal diaries of the observers. Their accounts of months of isolation, storms that shook the building, and eerie winter sunrises above the cloud layer make extraordinary reading — one of Scotland's great untold stories."] },
  { id: 2, title: "The Massacre of Glen Coe", cat: "History", region: "Glen Coe", peak: "Bidean nam Bian", lat: 56.652, lng: -5.1, author: "Rachel M.", excerpt: "On a frozen February morning in 1692, soldiers turned on the families who had sheltered them. The glen still carries the weight of that betrayal.", read: "10 min", icon: "⚔️",
    body: ["In the early hours of 13 February 1692, soldiers who had been billeted for twelve days with the MacDonald clan of Glencoe rose and murdered their hosts. At least 38 men, women and children were killed outright. Others fled into the mountains in a February blizzard — many dying of exposure. The soldiers were mostly Campbells acting on orders from the Crown.", "The political context was the Jacobite conflicts. King William III demanded Highland clan chiefs swear an oath of loyalty by 1 January 1692. Alasdair MacIain, chief of the Glencoe MacDonalds, arrived late to sign — only to be redirected to Inveraray, arriving after the deadline. Officials in Edinburgh saw their opportunity.", "Orders to 'fall upon the rebels and put all to the sword under seventy' were signed by Secretary of State Sir John Dalrymple. What made the massacre infamous was not merely the killing, but the betrayal — soldiers murdering the very people whose food and warmth they had shared. This violated the sacred Highland code of hospitality in a way that Scottish culture has never forgotten.", "The glen bears its memory quietly. A small museum in Glencoe village tells the story with genuine care. Walking the glen on a grey winter day, with low cloud in the corries and the dark peaks pressing in, the events of that February morning feel surprisingly close.", "Glencoe remains one of the most dramatic landscapes in Scotland. Its character runs deeper than scenery — every walker who passes through takes something of that history with them, whether they know it or not."] },
  { id: 3, title: "Torridon: Walking on the Oldest Rock in the World", cat: "Geology", region: "Torridon", peak: "Liathach", lat: 57.581, lng: -5.468, author: "Laura K.", excerpt: "The sandstone beneath your boots on Liathach is three billion years old. Before complex life, before oxygen, this rock was already ancient.", read: "6 min", icon: "🪨",
    body: ["The reddish-brown sandstone that forms the great bulk of Liathach, Beinn Eighe and Beinn Alligin is Torridonian sandstone — laid down as river delta sediment approximately 750 million to one billion years ago, on top of Lewisian gneiss that is itself 2.5 to 3 billion years old. When you put your hand on the bare rock, you are touching some of the oldest surface geology in the world.", "The Lewisian gneiss — the grey, streaked basement rock you see at low level — was formed deep in the earth's crust during a time before complex life existed, before the oceans had significant oxygen. It was metamorphosed by immense heat and pressure, then eroded flat by ancient glaciers over hundreds of millions of years before the Torridonian sediments were deposited on top.", "What makes Torridon visually extraordinary is the contrast between these two rock types. The massive red sandstone towers rise abruptly from a flat, boggy landscape underlain by ancient gneiss, capped in places by bright white quartzite — a third rock type, 600 million years old, forming the distinctive scree-covered summits of Beinn Eighe.", "Beinn Eighe was designated Britain's first National Nature Reserve in 1951, partly in recognition of its geological importance. The Beinn Eighe Mountain Trail gives access to the quartzite ridges and extraordinary views over Loch Maree. Torridon village is the base for most walks in the area.", "Walking in Torridon is a genuinely humbling experience. On a clear day, looking across the ancient landscape from the ridge of Liathach, it is possible to grasp, briefly and imperfectly, just how small and brief human existence is relative to the rock beneath your boots."] },
  { id: 4, title: "The Grey Man of Ben Macdui", cat: "Folklore", region: "Cairngorms", peak: "Ben Macdui", lat: 57.070, lng: -3.669, author: "Rachel M.", excerpt: "Experienced mountaineers have reported footsteps behind them, a towering shadow in the mist, and an overwhelming urge to flee from the summit plateau.", read: "7 min", icon: "👻",
    body: ["In 1925, Professor Norman Collie, an experienced and respected mountaineer, stood up at the annual general meeting of the Cairngorm Club and described something remarkable. He said that in 1891, while descending Ben Macdui alone in mist, he had heard footsteps behind him — one step for every three or four of his own. When he stopped, the steps stopped. When he moved, they resumed. Eventually, overcome with an inexplicable terror, he ran for four miles without looking back.", "Collie was not alone. James Kellas, a pioneering Himalayan mountaineer, and several other credible witnesses reported similar experiences — a looming presence in the mist, footsteps that shouldn't be there, an overwhelming sense of dread that sent them running from the summit plateau. In Gaelic tradition, the entity is called Am Fear Liath Mòr — the Big Grey Man.", "The scientific explanation most commonly offered is the Brocken spectre — a meteorological phenomenon in which your shadow is cast onto mist or cloud below you, magnified and surrounded by a halo of light. When you move, the spectre moves. When you stop, it stops. On a featureless, mist-wrapped plateau, this can be deeply disorientating.", "Whether or not the Grey Man exists in any literal sense, the feeling it describes — that particular, irrational unease that the high, featureless Cairngorm plateau can produce in bad weather — is familiar to many experienced hillwalkers. The plateau is vast and monotonous, navigation is genuinely difficult in poor visibility, and the scale of the landscape overwhelms normal human reference points.", "Ben Macdui, at 1,309m, is Britain's second-highest mountain. Most walkers approach via Cairngorm Mountain and the ski infrastructure, crossing the featureless plateau to the summit. Go on a clear day for extraordinary views. Go in mist if you want to understand the legend from the inside."] },
  { id: 5, title: "Eagles Above Kintail", cat: "Wildlife", region: "Kintail & Affric", peak: "The Five Sisters", lat: 57.22, lng: -5.35, author: "Laura K.", excerpt: "The golden eagles that soar above the Five Sisters have hunted these ridges for thousands of years. Here's how to spot them without disturbing them.", read: "5 min", icon: "🦅",
    body: ["The golden eagle is Britain's largest bird of prey — a wingspan of up to 2.2 metres, weighing up to 6.5 kg, capable of stooping at 150 mph on prey spotted from half a mile away. Scotland holds around 500 pairs, the entire British population. Kintail, with its remote glens and high ridges, is among the best places in the country to see them.", "Golden eagles mate for life and are deeply territorial, holding ranges of up to 60 square kilometres. They are most active in late winter and early spring when they perform spectacular aerial displays over their territories — flying in wide circles, then suddenly folding their wings and diving, then recovering. This behaviour is most visible from ridgelines like the Five Sisters of Kintail.", "The best time to spot eagles is early morning, when thermals are beginning to develop, or late afternoon. Look for a large, broad-winged bird holding a ridge on spread, slightly upswept wings — unlike buzzards, which tilt side to side, eagles hold a stable 'V' profile. Their size is the key tell: even at great distance they look unmistakably large relative to anything else in the sky.", "Eagles were systematically persecuted through the Victorian era by gamekeepers and landowners, driven to extinction in England and Wales and reduced to a remnant Scottish population. Their slow recovery through the 20th century is one of conservation's great stories — but they remain vulnerable to illegal poisoning and habitat loss.", "If you spot a golden eagle, stay still, keep quiet, and watch from distance. Eagles are sensitive to disturbance at the nest. The RSPB operates a number of watch points in the Highlands during the breeding season — these are the best places for guaranteed sightings."] },
  { id: 6, title: "The Fairy Pools of Skye", cat: "Folklore", region: "Skye Cuillin", peak: "Sgurr nan Gillean", lat: 57.254, lng: -6.196, author: "Rachel M.", excerpt: "Crystal clear pools at the foot of the Black Cuillin, where legend says the fairy folk would bathe. The water is still ice cold, and the magic hasn't faded.", read: "5 min", icon: "🧚",
    body: ["The Fairy Pools lie at the foot of the Black Cuillin above Glen Brittle, where the Allt Coir' a' Mhadaidh tumbles down a series of cascades into a succession of turquoise pools so clear you can see every pebble on the bottom from the surface. The water is glacial melt — ice cold even in summer, never above about 10°C — and the colour comes from the pure basalt rock through which it flows.", "In Gaelic tradition, the pools were bathing places of the fairy folk — the Sìth, beings who lived in the hills and underworld of the Scottish imagination and who were known to lure, reward, or punish humans who crossed into their realm. Leaving offerings at the pools was once considered wise. The association has faded, but the pools still carry an otherworldly atmosphere, particularly in morning mist.", "The Black Cuillin forms the backdrop — a jagged ridge of gabbro rising to 993 metres at Sgurr Dearg, the whole ridge darkening and brightening as cloud shadow moves across the peaks. It is one of the most dramatic mountain backdrops in Britain, and it gives the Fairy Pools walk a scale and grandeur that simple waterfall walks rarely achieve.", "The walk from the Glen Brittle car park is approximately 5km return, with minimal ascent. The best time to visit is early morning, before the crowds, when the pools are mirror-still and the light from the east catches the cascades. Many people swim here — understand that the water is extremely cold and there are no lifeguards.", "Skye is reached via the Skye Bridge from Kyle of Lochalsh, or by ferry from Mallaig to Armadale. The island has excellent walking infrastructure, and the Fairy Pools are one of Scotland's most visited natural sites — for good reason."] },
  { id: 7, title: "How Striding Edge Was Formed", cat: "Geology", region: "Lake District", peak: "Helvellyn", lat: 54.527, lng: -3.016, author: "Laura K.", excerpt: "Two glaciers carved the mountain from both sides, leaving behind a knife-edge ridge that draws thousands of walkers each year.", read: "6 min", icon: "🧊",
    body: ["Striding Edge is an arête — a narrow ridge formed when two glaciers erode a mountain from opposite sides. During the last ice age, glaciers occupied both Red Tarn corrie to the north and Nethermost corrie to the south of the ridge. Over thousands of years they quarried rock from the headwalls of the corries, gradually steepening and narrowing the ridge between them until what remained was the thin blade of rock that exists today.", "The last major glaciation of the Lake District ended approximately 10,000 years ago. The ice retreated, the corries were revealed, and Red Tarn filled with meltwater to form the high-altitude lake that sits beneath the Edge today. The lake is held in its corrie basin by a moraine — a ridge of glacial debris deposited at the glacier's snout as it retreated.", "The rock of Striding Edge is Skiddaw Slate — fine-grained, dark-coloured, and relatively hard. It has weathered into blocks and ledges that make the ridge walkable, if narrow. The hardness of the rock is why the Edge has survived at all — softer rocks would have been eroded away by weathering in the 10,000 years since the ice retreated.", "The traverse of Striding Edge is one of the most popular mountain routes in England, and has been since the Victorian era. Wordsworth walked it. The scale of the exposure — with steep drops on both sides — makes it feel genuinely serious, though most scramblers find the difficulties straightforward in good conditions. In winter, with ice, it requires full winter gear.", "The view from the summit of Helvellyn on a clear day takes in most of the Lake District fells, with Red Tarn far below and the full sweep of Striding Edge visible as a thin line against the sky. It is one of the great views in English walking."] },
  { id: 8, title: "The Drovers' Roads of Galloway", cat: "History", region: "Galloway Hills", peak: "Merrick", lat: 55.146, lng: -4.615, author: "Rachel M.", excerpt: "Long before tarmac, cattle were driven through these hills on ancient paths. Some of our best walking routes follow their footsteps.", read: "7 min", icon: "🐄",
    body: ["For centuries before the railways, the only way to move cattle from the Highland and Galloway grazing grounds to the markets of central Scotland and England was on the hoof. Tens of thousands of cattle walked these routes each year, driven by small teams of drovers who knew every pass, every stance (overnight stopping place), and every tolerable river crossing from memory.", "The drove roads didn't follow valleys — they followed ridgelines and high ground to avoid the boggy, forested lowlands and the toll roads. Cattle were driven for up to 20 miles a day, rested at regular stances, and then walked on. The drovers themselves slept rough, wrapped in their plaids, eating oatmeal, cheese, and blood mixed from the cattle. It was a hard, highly skilled trade.", "Galloway was one of the great cattle-producing regions of Scotland, and its drove roads threaded through the hills from Castle Douglas northwards towards Ayr and eventually Edinburgh. The Merrick, at 843 metres the highest point in southern Scotland, stands at the heart of this network. Many hill paths in the area follow old drove lines.", "The drove trade collapsed almost overnight when the railways arrived in the 1840s and 50s. Cattle could be loaded at market and transported direct. The drovers' roads fell silent, returned to grass, and became the walking routes that hillwalkers now use — often without knowing what they're following.", "The Southern Upland Way, which crosses the Galloway Hills, passes through former drove country. The long, grassy ridgelines that make Galloway so pleasant to walk are partly a legacy of centuries of cattle grazing. The landscape carries its history in its bones, even where the surface has healed."] },
  { id: 9, title: "Snowdon's Mining Heritage", cat: "History", region: "Snowdonia", peak: "Snowdon", lat: 53.068, lng: -4.076, author: "Laura K.", excerpt: "Copper mines once riddled the slopes of Snowdon. The ruins still stand as a reminder of the communities that lived and worked in these mountains.", read: "8 min", icon: "⛏️",
    body: ["People have extracted copper from the slopes of Snowdon since the Bronze Age — perhaps 3,500 years ago. The Llanberis copper mines at the head of the Llanberis Pass were among the most productive in Britain during the late 18th and early 19th centuries, employing hundreds of men who lived in tight-knit communities in the surrounding valleys.", "The Britannia Copper Mines, visible from the Miners' Track as rectangular ruins beside Glaslyn lake at 600 metres, were the high-water mark of Snowdon's industrial period. At their peak in the 1820s, they processed thousands of tons of ore annually, using water power from Glaslyn to drive the crushing and smelting machinery. The ruins of the barracks, offices, and ore-processing buildings still stand.", "Life for the miners was brutal by modern standards. Men worked 12-hour shifts underground in wet, poorly ventilated tunnels, exposed to silica dust that caused fatal lung disease within years. Pay was low, accidents were frequent, and the communities had almost no healthcare. Yet the mining culture produced strong traditions of choral singing, chapel attendance, and political radicalism that shaped Welsh identity.", "The mines closed progressively through the late 19th century as ore grades fell and cheaper copper became available from Chile and the American West. The valleys depopulated, the chapels emptied, and the mountains returned to silence. The ruins at Glaslyn are some of the most evocative industrial remains in Wales.", "The Miners' Track from Pen-y-Pass follows the original route used by mine workers and is now one of the most popular ascents of Snowdon. Glaslyn's extraordinary blue-green colour is partly a result of residual copper compounds in the water — a chemical legacy of the mining that ended over a century ago."] },
  { id: 10, title: "Mountain Hares of the Cairngorms", cat: "Wildlife", region: "Cairngorms", peak: "Cairn Gorm", lat: 57.1, lng: -3.6, author: "Laura K.", excerpt: "They turn white in winter and blue-grey in summer. Spotting a mountain hare on the Cairngorm plateau is one of Scotland's great wildlife experiences.", read: "4 min", icon: "🐇",
    body: ["The mountain hare is Britain's only native hare species — a survivor of the last ice age that has adapted to the extreme conditions of the Scottish high tops. Unlike the introduced brown hare, mountain hares change colour with the seasons: blue-grey in summer, pure white in winter. The moult is triggered by day length, not temperature — which means that in mild winters, white hares can sit on snowless hillsides, conspicuous to everything.", "Cairngorms National Park holds the largest population of mountain hares in Britain — perhaps 35,000 animals. They are most concentrated on the high, heather-covered slopes and boulder fields between 600 and 900 metres, where they shelter in forms — shallow depressions scraped in the vegetation. In heavy snow they burrow into snowdrifts to stay warm.", "Mountain hares are most active around dawn and dusk and will often sit very still, relying on camouflage, before bolting with extraordinary speed if approached. In summer, look for the blue-grey animals on open hillsides. In winter, scan snow-free ground carefully — a white hare on bare brown heather stands out like a signal.", "The species faces a serious conservation challenge. Culling on grouse moors — where hares are shot to reduce tick burdens on red grouse — has been controversial. Some Cairngorm estates have voluntarily ceased culling, and the species is showing signs of recovery in these areas. Climate change, which reduces snow cover, also threatens their camouflage advantage.", "The plateau above Cairngorm Mountain ski area is excellent mountain hare habitat and is easily accessed via the funicular railway (summer) or a walk from the car park at Coire Cas. Early morning in late winter, with snow still on the ground, is the best time for sightings."] },
  { id: 11, title: "The Ptarmigan: Scotland's Mountain Chameleon", cat: "Wildlife", region: "Cairngorms", peak: "Cairn Gorm", lat: 57.12, lng: -3.65, author: "Laura K.", excerpt: "Three times a year it changes colour to match its surroundings. The ptarmigan is the only bird that lives year-round on Scotland's highest peaks.", read: "5 min", icon: "🐦",
    body: ["The ptarmigan is a grouse of the high Arctic — and Scotland's high tops are the southernmost part of its range in Britain. It is the only British bird that turns white in winter, moulting through three distinct plumages across the year: white in winter, grey-brown in spring, and brown-and-buff in summer. Each plumage provides near-perfect camouflage for its season.", "Ptarmigan live above 800 metres year-round, among boulder fields and short alpine vegetation. They are extraordinarily cold-hardy — their feet are feathered to the toes, providing insulation in snow, and they can survive temperatures of -25°C by sheltering in snowdrifts. They do not migrate and do not descend to lower ground in winter.", "Finding ptarmigan requires both altitude and patience. Walk to the summit plateau of any Cairngorm above 900 metres and look carefully at the boulderfields — in winter, white birds on white snow are nearly invisible until they move. In summer, they crouch motionless and can be approached to within a few metres, relying on camouflage rather than flight.", "The ptarmigan population is a sensitive indicator of climate change. As winters become milder and snow cover decreases, the species spends more time in its white winter plumage on snowless ground — exposed and vulnerable to predators. Population monitoring on the Cairngorm plateau shows concerning declines over the past two decades.", "The Cairngorm Mountain funicular gives relatively easy access to ptarmigan habitat without a long ascent. Look for them on the walk between the top station and the summit of Cairn Gorm. They are most visible in late autumn, when the contrast between their whitening plumage and the still-brown hillside makes them stand out."] },
  { id: 12, title: "How Ice Shaped Scotland", cat: "Geology", region: "Cairngorms", peak: "Ben Macdui", lat: 57.0, lng: -3.8, author: "Laura K.", excerpt: "Eighteen thousand years ago, Scotland lay beneath an ice sheet over a kilometre thick. Everything you walk through today was carved by glaciers.", read: "7 min", icon: "🧊",
    body: ["At the peak of the last glaciation, approximately 18,000 years ago, Scotland was buried under an ice sheet up to 1,800 metres thick. Only the very highest summits — nunataks — projected above the ice. The weight of the ice was so great that it depressed the land by hundreds of metres; Scotland is still slowly rebounding today, a process called isostatic uplift measurable by GPS.", "As glaciers moved, they carried enormous quantities of rock frozen into their base, using it to grind and polish the bedrock beneath. This is why so many Scottish mountains have smooth, rounded profiles on one side and steep, shattered cliffs on the other — the smooth side faced the advancing glacier; the cliff face is where ice plucked rock away as it flowed over the summit. This asymmetry is called a roche moutonnée.", "The great glens — Glen Coe, Glen Nevis, Glen More, Glen Affric — were carved by valley glaciers following existing river valleys. Glaciers are far more powerful erosive agents than rivers: they deepened the valleys by hundreds of metres, steepened the sides to cliff angles, and left characteristic U-shaped profiles. The sea lochs of the west coast are glacial fjords, drowned when sea levels rose after the ice retreated.", "As the glaciers finally retreated, approximately 10,000 years ago, they left behind their moraines — ridges and hummocks of rock debris deposited at their snouts. These are visible as the hummocky ground at the mouths of many Highland glens. Erratic boulders — rocks of a different type to the bedrock on which they rest — were plucked from their source and transported tens of kilometres before being dropped as the ice melted.", "Scotland is geologically young in the sense that the ice retreated so recently. The soils are thin, the vegetation is simple, and the mountains are still in the process of being shaped by weather, frost action, and the slow but relentless movement of water. Every walk in the Scottish hills is a walk through an actively evolving landscape."] },
  { id: 13, title: "Reading Mountain Weather: What the Clouds Tell You", cat: "Safety", region: "Ben Nevis & Mamores", peak: "Ben Nevis", lat: 56.8, lng: -4.9, author: "Rachel M.", excerpt: "The summit forecast said clear. By the time you reached the ridge, you were in a whiteout. Mountain weather is different — here's how to read it.", read: "9 min", icon: "⛈️",
    body: ["Mountain weather behaves differently to valley weather because mountains force air upward. When moist air rises, it cools, and cloud forms when it reaches the dew point temperature. This process — orographic lift — can create dense summit cloud when the valley below is sunny and clear. The forecast for the nearest town is almost useless for planning a high-level route; always use a dedicated mountain weather service.", "The Mountain Weather Information Service (MWIS) provides detailed forecasts for specific mountain areas of the UK, updated twice daily. The Met Office also produces a Mountain Forecast for specific summits. Both services include summit temperature, wind speed, and cloud base height — the last of these tells you whether the summit will be in cloud or above it. Make these your standard pre-walk check.", "Cloud types give you advance warning of what's coming. High, thin cirrus cloud — the streaky, wispy formations — often precede a frontal system by 24-48 hours. Lenticular clouds, the lens-shaped formations that form over summits in strong winds, indicate violent turbulence above the ridge. Cumulonimbus — the anvil-shaped thunderstorm cloud — should prompt immediate descent from any exposed ground.", "Wind speed increases dramatically with altitude, and temperature drops approximately 1°C for every 100 metres of ascent. On a 15°C day in the valley, the summit of Ben Nevis is likely to be around 2°C — before accounting for wind chill. Wind chill at 60 mph wind speed reduces the effective temperature by a further 15°C. People have died of hypothermia on Scottish mountains in summer.", "The rule of thumb is: if you're unsure, don't go. The mountain will be there next week. Turning around is not failure — it is good judgement. The most experienced hillwalkers in Scotland have long lists of days when they turned around, and they are alive to talk about it precisely because of that habit."] },
  { id: 14, title: "Navigation Without Signal: The Art of the Map", cat: "Safety", region: "Cairngorms", peak: "Cairn Gorm", lat: 57.05, lng: -3.7, author: "Laura K.", excerpt: "Your phone will die. GPS will fail. Fog will descend. The only reliable navigation tool in the mountains is one that doesn't need a battery.", read: "8 min", icon: "🗺️",
    body: ["A smartphone GPS is a remarkable navigation tool in fine weather. It is also a liability in mountains, for several reasons: batteries drain fast in cold, screens become invisible in bright sunlight, and the glass fails if dropped. More fundamentally, a phone gives you a blue dot on a map — it does not teach you to understand the landscape around you. That understanding, the thing that keeps you safe when the phone dies, comes only from learning to read a paper map.", "Contour lines are the language of maps. Each line connects points of equal altitude. Where contours are close together, the ground is steep. Where they are spread apart, the ground is gentle. Contours that form a V shape pointing uphill indicate a valley or stream. Contours that form a V pointing downhill indicate a ridge or spur. A ring of contours indicates a summit. If you can read contours fluently, you can construct the entire three-dimensional landscape from a two-dimensional map.", "Taking a compass bearing is the foundational navigation skill. Place the compass on the map between your current position and your destination. Rotate the housing until the orienting lines align with the map's north lines. Hold the compass level, rotate your body until the needle aligns with the orienting arrow — and walk in the direction the travel arrow points. Practise this at home until it is automatic, not in mist on a high plateau.", "Two techniques make navigation significantly safer in poor visibility. Aiming off is deliberately navigating to a point to one side of your destination, so you know which way to turn when you hit a feature. Handrailing means following a linear feature — a fence, a stream, a ridge edge — rather than navigating across featureless ground. Combining these techniques with careful timing and pacing makes navigation in cloud genuinely manageable.", "The OS Explorer maps (1:25,000) are the standard for most hill walking. Carry a map and compass on every mountain walk above the snow line or in conditions where cloud is forecast. A dedicated GPS device is a useful backup; a phone should be a tertiary option. The skill of map reading is one of the best investments any hillwalker can make."] },
  { id: 15, title: "The Red Deer Rut", cat: "Wildlife", region: "Kintail & Affric", peak: "The Five Sisters", lat: 57.15, lng: -5.2, author: "Laura K.", excerpt: "Every October, Britain's largest land mammal fills the Highland glens with sound. The red deer rut is one of nature's great spectacles, happening right here.", read: "6 min", icon: "🦌",
    body: ["The red deer rut begins in late September and peaks through October, when stags that have spent the summer feeding and growing their antlers come down from the high ground to compete for hinds. A mature Highland stag weighs up to 190 kg and carries antlers that can span a metre across. During the rut, they roar almost continuously — a deep, hoarse bellowing that carries for kilometres across open glens.", "Dominance is established primarily through roaring contests and parallel walking. Fights — the full clash of antlers — are relatively rare because they are costly; a stag can lose an eye, break an antler, or be fatally injured. Most confrontations are resolved before they escalate. The winning stag gathers a herd of hinds, constantly herding them, chasing off rivals, and barely eating for the duration of the rut.", "Red deer are legally the property of the landowner across most of Scotland. The stalking season runs from 1 July to 20 October for stags and 21 October to 15 February for hinds. During the stalking season, some hill paths can be temporarily closed or require asking permission at the estate before walking. Check the Heading for the Scottish Hills website before visiting during these periods.", "The rut is audible from valley level — you can often hear the roaring long before you see the deer. To watch without disturbing the animals, stay downwind, move slowly, and observe from 200 metres or more. Disturbing rutting deer can disrupt the breeding cycle and stress animals that are already physically depleted.", "Kintail, Glen Affric, and the Cairngorms are among the best places to witness the rut from open hill. The glens around Torridon and Assynt in the northwest are also exceptional. Go at dawn or dusk, when deer are most active, and bring binoculars — this is wildlife watching at its most primally impressive."] },
  { id: 16, title: "Sir Hugh Munro and His Tables", cat: "History", region: "Cairngorms", peak: "Ben Macdui", lat: 57.0, lng: -3.7, author: "Rachel M.", excerpt: "In 1891, a Scottish aristocrat published a list of mountains. It created a sporting obsession that has consumed hundreds of thousands of hillwalkers ever since.", read: "7 min", icon: "📋",
    body: ["Sir Hugh Thomas Munro was a founding member of the Scottish Mountaineering Club and a man of independent means who spent much of his life walking the Scottish hills. In 1891, after years of systematic survey, he published his Tables of Heights over 3,000 Feet in the Scottish Mountaineering Club Journal — a list of 283 separate summits and 255 tops (subsidiary summits) that met his criteria for a distinct mountain.", "Munro never completed his own list. He died in 1919 with three peaks unclimbed, including the Inaccessible Pinnacle on Skye — a technical rock climb requiring a rope — which he had repeatedly deferred. The first person to complete the list was the Reverend Archibald Robertson, in 1901. The second completion came 22 years later. By the year 2000, over 3,000 completions had been recorded. Today the number is over 10,000.", "The list has been revised multiple times as survey techniques improved. The current official list, maintained by the SMC, stands at 282 Munros following revisions in 2012. Mountains have been added, removed, and reclassified as better height data became available. Beinn Tarsuinn was added in 1997 when its true height was confirmed; Ruadh Stac Mòr was briefly a Munro before being reclassified.", "Completing all the Munros — 'compleating' in the preferred spelling — has become one of Scotland's most significant sporting achievements. Many people walk the hills for decades to finish; some do it in a single long journey. The fastest known time for an unsupported completion is under 40 days. The oldest person to compleat was in their 80s. The youngest was a child walked up by their parents.", "The Munros have shaped Scottish hill culture profoundly. They brought walkers to remote areas that might otherwise have seen very few visitors, created communities of hillwalkers, and established standards of mountain craft. Whether you're chasing the list or simply out for the day, the Munros give Scotland's hills a particular texture that goes beyond simple appreciation of scenery."] },
  { id: 17, title: "River Otters: Scotland's Secret Resident", cat: "Wildlife", region: "Kintail & Affric", peak: "The Five Sisters", lat: 57.1, lng: -5.3, author: "Laura K.", excerpt: "The Eurasian otter is one of Scotland's great conservation success stories. With patience and timing, you can watch them fish in the same rivers where they were nearly wiped out.", read: "5 min", icon: "🦦",
    body: ["The Eurasian otter was driven to near-extinction in England and Wales through the 20th century by hunting, pesticide contamination of waterways, and habitat loss. Scotland's clean, fast-flowing Highland rivers provided a refuge, and Scottish otter populations have remained strong — today Scotland holds the largest otter population in Britain, with an estimated 8,000 animals.", "Otters are largely crepuscular — most active around dawn and dusk — and spend much of the day resting in holts (dens) among tree roots, rock cavities, or dense vegetation beside rivers and lochs. They are equally comfortable in fresh and salt water; the west coast sea lochs and tidal rivers are excellent otter habitat, where fish are plentiful and disturbance is low.", "Spotting an otter requires patience and the right approach. Walk slowly along a riverbank in the early morning, staying downwind (otters have an excellent sense of smell). Look for fish-scale and crab-shell remains at spraints (otter droppings) marked on prominent rocks — fresh spraint indicates recent activity. Once you've found spraint, sit quietly and wait.", "The sound of an otter surfacing — a soft splash, then vigorous chewing — often precedes the sighting. They dive repeatedly, typically for 15-20 seconds, surfacing to eat smaller fish on the spot and bringing larger prey ashore. Watching an otter eat a sea trout on a riverside boulder is one of the great wildlife moments Scotland offers.", "The Isle of Skye, Kintail, Torridon, and the Argyll coast are all outstanding otter habitat. The RSPB's Loch Garten reserve in the Cairngorms has regular sightings along the River Spey. Binoculars are essential, and 6am is usually the best time. Dress in muted colours, move slowly, and speak in whispers — the otter will come."] },
  { id: 18, title: "The Cairngorm Plateau in Winter", cat: "Seasonal", region: "Cairngorms", peak: "Cairn Gorm", lat: 57.1, lng: -3.65, author: "Rachel M.", excerpt: "In winter the Cairngorm plateau becomes a sub-Arctic wilderness. Wind speeds above 100 mph are not unusual. It is also one of the most beautiful places in Britain.", read: "8 min", icon: "❄️",
    body: ["The Cairngorm plateau — the high ground above 1,000 metres between Cairn Gorm, Ben Macdui, Braeriach, and Cairn Toul — has a climate closer to the Arctic than to the rest of Britain. Average January temperatures on the plateau are around -7°C, but wind chill regularly pushes effective temperatures below -20°C. Annual snowfall can exceed 5 metres. The ski area at Cairngorm Mountain exists because of this snowfall, which can persist on north-facing slopes into June.", "What makes the plateau remarkable in winter is not just the conditions but the landscape they create. The snow is sculpted by persistent westerly winds into sastrugi — ridged, wave-like formations — and the light on clear winter days has a clarity found nowhere else in Britain. Ptarmigan in white plumage dot the boulderfields. Red grouse, impossible to spot against the heather in summer, are suddenly visible against white snow. The silence, broken only by wind, is absolute.", "Planning a winter plateau walk requires more preparation than any summer hill walk. Full winter clothing — insulated and waterproof layers — is essential. A rope, ice axe, and crampons are needed for any route that crosses steep ground or has the potential for icy cornices. Navigation on the featureless plateau in cloud requires absolute compass competence. Many experienced hillwalkers take a winter mountain skills course before venturing onto the plateau in full winter conditions.", "The reward for this preparation is access to one of the most extraordinary experiences in British walking. A clear winter day on the plateau — blue sky, white snow, ptarmigan, and views stretching to the Cairngorm peaks in every direction — is genuinely unforgettable. The low winter sun gives the snow a golden colour in the late afternoon that no photograph quite captures.", "The ski road to the Cairngorm Mountain car park at 635 metres gives a significant head start on the ascent. The funicular to 1,080 metres is available in winter (with appropriate safety restrictions). From the top, the summit of Cairn Gorm is a 30-minute walk in good visibility. Always check the avalanche forecast from the Scottish Avalanche Information Service before heading out."] },
  { id: 19, title: "Spring Comes Late to the Scottish Hills", cat: "Seasonal", region: "Ben Nevis & Mamores", peak: "Ben Nevis", lat: 56.75, lng: -4.95, author: "Laura K.", excerpt: "While gardens bloom in April, the high tops of Scotland are still in winter. Spring above 800 metres is brief, violet-coloured, and extraordinary.", read: "5 min", icon: "🌸",
    body: ["Spring at sea level in Scotland typically arrives in March and April. Spring above 800 metres arrives in May and sometimes June — and even then it is conditional, liable to be interrupted by snow showers into late spring. The mountains move through winter on their own schedule, indifferent to the calendar.", "The first sign of alpine spring is purple saxifrage — a small, vivid purple flower that blooms on exposed ledges while snow still covers the surrounding hillside. It is one of only a handful of plants tough enough to flower at altitude in Scotland, and it does so on rock faces and cliff ledges that catch any available warmth from the low spring sun. Seeing purple saxifrage in flower against a snow backdrop is one of the most striking botanical sights in Britain.", "Ptarmigan begin their spring moult in April, transitioning from winter white through a brown-and-white mottled intermediate plumage before reaching their summer colouration. Mountain hares go through a similar change. For a few weeks in spring, both species are highly visible — their mottled coats stand out against both snow and bare ground.", "Waterfalls are at their most spectacular in spring, when snowmelt adds enormous volume to every burn and river. The Falls of Glomach in Kintail — one of Britain's highest waterfalls at 113 metres — are most powerful in May, when the plateau above is still shedding its winter snow. Many routes that are dry scrambles in summer become proper watercourse walks in spring.", "If you can walk only one season in the Scottish hills, consider spring. The midges have not yet emerged. The daylight is rapidly lengthening. Snow lingering in the north-facing corries gives a sense of winter's scale. And the first flowers on the rock faces remind you that life, persistent and tough, finds a way at every altitude."] },
  { id: 20, title: "Ben Nevis in Winter: What Changes Above the Cloud", cat: "Routes", region: "Ben Nevis & Mamores", peak: "Ben Nevis", lat: 56.797, lng: -5.003, author: "Rachel M.", excerpt: "The Mountain Track in summer is a strenuous but straightforward walk. In winter, the same path becomes one of the most serious mountain routes in Britain.", read: "9 min", icon: "🏔️",
    body: ["Ben Nevis in winter is a different mountain. The Mountain Track — a clear, wide path in summer — becomes buried under metres of snow. The summit plateau acquires cornices: overhanging lips of wind-packed snow that extend invisibly beyond the cliff edge. Every year, walkers have been killed on Ben Nevis by stepping through cornices they didn't know existed, falling onto the north face 300 metres below.", "The winter-specific hazards on Ben Nevis include: corniced plateau edges in all directions from the summit; the abseil posts (emergency descent markers) being buried by drifting snow; a descent route onto the Pony Track that can be mistaken for the descent into Five Finger Gully (fatal in avalanche or slide conditions); and wind speeds that routinely exceed 80 mph on the summit. The Ben Nevis and Carn Mòr Dearg massif generates its own weather systems.", "The minimum equipment for a winter ascent of the Mountain Track includes: ice axe, crampons, full winter clothing, a compass and paper map, a headtorch, emergency bivouac equipment, and sufficient food and water. The ability to self-arrest — stop yourself during a slide on steep snow using an ice axe — is essential and should be practised with an instructor before you need it in earnest.", "The north face of Ben Nevis — the vast cliff that you cannot see from the tourist path — contains some of the most serious winter climbing routes in Britain: Tower Ridge, Observatory Ridge, Zero Gully, Point Five Gully. These are technical routes requiring full winter mountaineering skills. Looking down the north face in winter conditions is a profoundly serious experience. Do not approach the summit plateau edge without knowing exactly where you are.", "A winter ascent of Ben Nevis on a clear day, with proper preparation, is one of the finest mountain experiences in Britain. The views from the summit across an entirely white landscape, the low winter sun casting long shadows across the snow, the silence broken only by wind — these are things that people who climb Ben Nevis in summer do not get to see. If you want to do it, take a winter skills course first. Guides Scotland and Glenmore Lodge both run excellent winter mountain courses."] },
];

const ME = { name: "Explorer", user: "", loc: "", frs: 0, fng: 0, walks: 0, dist: 0, elev: 0, munros: { d: 0, t: 282 }, corbetts: { d: 0, t: 222 }, wainwrights: { d: 0, t: 214 }, hewitts: { d: 0, t: 525 }, donalds: { d: 0, t: 89 } };

const BADGES = [
  { n: "First Summit", i: "🏔️", e: true }, { n: "10 Munros", i: "🔟", e: true },
  { n: "Winter Warrior", i: "❄️", e: true }, { n: "100km Club", i: "🏃", e: true },
  { n: "Community Leader", i: "👥", e: false, p: 60 }, { n: "Elevation King", i: "📈", e: false, p: 78 },
  { n: "All Seasons", i: "🌦️", e: false, p: 83 }, { n: "Dawn Patrol", i: "🌅", e: false, p: 33 },
  { n: "Munro Compleatist", i: "🏆", e: false, p: 14 }, { n: "Ridge Runner", i: "⛰️", e: false, p: 40 },
];


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

  // Update markers — use DOM markers if html prop present (Learn page icons),
  // otherwise use fast GeoJSON triangle layer (mountain tracker)
  useEffect(() => {
    if (!mapReady || !mapInstance.current) return;
    const map = mapInstance.current;
    const hasHtml = markers && markers.some(m => m.html);

    if (hasHtml) {
      // DOM markers for emoji/html icons (Learn page)
      import("mapbox-gl").then(mod => {
        const mapboxgl = mod.default;
        // Remove old markers
        if (map._minimapMarkers) { map._minimapMarkers.forEach(m => m.remove()); }
        map._minimapMarkers = [];
        // Remove GeoJSON layer if exists
        if (map.getLayer("minimap-markers-layer")) map.removeLayer("minimap-markers-layer");
        if (map.getSource("minimap-markers")) map.removeSource("minimap-markers");
        (markers || []).filter(m => m.lat && m.lng).forEach((m, i) => {
          const el = document.createElement("div");
          el.style.cssText = m.style || "width:36px;height:36px;border-radius:50%;background:#264f80;border:2px solid rgba(90,152,227,0.3);cursor:pointer;display:flex;align-items:center;justify-content:center;";
          if (m.html) el.innerHTML = m.html;
          if (onMarkerClick) el.addEventListener("click", () => onMarkerClick(m, i));
          const marker = new mapboxgl.Marker({ element: el }).setLngLat([m.lng, m.lat]).addTo(map);
          map._minimapMarkers.push(marker);
        });
      });
    } else {
      // GeoJSON triangle layer for peak markers (mountain tracker)
      const geojson = {
        type: "FeatureCollection",
        features: (markers || []).filter(m => m.lat && m.lng).map((m, i) => ({
          type: "Feature",
          geometry: { type: "Point", coordinates: [m.lng, m.lat] },
          properties: { color: m.color || "#E85D3A", idx: i, peakData: JSON.stringify(m.data || {}) },
        })),
      };
      if (map.getSource("minimap-markers")) {
        map.getSource("minimap-markers").setData(geojson);
      } else {
        map.addSource("minimap-markers", { type: "geojson", data: geojson });
        map.addLayer({
          id: "minimap-markers-layer", type: "symbol", source: "minimap-markers",
          layout: { "text-field": "▲", "text-size": 30, "text-allow-overlap": true, "text-ignore-placement": true },
          paint: { "text-color": ["get", "color"], "text-halo-color": "rgba(255,255,255,0.6)", "text-halo-width": 1 },
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
  const [oauthLoading, setOauthLoading] = useState(null); // "google" | "apple" | null
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    setOauthLoading("google");
    setError("");
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "https://trailsync-zeta.vercel.app/auth/callback" },
    });
    if (authError) { setError(authError.message); setOauthLoading(null); }
    // On success browser redirects away — auth listener in parent handles the rest
  };

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
        <button disabled style={{ width: "100%", padding: "13px", borderRadius: "12px", border: "1px solid rgba(90,152,227,0.1)", background: "#0a2240", color: "#BDD6F4", fontSize: "13px", fontWeight: 600, cursor: "default", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontFamily: "'DM Sans'", marginBottom: "10px", opacity: 0.4 }}>
          <Apple size={16} /> Sign in with Apple <span style={{ fontSize: "10px", opacity: 0.6 }}>(coming soon)</span>
        </button>
        <button onClick={handleGoogleLogin} disabled={!!oauthLoading} style={{ width: "100%", padding: "13px", borderRadius: "12px", border: "1px solid rgba(90,152,227,0.15)", background: "#0a2240", color: "#F8F8F8", fontSize: "13px", fontWeight: 600, cursor: oauthLoading ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontFamily: "'DM Sans'", marginBottom: "10px", opacity: oauthLoading ? 0.7 : 1 }}>
          {oauthLoading === "google" ? <div style={{ width: "16px", height: "16px", border: "2px solid rgba(248,248,248,0.3)", borderTop: "2px solid #F8F8F8", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>}
          {oauthLoading === "google" ? "Redirecting…" : "Sign in with Google"}
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
const HomePage = ({ userName, initialFilter, userId, followingIds, setFollowingIds, setFollowingCount, headerSearch, setHeaderSearch, openRoute, searchResults, setSearchResults, searching, setSearching, onViewProfile }) => {
  const [wxOpen, setWxOpen] = useState(false);
  const [ff, setFf] = useState(initialFilter || "all");
  const [expandedArea, setExpandedArea] = useState(null);
  const [showSAIS, setShowSAIS] = useState(false);
  const [windUnit, setWindUnit] = useState("mph");
  const fmtWind = (mph) => windUnit === "mph" ? Math.round(mph) : Math.round(mph * 1.60934);

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
  const [feedPostOpen, setFeedPostOpen] = useState(false);
  const [feedPostText, setFeedPostText] = useState("");
  const [feedPosting, setFeedPosting] = useState(false);

  // Run search whenever headerSearch changes
  useEffect(() => {
    if (headerSearch !== undefined) {
      handleSearch(headerSearch);
    }
  }, [headerSearch]);

  // Fetch posts once on mount — no auth needed, posts are public
  const fetchPosts = async () => {
    try {
      await supabase.auth.getSession();
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
        route: p.route_points || null,
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
    fetchPosts();
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
        supabase.from("posts").select("*").ilike("text", `%${q}%`).order("created_at", { ascending: false }).limit(8),
        supabase.from("profiles").select("id, username, name, location, follower_count").or(`username.ilike.%${q}%,name.ilike.%${q}%`).limit(6),
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
        route: p.route_points || null,
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

      {/* Floating create post button — fixed bottom right above tab bar */}
      {!feedPostOpen && (
        <button onClick={() => setFeedPostOpen(true)} style={{ position: "fixed", bottom: "82px", right: "16px", width: "52px", height: "52px", borderRadius: "50%", border: "none", background: "linear-gradient(135deg,#E85D3A,#d04a2a)", color: "#F8F8F8", fontSize: "26px", fontWeight: 300, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, boxShadow: "0 4px 16px rgba(232,93,58,0.45)", lineHeight: 1 }}>+</button>
      )}

      {/* Expanded create post form */}
      {feedPostOpen && (
        <div style={{ marginBottom: "14px", animation: "fi .15s ease" }}>
          <div style={{ background: "#0a2240", borderRadius: "12px", border: "1px solid rgba(90,152,227,0.2)", padding: "12px", animation: "fi .15s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#264f80,#5A98E3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "#F8F8F8", flexShrink: 0 }}>{(userName||"U")[0].toUpperCase()}</div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#F8F8F8" }}>{userName}</div>
            </div>
            <textarea autoFocus placeholder="Share a summit, trail conditions, local wildlife…" value={feedPostText} onChange={e => setFeedPostText(e.target.value)} rows={3} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(90,152,227,0.15)", background: "#041e3d", color: "#F8F8F8", fontSize: "13px", outline: "none", fontFamily: "'DM Sans'", resize: "none", boxSizing: "border-box" }} />
            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              <button onClick={() => { setFeedPostOpen(false); setFeedPostText(""); }} style={{ flex: 1, padding: "9px", borderRadius: "8px", border: "1px solid rgba(90,152,227,0.15)", background: "transparent", color: "#BDD6F4", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans'" }}>Cancel</button>
              <button disabled={!feedPostText.trim() || feedPosting} onClick={async () => {
                if (!feedPostText.trim() || feedPosting) return;
                setFeedPosting(true);
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                  const meta = user.user_metadata || {};
                  const newPost = { user_id: user.id, username: meta.username || meta.full_name?.split(" ")[0] || null, full_name: meta.full_name || null, type: "summit", text: feedPostText.trim(), peaks: [] };
                  await supabase.from("posts").insert(newPost);
                  setLivePosts(prev => [{ id: Date.now(), user: meta.username || meta.full_name?.split(" ")[0] || userName, av: (userName||"U")[0].toUpperCase(), time: "just now", type: "summit", text: feedPostText.trim(), likes: 0, comments: 0, peaks: [], user_id: user.id }, ...prev]);
                }
                setFeedPostText(""); setFeedPostOpen(false); setFeedPosting(false);
              }} style={{ flex: 2, padding: "9px", borderRadius: "8px", border: "none", background: "linear-gradient(135deg,#E85D3A,#d04a2a)", color: "#F8F8F8", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'", opacity: !feedPostText.trim() || feedPosting ? 0.6 : 1 }}>
                {feedPosting ? "Posting…" : "Post to Feed"}
              </button>
            </div>
          </div>
        </div>
      )}

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
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <button onClick={() => setWindUnit(u => u === "mph" ? "kph" : "mph")} style={{ padding: "3px 8px", borderRadius: "6px", border: "1px solid rgba(90,152,227,0.2)", background: "rgba(90,152,227,0.08)", color: "#5A98E3", fontSize: "10px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'" }}>{windUnit}</button>
                {wxUpdated && !wxLoading && (
                  <span style={{ fontSize: "9px", color: "#BDD6F4", opacity: 0.4 }}>
                    {wxUpdated.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
              </div>
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
                            <div style={{ fontSize: "12px", fontWeight: 700, color: a.wind > 35 ? "#E85D3A" : a.wind >= 20 ? "#F49D37" : "#F8F8F8" }}>{fmtWind(a.wind)}</div>
                            <div style={{ fontSize: "8px", color: "#BDD6F4", opacity: 0.5 }}>{windUnit}</div>
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
                          <span>Wind: {fmtWind(a.wind)}{windUnit}</span>
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
                                  <div style={{ fontSize: "11px", fontWeight: 700, color: lw.wi > 35 ? "#E85D3A" : lw.wi >= 20 ? "#F49D37" : "#F8F8F8" }}>{fmtWind(lw.wi)}<span style={{ fontSize: "8px" }}>{windUnit}</span></div>
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
                      ["Wind", `${fmtWind(selPeakWx.wx.wi)}${windUnit}`, selPeakWx.wx.wi > 35 ? "#E85D3A" : selPeakWx.wx.wi >= 20 ? "#F49D37" : "#F8F8F8"],
                      ["Gusts", `${fmtWind(selPeakWx.wx.gusts)}${windUnit}`, selPeakWx.wx.gusts > 50 ? "#E85D3A" : selPeakWx.wx.gusts > 30 ? "#F49D37" : "#F8F8F8"],
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
                            <div style={{ fontSize: "9px", fontWeight: 600, color: h.wind > 35 ? "#E85D3A" : h.wind >= 20 ? "#F49D37" : "#BDD6F4", marginTop: "3px" }}>{fmtWind(h.wind)}{windUnit}</div>
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

      {/* Feed filter dropdown */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", animation: "su .4s ease .3s both" }}>
        <select value={ff} onChange={e => setFf(e.target.value)} style={{
          background: "#0a2240", border: "1px solid rgba(90,152,227,0.2)", borderRadius: "20px",
          color: ff === "all" ? "#BDD6F4" : "#5A98E3", fontSize: "12px", fontFamily: "'DM Sans'",
          fontWeight: ff === "all" ? 500 : 700, padding: "6px 30px 6px 14px", cursor: "pointer",
          outline: "none", WebkitAppearance: "none", appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%235A98E3' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center"
        }}>
          <option value="all">For You</option>
          <option value="summits">Summits</option>
          <option value="events">Events</option>
          <option value="news">News</option>
          <option value="fundraiser">Fundraiser</option>
        </select>
      </div>

      {/* Feed */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {livePosts.filter(p => ff === "all" || (ff === "summits" && (p.type === "summit" || p.type === "walk")) || (ff === "events" && p.type === "event") || (ff === "news" && p.type === "news") || (ff === "fundraiser" && p.type === "fundraiser")).map((p, i) => (
          <div key={p.id} onClick={() => setCommentOpen(commentOpen === p.id ? null : p.id)} style={{
            background: "#0a2240", borderRadius: "14px", padding: "14px",
            border: `1px solid ${commentOpen === p.id ? "rgba(90,152,227,0.25)" : "rgba(90,152,227,0.1)"}`,
            animation: `su .3s ease ${.35 + i * .05}s both`, cursor: "pointer"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <div onClick={() => p.user_id && onViewProfile && onViewProfile({ id: p.user_id, name: p.user, username: p.user })} style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg,#264f80,#5A98E3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "17px", fontWeight: 700, color: "#F8F8F8", cursor: p.user_id ? "pointer" : "default", flexShrink: 0 }}>{p.av}</div>
              <div style={{ flex: 1 }}>
                <div onClick={() => p.user_id && onViewProfile && onViewProfile({ id: p.user_id, name: p.user, username: p.user })} style={{ fontSize: "13px", fontWeight: 700, color: "#F8F8F8", cursor: p.user_id ? "pointer" : "default", display: "inline-block" }}>{p.user}</div>
                <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.5 }}>{p.time}</div>
              </div>
              {p.type === "walk" && <span style={{ fontSize: "9px", padding: "2px 8px", borderRadius: "6px", background: "rgba(90,152,227,0.15)", color: "#5A98E3", fontWeight: 700 }}>🥾 WALK</span>}
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
            {p.type === "walk" && p.route && p.route.length > 2 && (
              <div style={{ marginTop: "10px" }} onClick={e => e.stopPropagation()}>
                <RoutePreview points={p.route} height={120} />
              </div>
            )}
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
            const peakMatch = (typeof PEAKS !== "undefined" ? PEAKS : []).find(p => r.peaks && r.peaks.includes(p.name));
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
      const peakMatch = (typeof PEAKS !== "undefined" ? PEAKS : []).find(p => r.peaks && r.peaks.includes(p.name));
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

const ROUTE_EXTRA = {
  1: { terrain: ["Mountain Track","Scree","Exposed Ridge","Rocky Path"], description: "The most popular route up Britain's highest peak follows the well-maintained Mountain Track (formerly the Tourist Route) from Glen Nevis. The path is clear throughout but becomes rocky and bouldery in the upper section. Navigation in poor visibility on the plateau is crucial — the summit plateau is large and featureless and has claimed lives in all seasons.", history: "Ben Nevis means 'Mountain with its Head in the Clouds' in Gaelic. The first recorded ascent was by botanist James Robertson in 1771. The former summit hotel and observatory (1883–1904) recorded weather data that still informs Scottish meteorology today. In April, the north face is a world-class ice climbing destination.", flora: "Red deer are common on the lower slopes. Look for ptarmigan near the summit plateau — they turn white in winter. Mountain hares, golden eagles and peregrine falcons inhabit these slopes year-round." },
  2: { terrain: ["Scramble","Exposed Arête","Rocky Ridge","Summit Plateau","Navigation Required"], description: "One of Scotland's great mountain days, the CMD Arête ascends to Carn Mòr Dearg before the thrilling narrow arête walk northeast to Ben Nevis summit. The arête requires simple scrambling with significant exposure — not for those uncomfortable with heights. The standard descent is via the Mountain Track (Tourist Route) back to Glen Nevis — do NOT reverse the arête.", history: "The CMD Arête was popularised in the Victorian era as the sporting alternative to the Tourist Route. The north face of Ben Nevis visible from the arête contains routes like Tower Ridge (TD) and Zero Gully, legendary among Scottish winter climbers.", flora: "Snow bunting are often spotted on the upper plateau in winter. The northeast corrie holds snow well into early summer. Rare alpine flowers including purple saxifrage bloom on ledges below the arête in May and June." },
  3: { terrain: ["Steep Approach","Scramble","Rocky Ridge","Summit Plateau"], description: "Buachaille Etive Mòr via Coire na Tulaich is a steep, direct ascent through a dramatic corrie followed by a ridge walk to the summit of Stob Dearg. The approach up the corrie involves a sustained hands-on scramble in the upper section. Descent should not be attempted straight down the south face — return via the ascent route.", history: "The Buachaille ('The Great Herdsman') has stood sentinel at the entrance to Glen Coe since the last ice age carved its dramatic profile. It is one of the most photographed mountains in Scotland, instantly recognisable from the A82. The northeast buttress was first climbed in 1895.", flora: "Glen Coe is a designated SSSI. The lower slopes support ancient Caledonian birch woodland. Red squirrel, otter, and golden eagle are all recorded here. The corrie headwall holds late snow and supports specialist alpine plant communities." },
  4: { terrain: ["Lochside Path","Graded Trail","Gentle Ascent","Woodland"], description: "Ben Lomond via the Ptarmigan Ridge is the southernmost Munro and the most accessible from Glasgow. The tourist path from Rowardennan is well-graded and clear throughout. The alternative Ptarmigan Ridge route (from the same start) gives a more varied approach via the northwest ridge with wider views over Loch Lomond.", history: "Ben Lomond was one of the first mountains climbed for sport rather than necessity, with records of ascents from the 1750s. The Trossachs and Loch Lomond area became romantically famous after Walter Scott's poem 'The Lady of the Lake' (1810) and Rob Roy (1817).", flora: "Ben Lomond National Memorial Park is managed by the National Trust for Scotland. Atlantic oakwood clings to the lower slopes — one of the finest examples in Britain. Ospreys nest at Loch Lomond from spring. Red deer and feral goats roam the upper slopes." },
  5: { terrain: ["Exposed Ridge","Scramble","Four Summits","High Level Route","Navigation Required"], description: "The Ring of Steall is one of Scotland's finest ridge walks, linking four Munros in the Mamores range above Glen Nevis. The route involves sustained scrambling on the connecting ridges, particularly on An Gearanach and the Sgùrr a' Mhàim descent. A wire bridge over the Water of Nevis adds character to the approach.", history: "The Mamores were a major centre of Highland clan life — the area saw significant clearances in the 18th and 19th centuries. The ring takes its name from the An Steall waterfall in the gorge below, the second highest waterfall in Scotland at 120m.", flora: "The high ridges support a full suite of arctic-alpine species. Look for mountain ringlet butterflies (Britain's only truly alpine butterfly) on the south-facing slopes in July. Red deer herds are abundant throughout." },
};
const ROUTE_EXTRA_DEFAULT = { terrain: ["Mountain Path","Open Hillside"], description: "A classic Scottish mountain route. Always check conditions before heading out and carry full navigation equipment. Weather can change rapidly in the Scottish Highlands year-round.", history: "Scotland's mountains have a rich history of exploration, farming, and Highland culture. Many summits were first climbed in the Victorian era during the golden age of Scottish mountaineering.", flora: "Scottish uplands support rare habitats including blanket bog, montane heath, and arctic-alpine plant communities. Red deer, mountain hare, ptarmigan, and golden eagle are frequent companions." };

const RoutesPage = ({ openRoute, pendingRouteDetail, onClearPendingRoute }) => {
  const [cf, setCf] = useState(null);
  const [df, setDf] = useState(null);
  const [showCommunity, setShowCommunity] = useState(true);
  const [subTab, setSubTab] = useState("list");
  const [selRegion, setSelRegion] = useState(null);
  const [showRouteDetail, setShowRouteDetail] = useState(null); // route object
  const [routeDetailCoords, setRouteDetailCoords] = useState(null);
  const [routeDetailCoordsLoading, setRouteDetailCoordsLoading] = useState(false);

  // Fetch GPX preview coords when route detail opens
  useEffect(() => {
    if (!showRouteDetail?.gpx_file) { setRouteDetailCoords(null); return; }
    setRouteDetailCoords(null);
    setRouteDetailCoordsLoading(true);
    fetchGpxText(showRouteDetail.gpx_file)
      .then(xml => { setRouteDetailCoords(parseGpxCoords(xml)); })
      .catch(() => setRouteDetailCoords(null))
      .finally(() => setRouteDetailCoordsLoading(false));
  }, [showRouteDetail?.gpx_file]);

  // Open route detail from external navigation (header search)
  useEffect(() => {
    if (pendingRouteDetail) {
      setShowRouteDetail(pendingRouteDetail);
      if (onClearPendingRoute) onClearPendingRoute();
    }
  }, [pendingRouteDetail]);
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

  const extra = showRouteDetail ? (ROUTE_EXTRA[showRouteDetail.id] || ROUTE_EXTRA_DEFAULT) : null;

  return (
    <>
    {/* ── Route detail modal ── */}
    {showRouteDetail && (
      <div style={{ position: "fixed", inset: 0, zIndex: 80, background: "#041e3d", overflowY: "auto", animation: "su .25s ease", display: "flex", flexDirection: "column" }}>
        {/* Hero header */}
        <div style={{ position: "relative", minHeight: 200, background: `linear-gradient(160deg, #0d2d54 0%, #1a4a7a 40%, #264f80 100%)`, flexShrink: 0, overflow: "hidden" }}>
          {/* Decorative mountain silhouette */}
          <svg viewBox="0 0 400 120" style={{ position: "absolute", bottom: 0, left: 0, right: 0, width: "100%", opacity: 0.12 }} preserveAspectRatio="none">
            <path d="M0 120 L60 60 L110 90 L180 20 L240 70 L290 40 L350 80 L400 50 L400 120Z" fill="#5A98E3" />
          </svg>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(4,30,61,0.9) 100%)" }} />
          <div style={{ position: "relative", padding: "14px 16px 20px" }}>
            <button onClick={() => setShowRouteDetail(null)} style={{ background: "rgba(4,30,61,0.6)", border: "none", borderRadius: "10px", padding: "8px 14px", color: "#BDD6F4", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Sans'", marginBottom: "50px", backdropFilter: "blur(8px)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg> Back
            </button>
            <div>
              <span style={{ fontSize: "10px", padding: "3px 10px", borderRadius: "8px", background: `rgba(${dc(showRouteDetail.diff) === "#6BCB77" ? "107,203,119" : dc(showRouteDetail.diff) === "#5A98E3" ? "90,152,227" : dc(showRouteDetail.diff) === "#F49D37" ? "244,157,55" : "232,93,58"},0.2)`, color: dc(showRouteDetail.diff), fontWeight: 700, marginBottom: "8px", display: "inline-block" }}>{showRouteDetail.diff}</span>
              <div style={{ fontSize: "22px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'DM Sans'", lineHeight: 1.2, marginBottom: "4px" }}>{showRouteDetail.name}</div>
              <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.6 }}>{showRouteDetail.reg} · Start: {showRouteDetail.start}</div>
            </div>
          </div>
        </div>

        {/* Route GPX preview */}
        <div style={{ background: "#041e3d", flexShrink: 0, position: "relative" }}>
          {routeDetailCoordsLoading && (
            <div style={{ height: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: "2px solid rgba(90,152,227,0.2)", borderTop: "2px solid #5A98E3", animation: "spin 0.7s linear infinite" }} />
            </div>
          )}
          {!routeDetailCoordsLoading && routeDetailCoords && routeDetailCoords.length > 1 && (
            <RoutePreview points={routeDetailCoords} height={120} />
          )}
          {/* Fade overlays */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "24px", background: "linear-gradient(to bottom, rgba(13,45,84,0.85), transparent)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "24px", background: "linear-gradient(to top, #041e3d, transparent)", pointerEvents: "none" }} />
        </div>

        {/* Body */}
        <div style={{ flex: 1, padding: "20px 16px 40px" }}>
          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "16px" }}>
            {[
              ["📏", `${showRouteDetail.dist}km`, "Distance"],
              ["⛰️", `${showRouteDetail.elev}m`, "Elevation"],
              ["⏱️", showRouteDetail.time, "Est. Time"],
            ].map(([icon, val, label]) => (
              <div key={label} style={{ background: "#0a2240", borderRadius: "12px", padding: "12px 8px", textAlign: "center", border: "1px solid rgba(90,152,227,0.1)" }}>
                <div style={{ fontSize: "16px", marginBottom: "4px" }}>{icon}</div>
                <div style={{ fontSize: "15px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'JetBrains Mono'" }}>{val}</div>
                <div style={{ fontSize: "9px", color: "#BDD6F4", opacity: 0.45, marginTop: "3px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Rating */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Star size={14} color="#EBCB8B" fill="#EBCB8B" />
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#F8F8F8" }}>{showRouteDetail.rat}</span>
            <span style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.45 }}>({showRouteDetail.rev} reviews)</span>
            {showRouteDetail.src === "ts" && <span style={{ fontSize: "9px", padding: "2px 8px", borderRadius: "6px", background: "rgba(90,152,227,0.1)", color: "#5A98E3", fontWeight: 700 }}>✓ Verified</span>}
          </div>

          {/* Terrain tags */}
          {extra?.terrain && (
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "#BDD6F4", opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Terrain</div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {extra.terrain.map(t => (
                  <span key={t} style={{ fontSize: "11px", padding: "4px 10px", borderRadius: "8px", background: "rgba(90,152,227,0.08)", border: "1px solid rgba(90,152,227,0.15)", color: "#BDD6F4", fontWeight: 600 }}>{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* Route description */}
          {extra?.description && (
            <div style={{ background: "#0a2240", borderRadius: "12px", padding: "14px", marginBottom: "12px", border: "1px solid rgba(90,152,227,0.08)" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "#5A98E3", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>About This Route</div>
              <div style={{ fontSize: "13px", color: "#BDD6F4", lineHeight: 1.65, opacity: 0.85 }}>{extra.description}</div>
            </div>
          )}

          {/* Peaks */}
          {showRouteDetail.peaks && showRouteDetail.peaks.length > 0 && (
            <div style={{ background: "rgba(107,203,119,0.05)", borderRadius: "12px", padding: "14px", marginBottom: "12px", border: "1px solid rgba(107,203,119,0.12)" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "#6BCB77", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>⛰️ Summits on Route</div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {showRouteDetail.peaks.map(pk => <span key={pk} style={{ fontSize: "12px", padding: "4px 10px", borderRadius: "8px", background: "rgba(107,203,119,0.1)", color: "#6BCB77", fontWeight: 600 }}>{pk}</span>)}
              </div>
            </div>
          )}

          {/* History & nature */}
          {(extra?.history || extra?.flora) && (
            <div style={{ background: "#0a2240", borderRadius: "12px", padding: "14px", marginBottom: "12px", border: "1px solid rgba(90,152,227,0.08)" }}>
              {extra.history && (
                <>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#5A98E3", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>🏔️ History</div>
                  <div style={{ fontSize: "12px", color: "#BDD6F4", lineHeight: 1.65, opacity: 0.8, marginBottom: extra.flora ? "12px" : 0 }}>{extra.history}</div>
                </>
              )}
              {extra.flora && (
                <>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#6BCB77", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>🌿 Wildlife & Flora</div>
                  <div style={{ fontSize: "12px", color: "#BDD6F4", lineHeight: 1.65, opacity: 0.8 }}>{extra.flora}</div>
                </>
              )}
            </div>
          )}

          {/* Directions to start */}
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(showRouteDetail.start + ", Scotland")}&travelmode=driving`} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px", borderRadius: "12px", background: "rgba(90,152,227,0.08)", border: "1px solid rgba(90,152,227,0.15)", textDecoration: "none", marginBottom: "10px" }}>
            <div style={{ width: 36, height: 36, borderRadius: "10px", background: "rgba(90,152,227,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5A98E3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#F8F8F8" }}>Directions to Start</div>
              <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.5, marginTop: "2px" }}>{showRouteDetail.start} · Opens Google Maps</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5A98E3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>

          {/* View on map */}
          {showRouteDetail.gpx_file && (
            <button onClick={() => { openRoute(showRouteDetail, "routes-detail"); setShowRouteDetail(null); }} style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#E85D3A,#d04a2a)", color: "#F8F8F8", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <Map size={16} /> View Route on Map
            </button>
          )}
        </div>
      </div>
    )}

    {/* ═══ FULL-SCREEN ROUTES MAP OVERLAY ═══ */}
    {subTab === "map" && (
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: "62px", zIndex: 50, background: "#041e3d", display: "flex", flexDirection: "column" }}>
        {/* Back chevron */}
        <button
          onClick={() => { setSubTab("list"); setSelRegion(null); }}
          style={{
            position: "absolute", top: "calc(env(safe-area-inset-top, 0px) + 12px)", left: 12, zIndex: 60,
            background: "rgba(4,30,61,0.92)", backdropFilter: "blur(12px)",
            border: "1px solid rgba(90,152,227,0.25)", borderRadius: "10px",
            padding: "8px 14px", color: "#F8F8F8", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "6px",
            fontSize: "13px", fontWeight: 700, fontFamily: "'DM Sans'",
            boxShadow: "0 2px 12px rgba(0,0,0,0.3)"
          }}
        >
          <ChevronLeft size={16} /> Routes
        </button>
        {/* Cluster map fills full screen */}
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
                      background: "#0a2240", border: "1px solid rgba(90,152,227,0.08)",
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
                        <span style={{ fontSize: "9px", padding: "1px 6px", borderRadius: "4px", background: "rgba(232,93,58,0.12)", color: "#E85D3A", fontWeight: 700 }}>View →</span>
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

    <div style={{ padding: "0 16px 16px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column" }}>
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
                onClick={() => setShowRouteDetail(r)}
                style={{ background: "#0a2240", borderRadius: "14px", padding: "14px",
                  border: "1px solid rgba(90,152,227,0.1)",
                  cursor: "pointer", animation: `fi .3s ease ${i * .04}s both` }}>
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

      {/* Map view is handled by the full-screen overlay above */}

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
    </>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   TAB 3: MAP
   ═══════════════════════════════════════════════════════════════════ */
const RouteWeatherPanel = ({ routeWeather, elevProfile, onElevHover, onElevLeave }) => {
  const [wxOpen, setWxOpen] = useState(true);
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 24, background: "rgba(4,30,61,0.97)", backdropFilter: "blur(16px)", borderRadius: "16px 16px 0 0", border: "1px solid rgba(90,152,227,0.15)", borderBottom: "none" }}>
      <div onClick={() => setWxOpen(o => !o)} style={{ padding: "12px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: "32px", height: "3px", borderRadius: "2px", background: "rgba(90,152,227,0.3)", position: "absolute", top: "6px", left: "50%", transform: "translateX(-50%)" }} />
        <div style={{ display: "flex", gap: "12px", flex: 1, marginTop: "4px" }}>
          <span style={{ fontSize: "12px", color: "#BDD6F4" }}>📏 {routeWeather.totalKm}km</span>
          <span style={{ fontSize: "12px", color: "#BDD6F4" }}>⏱️ {routeWeather.totalHours}h</span>
          <span style={{ fontSize: "12px", color: "#BDD6F4" }}>⛰️ {routeWeather.totalAscent}m</span>
          {routeWeather.timeline[0] && <span style={{ fontSize: "12px", color: "#BDD6F4", marginLeft: "auto" }}>{routeWeather.timeline[0].icon} {routeWeather.timeline[0].temp !== undefined ? `${Math.round(routeWeather.timeline[0].temp)}°` : ""}</span>}
        </div>
        <div style={{ color: "#BDD6F4", opacity: 0.4, fontSize: "10px", flexShrink: 0 }}>{wxOpen ? "▼" : "▲"}</div>
      </div>
      {wxOpen && (
        <div style={{ padding: "0 16px 16px", maxHeight: "40vh", overflowY: "auto" }}>
          {elevProfile && (
            <div style={{ marginBottom: "12px" }}>
              <div style={{ height: "48px", background: "#0a2240", borderRadius: "8px", overflow: "hidden", position: "relative", cursor: "ew-resize" }}>
                {(() => {
                  const mn = Math.min(...elevProfile), mx = Math.max(...elevProfile), rng = mx - mn || 1;
                  const w = 100, h = 40;
                  const pts = elevProfile.map((e, i) => `${(i / (elevProfile.length - 1)) * w},${h - ((e - mn) / rng) * h}`).join(" ");
                  const fill = `${pts} ${w},${h} 0,${h}`;
                  const getFrac = (clientX, el) => {
                    const rect = el.getBoundingClientRect();
                    const frac = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
                    const hourIdx = Math.min(Math.round(frac * routeWeather.totalHours), routeWeather.timeline.length - 1);
                    if (onElevHover) onElevHover(Math.max(0, hourIdx), frac);
                  };
                  const handleMove = (e) => getFrac(e.clientX, e.currentTarget);
                  const handleLeave = () => { if (onElevLeave) onElevLeave(); };
                  const handleTouchMove = (e) => { e.preventDefault(); getFrac(e.touches[0].clientX, e.currentTarget); };
                  const handleTouchEnd = () => { if (onElevLeave) onElevLeave(); };
                  return (
                    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: "100%", height: "100%", display: "block", touchAction: "none" }} onMouseMove={handleMove} onMouseLeave={handleLeave} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} onTouchCancel={handleTouchEnd}>
                      <defs>
                        <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#F49D37" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#E85D3A" stopOpacity="0.05" />
                        </linearGradient>
                      </defs>
                      <polygon points={fill} fill="url(#elevGrad)" />
                      <polyline points={pts} fill="none" stroke="#F49D37" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
                    </svg>
                  );
                })()}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2px" }}>
                <div style={{ fontSize: "8px", color: "#BDD6F4", opacity: 0.4 }}>{Math.min(...elevProfile)}m</div>
                <div style={{ fontSize: "8px", color: "#BDD6F4", opacity: 0.4 }}>Elevation</div>
                <div style={{ fontSize: "8px", color: "#BDD6F4", opacity: 0.4 }}>{Math.max(...elevProfile)}m</div>
              </div>
            </div>
          )}
          <div style={{ display: "flex", gap: "5px", overflowX: "auto", paddingBottom: "4px" }}>
            {routeWeather.timeline.map((pt, i) => (
              <div key={i} style={{ flexShrink: 0, width: "56px", textAlign: "center", background: "#0a2240", borderRadius: "10px", padding: "7px 3px", border: "1px solid rgba(90,152,227,0.08)" }}>
                <div style={{ fontSize: "9px", color: "#BDD6F4", opacity: 0.5, marginBottom: "3px" }}>{i === 0 ? "Now" : `+${i}h`}</div>
                <div style={{ fontSize: "16px", marginBottom: "2px" }}>{pt.icon || "🌤️"}</div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#F8F8F8" }}>{pt.temp !== undefined ? `${Math.round(pt.temp)}°` : "—"}</div>
                <div style={{ fontSize: "8px", color: "#5A98E3", marginTop: "1px" }}>{pt.wind !== undefined ? `${Math.round(pt.wind)}mph` : ""}</div>
                <div style={{ fontSize: "8px", color: pt.precip > 50 ? "#E85D3A" : "#BDD6F4", opacity: 0.6 }}>{pt.precip !== undefined ? `${pt.precip}%` : ""}</div>
                <div style={{ fontSize: "7px", color: "#BDD6F4", opacity: 0.3 }}>{pt.ele}m</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: "8px", color: "#BDD6F4", opacity: 0.25, textAlign: "center", marginTop: "8px" }}>Naismith timing · Open-Meteo</div>
        </div>
      )}
    </div>
  );
};

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
  const [routeHoverTooltip, setRouteHoverTooltip] = useState(null);
  const routePopupRef = useRef(null);
  const routeElevPopupRef = useRef(null); // from elevation hover
  const [elevHoverActive, setElevHoverActive] = useState(false);
  const [routeWeather, setRouteWeather] = useState(null); // hourly weather along route
  const [routeWeatherLoading, setRouteWeatherLoading] = useState(false);
  const [elevProfile, setElevProfile] = useState(null); // elevation points for chart
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
  const [summitToast, setSummitToast] = useState(null); // { name, cls, ht } — shown briefly when summit hit
  const watchIdRef = useRef(null);
  const trackPointsRef = useRef([]);    // [{lng, lat, alt, t}]
  const lastAltRef = useRef(null);
  const userMovedMapRef = useRef(false); // true when user has manually panned away from location
  const [userMovedMap, setUserMovedMap] = useState(false); // mirror for re-centre button visibility
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
        setDetectedPeaks(prev => {
          if (prev.find(p => p.id === pk.id)) return prev;
          // New summit detected — show toast
          setSummitToast(pk);
          return [...prev, pk];
        });
      }
    });
  };

  // Auto-dismiss summit toast after 5 seconds
  useEffect(() => {
    if (!summitToast) return;
    const t = setTimeout(() => setSummitToast(null), 5000);
    return () => clearTimeout(t);
  }, [summitToast]);

  const locationMarkerRef = useRef(null);

  // Create the pulsing blue location dot element
  const createLocationDot = () => {
    const el = document.createElement("div");
    el.style.cssText = `position: relative; width: 20px; height: 20px;`;
    // Outer pulse ring
    const pulse = document.createElement("div");
    pulse.style.cssText = `
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 40px; height: 40px; border-radius: 50%;
      background: rgba(90,152,227,0.2);
      animation: locationPulse 2s ease-out infinite;
    `;
    // Inner dot
    const dot = document.createElement("div");
    dot.style.cssText = `
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 16px; height: 16px; border-radius: 50%;
      background: #5A98E3; border: 3px solid #ffffff;
      box-shadow: 0 2px 8px rgba(90,152,227,0.6);
    `;
    // Elevation label (updated by updateLiveTrack)
    const label = document.createElement("div");
    label.className = "elev-label";
    label.style.cssText = `
      position: absolute; top: 24px; left: 50%;
      transform: translateX(-50%);
      background: rgba(4,30,61,0.88); color: #5A98E3;
      font-size: 10px; font-weight: 700; font-family: 'DM Sans', sans-serif;
      padding: 2px 6px; border-radius: 4px; white-space: nowrap;
      border: 1px solid rgba(90,152,227,0.35); pointer-events: none;
      display: none;
    `;
    el.appendChild(pulse);
    el.appendChild(dot);
    el.appendChild(label);
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
          const lbl = locationMarkerRef.current.getElement().querySelector(".elev-label");
          if (lbl && latest.alt != null) { lbl.textContent = `${Math.round(latest.alt)}m`; lbl.style.display = "block"; }
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
        // Only add point if no GPS jump > 50m (filters out satellite lock errors)
        const isGpsJump = prev && haversineDist([prev.lng, prev.lat], [lng, lat]) > 0.05;
        if (!isGpsJump) {
          trackPointsRef.current = [...trackPointsRef.current, point];
          updateLiveTrack(trackPointsRef.current);
        }
        checkNearPeak(lat, lng);
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
    setSummitToast(null);
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

    // Detect user-initiated map panning (touchstart/dragstart have originalEvent set)
    const onUserMove = (e) => {
      if (e.originalEvent) { userMovedMapRef.current = true; setUserMovedMap(true); }
    };
    map.on("dragstart", onUserMove);
    map.on("touchstart", onUserMove);

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

  // Store parsed GPX coords when route loads + fetch weather timeline
  useEffect(() => {
    if (!gpxRoute) {
      setGpxRouteCoords(null); setGpxRouteActive(false); setGpxRouteDistDone(0);
      setGpxRouteProgress(0); setGpxRouteElapsed("0:00"); setGpxRouteEta("--");
      setRouteWeather(null); setElevProfile(null);
      return;
    }
  }, [gpxRoute]);

  // Hover tooltip on GPX route — uses Mapbox Popup so it moves with the map
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !gpxRouteCoords || !routeWeather) {
      if (routePopupRef.current) { routePopupRef.current.remove(); routePopupRef.current = null; }
      return;
    }

    const haversine = ([lng1, lat1], [lng2, lat2]) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLng = (lng2 - lng1) * Math.PI / 180;
      const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    };

    let totalKm = 0;
    const cumDists = [0];
    for (let i = 1; i < gpxRouteCoords.length; i++) {
      totalKm += haversine(gpxRouteCoords[i-1], gpxRouteCoords[i]);
      cumDists.push(totalKm);
    }

    import("mapbox-gl").then(mod => {
      const mapboxgl = mod.default;

      const onMove = (e) => {
        const lngLat = e.lngLat;
        let minDist = Infinity, nearestIdx = 0;
        for (let i = 0; i < gpxRouteCoords.length; i++) {
          const d = haversine([lngLat.lng, lngLat.lat], gpxRouteCoords[i]);
          if (d < minDist) { minDist = d; nearestIdx = i; }
        }
        if (minDist > 0.3 || elevHoverActive) {
          if (routePopupRef.current) { routePopupRef.current.remove(); routePopupRef.current = null; }
          return;
        }
        const frac = cumDists[nearestIdx] / totalKm;
        const hourIdx = Math.min(Math.round(frac * routeWeather.totalHours), routeWeather.timeline.length - 1);
        const wx = routeWeather.timeline[hourIdx] || {};
        const coord = gpxRouteCoords[nearestIdx];
        const ele = Math.round(coord[2] || 0);
        const label = hourIdx === 0 ? "At start" : `~${hourIdx}h in`;
        const precip = wx.precip !== undefined ? wx.precip : null;
        const precipColor = precip > 50 ? "#E85D3A" : "#BDD6F4";

        const html = `<div style="background:rgba(4,30,61,0.97);border:1px solid rgba(90,152,227,0.25);border-radius:12px;padding:10px 13px;font-family:'DM Sans',sans-serif;min-width:110px;box-shadow:0 4px 20px rgba(0,0,0,0.5)">
          <div style="font-size:9px;color:#BDD6F4;opacity:0.5;margin-bottom:5px">${label}</div>
          <div style="display:flex;align-items:center;gap:7px;margin-bottom:5px">
            <span style="font-size:22px">${wx.icon || "🌤️"}</span>
            <div>
              <div style="font-size:15px;font-weight:800;color:#F8F8F8">${wx.temp !== undefined ? Math.round(wx.temp) + "°C" : "—"}</div>
              <div style="font-size:9px;color:#5A98E3">${wx.wind !== undefined ? Math.round(wx.wind) + "mph wind" : ""}</div>
            </div>
          </div>
          <div style="display:flex;gap:8px">
            ${precip !== null ? `<span style="font-size:9px;color:${precipColor};opacity:0.8">🌧 ${precip}%</span>` : ""}
            <span style="font-size:9px;color:#BDD6F4;opacity:0.5">⛰️ ${ele}m</span>
          </div>
        </div>`;

        if (!routePopupRef.current) {
          routePopupRef.current = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, className: "route-wx-popup", maxWidth: "none" })
            .setLngLat([coord[0], coord[1]])
            .setHTML(html)
            .addTo(map);
        } else {
          routePopupRef.current.setLngLat([coord[0], coord[1]]).setHTML(html);
        }
      };

      const onLeave = () => {
        if (routePopupRef.current) { routePopupRef.current.remove(); routePopupRef.current = null; }
      };

      map.on("mousemove", onMove);
      map.on("mouseleave", onLeave);

      return () => {
        map.off("mousemove", onMove);
        map.off("mouseleave", onLeave);
        if (routePopupRef.current) { routePopupRef.current.remove(); routePopupRef.current = null; }
      };
    });
  }, [gpxRouteCoords, routeWeather]);

  // Fetch weather timeline when coords are parsed
  useEffect(() => {
    if (!gpxRouteCoords || gpxRouteCoords.length < 2) return;
    setRouteWeatherLoading(true);

    const haversine = ([lng1, lat1], [lng2, lat2]) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLng = (lng2 - lng1) * Math.PI / 180;
      const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    };

    // Build elevation profile (sample every ~50 points)
    const step = Math.max(1, Math.floor(gpxRouteCoords.length / 80));
    const elevPoints = gpxRouteCoords.filter((_, i) => i % step === 0).map(c => c[2] || 0);
    setElevProfile(elevPoints);

    // Calculate total distance and ascent for Naismith's rule
    let totalKm = 0, totalAscentM = 0;
    for (let i = 1; i < gpxRouteCoords.length; i++) {
      totalKm += haversine(gpxRouteCoords[i-1], gpxRouteCoords[i]);
      const dElev = (gpxRouteCoords[i][2] || 0) - (gpxRouteCoords[i-1][2] || 0);
      if (dElev > 0) totalAscentM += dElev;
    }

    // Naismith: 5km/h flat + 10min per 100m ascent
    const flatHours = totalKm / 5;
    const ascentHours = (totalAscentM / 100) * (10/60);
    const totalHours = flatHours + ascentHours;

    // Sample 1 point per hour along route
    const now = new Date();
    const hourlyPoints = [];
    for (let h = 0; h <= Math.ceil(totalHours); h++) {
      const frac = Math.min(h / totalHours, 1);
      const targetDist = frac * totalKm;
      let cumDist = 0, idx = 0;
      for (let i = 1; i < gpxRouteCoords.length; i++) {
        cumDist += haversine(gpxRouteCoords[i-1], gpxRouteCoords[i]);
        if (cumDist >= targetDist) { idx = i; break; }
      }
      const pt = gpxRouteCoords[idx];
      hourlyPoints.push({ hour: h, lat: pt[1], lng: pt[0], ele: Math.round(pt[2] || 0), time: new Date(now.getTime() + h * 3600000) });
    }

    // Fetch Open-Meteo for start point with hourly forecast
    const startLat = gpxRouteCoords[0][1];
    const startLng = gpxRouteCoords[0][0];
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${startLat}&longitude=${startLng}&hourly=temperature_2m,precipitation_probability,windspeed_10m,weathercode&wind_speed_unit=kmh&timezone=Europe%2FLondon&forecast_days=2`;

    fetch(url).then(r => r.json()).then(data => {
      const hours = data.hourly;
      const nowHour = now.getHours();
      const wxMap = {};
      hours.time.forEach((t, i) => { wxMap[t] = { temp: hours.temperature_2m[i], precip: hours.precipitation_probability[i], wind: hours.windspeed_10m[i], code: hours.weathercode[i] }; });

      const timeline = hourlyPoints.map(pt => {
        const tKey = pt.time.toISOString().slice(0, 13) + ":00";
        const wx = wxMap[tKey] || {};
        const icon = wx.code === 0 ? "☀️" : wx.code <= 2 ? "🌤️" : wx.code <= 48 ? "☁️" : wx.code <= 67 ? "🌧️" : "🌨️";
        return { ...pt, temp: wx.temp, precip: wx.precip, wind: wx.wind, icon };
      });

      setRouteWeather({ timeline, totalKm: Math.round(totalKm * 10) / 10, totalHours: Math.round(totalHours * 10) / 10, totalAscent: Math.round(totalAscentM) });
      setRouteWeatherLoading(false);
    }).catch(() => setRouteWeatherLoading(false));
  }, [gpxRouteCoords]);

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
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: "62px", zIndex: 0 }}>
      {/* Real Mapbox Map */}
      <div ref={mapContainer} style={{ position: "absolute", inset: 0 }} />

      {/* Re-centre button — always visible during tracking so user can opt-in to snap to location */}
      {recording && (
        <button
          onClick={() => {
            const lastPt = trackPointsRef.current[trackPointsRef.current.length - 1];
            if (lastPt && mapRef.current) {
              mapRef.current.flyTo({ center: [lastPt.lng, lastPt.lat], duration: 600 });
            }
            userMovedMapRef.current = false;
            setUserMovedMap(false);
          }}
          style={{
            position: "absolute", bottom: "120px", right: "16px", zIndex: 10,
            background: "rgba(4,30,61,0.95)", border: "1px solid rgba(90,152,227,0.3)",
            borderRadius: "12px", padding: "8px 14px", color: "#5A98E3",
            fontSize: "12px", fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", gap: "6px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.3)", fontFamily: "'DM Sans'",
            backdropFilter: "blur(8px)"
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>
          Re-centre
        </button>
      )}

      {/* Top controls — offset by status bar height when viewport-fit=cover is active */}
      <div style={{ position: "absolute", top: "calc(env(safe-area-inset-top, 0px) + 10px)", left: 10, right: 10, display: "flex", gap: "6px", zIndex: 20 }}>
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
      {wo && <div onClick={goHome} style={{ position: "absolute", top: "calc(env(safe-area-inset-top, 0px) + 56px)", left: "50%", transform: "translateX(-50%)", background: "rgba(232,93,58,.92)", backdropFilter: "blur(8px)", borderRadius: "20px", padding: "7px 18px", zIndex: 20, display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", animation: "fi .4s ease", border: "1px solid rgba(248,248,248,.15)" }}><span style={{ fontSize: "12px", color: "#F8F8F8", fontWeight: 600 }}>Unsure where to go?</span><ArrowRight size={14} color="#F8F8F8" /></div>}

      {/* GPX route banner — shown when a route is active or loading */}
      {(gpxRoute || mapGpxLoading) && (
        <div style={{ position: "absolute", top: "calc(env(safe-area-inset-top, 0px) + 56px)", left: 10, right: 10, zIndex: 22,
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

      {/* ── ROUTE WEATHER TIMELINE ── */}
      {gpxRoute && !gpxRouteActive && routeWeatherLoading && (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 24, background: "rgba(4,30,61,0.97)", backdropFilter: "blur(16px)", borderRadius: "16px 16px 0 0", border: "1px solid rgba(90,152,227,0.15)", borderBottom: "none", padding: "14px 16px", textAlign: "center" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#5A98E3", margin: "0 auto 8px", animation: "pulse 1s ease infinite" }} />
          <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.5 }}>Calculating route forecast…</div>
        </div>
      )}
      {gpxRoute && !gpxRouteActive && routeWeather && (
        <RouteWeatherPanel routeWeather={routeWeather} elevProfile={elevProfile} onElevHover={(hourIdx, frac) => {
          if (!gpxRouteCoords || !routeWeather) return;
          setElevHoverActive(true);
          // Find the coordinate at this fraction along the route
          const targetIdx = Math.round(frac * (gpxRouteCoords.length - 1));
          const coord = gpxRouteCoords[Math.min(targetIdx, gpxRouteCoords.length - 1)];
          const wx = routeWeather.timeline[hourIdx] || {};
          const ele = Math.round(coord[2] || 0);
          const label = hourIdx === 0 ? "At start" : `~${hourIdx}h in`;
          const precip = wx.precip !== undefined ? wx.precip : null;
          const precipColor = precip > 50 ? "#E85D3A" : "#BDD6F4";
          const html = `<div style="background:rgba(4,30,61,0.97);border:1px solid rgba(244,157,55,0.4);border-radius:12px;padding:10px 13px;font-family:'DM Sans',sans-serif;min-width:110px;box-shadow:0 4px 20px rgba(0,0,0,0.5)">
            <div style="font-size:9px;color:#F49D37;opacity:0.8;margin-bottom:5px">📍 ${label}</div>
            <div style="display:flex;align-items:center;gap:7px;margin-bottom:5px">
              <span style="font-size:22px">${wx.icon || "🌤️"}</span>
              <div>
                <div style="font-size:15px;font-weight:800;color:#F8F8F8">${wx.temp !== undefined ? Math.round(wx.temp) + "°C" : "—"}</div>
                <div style="font-size:9px;color:#5A98E3">${wx.wind !== undefined ? Math.round(wx.wind) + "mph wind" : ""}</div>
              </div>
            </div>
            <div style="display:flex;gap:8px">
              ${precip !== null ? `<span style="font-size:9px;color:${precipColor};opacity:0.8">🌧 ${precip}%</span>` : ""}
              <span style="font-size:9px;color:#BDD6F4;opacity:0.5">⛰️ ${ele}m</span>
            </div>
            <div style="font-size:8px;color:#F49D37;opacity:0.4;margin-top:4px;cursor:pointer;text-align:right" onclick="this.closest('.mapboxgl-popup').remove()">✕ close</div>
          </div>`;
          import("mapbox-gl").then(mod => {
            const mapboxgl = mod.default;
            if (!routeElevPopupRef.current) {
              routeElevPopupRef.current = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, className: "route-wx-popup", maxWidth: "none" })
                .setLngLat([coord[0], coord[1]])
                .setHTML(html)
                .addTo(mapRef.current);
            } else {
              routeElevPopupRef.current.setLngLat([coord[0], coord[1]]).setHTML(html);
            }
          });
        }} onElevLeave={() => {
          if (routeElevPopupRef.current) { routeElevPopupRef.current.remove(); routeElevPopupRef.current = null; }
          setElevHoverActive(false);
        }} />
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

                {/* Summit toast — flashes when a peak is auto-detected */}
                {summitToast && (
                  <div style={{ padding: "10px 14px", borderRadius: "10px", background: "linear-gradient(135deg,rgba(107,203,119,0.18),rgba(90,152,227,0.1))", border: "1px solid rgba(107,203,119,0.35)", marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px", animation: "su .3s ease" }}>
                    <div style={{ fontSize: "22px", flexShrink: 0 }}>⛰️</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "12px", fontWeight: 800, color: "#6BCB77" }}>Summit Reached!</div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#F8F8F8", marginTop: "1px" }}>{summitToast.name}</div>
                      <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.6 }}>{summitToast.ht}m · {CLS[summitToast.cls]?.name || summitToast.cls}</div>
                    </div>
                    <button onClick={() => setSummitToast(null)} style={{ background: "none", border: "none", color: "#6BCB77", opacity: 0.5, cursor: "pointer", padding: "2px", flexShrink: 0 }}><X size={14} /></button>
                  </div>
                )}

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

                {/* Route preview map */}
                {trackPointsRef.current.length > 2 && (
                  <div style={{ marginBottom: "10px" }}>
                    <label style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.6, fontWeight: 600, display: "block", marginBottom: "6px" }}>Your Route</label>
                    <RoutePreview points={trackPointsRef.current.map(p => [p.lng, p.lat])} />
                  </div>
                )}

                {/* Add photos */}
                <button onClick={() => setActPhotos(p => p + 1)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px dashed rgba(90,152,227,0.25)", background: "transparent", color: "#BDD6F4", fontSize: "11px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontFamily: "'DM Sans'", marginBottom: "14px" }}>
                  <Camera size={14} /> {actPhotos > 0 ? `${actPhotos} photo${actPhotos > 1 ? "s" : ""} added — tap to add more` : "Add Photos"}
                </button>

                {/* Save buttons */}
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => { resetTracking(); setTrackMode(false); }} style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "1px solid rgba(90,152,227,0.15)", background: "transparent", color: "#BDD6F4", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'" }}>Discard</button>
                  <button onClick={() => { if (onSaveWalk) onSaveWalk({ name: actName || "Untitled Walk", desc: actDesc, dist: realDistDisplay, elev: realElevDisplay, time: fmtTime(elapsed), movingTime: fmtTime(movingTimeRef.current), avgSpeed: (realDist > 0 && elapsed > 0 ? (realDist / (elapsed / 3600)).toFixed(1) : "0.0"), peaks: detectedPeaks.map(p => p.name), photos: actPhotos, date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }), route: trackPointsRef.current.map(p => [p.lng, p.lat]) }); setSaved(true); }} style={{ flex: 2, padding: "11px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#E85D3A,#d04a2a)", color: "#F8F8F8", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'" }}>Save & Publish</button>
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
  const [readingArticle, setReadingArticle] = useState(null);

  const filteredArticles = DISCOVER.filter(a => !discCat || a.cat === discCat);
  const categories = [...new Set(DISCOVER.map(a => a.cat))];

  return (
    <>
    <div style={{ padding: "0 16px 16px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column" }}>
      {/* Header with sub-tabs */}
      <div style={{ padding: "24px 0 12px", display: "flex", alignItems: "baseline", gap: "16px" }}>
        <div onClick={() => setSubTab("learn")} style={{ fontSize: "24px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'Playfair Display',serif", cursor: "pointer", opacity: subTab === "learn" ? 1 : 0.45, transition: "opacity .2s" }}>Learn</div>
        <div onClick={() => setSubTab("discover")} style={{ fontSize: "24px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'Playfair Display',serif", cursor: "pointer", opacity: subTab === "discover" ? 1 : 0.45, transition: "opacity .2s", display: "flex", alignItems: "center", gap: "8px" }}>
          Discover
          <Sparkles size={16} color={subTab === "discover" ? "#E85D3A" : "#BDD6F4"} style={{ opacity: subTab === "discover" ? 1 : 0.45 }} />
        </div>
      </div>

      {/* ═══ LEARN SUB-TAB ═══ */}
      {subTab === "learn" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
            <div style={{ fontSize: "13px", color: "#BDD6F4", opacity: 0.6 }}>Build your skills, stay safe on the hill</div>
            {Object.values(courseProgress).some(v => v > 0) && (
              <button onClick={() => onCourseProgress && MODULES.forEach(m => onCourseProgress(m.id, 0))} style={{ background: "none", border: "1px solid rgba(232,93,58,0.25)", borderRadius: "8px", padding: "4px 10px", color: "#E85D3A", fontSize: "10px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'", opacity: 0.7 }}>Reset</button>
            )}
          </div>
          <div style={{ padding: "14px", marginBottom: "16px", borderRadius: "14px", background: "linear-gradient(135deg,rgba(90,152,227,0.12),rgba(107,203,119,0.06))", border: "1px solid rgba(90,152,227,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {(() => {
                const started = MODULES.filter(m => (courseProgress[m.id] ?? 0) > 0).length;
                const completed = MODULES.filter(m => (courseProgress[m.id] ?? 0) >= m.les).length;
                const totalLessons = MODULES.reduce((a, m) => a + m.les, 0);
                const doneLessons = MODULES.reduce((a, m) => a + Math.min(courseProgress[m.id] ?? 0, m.les), 0);
                const pctAll = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0;
                return (<>
                  <div><div style={{ fontSize: "13px", fontWeight: 700, color: "#F8F8F8" }}>Your Progress</div><div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.6, marginTop: "2px" }}>{started} of {MODULES.length} started · {completed} completed</div></div>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: "#5A98E3", fontFamily: "'JetBrains Mono'" }}>{pctAll}%</div>
                </>);
              })()}
            </div>
            <div style={{ height: "5px", borderRadius: "5px", background: "#0a2240", marginTop: "10px" }}>{(() => {
              const totalLessons = MODULES.reduce((a, m) => a + m.les, 0);
              const doneLessons = MODULES.reduce((a, m) => a + Math.min(courseProgress[m.id] ?? 0, m.les), 0);
              const pctAll = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0;
              return <div style={{ width: `${pctAll}%`, height: "100%", borderRadius: "5px", background: "linear-gradient(90deg,#5A98E3,#6BCB77)" }} />;
            })()}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {MODULES.map((m, i) => { const doneLessons = courseProgress[m.id] ?? 0; const pct = Math.round((doneLessons / m.les) * 100); return (
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
                        <button onClick={(e) => { e.stopPropagation(); setReadingArticle(a); }} style={{ padding: "7px 16px", borderRadius: "8px", border: "none", background: "linear-gradient(135deg,#E85D3A,#d04a2a)", color: "#F8F8F8", fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'" }}>Read Story</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Map view handled by full-screen overlay below */}
        </div>
      )}

      {/* ═══ ARTICLE READER MODAL ═══ */}
      {readingArticle && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(2,12,27,0.97)", display: "flex", flexDirection: "column", overflowY: "auto" }}>
          {/* Header */}
          <div style={{ position: "sticky", top: 0, background: "rgba(4,30,61,0.98)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(90,152,227,0.12)", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px", zIndex: 10 }}>
            <button onClick={() => setReadingArticle(null)} style={{ background: "rgba(90,152,227,0.12)", border: "none", borderRadius: "50%", width: "34px", height: "34px", cursor: "pointer", color: "#BDD6F4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <X size={16} />
            </button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "10px", color: "#5A98E3", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>{readingArticle.cat}</div>
              <div style={{ fontSize: "14px", fontWeight: 800, color: "#F8F8F8", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{readingArticle.title}</div>
            </div>
            <div style={{ fontSize: "28px", flexShrink: 0 }}>{readingArticle.icon}</div>
          </div>

          {/* Hero band */}
          <div style={{ background: "linear-gradient(135deg,rgba(90,152,227,0.12),rgba(232,93,58,0.08))", borderBottom: "1px solid rgba(90,152,227,0.1)", padding: "18px 18px 16px" }}>
            <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.55, marginBottom: "6px" }}>
              {readingArticle.region}{readingArticle.peak ? ` · ${readingArticle.peak}` : ""} · {readingArticle.read}
            </div>
            <div style={{ fontSize: "13px", color: "#BDD6F4", lineHeight: 1.65, fontStyle: "italic", borderLeft: "3px solid #E85D3A", paddingLeft: "12px" }}>
              "{readingArticle.excerpt}"
            </div>
            <div style={{ marginTop: "12px", fontSize: "10px", color: "#BDD6F4", opacity: 0.4 }}>
              By <span style={{ color: "#5A98E3", fontWeight: 700, opacity: 1 }}>{readingArticle.author}</span>
            </div>
          </div>

          {/* Article body */}
          <div style={{ padding: "20px 18px 40px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {(readingArticle.body || []).map((para, i) => (
              <p key={i} style={{ margin: 0, fontSize: "14px", color: "#D6E8FF", lineHeight: 1.75, fontWeight: 400 }}>
                {para}
              </p>
            ))}
          </div>

          {/* Footer */}
          <div style={{ padding: "16px 18px 32px", borderTop: "1px solid rgba(90,152,227,0.1)", display: "flex", justifyContent: "center" }}>
            <button onClick={() => setReadingArticle(null)} style={{ padding: "11px 32px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#5A98E3,#4080cc)", color: "#F8F8F8", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'" }}>
              Close Article
            </button>
          </div>
        </div>
      )}
    </div>

    {/* ═══ FULL-SCREEN DISCOVER MAP OVERLAY ═══ */}
    {subTab === "discover" && discView === "map" && (
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: "62px", zIndex: 50, background: "#041e3d", display: "flex", flexDirection: "column" }}>
        {/* Back button */}
        <button
          onClick={() => { setDiscView("list"); setSelArticle(null); }}
          style={{
            position: "absolute", top: "calc(env(safe-area-inset-top, 0px) + 12px)", left: 12, zIndex: 60,
            background: "rgba(4,30,61,0.92)", backdropFilter: "blur(12px)",
            border: "1px solid rgba(90,152,227,0.25)", borderRadius: "10px",
            padding: "8px 14px", color: "#F8F8F8", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "6px",
            fontSize: "13px", fontWeight: 700, fontFamily: "'DM Sans'",
            boxShadow: "0 2px 12px rgba(0,0,0,0.3)"
          }}
        >
          <ChevronLeft size={16} /> Discover
        </button>
        {/* Full-screen map with story markers */}
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
                  <button onClick={(e) => { e.stopPropagation(); setReadingArticle(selArticle); }} style={{ padding: "8px 18px", borderRadius: "9px", border: "none", background: "linear-gradient(135deg,#E85D3A,#d04a2a)", color: "#F8F8F8", fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'" }}>Read Story</button>
                </div>
              </div>
            </div>
          )}
        </MiniMap>
      </div>
    )}
    </>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   ROUTE PREVIEW — SVG polyline from recorded GPS points
   ═══════════════════════════════════════════════════════════════════ */
const RoutePreview = ({ points, height = 150 }) => {
  if (!points || points.length < 2) return null;
  const lngs = points.map(p => p[0]);
  const lats = points.map(p => p[1]);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  // Add padding around bbox so route isn't clipped to edge
  const lngPad = (maxLng - minLng) * 0.18 || 0.012;
  const latPad = (maxLat - minLat) * 0.18 || 0.012;
  const bMinLng = minLng - lngPad, bMaxLng = maxLng + lngPad;
  const bMinLat = minLat - latPad, bMaxLat = maxLat + latPad;
  const W = 320, H = height;
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const mapUrl = token
    ? `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/static/[${bMinLng.toFixed(5)},${bMinLat.toFixed(5)},${bMaxLng.toFixed(5)},${bMaxLat.toFixed(5)}]/${W}x${H}?access_token=${token}&attribution=false&logo=false`
    : null;
  // Mercator projection to match static map tiles
  const mercY = lat => Math.log(Math.tan((lat * Math.PI / 180) / 2 + Math.PI / 4));
  const mMinY = mercY(bMinLat), mMaxY = mercY(bMaxLat);
  const toX = lng => ((lng - bMinLng) / (bMaxLng - bMinLng)) * W;
  const toY = lat => H - ((mercY(lat) - mMinY) / (mMaxY - mMinY)) * H;
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${toX(p[0]).toFixed(1)} ${toY(p[1]).toFixed(1)}`).join(" ");
  const sx = toX(points[0][0]), sy = toY(points[0][1]);
  const ex = toX(points[points.length - 1][0]), ey = toY(points[points.length - 1][1]);
  return (
    <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(90,152,227,0.15)", position: "relative" }}>
      {mapUrl
        ? <img src={mapUrl} alt="" style={{ width: "100%", height: `${H}px`, display: "block", objectFit: "cover" }} />
        : <div style={{ width: "100%", height: `${H}px`, background: "#0a2240" }} />}
      <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5A98E3" /><stop offset="100%" stopColor="#6BCB77" />
          </linearGradient>
          <filter id="rShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="rgba(0,0,0,0.6)" />
          </filter>
        </defs>
        <path d={d} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" filter="url(#rShadow)" />
        <path d={d} fill="none" stroke="url(#rg)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={sx} cy={sy} r="5" fill="#6BCB77" stroke="#fff" strokeWidth="2" />
        <circle cx={ex} cy={ey} r="5" fill="#E85D3A" stroke="#fff" strokeWidth="2" />
      </svg>
      <div style={{ position: "absolute", bottom: "6px", right: "8px", display: "flex", gap: "10px", background: "rgba(4,30,61,0.72)", backdropFilter: "blur(6px)", borderRadius: "6px", padding: "3px 8px" }}>
        {[["#6BCB77","Start"],["#E85D3A","Finish"]].map(([c, l]) => (
          <span key={l} style={{ fontSize: "9px", color: "#F8F8F8", display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: c, display: "inline-block" }} />{l}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   SETTINGS PAGE (full-screen overlay)
   ═══════════════════════════════════════════════════════════════════ */
const SettingsPage = ({ onClose, onSignOut, userName, userId }) => {
  const [page, setPage] = useState(null);
  const [pwCur, setPwCur] = useState(""); const [pwNew, setPwNew] = useState(""); const [pwConf, setPwConf] = useState("");
  const [pwMsg, setPwMsg] = useState(null); const [pwLoading, setPwLoading] = useState(false);
  const [delStep, setDelStep] = useState(0); const [deacStep, setDeacStep] = useState(0);
  const [comments, setComments] = useState([]); const [actLoaded, setActLoaded] = useState(false);
  const [distUnit, setDistUnit] = useState(() => { try { return localStorage.getItem("ts_dist") || "km"; } catch { return "km"; }});
  const [elevUnit, setElevUnit] = useState(() => { try { return localStorage.getItem("ts_elev") || "m"; } catch { return "m"; }});
  const [speedUnit, setSpeedUnit] = useState(() => { try { return localStorage.getItem("ts_speed") || "kmh"; } catch { return "kmh"; }});
  const [privPublic, setPrivPublic] = useState(() => { try { return localStorage.getItem("ts_pub") !== "false"; } catch { return true; }});
  const [liveHikers, setLiveHikers] = useState(() => { try { return localStorage.getItem("ts_live") !== "false"; } catch { return true; }});

  const sp = (key, val) => { try { localStorage.setItem(key, String(val)); } catch {} };
  const goBack = () => { setPage(null); setDelStep(0); setDeacStep(0); setPwMsg(null); };

  const Tog = ({ on, onToggle }) => (
    <div onClick={onToggle} style={{ width: "46px", height: "26px", borderRadius: "13px", background: on ? "#6BCB77" : "rgba(90,152,227,0.15)", cursor: "pointer", position: "relative", transition: "background .2s ease", flexShrink: 0, border: on ? "none" : "1px solid rgba(90,152,227,0.2)" }}>
      <div style={{ position: "absolute", top: "3px", left: on ? "23px" : "2px", width: "20px", height: "20px", borderRadius: "50%", background: "#F8F8F8", transition: "left .2s ease", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
    </div>
  );
  const UnitTog = ({ leftLabel, rightLabel, value, leftVal, rightVal, onChange }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span style={{ fontSize: "11px", fontWeight: value === leftVal ? 700 : 400, color: value === leftVal ? "#F8F8F8" : "#BDD6F4", opacity: value === leftVal ? 1 : 0.45 }}>{leftLabel}</span>
      <div onClick={() => onChange(value === leftVal ? rightVal : leftVal)} style={{ width: "46px", height: "26px", borderRadius: "13px", background: value === rightVal ? "#5A98E3" : "rgba(90,152,227,0.15)", cursor: "pointer", position: "relative", transition: "background .2s", border: "1px solid rgba(90,152,227,0.2)" }}>
        <div style={{ position: "absolute", top: "2px", left: value === rightVal ? "22px" : "2px", width: "20px", height: "20px", borderRadius: "50%", background: "#F8F8F8", transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
      </div>
      <span style={{ fontSize: "11px", fontWeight: value === rightVal ? 700 : 400, color: value === rightVal ? "#F8F8F8" : "#BDD6F4", opacity: value === rightVal ? 1 : 0.45 }}>{rightLabel}</span>
    </div>
  );
  const Row = ({ label, sub, icon, onClick, right, danger, noBorder }) => (
    <div onClick={right ? undefined : onClick} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 0", cursor: (onClick && !right) ? "pointer" : "default", borderBottom: noBorder ? "none" : "1px solid rgba(90,152,227,0.07)" }}>
      {icon && <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: danger ? "rgba(232,93,58,0.1)" : "rgba(90,152,227,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "15px" }}>{icon}</div>}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "13px", fontWeight: 600, color: danger ? "#E85D3A" : "#F8F8F8", fontFamily: "'DM Sans'" }}>{label}</div>
        {sub && <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.5, marginTop: "2px", lineHeight: 1.4 }}>{sub}</div>}
      </div>
      {right || (onClick && !right ? <svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M1 1l5 5-5 5" stroke="#BDD6F4" strokeWidth="1.5" strokeOpacity="0.35" strokeLinecap="round" strokeLinejoin="round"/></svg> : null)}
    </div>
  );
  const Hdr = ({ title }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "6px 0 20px" }}>
      <button onClick={goBack} style={{ background: "rgba(90,152,227,0.1)", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", color: "#BDD6F4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
      </button>
      <div style={{ fontSize: "16px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'DM Sans'" }}>{title}</div>
    </div>
  );
  const Sec = ({ title }) => <div style={{ fontSize: "9px", fontWeight: 700, color: "#5A98E3", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "20px", marginBottom: "4px", opacity: 0.75 }}>{title}</div>;

  useEffect(() => {
    if (page === "activity" && !actLoaded && userId) {
      supabase.from("post_comments").select("text, created_at, posts(text)").eq("user_id", userId).order("created_at", { ascending: false }).limit(30)
        .then(({ data }) => { setComments(data || []); setActLoaded(true); });
    }
  }, [page, actLoaded, userId]);

  const renderPage = () => {
    if (!page) return (
      <>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "20px", paddingTop: "6px" }}>
          <div>
            <div style={{ fontSize: "20px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'DM Sans'" }}>Settings</div>
            <div style={{ fontSize: "12px", color: "#BDD6F4", opacity: 0.45, marginTop: "2px" }}>{userName}</div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(90,152,227,0.1)", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", color: "#BDD6F4", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <Sec title="Profile & Activity" />
        <Row icon="📊" label="Activity" sub="Your comments and interactions" onClick={() => setPage("activity")} />
        <Row icon="🔒" label="Privacy" sub="Account visibility, live hikers" onClick={() => setPage("privacy")} />
        <Row icon="📐" label="Preferences" sub="Units: distance, elevation, speed" onClick={() => setPage("preferences")} />
        <Row icon="📍" label="Location Services" sub="Manage GPS permissions" onClick={() => setPage("location")} />
        <Sec title="Legal & Support" />
        <Row icon="❓" label="FAQ & Help" sub="Common questions and guides" onClick={() => setPage("legal")} />
        <Sec title="Account" />
        <Row icon="🔑" label="Account & Security" sub="Password, deactivate, delete account" onClick={() => setPage("account")} />
        <Row icon="⭐" label="Subscription" sub="Plans and billing" onClick={() => setPage("subscription")} />
        <Row icon="💳" label="Payment" sub="Payment methods" onClick={() => setPage("payment")} />
        <div style={{ marginTop: "24px", paddingBottom: "8px" }}>
          <button onClick={onSignOut} style={{ width: "100%", padding: "13px", borderRadius: "12px", border: "1px solid rgba(232,93,58,0.2)", background: "rgba(232,93,58,0.05)", color: "#E85D3A", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'" }}>Sign Out</button>
        </div>
      </>
    );

    if (page === "account") return (
      <>
        <Hdr title="Account & Security" />
        <Sec title="Change Password" />
        <div style={{ background: "#0a2240", borderRadius: "12px", padding: "14px", marginBottom: "4px" }}>
          <input type="password" placeholder="Current password" value={pwCur} onChange={e => setPwCur(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(90,152,227,0.15)", background: "#041e3d", color: "#F8F8F8", fontSize: "13px", fontFamily: "'DM Sans'", outline: "none", marginBottom: "8px", boxSizing: "border-box" }} />
          <input type="password" placeholder="New password" value={pwNew} onChange={e => setPwNew(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(90,152,227,0.15)", background: "#041e3d", color: "#F8F8F8", fontSize: "13px", fontFamily: "'DM Sans'", outline: "none", marginBottom: "8px", boxSizing: "border-box" }} />
          <input type="password" placeholder="Confirm new password" value={pwConf} onChange={e => setPwConf(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(90,152,227,0.15)", background: "#041e3d", color: "#F8F8F8", fontSize: "13px", fontFamily: "'DM Sans'", outline: "none", marginBottom: "10px", boxSizing: "border-box" }} />
          {pwMsg && <div style={{ fontSize: "11px", color: pwMsg.ok ? "#6BCB77" : "#E85D3A", marginBottom: "8px" }}>{pwMsg.text}</div>}
          <button onClick={async () => {
            if (!pwNew || pwNew !== pwConf) { setPwMsg({ ok: false, text: "Passwords don't match" }); return; }
            if (pwNew.length < 8) { setPwMsg({ ok: false, text: "Must be at least 8 characters" }); return; }
            setPwLoading(true);
            const { error } = await supabase.auth.updateUser({ password: pwNew });
            setPwLoading(false);
            if (error) setPwMsg({ ok: false, text: error.message });
            else { setPwMsg({ ok: true, text: "Password updated successfully!" }); setPwCur(""); setPwNew(""); setPwConf(""); }
          }} disabled={pwLoading} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "none", background: "linear-gradient(135deg,#5A98E3,#264f80)", color: "#F8F8F8", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'", opacity: pwLoading ? 0.6 : 1 }}>
            {pwLoading ? "Updating…" : "Update Password"}
          </button>
        </div>
        <Sec title="Account Status" />
        {deacStep === 0 ? (
          <Row icon="⏸️" label="Deactivate Account" sub="Temporarily hide your profile — reactivate by signing in" onClick={() => setDeacStep(1)} />
        ) : (
          <div style={{ background: "rgba(90,152,227,0.05)", borderRadius: "12px", border: "1px solid rgba(90,152,227,0.15)", padding: "14px", marginBottom: "4px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#F8F8F8", marginBottom: "6px" }}>Deactivate your account?</div>
            <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.6, marginBottom: "12px", lineHeight: 1.55 }}>Your profile will be hidden from the community. Your data is fully preserved. Sign back in at any time to reactivate.</div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => setDeacStep(0)} style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid rgba(90,152,227,0.2)", background: "transparent", color: "#BDD6F4", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans'" }}>Cancel</button>
              <button onClick={async () => { await supabase.auth.updateUser({ data: { deactivated: true } }); onSignOut(); }} style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "none", background: "rgba(90,152,227,0.2)", color: "#5A98E3", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'" }}>Deactivate</button>
            </div>
          </div>
        )}
        {delStep === 0 && <Row icon="🗑️" label="Delete Account" sub="Permanently delete all your data" onClick={() => setDelStep(1)} danger />}
        {delStep === 1 && (
          <div style={{ background: "rgba(232,93,58,0.05)", borderRadius: "12px", border: "1px solid rgba(232,93,58,0.2)", padding: "14px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#E85D3A", marginBottom: "6px" }}>Are you sure?</div>
            <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.6, marginBottom: "12px", lineHeight: 1.55 }}>This permanently deletes your profile, walks, stats and all associated data. This cannot be undone. We process deletion requests within 30 days (UK GDPR).</div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => setDelStep(0)} style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid rgba(90,152,227,0.2)", background: "transparent", color: "#BDD6F4", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans'" }}>Cancel</button>
              <button onClick={() => setDelStep(2)} style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "none", background: "#E85D3A", color: "#F8F8F8", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'" }}>Yes, Delete</button>
            </div>
          </div>
        )}
        {delStep === 2 && (
          <div style={{ background: "rgba(232,93,58,0.05)", borderRadius: "12px", border: "1px solid rgba(232,93,58,0.2)", padding: "14px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#6BCB77", marginBottom: "6px" }}>Request submitted</div>
            <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.6, lineHeight: 1.55, marginBottom: "12px" }}>We'll delete all your data within 30 days and send a confirmation to your email. You'll be signed out now.</div>
            <button onClick={async () => { await supabase.auth.updateUser({ data: { deletion_requested: true, deletion_requested_at: new Date().toISOString() } }); onSignOut(); }} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "none", background: "#E85D3A", color: "#F8F8F8", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'" }}>Sign Out & Submit</button>
          </div>
        )}
      </>
    );

    if (page === "activity") return (
      <>
        <Hdr title="Your Activity" />
        {!actLoaded ? (
          <div style={{ textAlign: "center", padding: "50px 0", color: "#BDD6F4", opacity: 0.4, fontSize: "12px" }}>Loading…</div>
        ) : comments.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px 0" }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>💬</div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#F8F8F8", marginBottom: "4px" }}>No comments yet</div>
            <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.45 }}>Your comments on community posts will appear here</div>
          </div>
        ) : (
          <>
            <Sec title={`Your Comments (${comments.length})`} />
            {comments.map((c, i) => (
              <div key={i} style={{ padding: "11px 0", borderBottom: "1px solid rgba(90,152,227,0.07)" }}>
                <div style={{ fontSize: "12px", color: "#F8F8F8", marginBottom: "4px", lineHeight: 1.4 }}>"{c.text}"</div>
                {c.posts?.text && <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.45, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>On: {c.posts.text}</div>}
                <div style={{ fontSize: "9px", color: "#5A98E3", marginTop: "4px", opacity: 0.6 }}>{new Date(c.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
              </div>
            ))}
          </>
        )}
      </>
    );

    if (page === "privacy") return (
      <>
        <Hdr title="Privacy" />
        <Sec title="Profile Visibility" />
        <Row label="Public Profile" sub="Anyone can view your profile and walks" right={<Tog on={privPublic} onToggle={() => { const v = !privPublic; setPrivPublic(v); sp("ts_pub", v); }} />} />
        <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.45, marginTop: "8px", lineHeight: 1.55, marginBottom: "4px" }}>When private, only people you approve can view your walks and stats. Your name still appears on shared summits.</div>
        <Sec title="Live Hikers Map" />
        <Row label="Appear on Live Map" sub="Show your location to other TrailSync users during walks" right={<Tog on={liveHikers} onToggle={() => { const v = !liveHikers; setLiveHikers(v); sp("ts_live", v); }} />} />
        <div style={{ background: "rgba(90,152,227,0.05)", borderRadius: "10px", padding: "12px", marginTop: "10px", border: "1px solid rgba(90,152,227,0.1)" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#5A98E3", marginBottom: "5px" }}>How Live Hikers works</div>
          <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.6, lineHeight: 1.6 }}>When enabled, your approximate position appears as a dot on the live map during an active walk. Your exact GPS coordinates are never stored — only a rounded position (~100m accuracy). This updates every 30 seconds and stops automatically when you end your walk. Only logged-in TrailSync users can see live hikers.</div>
        </div>
      </>
    );

    if (page === "preferences") return (
      <>
        <Hdr title="Preferences" />
        <Sec title="Measurement Units" />
        <div style={{ background: "#0a2240", borderRadius: "12px", padding: "14px", display: "flex", flexDirection: "column", gap: "0" }}>
          {[
            { label: "Distance", sub: "Walk and route distances", leftLabel: "km", rightLabel: "mi", value: distUnit, leftVal: "km", rightVal: "mi", onChange: v => { setDistUnit(v); sp("ts_dist", v); } },
            { label: "Elevation", sub: "Height gain and altitude", leftLabel: "m", rightLabel: "ft", value: elevUnit, leftVal: "m", rightVal: "ft", onChange: v => { setElevUnit(v); sp("ts_elev", v); } },
            { label: "Speed", sub: "Pace and speed display", leftLabel: "km/h", rightLabel: "mph", value: speedUnit, leftVal: "kmh", rightVal: "mph", onChange: v => { setSpeedUnit(v); sp("ts_speed", v); } },
          ].map((u, idx, arr) => (
            <div key={u.label}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#F8F8F8" }}>{u.label}</div>
                  <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.45, marginTop: "1px" }}>{u.sub}</div>
                </div>
                <UnitTog {...u} />
              </div>
              {idx < arr.length - 1 && <div style={{ height: "1px", background: "rgba(90,152,227,0.07)" }} />}
            </div>
          ))}
        </div>
        <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.4, marginTop: "10px", lineHeight: 1.5 }}>Changes apply immediately across the app. Stored walk data is not modified.</div>
      </>
    );

    if (page === "location") return (
      <>
        <Hdr title="Location Services" />
        <div style={{ background: "#0a2240", borderRadius: "12px", padding: "18px", marginBottom: "14px", textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "10px" }}>📍</div>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#F8F8F8", marginBottom: "6px" }}>GPS Required for Walk Tracking</div>
          <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.55, lineHeight: 1.6 }}>TrailSync uses GPS to track walks, detect summits, and show your position on the map. Location is only active during a recording.</div>
        </div>
        <button onClick={() => {
          if (navigator.permissions) {
            navigator.permissions.query({ name: "geolocation" }).then(r => {
              if (r.state === "denied") alert("Location is blocked. Please enable it in your browser or phone settings — see the guide below.");
              else navigator.geolocation.getCurrentPosition(() => alert("Location is working correctly!"), () => alert("Unable to get location. Check your settings below."));
            });
          } else {
            navigator.geolocation.getCurrentPosition(() => alert("Location is working correctly!"), () => alert("Location unavailable. Check your settings."));
          }
        }} style={{ width: "100%", padding: "13px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#5A98E3,#264f80)", color: "#F8F8F8", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'", marginBottom: "12px" }}>
          Check Location Permission
        </button>
        <div style={{ background: "rgba(90,152,227,0.06)", borderRadius: "10px", padding: "13px", marginBottom: "8px", border: "1px solid rgba(90,152,227,0.1)" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#5A98E3", marginBottom: "6px" }}>📱 Enable on iPhone</div>
          <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.65, lineHeight: 1.65 }}>Settings → Privacy & Security → Location Services → Safari → While Using App<br/>Or: Settings → Safari → Location → Allow</div>
        </div>
        <div style={{ background: "rgba(90,152,227,0.06)", borderRadius: "10px", padding: "13px", border: "1px solid rgba(90,152,227,0.1)" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#5A98E3", marginBottom: "6px" }}>🤖 Enable on Android</div>
          <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.65, lineHeight: 1.65 }}>Settings → Apps → Chrome → Permissions → Location → Allow<br/>Or: tap the lock icon in your browser address bar → Location → Allow</div>
        </div>
      </>
    );

    if (page === "subscription") return (
      <>
        <Hdr title="Subscription" />
        <div style={{ background: "linear-gradient(135deg,rgba(90,152,227,0.08),rgba(107,203,119,0.04))", borderRadius: "14px", border: "1px solid rgba(90,152,227,0.15)", padding: "18px", marginBottom: "16px", textAlign: "center" }}>
          <div style={{ fontSize: "10px", fontWeight: 700, color: "#5A98E3", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Current Plan</div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'DM Sans'" }}>Free</div>
          <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.45, marginTop: "4px" }}>Basic access to TrailSync</div>
        </div>
        <div style={{ background: "#0a2240", borderRadius: "14px", border: "1px solid rgba(107,203,119,0.25)", padding: "16px", marginBottom: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div style={{ fontSize: "15px", fontWeight: 800, color: "#F8F8F8" }}>Premium</div>
            <div><span style={{ fontSize: "16px", fontWeight: 800, color: "#6BCB77" }}>£7.99</span><span style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.5 }}>/month</span></div>
          </div>
          {["Unlimited walk tracking", "Advanced stats & insights", "GPX import & export", "Offline maps", "AI route recommendations", "Fundraiser creation", "Live hiker visibility", "Priority support"].map(f => (
            <div key={f} style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.7, marginBottom: "6px", display: "flex", alignItems: "center", gap: "7px" }}><span style={{ color: "#6BCB77", fontSize: "12px" }}>✓</span>{f}</div>
          ))}
          <button style={{ width: "100%", marginTop: "14px", padding: "11px", borderRadius: "10px", border: "none", background: "rgba(107,203,119,0.12)", color: "#6BCB77", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'" }}>Upgrade to Premium</button>
        </div>
      </>
    );

    if (page === "payment") return (
      <>
        <Hdr title="Payment" />
        <div style={{ background: "#0a2240", borderRadius: "14px", border: "1px solid rgba(90,152,227,0.1)", padding: "20px", marginBottom: "14px", textAlign: "center" }}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>💳</div>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#F8F8F8", marginBottom: "6px" }}>No payment method on file</div>
          <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.45, lineHeight: 1.5 }}>Payment details are added when you subscribe to Premium.</div>
        </div>
        <div style={{ background: "rgba(90,152,227,0.06)", borderRadius: "12px", padding: "16px", border: "1px solid rgba(90,152,227,0.1)" }}>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#F8F8F8", marginBottom: "8px" }}>🍎 Subscribed via Apple Pay?</div>
          <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.6, lineHeight: 1.6, marginBottom: "12px" }}>Apple Pay subscriptions are billed and managed directly by Apple. We can't modify or cancel them from within the app — you'll need to manage this in your iPhone Settings.</div>
          <button onClick={() => { try { window.location.href = "itms-apps://settings"; } catch { alert("Go to: iPhone Settings → [Your Name] → Subscriptions → TrailSync"); }}} style={{ width: "100%", padding: "11px", borderRadius: "9px", border: "none", background: "rgba(90,152,227,0.12)", color: "#5A98E3", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'" }}>
            Open iPhone Settings
          </button>
        </div>
      </>
    );

    if (page === "legal") return (
      <>
        <Hdr title="Legal & Help" />
        <Sec title="Support" />
        <Row icon="❓" label="Frequently Asked Questions" sub="How TrailSync works" onClick={() => setPage("legal-faq")} />
        <Row icon="✉️" label="Contact Us" sub="privacy@trailsync.app" onClick={() => { window.location.href = "mailto:privacy@trailsync.app"; }} />
        <Sec title="Legal" />
        <Row icon="🔒" label="Privacy Policy" sub="How we collect, use and protect your data" onClick={() => setPage("legal-privacy")} />
        <Row icon="📋" label="Terms of Service" sub="Rules and conditions of use" onClick={() => setPage("legal-terms")} />
        <Row icon="🇪🇺" label="GDPR & Your Rights" sub="Your rights under UK GDPR" onClick={() => setPage("legal-gdpr")} />
      </>
    );

    if (page === "legal-faq") return (
      <>
        <Hdr title="FAQ" />
        {[
          { q: "How does walk tracking work?", a: "Tap Record on the map tab, then start your walk. TrailSync uses your phone's GPS to trace your route, measure distance and elevation, and detect any summits you pass. Tap Stop when you're done to save." },
          { q: "What is the Live Hikers map?", a: "Live Hikers shows other TrailSync users who are currently out walking. Your approximate location (rounded to ~100m) is shared during active walks. You can turn this off in Settings → Privacy at any time." },
          { q: "How do I bag a summit?", a: "Walk within range of a summit while recording — TrailSync detects it automatically. You can also manually log a peak by tapping it on the Mountains map in your Profile." },
          { q: "Is my data safe?", a: "Yes. Your data is stored securely on Supabase (EU servers). We never sell your data to third parties. See our Privacy Policy for full details." },
          { q: "How do I delete my account?", a: "Go to Settings → Account & Security → Delete Account. We'll process your request within 30 days in line with UK GDPR." },
          { q: "Can I use TrailSync offline?", a: "Basic features work offline, but mapping and community features require an internet connection. Offline maps are available on the Premium plan." },
        ].map((item, i) => (
          <div key={i} style={{ marginBottom: "14px", background: "#0a2240", borderRadius: "12px", padding: "14px", border: "1px solid rgba(90,152,227,0.08)" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#F8F8F8", marginBottom: "7px" }}>{item.q}</div>
            <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.65, lineHeight: 1.6 }}>{item.a}</div>
          </div>
        ))}
      </>
    );

    if (page === "legal-privacy") return (
      <>
        <Hdr title="Privacy Policy" />
        <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.4, marginBottom: "16px" }}>Last updated: April 2026</div>
        {[
          { title: "What we collect", body: "We collect the information you provide when creating an account (name, email), your walk activity (routes, distance, elevation, peaks), and posts you make to the community feed. We also collect anonymised usage data to improve the app." },
          { title: "How we use it", body: "Your data is used to provide the TrailSync service — tracking your walks, displaying your stats, and powering community features. We do not sell your data to third parties or use it for advertising." },
          { title: "Data storage", body: "Your data is stored securely with Supabase on EU-based servers. Walk data and posts are retained while your account is active. You can request deletion at any time." },
          { title: "Live location", body: "If Live Hikers is enabled, your approximate location (rounded to ~100m) is shared with other users during active walks. Exact GPS coordinates are never stored. This feature can be disabled at any time in Privacy settings." },
          { title: "Your rights", body: "Under UK GDPR you have the right to access, correct, export, or delete your personal data. Email privacy@trailsync.app or use the Delete Account option in Settings to exercise these rights." },
          { title: "Cookies", body: "We use essential cookies only — for authentication and session management. We do not use tracking or advertising cookies." },
          { title: "Contact", body: "For privacy-related queries contact privacy@trailsync.app. We aim to respond within 5 working days." },
        ].map((s, i) => (
          <div key={i} style={{ marginBottom: "14px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#5A98E3", marginBottom: "5px" }}>{s.title}</div>
            <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.65, lineHeight: 1.65 }}>{s.body}</div>
          </div>
        ))}
      </>
    );

    if (page === "legal-gdpr") return (
      <>
        <Hdr title="GDPR & Your Rights" />
        <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.55, lineHeight: 1.6, marginBottom: "16px" }}>Under UK GDPR you have the following rights regarding your personal data:</div>
        {[
          { right: "Right of Access", desc: "Request a copy of all personal data we hold about you." },
          { right: "Right to Rectification", desc: "Ask us to correct inaccurate or incomplete data." },
          { right: "Right to Erasure", desc: "Request deletion of your data ('right to be forgotten'). We process deletion requests within 30 days." },
          { right: "Right to Restriction", desc: "Ask us to limit how we process your data in certain circumstances." },
          { right: "Right to Portability", desc: "Receive your data in a structured, machine-readable format." },
          { right: "Right to Object", desc: "Object to certain types of processing, including direct marketing." },
        ].map((r, i) => (
          <div key={i} style={{ padding: "12px 0", borderBottom: "1px solid rgba(90,152,227,0.07)" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#F8F8F8", marginBottom: "4px" }}>{r.right}</div>
            <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.6, lineHeight: 1.5 }}>{r.desc}</div>
          </div>
        ))}
        <div style={{ background: "rgba(90,152,227,0.06)", borderRadius: "10px", padding: "13px", marginTop: "16px", border: "1px solid rgba(90,152,227,0.1)" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#5A98E3", marginBottom: "5px" }}>Exercise your rights</div>
          <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.6, lineHeight: 1.55 }}>Email privacy@trailsync.app or use Settings → Account & Security → Delete Account. We aim to respond within 30 days.</div>
        </div>
      </>
    );

    if (page === "legal-terms") return (
      <>
        <Hdr title="Terms of Service" />
        <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.4, marginBottom: "16px" }}>Last updated: April 2026</div>
        {[
          { title: "Acceptance", body: "By using TrailSync you agree to these terms. If you don't agree, please don't use the app." },
          { title: "Your account", body: "You're responsible for keeping your login credentials secure. Don't share your account or use it for anything illegal or harmful." },
          { title: "Community standards", body: "Keep posts respectful and relevant to outdoor activities. We reserve the right to remove content or suspend accounts that violate community guidelines." },
          { title: "Safety disclaimer", body: "TrailSync is a tool to assist your walks — not a substitute for proper navigation skills, equipment, or judgment. Always check conditions before heading out. You're responsible for your own safety." },
          { title: "Intellectual property", body: "TrailSync and its content are owned by us. You retain ownership of the content you post but grant us a licence to display it within the app." },
          { title: "Changes", body: "We may update these terms and will notify you of significant changes. Continued use after changes means acceptance." },
        ].map((s, i) => (
          <div key={i} style={{ marginBottom: "14px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#5A98E3", marginBottom: "5px" }}>{s.title}</div>
            <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.65, lineHeight: 1.65 }}>{s.body}</div>
          </div>
        ))}
      </>
    );

    return null;
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#041e3d", overflowY: "auto", animation: "su .22s ease" }}>
      <div style={{ maxWidth: "430px", margin: "0 auto", padding: `max(env(safe-area-inset-top,16px),16px) 16px max(env(safe-area-inset-bottom,16px),24px)` }}>
        {renderPage()}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   TAB 5: PROFILE
   ═══════════════════════════════════════════════════════════════════ */
const ProfilePage = ({ initialSec, onSecChange, goMap, goHome, goRoutes, openRoute, onSignOut, savedWalks, setSavedWalks, dbPeaks, userName, userLocation, setUserLocation, followerCount, followingCount, followingIds, setFollowingIds, setFollowerCount, setFollowingCount, userId, onViewProfile, onPublishPost }) => {
  const [showSettings, setShowSettings] = useState(false);
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
  // My social posts (loaded from posts table)
  const [myDbPosts, setMyDbPosts] = useState([]);

  useEffect(() => {
    if (!userId) return;
    supabase.from("posts").select("*").eq("user_id", userId)
      .order("created_at", { ascending: false }).limit(30)
      .then(({ data }) => { if (data) setMyDbPosts(data); });
  }, [userId]);

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
  const [lbScope, setLbScope] = useState("global"); // "global" | "friends"
  const [lbData, setLbData] = useState([]);
  const [lbLoading, setLbLoading] = useState(false);

  // Fetch leaderboard data from user_walks whenever time/scope changes
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    async function fetchLeaderboard() {
      setLbLoading(true);
      try {
        // Date cutoff based on time filter
        const now = new Date();
        let since = null;
        if (lbTime === "daily") { since = new Date(now); since.setHours(0,0,0,0); }
        else if (lbTime === "weekly") { since = new Date(now); since.setDate(now.getDate() - 7); }
        else if (lbTime === "monthly") { since = new Date(now); since.setMonth(now.getMonth() - 1); }
        else if (lbTime === "6month") { since = new Date(now); since.setMonth(now.getMonth() - 6); }
        else if (lbTime === "yearly") { since = new Date(now); since.setFullYear(now.getFullYear() - 1); }

        // Build query — get all walks in time window
        let q = supabase.from("user_walks").select("user_id, distance_km, elevation_m, duration");
        if (since) q = q.gte("date_walked", since.toISOString().split("T")[0]);

        // Friends scope: only walks from users I follow + myself
        if (lbScope === "friends") {
          const { data: follows } = await supabase.from("follows").select("following_id").eq("follower_id", userId);
          const friendIds = [userId, ...(follows || []).map(f => f.following_id)];
          q = q.in("user_id", friendIds);
        }

        const { data: walks, error } = await q;
        if (error || !walks || cancelled) { setLbLoading(false); return; }

        // Aggregate per user
        const byUser = {};
        for (const w of walks) {
          if (!byUser[w.user_id]) byUser[w.user_id] = { user_id: w.user_id, d: 0, e: 0 };
          byUser[w.user_id].d += parseFloat(w.distance_km) || 0;
          byUser[w.user_id].e += parseInt(w.elevation_m) || 0;
        }

        // Fetch display names for these user ids
        const userIds = Object.keys(byUser);
        if (userIds.length === 0) { setLbData([]); setLbLoading(false); return; }
        const { data: profiles } = await supabase.from("profiles").select("id, username, name").in("id", userIds);
        const profileMap = {};
        for (const p of profiles || []) profileMap[p.id] = p.username || p.name || "Hiker";

        const rows = userIds.map(uid => ({
          uid,
          n: profileMap[uid] || "Hiker",
          d: Math.round(byUser[uid].d * 10) / 10,
          e: Math.round(byUser[uid].e),
          pts: Math.round(byUser[uid].d * 2 + byUser[uid].e / 100),
          isMe: uid === userId,
        }));

        if (!cancelled) setLbData(rows);
      } catch(e) { console.error("Leaderboard fetch error:", e); }
      if (!cancelled) setLbLoading(false);
    }
    fetchLeaderboard();
    return () => { cancelled = true; };
  }, [lbTime, lbScope, userId]);
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
  const [frOrg, setFrOrg] = useState("");
  const [frDesc, setFrDesc] = useState("");
  const [frLink, setFrLink] = useState("");

  // ── STATS section state ──
  const [statView, setStatView] = useState("weekly");
  const [statMetric, setStatMetric] = useState("elevation");
  const [statOffset, setStatOffset] = useState(0);
  const [statCompareOffset, setStatCompareOffset] = useState(null); // null = off, number = comparison period offset
  const [statSelectedBar, setStatSelectedBar] = useState(null); // { label, value, cmpValue }
  const [showAllBadges, setShowAllBadges] = useState(false);

  const ST_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const ST_MONTHS_FULL = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const ST_MONTH_MAP = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 };
  const ST_DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  const stParseDate = (s) => {
    if (!s) return null;
    const p = s.split(" ");
    if (p.length < 3) return null;
    const m = ST_MONTH_MAP[p[1]];
    if (m === undefined) return null;
    return new Date(parseInt(p[2]), m, parseInt(p[0]));
  };

  const stParseTimeMins = (t) => {
    if (!t) return 0;
    const p = t.split(":").map(Number);
    if (p.length === 3) return p[0] * 60 + p[1] + p[2] / 60;
    if (p.length === 2) return p[0] * 60 + p[1];
    return 0;
  };

  const stGetVal = (w, metric) => {
    if (metric === "elevation") return parseFloat(w.elev) || 0;
    if (metric === "distance") return parseFloat(w.dist) || 0;
    if (metric === "time") return stParseTimeMins(w.movingTime || w.time);
    return 1;
  };

  const stFmtVal = (v, metric) => {
    if (metric === "elevation") return v >= 1000 ? `${(v / 1000).toFixed(1)}km` : `${Math.round(v)}m`;
    if (metric === "distance") return `${v.toFixed(1)}km`;
    if (metric === "time") { const h = Math.floor(v / 60); const mn = Math.round(v % 60); return h > 0 ? `${h}h ${mn}m` : `${mn}m`; }
    return String(Math.round(v));
  };

  const stWeekStart = (offset) => {
    const now = new Date(); const day = now.getDay();
    const d = new Date(now);
    d.setDate(now.getDate() - (day === 0 ? 6 : day - 1) + offset * 7);
    d.setHours(0, 0, 0, 0); return d;
  };

  const stMonthStart = (offset) => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + offset, 1);
  };

  const stYearStart = (offset) => new Date(new Date().getFullYear() + offset, 0, 1);

  const stBuildBars = (view, offset, metric, walks) => {
    if (view === "weekly") {
      const ws = stWeekStart(offset);
      return ST_DAYS.map((lbl, i) => {
        const d = new Date(ws); d.setDate(ws.getDate() + i); d.setHours(0, 0, 0, 0);
        const de = new Date(d); de.setHours(23, 59, 59, 999);
        const total = (walks || []).reduce((acc, w) => { const wd = stParseDate(w.date); return (wd && wd >= d && wd <= de) ? acc + stGetVal(w, metric) : acc; }, 0);
        return { label: lbl, value: total, date: new Date(d) };
      });
    }
    if (view === "monthly") {
      const ms = stMonthStart(offset);
      const days = new Date(ms.getFullYear(), ms.getMonth() + 1, 0).getDate();
      return Array.from({ length: days }, (_, i) => {
        const d = new Date(ms.getFullYear(), ms.getMonth(), i + 1);
        const de = new Date(d); de.setHours(23, 59, 59, 999);
        const total = (walks || []).reduce((acc, w) => { const wd = stParseDate(w.date); return (wd && wd >= d && wd <= de) ? acc + stGetVal(w, metric) : acc; }, 0);
        return { label: String(i + 1), value: total, date: d };
      });
    }
    const ys = stYearStart(offset);
    return ST_MONTHS.map((m, i) => {
      const d = new Date(ys.getFullYear(), i, 1);
      const de = new Date(ys.getFullYear(), i + 1, 0, 23, 59, 59);
      const total = (walks || []).reduce((acc, w) => { const wd = stParseDate(w.date); return (wd && wd >= d && wd <= de) ? acc + stGetVal(w, metric) : acc; }, 0);
      return { label: m, value: total, date: d };
    });
  };

  const stPeriodTitle = (view, offset) => {
    if (view === "weekly") {
      const ws = stWeekStart(offset); const we = new Date(ws); we.setDate(ws.getDate() + 6);
      return `${ws.getDate()} ${ST_MONTHS[ws.getMonth()]} – ${we.getDate()} ${ST_MONTHS[we.getMonth()]}`;
    }
    if (view === "monthly") { const ms = stMonthStart(offset); return `${ST_MONTHS_FULL[ms.getMonth()]} ${ms.getFullYear()}`; }
    return String(stYearStart(offset).getFullYear());
  };

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
      {showSettings && <SettingsPage onClose={() => setShowSettings(false)} onSignOut={onSignOut} userName={userName} userId={userId} />}
    <div style={{ padding: "0 16px 16px", overflowY: "auto", flex: 1, WebkitOverflowScrolling: "touch" }}>

      {/* ═══ FOLLOWERS / FOLLOWING — FULL PAGE ═══ */}
      {showFollowers && (
        <div style={{ position: "fixed", inset: 0, zIndex: 60, background: "#041e3d", display: "flex", flexDirection: "column", animation: "fi .2s ease" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "calc(14px + env(safe-area-inset-top, 0px)) 16px 14px", borderBottom: "1px solid rgba(90,152,227,0.1)", background: "rgba(4,30,61,0.95)", backdropFilter: "blur(12px)" }}>
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
              <button onClick={() => setShowSettings(true)} style={{ padding: "7px", borderRadius: "8px", background: "#0a2240", border: "1px solid rgba(90,152,227,0.12)", cursor: "pointer", color: "#BDD6F4" }}><Settings size={16} /></button>
            </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "16px" }}>
        {[[ME.walks, "Walks", "#E85D3A"], [`${ME.dist}km`, "Distance", "#5A98E3"], [`${(ME.elev / 1000).toFixed(1)}km`, "Elevation", "#6BCB77"]].map(([v, l, c]) => <div key={l} style={{ background: "#0a2240", borderRadius: "10px", padding: "10px 6px", textAlign: "center", border: "1px solid rgba(90,152,227,0.1)" }}><div style={{ fontSize: "17px", fontWeight: 800, color: c, fontFamily: "'JetBrains Mono'" }}>{v}</div><div style={{ fontSize: "9px", color: "#BDD6F4", opacity: 0.5, marginTop: "2px" }}>{l}</div></div>)}
      </div>

      <div style={{ display: "flex", gap: "3px", marginBottom: "14px", background: "#0a2240", borderRadius: "12px", padding: "3px", overflowX: "auto" }}>
        {[["mountains", "Mountains"], ["posts", "Posts"], ["stats", "Stats"], ["leaderboard", "Leaderboard"]].map(([k, l]) => <button key={k} onClick={() => handleSecChange(k)} style={{ flex: 1, padding: "8px", borderRadius: "10px", border: "none", background: sec === k ? "rgba(90,152,227,0.2)" : "transparent", color: sec === k ? "#5A98E3" : "#BDD6F4", fontSize: "10px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'", opacity: sec === k ? 1 : 0.5, whiteSpace: "nowrap" }}>{l}</button>)}
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
                <MiniMap key={mtExpanded ? "expanded" : "compact"} height={mtExpanded ? "100%" : "340px"} showGPS={true} onMapReady={map => { mtMapRef.current = map; }} markers={filteredPeaks.filter(pk => pk.lat && pk.lng).slice(0, 400).map(pk => ({ lat: pk.lat, lng: pk.lng, color: pk.done ? "#1a7a2e" : "#E85D3A", data: pk, style: `width:14px;height:14px;border-radius:50%;background:${pk.done ? "#1a7a2e" : "#E85D3A"};border:2px solid rgba(255,255,255,0.5);cursor:pointer;box-shadow:0 0 6px ${pk.done ? "rgba(26,122,46,0.5)" : "rgba(232,93,58,0.4)"};` }))} onMarkerClick={(m) => { setSelPeak(m.data); setLogging(false); if (mtActiveGpxId) { removeGpxFromMap(mtMapRef.current, mtActiveGpxId); setMtActiveGpxId(null); } }}>
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

      {sec === "stats" && (() => {
        const statBars = stBuildBars(statView, statOffset, statMetric, savedWalks);
        const statCompareBars = statCompareOffset !== null ? stBuildBars(statView, statCompareOffset, statMetric, savedWalks) : null;
        const statMax = Math.max(1, ...statBars.map(b => b.value), ...(statCompareBars || []).map(b => b.value));
        const statTotal = statBars.reduce((a, b) => a + b.value, 0);
        const statCompareTotal = statCompareBars ? statCompareBars.reduce((a, b) => a + b.value, 0) : 0;
        const CHART_H = 180;
        const MAIN_COL = "#5A98E3";
        const CMP_COL = "#E85D3A";
        const now = new Date();
        return (
          <div>
            {/* View toggle */}
            <div style={{ display: "flex", gap: "4px", marginBottom: "12px" }}>
              {[["weekly","Weekly"],["monthly","Monthly"],["yearly","Yearly"]].map(([k,l]) => (
                <button key={k} onClick={() => { setStatView(k); setStatOffset(0); setStatCompareOffset(null); setStatSelectedBar(null); }} style={{ flex: 1, padding: "7px", borderRadius: "10px", border: "none", background: statView === k ? "rgba(90,152,227,0.15)" : "#0a2240", color: statView === k ? "#5A98E3" : "#BDD6F4", fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'", opacity: statView === k ? 1 : 0.5 }}>{l}</button>
              ))}
            </div>

            {/* Compact metric dropdown */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <span style={{ fontSize: "13px", color: "#F8F8F8", fontWeight: 700, whiteSpace: "nowrap" }}>Showing</span>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", paddingLeft: "10px", paddingRight: "26px", pointerEvents: "none", borderRadius: "8px", border: "1px solid rgba(90,152,227,0.25)", background: "rgba(90,152,227,0.08)", gap: "6px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, fontFamily: "'DM Sans'", color: "#F8F8F8", whiteSpace: "nowrap" }}>
                    {{"elevation":"Elevation Gain","distance":"Distance","time":"Time Spent","walks":"Activities"}[statMetric]}
                  </span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#F8F8F8" strokeWidth="2.5" style={{ flexShrink: 0, marginLeft: "auto" }}><path d="m6 9 6 6 6-6"/></svg>
                </div>
                <select value={statMetric} onChange={e => setStatMetric(e.target.value)} style={{ padding: "6px 26px 6px 10px", borderRadius: "8px", border: "1px solid transparent", background: "transparent", color: "transparent", fontSize: "13px", fontFamily: "'DM Sans'", outline: "none", cursor: "pointer", opacity: 0, position: "relative", zIndex: 1 }}>
                  <option value="elevation">Elevation Gain</option>
                  <option value="distance">Distance</option>
                  <option value="time">Time Spent</option>
                  <option value="walks">Activities</option>
                </select>
              </div>
            </div>

            {/* Period navigation */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <button onClick={() => { setStatOffset(o => o - 1); setStatSelectedBar(null); }} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid rgba(90,152,227,0.15)", background: "#0a2240", color: "#BDD6F4", cursor: "pointer", fontSize: "20px", lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>‹</button>
              <div style={{ textAlign: "center", flex: 1, padding: "0 8px" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#F8F8F8" }}>{stPeriodTitle(statView, statOffset)}</div>
                {statOffset !== 0 && <div style={{ fontSize: "9px", color: "#BDD6F4", opacity: 0.4, marginTop: "2px" }}>tap › for current</div>}
              </div>
              <button onClick={() => { setStatOffset(o => Math.min(0, o + 1)); setStatSelectedBar(null); }} disabled={statOffset >= 0} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid rgba(90,152,227,0.15)", background: "#0a2240", color: statOffset >= 0 ? "#264f80" : "#BDD6F4", cursor: statOffset >= 0 ? "default" : "pointer", fontSize: "20px", lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>›</button>
            </div>

            {/* Bar chart */}
            <div style={{ background: "#0a2240", borderRadius: "14px", border: "1px solid rgba(90,152,227,0.1)", padding: "14px 10px 24px", marginBottom: "12px", position: "relative" }}>
              {/* Horizontal grid lines */}
              <div style={{ position: "absolute", top: "14px", left: "10px", right: "10px", height: `${CHART_H}px`, pointerEvents: "none" }}>
                {[0.25, 0.5, 0.75, 1].map(pct => (
                  <div key={pct} style={{ position: "absolute", bottom: `${pct * CHART_H}px`, left: 0, right: 0 }}>
                    <div style={{ width: "100%", height: "1px", background: "rgba(90,152,227,0.1)" }} />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: statView === "monthly" ? "1px" : "4px", height: `${CHART_H}px` }}>
                {statBars.map((bar, i) => {
                  const bH = statMax > 0 ? Math.max(bar.value > 0 ? 4 : 0, Math.round((bar.value / statMax) * CHART_H)) : 0;
                  const cmpBar = statCompareBars ? statCompareBars[i] : null;
                  const cH = cmpBar ? (statMax > 0 ? Math.max(cmpBar.value > 0 ? 4 : 0, Math.round((cmpBar.value / statMax) * CHART_H)) : 0) : 0;
                  const isNow = (() => {
                    if (statView === "weekly" || statView === "monthly") {
                      const t = new Date(); t.setHours(0,0,0,0);
                      const bd = new Date(bar.date); bd.setHours(0,0,0,0);
                      return bd.getTime() === t.getTime();
                    }
                    return bar.date.getMonth() === now.getMonth() && bar.date.getFullYear() === now.getFullYear();
                  })();
                  const showLabel = statView !== "monthly";
                  const isSelected = statSelectedBar?.index === i;
                  return (
                    <div key={i} onClick={() => setStatSelectedBar(isSelected ? null : { index: i, label: bar.label, value: bar.value, cmpValue: cmpBar?.value ?? null, date: bar.date })} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", height: "100%", cursor: "pointer" }}>
                      <div style={{ width: "100%", display: "flex", alignItems: "flex-end", gap: "1px", justifyContent: "center", height: "100%" }}>
                        {statCompareBars && (
                          <div style={{ flex: 1, height: `${cH}px`, background: CMP_COL, borderRadius: "3px 3px 0 0", opacity: isSelected ? 1 : 0.6, maxWidth: statView === "monthly" ? "4px" : "14px", transition: "height .25s ease" }} />
                        )}
                        <div style={{ flex: 1, height: `${bH}px`, background: bar.value > 0 ? (isNow ? "#6BCB77" : isSelected ? "#89c4ff" : MAIN_COL) : "rgba(90,152,227,0.07)", borderRadius: "3px 3px 0 0", maxWidth: statView === "monthly" ? "4px" : "14px", transition: "height .25s ease" }} />
                      </div>
                      {showLabel && (
                        <div style={{ position: "absolute", bottom: "-18px", fontSize: statView === "monthly" ? "7px" : "8px", color: isNow ? "#6BCB77" : isSelected ? "#89c4ff" : "#BDD6F4", opacity: isNow || isSelected ? 1 : 0.45, fontWeight: isNow || isSelected ? 700 : 400, whiteSpace: "nowrap", transform: "translateX(-50%)", left: "50%" }}>{bar.label}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected bar info card */}
            {statSelectedBar && (
              <div style={{ background: "#0a2240", borderRadius: "12px", border: "1px solid rgba(90,152,227,0.15)", padding: "12px 14px", marginBottom: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", animation: "fi .15s ease" }}>
                <div>
                  <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.5, fontWeight: 600, marginBottom: "2px" }}>{(() => {
                    const d = statSelectedBar.date instanceof Date ? statSelectedBar.date : new Date(statSelectedBar.date);
                    if (statView === "monthly") {
                      return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
                    } else if (statView === "weekly") {
                      return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
                    } else {
                      return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
                    }
                  })()}</div>
                  <div style={{ fontSize: "20px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'JetBrains Mono'" }}>{stFmtVal(statSelectedBar.value, statMetric)}</div>
                  {statSelectedBar.cmpValue !== null && (
                    <div style={{ fontSize: "10px", color: statSelectedBar.value >= statSelectedBar.cmpValue ? "#6BCB77" : CMP_COL, fontWeight: 600, marginTop: "2px" }}>
                      {statSelectedBar.value >= statSelectedBar.cmpValue ? "▲" : "▼"} vs {stFmtVal(statSelectedBar.cmpValue, statMetric)}
                    </div>
                  )}
                </div>
                <button onClick={() => setStatSelectedBar(null)} style={{ background: "rgba(90,152,227,0.1)", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", color: "#BDD6F4", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
              </div>
            )}

            {/* Compare pill */}
            {(() => {
              const isWeekly = statView === "weekly";
              const cmpLabel = isWeekly ? "Compare weeks" : "Compare months";
              // Always generate options relative to now (offset 0), not statOffset
              const cmpPeriods = [];
              if (isWeekly) {
                for (let i = 1; i <= 12; i++) {
                  const off = -i;
                  cmpPeriods.push({ label: i === 1 ? `Last week · ${stPeriodTitle("weekly", off)}` : `${i} weeks ago · ${stPeriodTitle("weekly", off)}`, value: off });
                }
              } else {
                for (let i = 1; i <= 24; i++) {
                  const off = -i;
                  cmpPeriods.push({ label: stPeriodTitle("monthly", off), value: off });
                }
              }
              const cmpView = isWeekly ? "weekly" : "monthly";
              return (
                <div style={{ marginBottom: "14px" }}>
                  {statCompareOffset === null ? (
                    <div style={{ position: "relative", width: "100%" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "6px 24px 6px 14px", borderRadius: "20px", border: "1px solid rgba(90,152,227,0.2)", pointerEvents: "none", position: "absolute", inset: 0 }}>
                        <span style={{ fontSize: "11px", fontWeight: 700, fontFamily: "'DM Sans'", color: "#F8F8F8", display: "flex", alignItems: "center", gap: "5px" }}>
                          {cmpLabel}
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#F8F8F8" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
                        </span>
                      </div>
                      <select
                        value=""
                        onChange={e => { if (e.target.value !== "") setStatCompareOffset(parseInt(e.target.value)); }}
                        style={{ width: "100%", padding: "6px 24px 6px 14px", borderRadius: "20px", border: "1px solid transparent", background: "transparent", color: "transparent", fontSize: "11px", outline: "none", cursor: "pointer", opacity: 0, position: "relative", zIndex: 1 }}
                      >
                        <option value="">{cmpLabel}</option>
                        {cmpPeriods.map(o => <option key={o.value} value={String(o.value)}>{o.label}</option>)}
                      </select>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px 8px 4px 10px", borderRadius: "20px", border: `1px solid ${CMP_COL}`, background: "rgba(232,93,58,0.08)" }}>
                        <span style={{ fontSize: "11px", fontWeight: 400, color: CMP_COL, fontFamily: "'DM Sans'" }}>{stPeriodTitle(cmpView, statCompareOffset)}</span>
                        <button onClick={() => setStatCompareOffset(null)} style={{ background: "none", border: "none", cursor: "pointer", color: CMP_COL, display: "flex", alignItems: "center", padding: "1px", fontSize: "11px", lineHeight: 1 }}>✕</button>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "9px", color: "#BDD6F4", opacity: 0.5 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "3px" }}><span style={{ display: "inline-block", width: "7px", height: "7px", borderRadius: "2px", background: MAIN_COL }} />{stPeriodTitle(statView, statOffset)}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: "3px" }}><span style={{ display: "inline-block", width: "7px", height: "7px", borderRadius: "2px", background: CMP_COL }} />{stPeriodTitle(cmpView, statCompareOffset)}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Summary cards */}
            {statCompareOffset !== null ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <div style={{ background: "rgba(90,152,227,0.08)", borderRadius: "12px", padding: "14px 10px", textAlign: "center", border: "1px solid rgba(90,152,227,0.15)" }}>
                  <div style={{ fontSize: "8px", color: MAIN_COL, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>{stPeriodTitle(statView, statOffset)}</div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'JetBrains Mono'" }}>{stFmtVal(statTotal, statMetric)}</div>
                </div>
                <div style={{ background: "rgba(232,93,58,0.08)", borderRadius: "12px", padding: "14px 10px", textAlign: "center", border: "1px solid rgba(232,93,58,0.15)" }}>
                  <div style={{ fontSize: "8px", color: CMP_COL, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>{stPeriodTitle(statView, statCompareOffset)}</div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'JetBrains Mono'" }}>{stFmtVal(statCompareTotal, statMetric)}</div>
                  {statCompareTotal > 0 && <div style={{ fontSize: "10px", color: statTotal >= statCompareTotal ? "#6BCB77" : CMP_COL, marginTop: "4px", fontWeight: 700 }}>{statTotal >= statCompareTotal ? "▲" : "▼"} {Math.round(Math.abs((statTotal - statCompareTotal) / statCompareTotal * 100))}%</div>}
                </div>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {[
                  ["Elevation Gain", stFmtVal((savedWalks||[]).reduce((a,w)=> a+(parseFloat(w.elev)||0),0), "elevation"), "#6BCB77"],
                  ["Distance", stFmtVal((savedWalks||[]).reduce((a,w)=> a+(parseFloat(w.dist)||0),0), "distance"), MAIN_COL],
                  ["Time", stFmtVal((savedWalks||[]).reduce((a,w)=> a+stParseTimeMins(w.movingTime||w.time),0), "time"), "#F8C94A"],
                  ["Activities", String((savedWalks||[]).length), CMP_COL],
                ].map(([lbl,val,col]) => (
                  <div key={lbl} style={{ background: "#0a2240", borderRadius: "12px", padding: "14px 10px", textAlign: "center", border: "1px solid rgba(90,152,227,0.08)" }}>
                    <div style={{ fontSize: "22px", fontWeight: 800, color: col, fontFamily: "'JetBrains Mono'" }}>{val}</div>
                    <div style={{ fontSize: "9px", color: "#BDD6F4", opacity: 0.45, marginTop: "4px" }}>{lbl}</div>
                  </div>
                ))}
              </div>
            )}
            {/* Badges */}
            <div style={{ marginTop: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#BDD6F4", opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.8px" }}>Badges</div>
                <button onClick={() => setShowAllBadges(true)} style={{ fontSize: "11px", fontWeight: 600, color: "#5A98E3", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans'", padding: 0 }}>View all →</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {BADGES.slice(0, 4).map((b, i) => (
                  <div key={i} style={{ background: b.e ? "rgba(107,203,119,0.05)" : "#0a2240", borderRadius: "12px", padding: "14px", textAlign: "center", border: `1px solid ${b.e ? "rgba(107,203,119,0.12)" : "rgba(90,152,227,0.1)"}`, opacity: b.e ? 1 : .75 }}>
                    <div style={{ fontSize: "30px", marginBottom: "4px" }}>{b.i}</div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#F8F8F8" }}>{b.n}</div>
                    {b.e ? <div style={{ fontSize: "9px", color: "#6BCB77", fontWeight: 600, marginTop: "6px" }}><CheckCircle size={10} style={{ verticalAlign: "middle" }} /> Earned</div>
                    : <div style={{ marginTop: "8px" }}><div style={{ height: "3px", borderRadius: "3px", background: "#264f80" }}><div style={{ width: `${b.p}%`, height: "100%", borderRadius: "3px", background: "#5A98E3" }} /></div><div style={{ fontSize: "9px", color: "#BDD6F4", opacity: 0.5, marginTop: "3px" }}>{b.p}%</div></div>}
                  </div>
                ))}
              </div>
            </div>

            {/* All badges modal */}
            {showAllBadges && (
              <div style={{ position: "fixed", inset: 0, zIndex: 60, background: "#041e3d", display: "flex", flexDirection: "column", animation: "fi .2s ease" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", borderBottom: "1px solid rgba(90,152,227,0.1)" }}>
                  <button onClick={() => setShowAllBadges(false)} style={{ background: "rgba(90,152,227,0.1)", border: "1px solid rgba(90,152,227,0.2)", borderRadius: "10px", padding: "7px 12px", color: "#BDD6F4", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Sans'" }}>
                    <ChevronLeft size={16} /> Back
                  </button>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: "#F8F8F8" }}>All Badges</div>
                  <div style={{ marginLeft: "auto", fontSize: "11px", color: "#6BCB77", fontWeight: 600 }}>{BADGES.filter(b => b.e).length}/{BADGES.length} earned</div>
                </div>
                <div style={{ overflowY: "auto", flex: 1, padding: "16px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    {BADGES.map((b, i) => (
                      <div key={i} style={{ background: b.e ? "rgba(107,203,119,0.05)" : "#0a2240", borderRadius: "14px", padding: "16px", textAlign: "center", border: `1px solid ${b.e ? "rgba(107,203,119,0.15)" : "rgba(90,152,227,0.1)"}`, opacity: b.e ? 1 : .75, animation: `fi .3s ease ${i * .04}s both` }}>
                        <div style={{ fontSize: "34px", marginBottom: "6px" }}>{b.i}</div>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "#F8F8F8" }}>{b.n}</div>
                        {b.e ? <div style={{ fontSize: "9px", color: "#6BCB77", fontWeight: 600, marginTop: "8px" }}><CheckCircle size={10} style={{ verticalAlign: "middle" }} /> Earned</div>
                        : <div style={{ marginTop: "10px" }}><div style={{ height: "4px", borderRadius: "4px", background: "#264f80" }}><div style={{ width: `${b.p}%`, height: "100%", borderRadius: "4px", background: "#5A98E3" }} /></div><div style={{ fontSize: "9px", color: "#BDD6F4", opacity: 0.5, marginTop: "4px" }}>{b.p}% complete</div></div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {sec === "leaderboard" && (() => {
        const sorted = [...lbData].sort((a, b) => b[lbm] - a[lbm]);
        const top20 = sorted.slice(0, 20);
        const myRank = sorted.findIndex(u => u.isMe);
        const meOutside = myRank >= 20; // true if I'm not in the top 20
        const meRow = myRank >= 0 ? sorted[myRank] : null;

        const renderRow = (u, rank, extra = {}) => (
          <div key={u.uid} style={{ background: u.isMe ? "rgba(90,152,227,0.08)" : "#0a2240", borderRadius: "10px", padding: "10px 12px", border: `1px solid ${u.isMe ? "rgba(90,152,227,0.3)" : "rgba(90,152,227,0.08)"}`, display: "flex", alignItems: "center", gap: "10px", animation: `fi .3s ease ${Math.min(rank, 20) * .04}s both`, ...extra }}>
            <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: rank < 3 ? `${["#FFD700","#C0C0C0","#CD7F32"][rank]}15` : "#264f80", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 800, color: rank < 3 ? ["#FFD700","#C0C0C0","#CD7F32"][rank] : "#BDD6F4", flexShrink: 0 }}>{rank + 1}</div>
            <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "linear-gradient(135deg,#264f80,#5A98E3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "#F8F8F8", flexShrink: 0 }}>{(u.n || "?")[0].toUpperCase()}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: u.isMe ? "#5A98E3" : "#F8F8F8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.n}{u.isMe ? " (you)" : ""}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: "14px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'JetBrains Mono'" }}>
                {lbm === "d" ? `${u.d}km` : lbm === "e" ? `${u.e >= 1000 ? (u.e/1000).toFixed(1)+"km" : u.e+"m"}` : u.pts.toLocaleString()}
              </div>
              <div style={{ fontSize: "8px", color: "#BDD6F4", opacity: 0.4 }}>{lbm === "d" ? "distance" : lbm === "e" ? "elevation" : "points"}</div>
            </div>
          </div>
        );

        return (
          <div>
            {/* Global / Friends toggle */}
            <div style={{ display: "flex", gap: "3px", marginBottom: "10px", background: "#0a2240", borderRadius: "10px", padding: "3px" }}>
              {[["global", "Global"], ["friends", "Friends"]].map(([k, l]) => (
                <button key={k} onClick={() => setLbScope(k)} style={{ flex: 1, padding: "6px", borderRadius: "8px", border: "none", background: lbScope === k ? "rgba(90,152,227,0.2)" : "transparent", color: lbScope === k ? "#5A98E3" : "#BDD6F4", fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'" }}>{l}</button>
              ))}
            </div>
            {/* Time period filter */}
            <div style={{ display: "flex", gap: "3px", marginBottom: "10px", background: "#0a2240", borderRadius: "10px", padding: "3px", overflowX: "auto" }}>
              {[["daily", "Day"], ["weekly", "Week"], ["monthly", "Month"], ["6month", "6 Mo"], ["yearly", "Year"], ["all", "All Time"]].map(([k, l]) => (
                <button key={k} onClick={() => setLbTime(k)} style={{ padding: "5px 10px", borderRadius: "8px", border: "none", background: lbTime === k ? "rgba(90,152,227,0.2)" : "transparent", color: lbTime === k ? "#5A98E3" : "#BDD6F4", fontSize: "10px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'", opacity: lbTime === k ? 1 : 0.4, whiteSpace: "nowrap" }}>{l}</button>
              ))}
            </div>
            {/* Metric filter */}
            <div style={{ display: "flex", gap: "4px", marginBottom: "10px" }}>
              {[["d", "Distance"], ["e", "Elevation"], ["pts", "Points"]].map(([k, l]) => (
                <button key={k} onClick={() => setLbm(k)} style={{ padding: "6px 14px", borderRadius: "10px", fontSize: "10px", cursor: "pointer", background: lbm === k ? "rgba(90,152,227,0.2)" : "#0a2240", border: `1px solid ${lbm === k ? "rgba(90,152,227,0.3)" : "rgba(90,152,227,0.1)"}`, color: lbm === k ? "#5A98E3" : "#BDD6F4", fontWeight: 700, fontFamily: "'DM Sans'" }}>{l}</button>
              ))}
            </div>
            {lbLoading && <div style={{ padding: "28px", textAlign: "center", fontSize: "12px", color: "#BDD6F4", opacity: 0.4 }}>Loading…</div>}
            {!lbLoading && sorted.length === 0 && (
              <div style={{ padding: "32px 16px", textAlign: "center" }}>
                <div style={{ fontSize: "28px", marginBottom: "10px" }}>🏔️</div>
                <div style={{ fontSize: "13px", color: "#BDD6F4", opacity: 0.5, marginBottom: "4px" }}>No activity yet</div>
                <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.3 }}>{lbScope === "friends" ? "Follow people to see their stats here" : "Record a walk to appear on the leaderboard"}</div>
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {top20.map((u, i) => renderRow(u, i))}
              {/* If current user is outside top 20, show a separator then their row */}
              {meOutside && meRow && <>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px 0" }}>
                  <div style={{ flex: 1, height: "1px", background: "rgba(90,152,227,0.12)" }} />
                  <span style={{ fontSize: "9px", color: "#BDD6F4", opacity: 0.3, fontWeight: 600 }}>YOUR RANK</span>
                  <div style={{ flex: 1, height: "1px", background: "rgba(90,152,227,0.12)" }} />
                </div>
                {renderRow(meRow, myRank)}
              </>}
            </div>
          </div>
        );
      })()}

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
                  <button onClick={async () => {
                    if (!canCreate) return;
                    const region = ROUTE_REGIONS.find(r => r.name === evRegion);
                    const { data: { user } } = await supabase.auth.getUser();
                    const meta = user?.user_metadata || {};
                    const newPost = {
                      user_id: user?.id || null,
                      username: meta.username || userName || null,
                      full_name: meta.full_name || null,
                      type: "event",
                      text: `${evName} — ${evDate} at ${evTime} · ${evDiff} · Max ${evSpots} spots · ${evAge} · ${evGender}${evRoute ? " · " + evRoute : ""}`,
                      peaks: [],
                      lat: region?.lat || null,
                      lng: region?.lng || null,
                    };
                    const { error } = await supabase.from("posts").insert(newPost);
                    if (error) console.error("Event insert error:", error);
                    const displayName = meta.username || userName || "You";
                    const livePost = { ...newPost, id: Date.now(), user: displayName, av: "📅", likes: 0, comments: 0, time: "just now", isLive: true };
                    if (onPublishPost) onPublishPost(livePost);
                    setMyDbPosts(prev => [livePost, ...prev]);
                    setEvCreated(true);
                  }} style={{ width: "100%", padding: "11px", borderRadius: "10px", border: "none", background: canCreate ? "linear-gradient(135deg,#E85D3A,#d04a2a)" : "#264f80", color: canCreate ? "#F8F8F8" : "#BDD6F4", fontSize: "13px", fontWeight: 700, cursor: canCreate ? "pointer" : "default", fontFamily: "'DM Sans'", opacity: canCreate ? 1 : 0.5, transition: "all .2s" }}>
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
                  const newPost = {
                    user_id: user.id,
                    username: meta.username || null,
                    full_name: meta.full_name || null,
                    type: "summit",
                    text: postText,
                    peaks: [],
                  };
                  const { error } = await supabase.from("posts").insert(newPost);
                  if (error) console.error("Post insert error:", error);
                  const displayName = meta.username || userName || "You";
                  const livePost = { ...newPost, id: Date.now(), user: displayName, av: displayName[0].toUpperCase(), likes: 0, comments: 0, time: "just now", isLive: true };
                  if (onPublishPost) onPublishPost(livePost);
                  setMyDbPosts(prev => [livePost, ...prev]);
                }
                setCreateType(null); setShowCreate(false); setPostText("");
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
            <input type="text" placeholder="Organisation name (e.g. Glencoe MRT)" value={frOrg} onChange={e => setFrOrg(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(90,152,227,0.2)", background: "#041e3d", color: "#F8F8F8", fontSize: "12px", outline: "none", fontFamily: "'DM Sans'", marginBottom: "8px" }} />
            <textarea placeholder="Tell people why this matters..." rows={2} value={frDesc} onChange={e => setFrDesc(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(90,152,227,0.2)", background: "#041e3d", color: "#F8F8F8", fontSize: "12px", outline: "none", fontFamily: "'DM Sans'", resize: "none", marginBottom: "8px" }} />
            <input type="url" placeholder="GoFundMe or donation link" value={frLink} onChange={e => setFrLink(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(90,152,227,0.2)", background: "#041e3d", color: "#F8F8F8", fontSize: "12px", outline: "none", fontFamily: "'DM Sans'", marginBottom: "10px" }} />
            <button onClick={async () => {
              if (!frOrg) return;
              const { data: { user } } = await supabase.auth.getUser();
              const meta = user?.user_metadata || {};
              const newPost = {
                user_id: user?.id || null,
                username: meta.username || userName || null,
                full_name: meta.full_name || null,
                type: "fundraiser",
                text: frDesc || frOrg,
                peaks: [],
                link: frLink || null,
              };
              const { error } = await supabase.from("posts").insert(newPost);
              if (error) console.error("Fundraiser insert error:", error);
              const displayName = meta.username || userName || frOrg;
              const livePost = { ...newPost, id: Date.now(), user: frOrg || displayName, av: "❤️", likes: 0, comments: 0, time: "just now", isLive: true };
              if (onPublishPost) onPublishPost(livePost);
              setMyDbPosts(prev => [livePost, ...prev]);
              setCreateType(null); setShowCreate(false); setFrOrg(""); setFrDesc(""); setFrLink(""); if (goHome) goHome("fundraiser");
            }} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "none", background: frOrg ? "linear-gradient(135deg,#6BCB77,#55a866)" : "#264f80", color: "#F8F8F8", fontSize: "12px", fontWeight: 700, cursor: frOrg ? "pointer" : "default", fontFamily: "'DM Sans'", opacity: frOrg ? 1 : 0.5 }}>Publish Fundraiser</button>
          </div>
        )}

        {/* Social posts (posts table) */}
        {!createType && !showCreate && myDbPosts.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "14px" }}>
            {myDbPosts.map((p, i) => (
              <div key={p.id || i} style={{ background: "#0a2240", borderRadius: "14px", border: "1px solid rgba(90,152,227,0.12)", padding: "14px", animation: `fi .3s ease ${i * .05}s both` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: avatarUrl ? "transparent" : "linear-gradient(135deg,#264f80,#5A98E3)", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "#F8F8F8" }}>
                    {avatarUrl ? <img src={avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (userName||"U")[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#F8F8F8" }}>{userName}</div>
                    <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.4 }}>
                      {p.time || (p.created_at ? new Date(p.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "just now")}
                      {p.type === "event" ? " · 📅 Event" : p.type === "fundraiser" ? " · ❤️ Fundraiser" : ""}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: "13px", color: "#BDD6F4", lineHeight: 1.55 }}>{p.text}</div>
              </div>
            ))}
          </div>
        )}

        {/* Saved walks and empty state */}
        {!createType && !showCreate && (
          <div>
            {savedWalks && savedWalks.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {savedWalks.map((w, i) => (
                  <div key={i} onClick={() => setSelWalk(w)} style={{ background: "#0a2240", borderRadius: "16px", border: "1px solid rgba(90,152,227,0.12)", overflow: "hidden", animation: `fi .3s ease ${i * .05}s both`, cursor: "pointer" }}>
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
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "calc(14px + env(safe-area-inset-top, 0px)) 16px 14px", borderBottom: "1px solid rgba(90,152,227,0.1)", background: "rgba(4,30,61,0.95)", backdropFilter: "blur(12px)", flexShrink: 0 }}>
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

            {/* Route map */}
            {selWalk.route && selWalk.route.length > 2 && (
              <div style={{ marginBottom: "10px" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, color: "#BDD6F4", opacity: 0.5, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Route</div>
                <RoutePreview points={selWalk.route} height={160} />
              </div>
            )}

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
  const [peaks, setPeaks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followerCount, setFollowerCount] = useState(user.follower_count || 0);
  const [followingCount, setFollowingCount] = useState(user.following_count || 0);
  const [sec, setSec] = useState("mountains");

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        const [postRes, walkRes, peakRes, profileRes] = await Promise.all([
          supabase.from("posts").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
          supabase.from("user_walks").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
          supabase.from("user_peaks").select("*").eq("user_id", user.id).eq("done", true),
          supabase.from("profiles").select("follower_count, following_count").eq("id", user.id).maybeSingle(),
        ]);
        if (postRes.data) setPosts(postRes.data);
        if (walkRes.data) setWalks(walkRes.data);
        if (peakRes.data) setPeaks(peakRes.data);
        if (profileRes.data) {
          setFollowerCount(profileRes.data.follower_count || 0);
          setFollowingCount(profileRes.data.following_count || 0);
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    loadProfile();
  }, [user.id]);

  const isFollowing = followingIds?.has(user.id);
  const isOwnProfile = userId === user.id;
  const displayName = user.name || user.username || "Hiker";
  const totalDist = walks.reduce((a, w) => a + (parseFloat(w.distance_km) || 0), 0);
  const totalElev = walks.reduce((a, w) => a + (parseInt(w.elevation_m) || 0), 0);

  // Group peaks by class
  const peaksByCls = peaks.reduce((acc, p) => {
    const cls = p.peak_id?.split("-")[0] || "munros";
    if (!acc[cls]) acc[cls] = [];
    acc[cls].push(p);
    return acc;
  }, {});

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 80, background: "#041e3d", display: "flex", flexDirection: "column", animation: "fi .2s ease" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "calc(14px + env(safe-area-inset-top, 0px)) 16px 14px", borderBottom: "1px solid rgba(90,152,227,0.1)", background: "rgba(4,30,61,0.95)", backdropFilter: "blur(12px)", flexShrink: 0 }}>
        <button onClick={onClose} style={{ background: "rgba(90,152,227,0.1)", border: "1px solid rgba(90,152,227,0.2)", borderRadius: "10px", padding: "7px 12px", color: "#BDD6F4", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Sans'" }}>
          <ChevronLeft size={16} /> Back
        </button>
        <div style={{ flex: 1 }} />
        {!isOwnProfile && (
          <button onClick={() => { onFollow(user.id); setFollowerCount(c => isFollowing ? Math.max(0, c - 1) : c + 1); }} style={{ padding: "8px 18px", borderRadius: "10px", border: isFollowing ? "1px solid rgba(90,152,227,0.3)" : "none", background: isFollowing ? "transparent" : "linear-gradient(135deg,#E85D3A,#d04a2a)", color: isFollowing ? "#5A98E3" : "#F8F8F8", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'" }}>
            {isFollowing ? "Following" : "Follow"}
          </button>
        )}
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Avatar + name */}
        <div style={{ padding: "20px 16px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg,#264f80,#5A98E3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", fontWeight: 800, color: "#F8F8F8", border: "3px solid rgba(90,152,227,0.3)", flexShrink: 0 }}>
              {displayName[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'Playfair Display',serif" }}>{displayName}</div>
              {user.username && <div style={{ fontSize: "12px", color: "#BDD6F4", opacity: 0.6, marginTop: "2px" }}>@{user.username}</div>}
              {user.location && <div style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.4, marginTop: "2px" }}>📍 {user.location}</div>}
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px", marginBottom: "16px" }}>
            {[[walks.length, "Walks"], [peaks.length, "Peaks"], [followerCount, "Followers"], [followingCount, "Following"]].map(([val, label]) => (
              <div key={label} style={{ textAlign: "center", padding: "10px 4px", background: "#0a2240", borderRadius: "10px", border: "1px solid rgba(90,152,227,0.1)" }}>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "#F8F8F8", fontFamily: "'JetBrains Mono'" }}>{val}</div>
                <div style={{ fontSize: "8px", color: "#BDD6F4", opacity: 0.4, marginTop: "3px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Distance / Elevation summary */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "16px" }}>
            <div style={{ background: "#0a2240", borderRadius: "10px", padding: "10px 12px", border: "1px solid rgba(90,152,227,0.1)" }}>
              <div style={{ fontSize: "16px", fontWeight: 800, color: "#5A98E3", fontFamily: "'JetBrains Mono'" }}>{totalDist.toFixed(1)}km</div>
              <div style={{ fontSize: "9px", color: "#BDD6F4", opacity: 0.4, marginTop: "2px" }}>Total distance</div>
            </div>
            <div style={{ background: "#0a2240", borderRadius: "10px", padding: "10px 12px", border: "1px solid rgba(90,152,227,0.1)" }}>
              <div style={{ fontSize: "16px", fontWeight: 800, color: "#6BCB77", fontFamily: "'JetBrains Mono'" }}>{totalElev >= 1000 ? `${(totalElev/1000).toFixed(1)}km` : `${totalElev}m`}</div>
              <div style={{ fontSize: "9px", color: "#BDD6F4", opacity: 0.4, marginTop: "2px" }}>Total elevation</div>
            </div>
          </div>

          {/* Section tabs */}
          <div style={{ display: "flex", background: "#0a2240", borderRadius: "10px", padding: "3px", marginBottom: "16px" }}>
            {[["mountains", "Mountains"], ["posts", "Posts"], ["walks", "Walks"]].map(([k, l]) => (
              <button key={k} onClick={() => setSec(k)} style={{ flex: 1, padding: "7px", borderRadius: "8px", border: "none", background: sec === k ? "rgba(90,152,227,0.2)" : "transparent", color: sec === k ? "#5A98E3" : "#BDD6F4", fontSize: "10px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'", opacity: sec === k ? 1 : 0.5 }}>{l}</button>
            ))}
          </div>
        </div>

        {/* Section content */}
        <div style={{ padding: "0 16px 24px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div style={{ fontSize: "12px", color: "#BDD6F4", opacity: 0.4 }}>Loading…</div>
            </div>
          ) : sec === "mountains" ? (
            peaks.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <Mountain size={36} color="#BDD6F4" style={{ opacity: 0.2, marginBottom: "12px" }} />
                <div style={{ fontSize: "13px", color: "#BDD6F4", opacity: 0.4 }}>{displayName} hasn't logged any peaks yet.</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {peaks.map(p => (
                  <div key={p.peak_id} style={{ background: "#0a2240", borderRadius: "10px", padding: "10px 12px", border: "1px solid rgba(90,152,227,0.08)", display: "flex", alignItems: "center", gap: "10px" }}>
                    <Mountain size={16} color="#6BCB77" style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#F8F8F8" }}>{p.peak_name}</div>
                      {p.date_completed && <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.4, marginTop: "2px" }}>{p.date_completed}</div>}
                    </div>
                    <CheckCircle size={14} color="#6BCB77" style={{ flexShrink: 0 }} />
                  </div>
                ))}
              </div>
            )
          ) : sec === "posts" ? (
            posts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <Users size={36} color="#BDD6F4" style={{ opacity: 0.2, marginBottom: "12px" }} />
                <div style={{ fontSize: "13px", color: "#BDD6F4", opacity: 0.4 }}>{displayName} hasn't posted anything yet.</div>
              </div>
            ) : (
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
            )
          ) : (
            walks.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <Route size={36} color="#BDD6F4" style={{ opacity: 0.2, marginBottom: "12px" }} />
                <div style={{ fontSize: "13px", color: "#BDD6F4", opacity: 0.4 }}>{displayName} hasn't logged any walks yet.</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {walks.map(w => (
                  <div key={w.id} style={{ background: "#0a2240", borderRadius: "12px", padding: "12px 14px", border: "1px solid rgba(90,152,227,0.08)" }}>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#F8F8F8", marginBottom: "6px" }}>{w.name || "Walk"}</div>
                    <div style={{ display: "flex", gap: "12px" }}>
                      {w.distance_km && <span style={{ fontSize: "11px", color: "#5A98E3", fontWeight: 600 }}>{parseFloat(w.distance_km).toFixed(1)}km</span>}
                      {w.elevation_m && <span style={{ fontSize: "11px", color: "#6BCB77", fontWeight: 600 }}>↑{w.elevation_m}m</span>}
                      {w.duration && <span style={{ fontSize: "11px", color: "#BDD6F4", opacity: 0.5 }}>{w.duration}</span>}
                    </div>
                    {w.date_walked && <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.3, marginTop: "4px" }}>{w.date_walked}</div>}
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   PWA INSTALL BANNER
   ═══════════════════════════════════════════════════════════════════ */
const PWAInstallBanner = ({ onDismiss }) => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installing, setInstalling] = useState(false);
  const isIos = typeof navigator !== "undefined" && /iphone|ipad|ipod/i.test(navigator.userAgent);

  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    setInstalling(true);
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") onDismiss();
    setInstalling(false);
    setInstallPrompt(null);
  };

  return (
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
      {installPrompt && !isIos ? (
        <button onClick={handleInstall} disabled={installing} style={{ marginTop: "12px", width: "100%", padding: "11px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#E85D3A,#d04a2a)", color: "#F8F8F8", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'" }}>
          {installing ? "Installing…" : "📲 Install TrailSync"}
        </button>
      ) : (
        <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
          {isIos ? (
            <div style={{ flex: 1, background: "rgba(90,152,227,0.08)", borderRadius: "10px", padding: "10px 12px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "#5A98E3", marginBottom: "4px" }}>📱 iPhone / iPad</div>
              <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.6, lineHeight: 1.5 }}>Tap <strong style={{ color: "#F8F8F8" }}>Share ↑</strong> then <strong style={{ color: "#F8F8F8" }}>Add to Home Screen</strong></div>
            </div>
          ) : (
            <div style={{ flex: 1, background: "rgba(90,152,227,0.08)", borderRadius: "10px", padding: "10px 12px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "#5A98E3", marginBottom: "4px" }}>🤖 Android / Chrome</div>
              <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.6, lineHeight: 1.5 }}>Tap <strong style={{ color: "#F8F8F8" }}>⋮ Menu</strong> then <strong style={{ color: "#F8F8F8" }}>Add to Home Screen</strong></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════════════ */
export default function TrailSync() {
  // Start as loading, then resolve from Supabase session
  const [authState, setAuthState] = useState("loading");
  const [userName, setUserName] = useState("Alex");

  const [tab, setTab] = useState(() => {
    try { return (typeof window !== "undefined" ? sessionStorage.getItem("ts_tab") : null) || "home"; } catch { return "home"; }
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
        const displayName = meta.full_name?.split(" ")[0] || meta.username || session.user.email?.split("@")[0] || "Explorer";
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
  const [headerSearchFocused, setHeaderSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchResults, setSearchResults] = useState({ posts: [], users: [], routes: [], peaks: [] });
  const [searching, setSearching] = useState(false);
  const [viewingProfile, setViewingProfile] = useState(null); // { id, name, username, location }
  const [pendingRouteDetail, setPendingRouteDetail] = useState(null);
  const [showPWABanner, setShowPWABanner] = useState(false);

  // Show PWA install banner if not already installed and not dismissed
  useEffect(() => {
    try {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
      const dismissed = localStorage.getItem("pwa-banner-dismissed");
      if (!isStandalone && !dismissed) {
        setTimeout(() => setShowPWABanner(true), 3000);
      }
    } catch(e) {}
  }, []);

  // Close header menus when the user switches tabs
  useEffect(() => { setShowUserMenu(false); setShowNotifications(false); }, [tab]);

  const [userCourseProgress, setUserCourseProgress] = useState({});
  const [userLocation, setUserLocation] = useState(null);
  const [userId, setUserId] = useState(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followingIds, setFollowingIds] = useState(new Set()); // set of user IDs this user follows

  // Follow/unfollow from header search
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
        if (error.code === "23505") {
          console.log("Already following — row exists");
        } else {
          console.error("FOLLOW INSERT ERROR:", JSON.stringify(error));
          setFollowingIds(prev => { const next = new Set(prev); next.delete(targetId); return next; });
          setFollowingCount(c => Math.max(0, c - 1));
        }
      } else {
        // Increment the target's follower_count in profiles table
        const { data: pf } = await supabase.from("profiles").select("follower_count").eq("id", targetId).maybeSingle();
        if (pf != null) await supabase.from("profiles").update({ follower_count: (pf.follower_count || 0) + 1 }).eq("id", targetId);
      }
    } else {
      setFollowingCount(c => Math.max(0, c - 1));
      const { error } = await supabase.from("follows").delete().eq("follower_id", userId).eq("following_id", targetId);
      if (error) {
        console.error("UNFOLLOW DELETE ERROR:", JSON.stringify(error));
        setFollowingIds(prev => { const next = new Set(prev); next.add(targetId); return next; });
        setFollowingCount(c => c + 1);
      } else {
        // Decrement the target's follower_count in profiles table
        const { data: pf } = await supabase.from("profiles").select("follower_count").eq("id", targetId).maybeSingle();
        if (pf != null) await supabase.from("profiles").update({ follower_count: Math.max(0, (pf.follower_count || 1) - 1) }).eq("id", targetId);
      }
    }
  };


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
          date: w.date_walked ? new Date(w.date_walked + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "",
          route: w.route_points || null,
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

  // Re-fetch follows when userId becomes available or browser tab becomes visible
  useEffect(() => {
    if (!userId) return;
    const fetchFollows = () => {
      supabase.from("follows").select("following_id").eq("follower_id", userId)
        .then(({ data }) => {
          if (data) {
            setFollowingIds(new Set(data.map(f => f.following_id)));
            setFollowingCount(data.length);
          }
        });
    };
    fetchFollows(); // run immediately when userId is first set (fixes browser vs PWA timing)
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      fetchFollows();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [userId]);

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
      <div style={{ position: "fixed", inset: 0, background: "#041e3d", fontFamily: "'DM Sans',system-ui,sans-serif", overflow: "hidden" }}>
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
      <div style={{ position: "fixed", inset: 0, background: "#041e3d", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
      <div style={{ position: "fixed", inset: 0, background: "#041e3d", fontFamily: "'DM Sans',system-ui,sans-serif", overflow: "hidden" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800&family=Playfair+Display:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          @keyframes fi { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes su { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes glow { 0%,100% { box-shadow: 0 0 8px rgba(232,93,58,.25); } 50% { box-shadow: 0 0 18px rgba(232,93,58,.45); } }
        `}</style>
        <LoginScreen onLogin={(user) => { setUserName(user.user_metadata?.full_name?.split(" ")[0] || user.email.split("@")[0]); setAuthState("app"); }} onGoSignup={() => setAuthState("signup")} />
      </div>
    );
  }

  if (authState === "signup") {
    return (
      <div style={{ position: "fixed", inset: 0, background: "#041e3d", fontFamily: "'DM Sans',system-ui,sans-serif", overflow: "hidden" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800&family=Playfair+Display:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          @keyframes fi { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes su { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes glow { 0%,100% { box-shadow: 0 0 8px rgba(232,93,58,.25); } 50% { box-shadow: 0 0 18px rgba(232,93,58,.45); } }
        `}</style>
        <SignupScreen onSignup={(name, username) => { setUserName(username || name.split(" ")[0]); setAuthState("username-prompt"); }} onGoLogin={() => setAuthState("login")} />
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100dvh", display: "flex", flexDirection: "column", background: "#041e3d", color: "#F8F8F8", fontFamily: "'DM Sans',system-ui,sans-serif", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800&family=Playfair+Display:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input, select, textarea { font-size: 16px !important; }
        button, a, [role="button"] { touch-action: manipulation; -webkit-user-select: none; user-select: none; }
        #header-search-input::placeholder { color: rgba(4,30,61,0.4); }
        ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(90,152,227,.15); border-radius: 4px; }
        select option { background: #0a2240; color: #F8F8F8; }
        @keyframes fi { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes su { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fl { 0%,100% { transform: translate(-50%,-50%) scale(1); } 50% { transform: translate(-50%,-50%) scale(1.04); } }
        @keyframes glow { 0%,100% { box-shadow: 0 0 8px rgba(232,93,58,.25); } 50% { box-shadow: 0 0 18px rgba(232,93,58,.45); } }
        @keyframes pulse { 0%,100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.08); } }
        @keyframes locationPulse { 0% { transform: translate(-50%,-50%) scale(0.5); opacity: 0.8; } 100% { transform: translate(-50%,-50%) scale(2.5); opacity: 0; } }
        .route-wx-popup .mapboxgl-popup-content { background: transparent !important; padding: 0 !important; box-shadow: none !important; border-radius: 0 !important; }
        .route-wx-popup .mapboxgl-popup-tip { display: none !important; }
      `}</style>

      {/* Header */}
      {tab !== "map" && (
        <div style={{ borderBottom: "1px solid rgba(90,152,227,0.1)", background: "rgba(4,30,61,.92)", backdropFilter: "blur(12px)", position: "relative", zIndex: 50, width: "100%", paddingTop: "env(safe-area-inset-top, 0px)" }}>
          {/* Top row — always: icon · [TrailSync|search] · bell · avatar */}
          <div style={{ display: "flex", alignItems: "center", padding: "0 10px", gap: "8px", height: "52px" }}>

            {/* Mountain icon — always visible */}
            <div style={{ width: "30px", height: "30px", borderRadius: "9px", background: "linear-gradient(135deg,#E85D3A,#F49D37)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, animation: "glow 3s ease infinite" }}>
              <Mountain size={15} color="#F8F8F8" />
            </div>

            {/* On home: compact search pill. On other tabs: TrailSync text */}
            {tab === "home" ? (
              <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: "5px", background: "rgba(255,255,255,0.92)", borderRadius: "18px", padding: "5px 10px", border: "1px solid rgba(255,255,255,0.6)", cursor: "text" }}
                  onClick={() => { const el = document.getElementById("header-search-input"); if (el) el.focus(); }}>
                  <Search size={12} color="#5A98E3" style={{ flexShrink: 0 }} />
                  <input
                    id="header-search-input"
                    type="text"
                    placeholder="Search people, mountains, routes…"
                    value={headerSearch}
                    onChange={e => setHeaderSearch(e.target.value)}
                    onFocus={() => setHeaderSearchFocused(true)}
                    onBlur={() => { setTimeout(() => setHeaderSearchFocused(false), 150); }}
                    style={{ background: "none", border: "none", outline: "none", color: "#041e3d", fontSize: "12px", fontFamily: "'DM Sans'", flex: 1, minWidth: 0 }}
                  />
                  {headerSearch && <button onClick={e => { e.stopPropagation(); setHeaderSearch(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#5A98E3", padding: 0, display: "flex", flexShrink: 0 }}><X size={12} /></button>}
                </div>
                {(headerSearchFocused || headerSearch) && (
                  <button onMouseDown={() => { setHeaderSearch(""); setHeaderSearchFocused(false); document.getElementById("header-search-input")?.blur(); }} style={{ background: "none", border: "none", color: "#BDD6F4", fontSize: "12px", fontWeight: 600, cursor: "pointer", padding: "4px 2px", flexShrink: 0, fontFamily: "'DM Sans'", whiteSpace: "nowrap" }}>Cancel</button>
                )}
              </div>
            ) : (
              <div style={{ flex: 1, fontSize: "15px", fontWeight: 800, color: "#F8F8F8", letterSpacing: "-.3px" }}>TrailSync</div>
            )}

          {/* Right buttons — always visible */}
          <div style={{ display: "flex", gap: "6px", alignItems: "center", flexShrink: 0 }}>
              <OfflineIndicator />
              {/* Bell — notification dropdown */}
              <div style={{ position: "relative" }}>
                <button onClick={() => { setShowNotifications(n => !n); setShowUserMenu(false); }} style={{ position: "relative", background: "#0a2240", border: "1px solid rgba(90,152,227,0.12)", borderRadius: "8px", padding: "6px", color: "#BDD6F4", cursor: "pointer" }}>
                  <Bell size={16} />
                  <div style={{ position: "absolute", top: 1, right: 1, width: "7px", height: "7px", borderRadius: "50%", background: "#E85D3A", border: "1px solid #041e3d" }} />
                </button>
                {showNotifications && (
                  <>
                    {/* Full-screen backdrop — tap anywhere to close */}
                    <div onClick={() => setShowNotifications(false)} style={{ position: "fixed", inset: 0, zIndex: 195 }} />
                    {/* Dropdown panel */}
                    <div style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, zIndex: 200, background: "#0a2240", borderRadius: "14px", border: "1px solid rgba(90,152,227,0.2)", minWidth: "270px", overflow: "visible", animation: "su .15s ease", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                      {/* Arrow caret — outer (border colour) */}
                      <div style={{ position: "absolute", top: "-9px", right: "11px", width: 0, height: 0, borderLeft: "9px solid transparent", borderRight: "9px solid transparent", borderBottom: "9px solid rgba(90,152,227,0.2)" }} />
                      {/* Arrow caret — inner (panel fill) */}
                      <div style={{ position: "absolute", top: "-7px", right: "12px", width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderBottom: "8px solid #0a2240" }} />
                      <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(90,152,227,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: "#F8F8F8" }}>Notifications</div>
                        <button onClick={() => setShowNotifications(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#BDD6F4", opacity: 0.5, padding: "2px", display: "flex", lineHeight: 1 }}><X size={14} /></button>
                      </div>
                      <div style={{ padding: "28px 16px", textAlign: "center" }}>
                        <Bell size={28} color="#5A98E3" style={{ opacity: 0.25, marginBottom: "10px" }} />
                        <div style={{ fontSize: "12px", color: "#BDD6F4", opacity: 0.4 }}>No notifications yet</div>
                        <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.25, marginTop: "4px" }}>Follow others to see their activity here</div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Avatar — user menu dropdown */}
              <div style={{ position: "relative" }}>
                <div onClick={() => { setShowUserMenu(m => !m); setShowNotifications(false); }} style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg,#264f80,#5A98E3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "#F8F8F8", border: "2px solid rgba(90,152,227,0.25)", cursor: "pointer" }}>
                  {userName ? userName[0].toUpperCase() : "A"}
                </div>
                {showUserMenu && (
                  <>
                    {/* Full-screen backdrop — tap anywhere to close */}
                    <div onClick={() => setShowUserMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 195 }} />
                    {/* Dropdown panel */}
                    <div style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, zIndex: 200, background: "#0a2240", borderRadius: "14px", border: "1px solid rgba(90,152,227,0.2)", minWidth: "170px", overflow: "visible", animation: "su .15s ease", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                      {/* Arrow caret — outer */}
                      <div style={{ position: "absolute", top: "-9px", right: "11px", width: 0, height: 0, borderLeft: "9px solid transparent", borderRight: "9px solid transparent", borderBottom: "9px solid rgba(90,152,227,0.2)" }} />
                      {/* Arrow caret — inner */}
                      <div style={{ position: "absolute", top: "-7px", right: "12px", width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderBottom: "8px solid #0a2240" }} />
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
        </div>
      )}

      {/* Search dropdown — fixed overlay that floats below header regardless of parent overflow */}
      {tab === "home" && headerSearch && headerSearch.length >= 2 && (
        <div style={{ position: "fixed", top: "calc(60px + env(safe-area-inset-top, 0px))", left: "16px", right: "16px", zIndex: 200, background: "rgba(4,30,61,0.99)", backdropFilter: "blur(20px)", borderRadius: "14px", border: "1px solid rgba(90,152,227,0.25)", overflow: "hidden", maxHeight: "70vh", overflowY: "auto", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
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
                  <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg,#264f80,#5A98E3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 700, color: "#F8F8F8", flexShrink: 0 }}>{(u.username || u.name || "?")[0].toUpperCase()}</div>
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
                <div key={r.id} onClick={() => { setHeaderSearch(""); setTab("routes"); setPendingRouteDetail(r); }} style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid rgba(90,152,227,0.06)", cursor: "pointer" }}>
                  <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "rgba(232,93,58,0.1)", border: "1px solid rgba(232,93,58,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Route size={16} color="#E85D3A" /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#F8F8F8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</div>
                    <div style={{ fontSize: "10px", color: "#BDD6F4", opacity: 0.5 }}>{r.reg} · {r.dist}km · {r.diff}</div>
                  </div>
                  <span style={{ fontSize: "9px", padding: "2px 7px", borderRadius: "5px", background: "rgba(90,152,227,0.12)", color: "#5A98E3", fontWeight: 700, flexShrink: 0 }}>View route →</span>
                </div>
              ))}
            </div>
          )}
          {searchResults.peaks.length > 0 && (
            <div>
              <div style={{ padding: "10px 14px 4px", fontSize: "9px", color: "#BDD6F4", opacity: 0.4, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Mountains</div>
              {searchResults.peaks.map(p => (
                <div key={p.id} style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid rgba(90,152,227,0.06)" }}>
                  <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: `${CLS[p.cls]?.color}15`, border: `1px solid ${CLS[p.cls]?.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Mountain size={16} color={CLS[p.cls]?.color || "#5A98E3"} /></div>
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
                    <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: p.type === "fundraiser" ? "rgba(107,203,119,0.15)" : p.type === "event" ? "rgba(90,152,227,0.15)" : "#264f80", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "#F8F8F8", flexShrink: 0 }}>{p.av}</div>
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

      {/* Content — flex:1 fills between header and tab bar */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {tab === "home" && <HomePage userName={userName} initialFilter={feedFilter} userId={userId} followingIds={followingIds} setFollowingIds={setFollowingIds} setFollowingCount={setFollowingCount} headerSearch={headerSearch} setHeaderSearch={setHeaderSearch} openRoute={openRouteOnMap} searchResults={searchResults} setSearchResults={setSearchResults} searching={searching} setSearching={setSearching} onViewProfile={setViewingProfile} />}
        {tab === "routes" && <RoutesPage openRoute={openRouteOnMap} pendingRouteDetail={pendingRouteDetail} onClearPendingRoute={() => setPendingRouteDetail(null)} />}
        {/* MapPage always mounted so GPX/Mapbox state survives tab switches — hidden with CSS when not active */}
        <div style={{ display: tab === "map" ? "flex" : "none", flex: 1, flexDirection: "column", overflow: "hidden" }}>
          <MapPage dbPeaks={dbPeaks} goHome={() => setTab("home")} goProfile={(sec) => { setProfileSec(sec || "mountains"); setTab("profile"); }} onSaveWalk={async (walk) => {
              // Optimistic update with DB-compatible shape
              const today = new Date();
              const dateWalked = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
              const localDateLabel = today.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
              setSavedWalks(prev => [{ ...walk, date: localDateLabel }, ...prev]);
              try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) { console.error("Walk save failed: no authenticated user"); return; }
                const meta = user.user_metadata || {};
                // Save to user_walks
                const { error: walkErr } = await supabase.from("user_walks").insert({
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
                  date_walked: dateWalked,
                  route_points: walk.route && walk.route.length > 1 ? walk.route : null,
                });
                if (walkErr) console.error("user_walks insert error:", JSON.stringify(walkErr));
                // Also post to community feed
                const distNum = parseFloat(walk.dist) || 0;
                const elevNum = parseInt(walk.elev) || 0;
                const parts = [walk.name];
                if (distNum > 0) parts.push(`${distNum.toFixed(1)}km`);
                if (elevNum > 0) parts.push(`${elevNum}m gain`);
                if (walk.time) parts.push(walk.time);
                const { error: postErr } = await supabase.from("posts").insert({
                  user_id: user.id,
                  username: meta.username || meta.full_name?.split(" ")[0] || null,
                  full_name: meta.full_name || null,
                  type: "walk",
                  text: parts.join(" · "),
                  peaks: walk.peaks || [],
                  route_points: walk.route && walk.route.length > 1 ? walk.route : null,
                });
                if (postErr) console.error("posts insert error:", JSON.stringify(postErr));
              } catch (e) { console.error("Failed to save walk:", e); }
            }} openRoute={openRouteOnMap} gpxRoute={gpxRoute} onCloseGpx={closeGpxRoute} />
        </div>
        {tab === "learn" && <LearnPage courseProgress={userCourseProgress} onCourseProgress={async (courseId, lessonsCompleted) => { setUserCourseProgress(prev => { const next = { ...prev }; if (lessonsCompleted === 0) { delete next[courseId]; } else { next[courseId] = lessonsCompleted; } return next; }); const { data: { user } } = await supabase.auth.getUser(); if (!user) return; if (lessonsCompleted === 0) { await supabase.from("user_courses").delete().eq("user_id", user.id).eq("course_id", courseId); } else { await supabase.from("user_courses").upsert({ user_id: user.id, course_id: courseId, lessons_completed: lessonsCompleted, updated_at: new Date().toISOString() }, { onConflict: "user_id,course_id" }); } }} />}
        {tab === "profile" && <ProfilePage initialSec={profileSec} onSecChange={setProfileSec} goMap={() => setTab("map")} goHome={(filter) => { setFeedFilter(filter || "all"); setTab("home"); }} goRoutes={() => setTab("routes")} openRoute={openRouteOnMap} savedWalks={savedWalks} setSavedWalks={setSavedWalks} dbPeaks={dbPeaks} userName={userName} userLocation={userLocation} setUserLocation={setUserLocation} followerCount={followerCount} followingCount={followingCount} followingIds={followingIds} setFollowingIds={setFollowingIds} setFollowerCount={setFollowerCount} setFollowingCount={setFollowingCount} userId={userId} onViewProfile={setViewingProfile} onPublishPost={post => setLivePosts(prev => [post, ...prev])} onSignOut={async () => {
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

      {/* Bottom nav — fixed to physical screen bottom, never affected by layout */}
      <div style={{ position: "relative", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "space-around", padding: "4px 6px 10px", borderTop: "1px solid rgba(90,152,227,0.1)", background: "rgba(4,30,61,.96)", backdropFilter: "blur(12px)" }}>
        {tabs.map((t, i) => {
          const I = t.icon; const a = tab === t.id; const ctr = i === 2;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ background: "none", border: "none", padding: ctr ? "0" : "4px 10px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", color: a ? (ctr ? "#F8F8F8" : "#E85D3A") : "#BDD6F4", transition: "color .2s", opacity: ctr ? 1 : (a ? 1 : 0.45) }}>
              {ctr ? (
                <div style={{ width: "46px", height: "46px", borderRadius: "50%", background: a ? "linear-gradient(135deg,#E85D3A,#d04a2a)" : "#1a3a6e", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "-12px", border: `2px solid ${a ? "#E85D3A" : "#2a5298"}`, boxShadow: a ? "0 4px 16px rgba(232,93,58,.35)" : "none", transition: "all .2s" }}>
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
