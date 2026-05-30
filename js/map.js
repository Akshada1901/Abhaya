/* ============================================================
   js/map.js
   Leaflet live safety map — blue-white CartoDB Voyager tiles.
   Loads real danger-zone reports from DB.
   Saves new reports to DB.
   Captures user GPS coordinates into state for SOS logging.
   ============================================================ */

function initMap() {
  if (state.mapInitialized) return;
  state.mapInitialized = true;

  const defaultLat = 13.0827;
  const defaultLng = 80.2707;

  const map = L.map('map-container', { zoomControl: false, attributionControl: false })
    .setView([defaultLat, defaultLng], 13);

  /* Light blue-white tile layer — CartoDB Voyager (free, no API key needed) */
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
  }).addTo(map);

  state.map = map;

  /* ── Marker icons ── */
  const userIcon = L.divIcon({
    html: '<div style="width:18px;height:18px;background:#3b82f6;border:3px solid #fff;border-radius:50%;box-shadow:0 0 0 4px rgba(59,130,246,0.3)"></div>',
    iconSize:[18,18], iconAnchor:[9,9], className:'',
  });
  const dangerIcon = L.divIcon({
    html: '<div style="width:16px;height:16px;background:#ff2d55;border:2px solid #fff;border-radius:50%;box-shadow:0 0 0 4px rgba(255,45,85,0.3)"></div>',
    iconSize:[16,16], iconAnchor:[8,8], className:'',
  });
  const safeIcon = L.divIcon({
    html: '<div style="width:14px;height:14px;background:#00c9a7;border:2px solid #fff;border-radius:50%;box-shadow:0 0 0 4px rgba(0,201,167,0.3)"></div>',
    iconSize:[14,14], iconAnchor:[7,7], className:'',
  });
  const guardianIcon = L.divIcon({
    html: '<div style="width:14px;height:14px;background:#ffd60a;border:2px solid #fff;border-radius:50%;box-shadow:0 0 0 4px rgba(255,214,10,0.3)"></div>',
    iconSize:[14,14], iconAnchor:[7,7], className:'',
  });

  /* ── Geolocation ── */
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        /* Store in state so SOS can log it */
        state.userLat = lat;
        state.userLng = lng;

        map.setView([lat, lng], 14);
        L.marker([lat, lng], { icon: userIcon }).addTo(map).bindPopup('📍 You are here');

        /* Load real DB reports near user */
        loadReportsFromDB(map, dangerIcon, lat, lng);
        addDemoMarkers(map, safeIcon, guardianIcon, lat, lng);
      },
      () => {
        L.marker([defaultLat, defaultLng], { icon: userIcon }).addTo(map).bindPopup('📍 You (approximate)');
        loadReportsFromDB(map, dangerIcon, defaultLat, defaultLng);
        addDemoMarkers(map, safeIcon, guardianIcon, defaultLat, defaultLng);
      }
    );
  } else {
    L.marker([defaultLat, defaultLng], { icon: userIcon }).addTo(map).bindPopup('📍 You');
    loadReportsFromDB(map, dangerIcon, defaultLat, defaultLng);
    addDemoMarkers(map, safeIcon, guardianIcon, defaultLat, defaultLng);
  }

  /* ── Show "unsafe area" banner randomly on map tap ── */
  map.on('click', () => {
    if (Math.random() < 0.3) {
      const alert = document.getElementById('map-alert');
      alert.classList.add('show');
      setTimeout(() => alert.classList.remove('show'), 4000);
    }
  });
}

/* ── Load danger reports from DB ── */
async function loadReportsFromDB(map, dangerIcon, lat, lng) {
  try {
    const res  = await fetch(`${API}/reports?lat=${lat}&lng=${lng}&radius=10`);
    const data = await res.json();

    if (data.success && data.data.length > 0) {
      data.data.forEach(r => {
        L.marker([parseFloat(r.latitude), parseFloat(r.longitude)], { icon: dangerIcon })
          .addTo(map)
          .bindPopup(`⚠️ ${r.threat_type}: ${r.description.substring(0, 60)}...`);
        L.circle([parseFloat(r.latitude), parseFloat(r.longitude)], {
          radius: 150, color: '#ff2d55', fillColor: '#ff2d55', fillOpacity: 0.08, weight: 1,
        }).addTo(map);
      });
    } else {
      /* Fallback sample markers when DB has no reports yet */
      addFallbackDangerMarkers(map, dangerIcon, lat, lng);
    }
  } catch (err) {
    console.warn('Could not load reports from DB, using samples:', err);
    addFallbackDangerMarkers(map, dangerIcon, lat, lng);
  }
}

/* ── Fallback danger markers (shown when DB is empty) ── */
function addFallbackDangerMarkers(map, dangerIcon, lat, lng) {
  const dangers = [
    { offset:[0.008,0.012],  note:'⚠️ Reported: Poor lighting & harassment' },
    { offset:[-0.012,0.006], note:'⚠️ Reported: Isolated area at night' },
    { offset:[0.005,-0.015], note:'⚠️ Reported: Suspicious activity' },
  ];
  dangers.forEach(d => {
    L.marker([lat+d.offset[0], lng+d.offset[1]], { icon: dangerIcon }).addTo(map).bindPopup(d.note);
    L.circle([lat+d.offset[0], lng+d.offset[1]], {
      radius:150, color:'#ff2d55', fillColor:'#ff2d55', fillOpacity:0.08, weight:1,
    }).addTo(map);
  });
}

/* ── Demo safe + guardian markers ── */
function addDemoMarkers(map, safeIcon, guardianIcon, lat, lng) {
  const safes = [
    { offset:[0.003,0.003],   note:'✅ Police Station nearby' },
    { offset:[-0.005,-0.008], note:'✅ Well-lit commercial area' },
  ];
  safes.forEach(s =>
    L.marker([lat+s.offset[0], lng+s.offset[1]], { icon: safeIcon }).addTo(map).bindPopup(s.note)
  );

  /* Guardian markers from state */
  state.guardians.slice(0, 2).forEach((g, i) => {
    const offsets = [[0.015, 0.01], [-0.009, 0.018]];
    if (offsets[i]) {
      L.marker([lat+offsets[i][0], lng+offsets[i][1]], { icon: guardianIcon })
        .addTo(map)
        .bindPopup(`👥 Guardian: ${g.name}`);
    }
  });
}

/* ── Report unsafe modal ── */
function showReportModal() { showModal('report-modal'); }

/* ── Submit report → save to DB ── */
async function submitReport() {
  const desc = document.getElementById('report-desc').value.trim();
  const type = document.getElementById('report-type').value;
  if (!desc || !type) { showToast('⚠️', 'Please fill all fields'); return; }

  hideModal('report-modal');
  document.getElementById('report-desc').value = '';
  document.getElementById('report-type').value = '';
  showToast('✅', 'Report submitted. Thank you for keeping others safe!');

  if (state.userId) {
    try {
      await fetch(`${API}/reports`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          user_id:      state.userId,
          latitude:     state.userLat || 13.0827,
          longitude:    state.userLng || 80.2707,
          description:  desc,
          threat_type:  type,
          city:         '',
        }),
      });
    } catch (err) {
      console.warn('Could not save report to DB:', err);
    }
  }
}