/* Ovation Hub shared layer. Build 2026-10-23 (Manager Desk gate added: mgrGate / mgrRequire / mgrApi, key cwOvationMgrPass).
   Build 2026-10-22b (client passcode only; porter pages).
   citywidelv.github.io/ovation-hub/ is a client-facing hub for Ovation Property Management
   staff and the day porters on their properties. Its passcode is its own (script property
   OV_PASSCODE on the CW Team Portal Backend), checked server side by kind ov_auth. The team
   passcode also opens it, so an FSM on a team device is never asked twice. Nothing here
   unlocks the Team Portal or any team hub.

   Everything a page needs to paint is in this file: property list, the Aspire at Redwood
   day porter workflow as a checklist, the gate, post helper, photo shrink. No fetch on load. */
(function(){
  "use strict";
  var WEBHOOK = "https://script.google.com/macros/s/AKfycbzfNnrpidCbWB1DeUNgXvRhDFMQgApfpn-3C9GU45wMEHcJpWFl8ZQVo6PUBSRfEVfRdg/exec";
  var KEY = "cwOvationPass";
  var TEAMKEY = "cwOpsHubPass";
  var STAMP = "cwOvationSince";
  var MAXAGE = 90 * 24 * 60 * 60 * 1000;
  var HUB = "https://citywidelv.github.io/ovation-hub/";
  var LOGO = "https://emailer.emfluence.com/clients/citywide/uploadedfiles/signature_logo.png";

  /* Every Ovation community from the May 2026 property list (41 named; the 13th Heirloom
     community was never identified). awarded = day porter awarded to City Wide. */
  var PROPERTIES = [
    { name:"Aspire at Echelon", group:"Mid-Rise", type:"mid", address:"8850 Echelon Point Dr, Las Vegas, NV 89149" },
    { name:"Aspire at Flamingo Grand", group:"Mid-Rise", type:"mid", address:"4335 S Grand Canyon Dr, Las Vegas, NV 89147", awarded:true, days:7 },
    { name:"Aspire at Redwood", group:"Mid-Rise", type:"mid", address:"6755 W Arby Ave, Las Vegas, NV 89118", awarded:true, days:7 },
    { name:"Altessa", group:"Mid-Rise", type:"mid", address:"100 Park Vista Dr, Las Vegas, NV 89138", awarded:true, days:5 },
    { name:"Arzano", group:"Mid-Rise", type:"mid", address:"6275 Boulder Hwy, Las Vegas, NV 89122" },
    { name:"Arzano II", group:"Mid-Rise", type:"mid", address:"6275 Boulder Hwy, Las Vegas, NV 89122" },
    { name:"Elevate", group:"Mid-Rise", type:"mid", address:"111 S Gibson Rd, Henderson, NV 89012" },
    { name:"Inspire", group:"Mid-Rise", type:"mid", address:"2656 N Buffalo Dr, Las Vegas, NV 89128" },
    { name:"Radiance at Grand Canyon", group:"Mid-Rise", type:"mid", address:"9860 W Tropicana Ave, Las Vegas, NV 89147" },
    { name:"Radiance at Rock Springs", group:"Mid-Rise", type:"mid", address:"1501 Rock Springs Dr, Las Vegas, NV 89128", awarded:true, days:5 },
    { name:"Adiamo", group:"Garden-Style", type:"garden", address:"1350 W Horizon Ridge Pkwy, Henderson, NV 89012", awarded:true, days:5 },
    { name:"Aspire at Alper", group:"Garden-Style", type:"garden", address:"1130 Alper Center Dr, Henderson, NV 89052", awarded:true, days:5 },
    { name:"Aspire at Grand Canyon", group:"Garden-Style", type:"garden", address:"9950 W Tropicana Ave, Las Vegas, NV 89147" },
    { name:"Aspire at Paseo & Imagine", group:"Garden-Style", type:"garden", address:"1480 Paseo Verde Pkwy, Henderson, NV 89012", awarded:true, days:7 },
    { name:"Aspire at Sunridge Heights", group:"Garden-Style", type:"garden", address:"3161 Sunridge Heights Pkwy, Henderson, NV 89052", awarded:true, days:5 },
    { name:"Aspire at Tropicana", group:"Garden-Style", type:"garden", address:"9110 W Tropicana Ave, Las Vegas, NV 89147" },
    { name:"Chateau Calais", group:"Garden-Style", type:"garden", address:"975 Seven Hills Dr, Henderson, NV 89052" },
    { name:"Diamond Vista", group:"Garden-Style", type:"garden", address:"3779 Autzen Stadium Way, Las Vegas, NV 89115" },
    { name:"The Grove", group:"Garden-Style", type:"garden", address:"2901 N Rainbow Blvd, Las Vegas, NV 89108" },
    { name:"Madera", group:"Garden-Style", type:"garden", address:"2600 S Town Center Dr, Las Vegas, NV 89135" },
    { name:"Positano", group:"Garden-Style", type:"garden", address:"10115 Jeffreys St, Las Vegas, NV 89183", awarded:true, days:5 },
    { name:"San Croix", group:"Garden-Style", type:"garden", address:"8000 W Spring Mountain Rd, Las Vegas, NV 89117" },
    { name:"Summer Winds", group:"Garden-Style", type:"garden", address:"2725 W Wigwam Ave, Las Vegas, NV 89123" },
    { name:"Tesora I & II", group:"Garden-Style", type:"garden", address:"9465 W Post Rd, Las Vegas, NV 89148", awarded:true, days:5 },
    { name:"Tivoli", group:"Garden-Style", type:"garden", address:"4650 N Rainbow Blvd, Las Vegas, NV 89108", awarded:true, days:5 },
    { name:"Tuscany", group:"Garden-Style", type:"garden", address:"725 S Hualapai Way, Las Vegas, NV 89145" },
    { name:"Venicia", group:"Garden-Style", type:"garden", address:"3644 S Fort Apache Rd, Las Vegas, NV 89147", awarded:true, days:5 },
    { name:"Viviani", group:"Garden-Style", type:"garden", address:"9625 W Russell Rd, Las Vegas, NV 89148" },
    { name:"Acapella", group:"Heirloom (55+)", type:"senior", address:"5025 E Mohave Ave, Las Vegas, NV 89104" },
    { name:"Arioso", group:"Heirloom (55+)", type:"senior", address:"9270 S Quarterhorse Ln, Las Vegas, NV 89178" },
    { name:"Capriccio", group:"Heirloom (55+)", type:"senior", address:"9420 W Wigwam Ave, Las Vegas, NV 89178" },
    { name:"Crescendo", group:"Heirloom (55+)", type:"senior", address:"9550 W Russell Rd, Las Vegas, NV 89148" },
    { name:"Ensemble", group:"Heirloom (55+)", type:"senior", address:"2675 W Agate Ave, Las Vegas, NV 89123" },
    { name:"Harmony", group:"Heirloom (55+)", type:"senior", address:"4200 N Tenaya Way, Las Vegas, NV 89129" },
    { name:"Heirloom at Pebble", group:"Heirloom (55+)", type:"senior", address:"2325 E Torino Ave, Las Vegas, NV 89123" },
    { name:"Heirloom at Rome", group:"Heirloom (55+)", type:"senior", address:"4850 W Rome Blvd, Las Vegas, NV 89131" },
    { name:"Heirloom at Torrey Pines", group:"Heirloom (55+)", type:"senior", address:"6540 W Arby Ave, Las Vegas, NV 89118" },
    { name:"Melody", group:"Heirloom (55+)", type:"senior", address:"8680 W Oquendo Rd, Las Vegas, NV 89148" },
    { name:"Minuet", group:"Heirloom (55+)", type:"senior", address:"4652 N Rainbow Blvd, Las Vegas, NV 89108" },
    { name:"Tempo", group:"Heirloom (55+)", type:"senior", address:"5625 S Hollywood Blvd, Las Vegas, NV 89122" }
  ];
  var GROUPS = ["Mid-Rise", "Garden-Style", "Heirloom (55+)"];

  /* The day porter workflow from the Aspire at Redwood scope of work (Oct 21 2026), as a
     checklist. "daily" = services performed each shift. "weekly" / "monthly" are spread
     across the week within the same hours; the porter ticks the ones done today.
     midOnly areas are skipped by default at garden-style properties. */
  var AREAS = [
    { key:"restrooms", name:"Restrooms", sub:"Clubhouse, leasing and amenity restrooms. Full service once, checks at start, middle and end of shift.",
      daily:["Waste emptied, liners replaced", "Toilets, urinals and sinks cleaned and disinfected", "Counters and fixtures cleaned and disinfected",
        "Mirrors wiped", "Partitions and doors spot cleaned", "Dispensers checked and refilled", "Floors swept or dust mopped",
        "Floors damp mopped and sanitized", "Checks done at start, middle and end of shift"],
      weekly:["Walls around fixtures spot cleaned", "Floor drains flushed"] },
    { key:"clubhouse", name:"Clubhouse, Leasing Office & Fitness Room", sub:"",
      daily:["Waste emptied, liners replaced as needed", "Furniture, counters and tables wiped", "Fitness equipment handles, seats and benches wiped and disinfected",
        "Fitness room mirrors wiped", "Coffee bar and kitchenette counters wiped", "Microwave exterior wiped", "Glass doors spot cleaned",
        "Floors vacuumed or dust mopped", "Floors damp mopped", "Administration office serviced as assigned"],
      weekly:["Microwave interior cleaned", "Interior glass and partitions spot cleaned"] },
    { key:"lobbies", name:"Entries, Lobbies, Hallways & Mail Areas", sub:"",
      daily:["Waste emptied, liners replaced as needed", "Entry and door glass spot cleaned", "Doors, frames and push plates spot cleaned",
        "Mailbox fronts and package counters dusted", "Lobby floors vacuumed or dust mopped", "Lobby floors damp mopped",
        "Hallway high-traffic floors vacuumed or dust mopped", "Hallway high-traffic floors damp mopped", "Walls spot cleaned at entries and high-traffic areas"],
      weekly:["Hallway floor rotation: floors vacuumed or dust mopped today", "Hallway hard floors damp mopped on the same rotation"],
      askFloors:true },
    { key:"elevators", name:"Elevators", sub:"Mid-rise buildings.", midOnly:true,
      daily:["Buttons and handrails cleaned and disinfected", "Cab walls and doors spot cleaned", "Cab floors vacuumed or dust mopped", "Cab floors damp mopped"],
      weekly:["Stainless steel cleaned with stainless cleaner", "Door tracks vacuumed"] },
    { key:"pool", name:"Pool & Spa Areas", sub:"Timing set around pool hours.",
      daily:["Litter and debris picked up on the pool deck", "Lounge chairs and tables wiped", "Waste emptied, liners replaced as needed",
        "Grill grates scraped, exteriors wiped, grease trays emptied", "Pool gate handles and touch points cleaned and disinfected"] },
    { key:"pet", name:"Pet Stations & Pet Relief Areas", sub:"",
      daily:["Pet waste stations emptied and cleaned, liners replaced", "Waste bag dispensers refilled", "Pet waste picked up from turf, gravel and walkways",
        "Pet relief areas sanitized", "Litter and debris picked up around pet areas", "Missing or damaged signage reported"] },
    { key:"walkways", name:"Walkways, Stairwells & Outdoor Common Areas", sub:"",
      daily:["Litter and debris picked up along walkways, stairwells, courtyards and entries", "Walkways and entries swept",
        "Outdoor furniture at entrances wiped", "Stairwells checked and litter picked up"],
      weekly:["Stairwells swept or dust mopped", "Stairwells damp mopped", "Stairwell handrails wiped"] },
    { key:"trash", name:"Trash & Dumpster Areas", sub:"Serviced first, ahead of resident and hauler traffic.",
      daily:["Loose trash around dumpsters and enclosures picked up", "Dumpsters checked for overflow", "Dumpster access checked before pickup",
        "Bins positioned for pickup and returned (pickup days)", "Waste bags moved in a brute can or cart, not carried over clean floors"] },
    { key:"all", name:"All Areas & Touch Points", sub:"Touch points: light switches, door handles and pulls, push plates, elevator buttons, mailbox handles, gate handles.",
      daily:["Horizontal surfaces up to 3 ft dusted (counters, tables, ledges, mailbox tops)", "Touch points cleaned and disinfected", "Soda spills and sticky residue addressed"],
      weekly:["Low dusting, 3 in to 3 ft", "High dusting, 5 ft to 10 ft"],
      monthly:["Ceiling vents dusted up to 10 ft", "Baseboards dusted", "Floor corners and edges vacuumed or dust mopped", "Floor corners and edges damp mopped"] },
    { key:"closet", name:"Janitorial Closet", sub:"Photo optional.", photoOptional:true,
      daily:["Equipment and chemicals stored in the closet", "Chemicals labeled and stored per the label", "SDS on site for every product"],
      weekly:["Closet floor swept"] }
  ];
  var PASSES = ["Opening pass (trash, pet stations, walkways, entries)", "Interior pass (lobbies, mail, elevators, hallways, clubhouse, leasing, fitness)",
    "Amenity pass (pool, spa, grill)", "Restroom checks (start, middle, end)", "Return passes through the shift", "Closing pass (final restroom check, entries, clubhouse, service log)"];

  function ls(fn){ try { return fn(); } catch(e){ return null; } }
  function esc(s){ return String(s == null ? "" : s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function uid(prefix){ return prefix + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8); }
  function $(id){ return document.getElementById(id); }
  function params(){
    var out = {};
    (location.search || "").replace(/^\?/, "").split("&").forEach(function(p){
      if(!p) return; var i = p.indexOf("=");
      out[decodeURIComponent(i < 0 ? p : p.slice(0, i))] = decodeURIComponent(i < 0 ? "" : p.slice(i + 1).replace(/\+/g, " "));
    });
    return out;
  }
  function byName(name){ for(var i = 0; i < PROPERTIES.length; i++) if(PROPERTIES[i].name === name) return PROPERTIES[i]; return null; }
  function awarded(){ return PROPERTIES.filter(function(p){ return p.awarded; }); }
  function propertyOptions(onlyAwarded){
    var html = '<option value="">Pick the property</option>';
    GROUPS.forEach(function(g){
      var list = PROPERTIES.filter(function(p){ return p.group === g && (!onlyAwarded || p.awarded); });
      if(!list.length) return;
      html += '<optgroup label="' + esc(g) + '">';
      list.forEach(function(p){ html += '<option value="' + esc(p.name) + '">' + esc(p.name) + '</option>'; });
      html += '</optgroup>';
    });
    return html;
  }

  /* ---------- gate ---------- */
  function touch(){ ls(function(){ localStorage.setItem(STAMP, String(Date.now())); }); }
  function fresh(){
    var t = Number(ls(function(){ return localStorage.getItem(STAMP); }) || 0);
    if(!t){ touch(); return true; }
    if(Date.now() - t > MAXAGE) return false;
    touch(); return true;
  }
  function getPass(){
    var v = ls(function(){ return localStorage.getItem(KEY); }) || "";
    if(v && !fresh()){ clearPass(); v = ""; }
    return v;   /* the team passcode does not open the client side; City Wide staff type the hub passcode once per device */
  }
  function setPass(p){ ls(function(){ localStorage.setItem(KEY, p); }); touch(); }
  function clearPass(){ ls(function(){ localStorage.removeItem(KEY); localStorage.removeItem(STAMP); }); }
  function isTeam(){ return !!(ls(function(){ return localStorage.getItem(TEAMKEY); })); }

  function post(body){
    return fetch(WEBHOOK, { method:"POST", headers:{ "Content-Type":"text/plain" }, body: JSON.stringify(body) })
      .then(function(r){ return r.json(); });
  }
  function api(kind, body){
    body = body || {};
    body.kind = kind;
    if(!body.passcode) body.passcode = getPass();
    return post(body);
  }
  function validate(pass){
    return post({ kind:"ov_auth", passcode: pass })
      .then(function(r){ if(r && r.ok === true) return { ok:true, r:r }; return { ok:false, r:r }; })
      .catch(function(){ return { ok:null }; });
  }

  /* Hub page: wires the passcode box. opts: input, button, err, gate, app, onUnlock */
  function hubGate(opts){
    var p = params();
    var next = p.next && p.next.indexOf(HUB) === 0 ? p.next : "";
    var input = $(opts.input), button = $(opts.button), err = $(opts.err), gate = $(opts.gate), app = $(opts.app);
    function say(m){ if(err) err.textContent = m || ""; }
    function open(){
      if(next){ location.replace(next); return; }
      if(gate) gate.classList.add("hidden"); if(app) app.classList.remove("hidden");
      if(opts.onUnlock) opts.onUnlock();
    }
    function submit(){
      var v = input ? String(input.value || "").trim() : "";
      if(!v){ say("Enter the passcode."); return; }
      button.disabled = true; button.textContent = "Checking...";
      validate(v).then(function(res){
        button.disabled = false; button.textContent = "Enter";
        if(res.ok === true){ setPass(v); open(); }
        else if(res.ok === null) say("Could not reach the server. Check your connection and try again.");
        else { say((res.r && res.r.error && !/wrong/i.test(res.r.error)) ? res.r.error : "That passcode is not right. Ask your City Wide contact."); input.value = ""; input.focus(); }
      });
    }
    if(button) button.addEventListener("click", function(e){ e.preventDefault(); submit(); });
    if(input) input.addEventListener("keydown", function(e){ if(e.key === "Enter"){ e.preventDefault(); submit(); } });
    var cached = getPass();
    if(cached){
      if(next){
        validate(cached).then(function(res){ if(res.ok === true || res.ok === null) open(); else { clearPass(); if(input) input.focus(); } });
      } else {
        open();
        validate(cached).then(function(res){ if(res.ok === false){ clearPass(); location.reload(); } });
      }
    } else if(input) input.focus();
  }
  /* Sub page: bounce to the hub gate when the device has no passcode. */
  function require(){
    var pass = getPass();
    if(!pass){ location.replace(HUB + "?next=" + encodeURIComponent(location.href)); return ""; }
    return pass;
  }
  function locked(msg){
    if(!msg || /passcode/i.test(String(msg))){ clearPass(); location.replace(HUB + "?next=" + encodeURIComponent(location.href)); return; }
    alert(msg);
  }

  /* ---------- Manager Desk gate (Oct 23 2026) ----------
     Third tier. The porter vendor's site manager holds this passcode (script property
     OV_MGR_PASSCODE, kind ov_mgr_auth). It opens manager.html and its pages only. It never
     opens the Ops Hub or the team review queue, and the client / team codes do not open it. */
  var MGRKEY = "cwOvationMgrPass", MGRSTAMP = "cwOvationMgrSince", MGRHUB = HUB + "manager.html";
  function mgrTouch(){ ls(function(){ localStorage.setItem(MGRSTAMP, String(Date.now())); }); }
  function mgrGetPass(){
    var v = ls(function(){ return localStorage.getItem(MGRKEY); }) || "";
    var t = Number(ls(function(){ return localStorage.getItem(MGRSTAMP); }) || 0);
    if(v && t && Date.now() - t > MAXAGE){ mgrClearPass(); return ""; }
    if(v) mgrTouch();
    return v;
  }
  function mgrSetPass(p){ ls(function(){ localStorage.setItem(MGRKEY, p); }); mgrTouch(); }
  function mgrClearPass(){ ls(function(){ localStorage.removeItem(MGRKEY); localStorage.removeItem(MGRSTAMP); }); }
  function mgrApi(kind, body){ body = body || {}; body.kind = kind; body.passcode = mgrGetPass(); return post(body); }
  function mgrValidate(pass){
    return post({ kind:"ov_mgr_auth", passcode: pass })
      .then(function(r){ if(r && r.ok === true) return { ok:true, r:r }; return { ok:false, r:r }; })
      .catch(function(){ return { ok:null }; });
  }
  function mgrGate(opts){
    var p = params();
    var next = p.next && p.next.indexOf(HUB + "manager") === 0 ? p.next : "";
    var input = $(opts.input), button = $(opts.button), err = $(opts.err), gate = $(opts.gate), app = $(opts.app);
    function say(m){ if(err) err.textContent = m || ""; }
    function open(){ if(next){ location.replace(next); return; } if(gate) gate.classList.add("hidden"); if(app) app.classList.remove("hidden"); if(opts.onUnlock) opts.onUnlock(); }
    function submit(){
      var v = input ? String(input.value || "").trim() : "";
      if(!v){ say("Enter the passcode."); return; }
      button.disabled = true; button.textContent = "Checking...";
      mgrValidate(v).then(function(res){
        button.disabled = false; button.textContent = "Enter";
        if(res.ok === true){ mgrSetPass(v); open(); }
        else if(res.ok === null) say("Could not reach the server. Check your connection and try again.");
        else { say((res.r && res.r.error && !/wrong/i.test(res.r.error)) ? res.r.error : "That passcode is not right. Ask your City Wide Facility Solutions Manager."); input.value = ""; input.focus(); }
      });
    }
    if(button) button.addEventListener("click", function(e){ e.preventDefault(); submit(); });
    if(input) input.addEventListener("keydown", function(e){ if(e.key === "Enter"){ e.preventDefault(); submit(); } });
    var cached = mgrGetPass();
    if(cached){
      if(next){ mgrValidate(cached).then(function(res){ if(res.ok === true || res.ok === null) open(); else { mgrClearPass(); if(input) input.focus(); } }); }
      else { open(); mgrValidate(cached).then(function(res){ if(res.ok === false){ mgrClearPass(); location.reload(); } }); }
    } else if(input) input.focus();
  }
  function mgrRequire(){
    var pass = mgrGetPass();
    if(!pass){ location.replace(MGRHUB + "?next=" + encodeURIComponent(location.href)); return ""; }
    return pass;
  }
  function mgrLocked(msg){
    if(!msg || /passcode/i.test(String(msg))){ mgrClearPass(); location.replace(MGRHUB + "?next=" + encodeURIComponent(location.href)); return; }
    alert(msg);
  }

  /* ---------- photos ---------- */
  /* Shrinks a camera photo to a JPEG at most `max` px on the long side. Fixes EXIF rotation
     where the browser supports it. Resolves { data, w, h }. */
  function shrink(file, max, quality){
    max = max || 1280; quality = quality || 0.74;
    function draw(src, w, h){
      var s = Math.min(1, max / Math.max(w, h));
      var cw = Math.max(1, Math.round(w * s)), ch = Math.max(1, Math.round(h * s));
      var c = document.createElement("canvas"); c.width = cw; c.height = ch;
      var ctx = c.getContext("2d"); ctx.drawImage(src, 0, 0, cw, ch);
      return { data: c.toDataURL("image/jpeg", quality), w: cw, h: ch };
    }
    if(window.createImageBitmap){
      return createImageBitmap(file, { imageOrientation: "from-image" }).then(function(bm){
        var out = draw(bm, bm.width, bm.height); try { bm.close(); } catch(e){} return out;
      }).catch(function(){ return viaImage(); });
    }
    return viaImage();
    function viaImage(){
      return new Promise(function(res, rej){
        var url = URL.createObjectURL(file); var img = new Image();
        img.onload = function(){ try { res(draw(img, img.naturalWidth, img.naturalHeight)); } catch(e){ rej(e); } URL.revokeObjectURL(url); };
        img.onerror = function(){ URL.revokeObjectURL(url); rej(new Error("Could not read that photo")); };
        img.src = url;
      });
    }
  }
  function thumb(data, max){
    max = max || 240;
    return new Promise(function(res){
      var img = new Image();
      img.onload = function(){
        var s = Math.min(1, max / Math.max(img.width, img.height));
        var c = document.createElement("canvas"); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        res(c.toDataURL("image/jpeg", 0.7));
      };
      img.onerror = function(){ res(data); };
      img.src = data;
    });
  }

  /* Upload photos one at a time. list = [{pid, data}], onEach(i, n, ok). Resolves count failed. */
  function uploadPhotos(id, list, onEach){
    var failed = 0;
    return list.reduce(function(chain, p, i){
      return chain.then(function(){
        if(p.uploaded) { if(onEach) onEach(i, list.length, true); return; }
        return api("ov_photo_put", { id:id, pid:p.pid, data:p.data }).then(function(r){
          if(r && r.ok){ p.uploaded = true; p.fileId = r.fileId; } else failed++;
          if(onEach) onEach(i, list.length, !!(r && r.ok));
        }).catch(function(){ failed++; if(onEach) onEach(i, list.length, false); });
      });
    }, Promise.resolve()).then(function(){ return failed; });
  }

  /* ---------- drafts (phone first) ---------- */
  function draftKey(kind){ return "cwOvDraft_" + kind; }
  function saveDraft(kind, obj){ ls(function(){ localStorage.setItem(draftKey(kind), JSON.stringify(obj)); }); }
  function loadDraft(kind){ var s = ls(function(){ return localStorage.getItem(draftKey(kind)); }); if(!s) return null; try { return JSON.parse(s); } catch(e){ return null; } }
  function clearDraft(kind){ ls(function(){ localStorage.removeItem(draftKey(kind)); }); }

  /* Pending photo queue survives a dropped connection: IndexedDB holds the JPEGs. */
  var DB = null;
  function idb(){
    if(DB) return Promise.resolve(DB);
    return new Promise(function(res, rej){
      if(!window.indexedDB) return rej(new Error("no idb"));
      var req = indexedDB.open("cwOvationHub", 1);
      req.onupgradeneeded = function(){ var db = req.result; if(!db.objectStoreNames.contains("photos")) db.createObjectStore("photos", { keyPath:"key" }); };
      req.onsuccess = function(){ DB = req.result; res(DB); };
      req.onerror = function(){ rej(req.error); };
    });
  }
  function photoStore(key, data){ return idb().then(function(db){ return new Promise(function(res){ var tx = db.transaction("photos", "readwrite"); tx.objectStore("photos").put({ key:key, data:data, at:Date.now() }); tx.oncomplete = function(){ res(true); }; tx.onerror = function(){ res(false); }; }); }).catch(function(){ return false; }); }
  function photoLoad(key){ return idb().then(function(db){ return new Promise(function(res){ var r = db.transaction("photos").objectStore("photos").get(key); r.onsuccess = function(){ res(r.result ? r.result.data : null); }; r.onerror = function(){ res(null); }; }); }).catch(function(){ return null; }); }
  function photoDrop(prefix){ return idb().then(function(db){ return new Promise(function(res){ var st = db.transaction("photos", "readwrite").objectStore("photos"); var c = st.openCursor(); c.onsuccess = function(){ var cur = c.result; if(!cur) return res(true); if(String(cur.key).indexOf(prefix) === 0) cur.delete(); cur.continue(); }; c.onerror = function(){ res(false); }; }); }).catch(function(){ return false; }); }

  function fmtDate(iso){
    if(!iso) return "";
    var d = new Date(iso); if(isNaN(d)) return String(iso);
    return d.toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" }) + " " + d.toLocaleTimeString("en-US", { hour:"numeric", minute:"2-digit" });
  }
  function weekday(ymd){
    if(!ymd) return "";
    var p = ymd.split("-"); var d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    return ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][d.getDay()] || "";
  }
  function today(){ var d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }

  function porterProp(v){ if(v !== undefined){ ls(function(){ localStorage.setItem("cwOvPorterProp", v || ""); }); return v; } return ls(function(){ return localStorage.getItem("cwOvPorterProp"); }) || ""; }
  /* Open a base64 PDF. Pass the window opened synchronously in the tap handler (phones block
     window.open after an await); falls back to a download link. */
  function openPdf(dataUri, name, win){
    try {
      var b64 = dataUri.split(",")[1]; var bin = atob(b64); var bytes = new Uint8Array(bin.length);
      for(var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      var blob = new Blob([bytes], { type:"application/pdf" }); var url = URL.createObjectURL(blob);
      if(win && !win.closed){ win.location.href = url; return true; }
      var w = window.open(url, "_blank");
      if(!w){ var a = document.createElement("a"); a.href = url; a.download = name || "report.pdf"; document.body.appendChild(a); a.click(); a.remove(); }
      return true;
    } catch(e){ if(win) try { win.close(); } catch(e2){} return false; }
  }
  window.OV = { WEBHOOK:WEBHOOK, porterProp:porterProp, openPdf:openPdf, HUB:HUB, LOGO:LOGO, PROPERTIES:PROPERTIES, GROUPS:GROUPS, AREAS:AREAS, PASSES:PASSES,
    esc:esc, uid:uid, $:$, params:params, byName:byName, awarded:awarded, propertyOptions:propertyOptions,
    getPass:getPass, setPass:setPass, clearPass:clearPass, isTeam:isTeam, post:post, api:api, validate:validate, hubGate:hubGate, require:require, locked:locked,
    mgrGate:mgrGate, mgrRequire:mgrRequire, mgrApi:mgrApi, mgrLocked:mgrLocked, mgrGetPass:mgrGetPass, mgrClearPass:mgrClearPass, MGRHUB:MGRHUB,
    shrink:shrink, thumb:thumb, uploadPhotos:uploadPhotos, saveDraft:saveDraft, loadDraft:loadDraft, clearDraft:clearDraft,
    photoStore:photoStore, photoLoad:photoLoad, photoDrop:photoDrop, fmtDate:fmtDate, weekday:weekday, today:today };
})();
