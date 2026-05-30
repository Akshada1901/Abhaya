/* ============================================================
   js/state.js
   Single source of truth for all app state.
   userId and authToken are populated after successful login.
   ============================================================ */
const state = {
  /* Auth */
  lang:            'en',
  currentScreen:   'screen-splash',
  userPhone:       '',
  userId:          null,       /* set after verify-otp */
  authToken:       null,       /* set after verify-otp */

  /* Safety features */
  voiceEnabled:    false,
  shakeEnabled:    true,
  locationEnabled: true,
  codeword:        'Help me',

  /* SOS */
  sosActive:       false,
  sosTimer:        null,
  sosCountdown:    5,

  /* Guardians — seeded with demo data, replaced by DB on login */
  guardians: [
    { id:1, name:'Amma (Mother)', phone:'9876543210', relation:'Mother', emoji:'👩‍👧', color:'rgba(255,45,85,0.15)' },
    { id:2, name:'Akka (Sister)', phone:'9123456789', relation:'Sister', emoji:'👭',  color:'rgba(59,130,246,0.15)' },
    { id:3, name:'Ramya Friend',  phone:'9988776655', relation:'Friend', emoji:'🤝',  color:'rgba(0,201,167,0.15)'  },
  ],

  /* Map */
  map:             null,
  mapInitialized:  false,
  userLat:         null,
  userLng:         null,

  /* Shake */
  shakeCount:      0,
  lastShakeTime:   0,
};

/* ── API base URL — change this if XAMPP is on a different port ── */
const API = 'api/index.php';