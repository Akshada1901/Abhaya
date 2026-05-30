/* js/screens.js — Injects all screen HTML + handles goTo / switchTab */

document.getElementById('screen-root').innerHTML = `
  <!-- SCREEN 1: SPLASH -->
  <div class="screen active" id="screen-splash">
    <div class="splash-shield">🛡️</div>
    <div class="splash-title"><h1>Abhaya</h1><span class="tamil">அபயா</span></div>
    <p class="splash-tagline">Protection Before Danger</p>
    <div class="splash-progress"><div class="splash-progress-bar" id="splash-bar"></div></div>
    <p style="font-family:var(--font-main);font-size:11px;color:var(--text-muted);margin-top:8px;">Tamil Nadu Government · Women Safety Initiative</p>
  </div>

  <!-- SCREEN 2: LOGIN -->
  <div class="screen" id="screen-login">
    <div class="login-header">
      <div class="login-logo">
        <div class="icon">🛡️</div>
        <div class="login-logo-text"><h2>Abhaya</h2><span>அபயா</span></div>
      </div>
      <p class="login-tagline">Protection Before Danger</p>
    </div>
    <div class="login-hero-text anim-fade-up">
      <h1>Your <span>Safety</span><br>Starts Here</h1>
      <p>Enter your mobile number to receive a one-time verification code. Your data stays private.</p>
    </div>
    <div class="form-group anim-fade-up delay-1">
      <label class="form-label">Mobile Number</label>
      <div class="input-wrap">
        <span class="input-prefix">+91</span>
        <input type="tel" class="form-input" id="phone-input" placeholder="Enter 10-digit number" maxlength="10" inputmode="numeric" pattern="[0-9]*">
      </div>
      <p class="error-msg" id="phone-error">Please enter a valid 10-digit mobile number</p>
    </div>
    <button class="btn-primary anim-fade-up delay-2" id="get-otp-btn" onclick="handleGetOTP()">Get OTP →</button>
    <div class="divider anim-fade-up delay-3"><span>or</span></div>
    <button class="btn-secondary anim-fade-up delay-3" onclick="skipToDemo()">Continue as Demo User</button>
    <p style="font-family:var(--font-main);font-size:11px;color:var(--text-muted);text-align:center;margin-top:24px;line-height:1.7;" class="anim-fade-up delay-4">By continuing you agree to our Terms of Service.<br>Your number is used only for authentication.</p>
  </div>

  <!-- SCREEN 3: OTP -->
  <div class="screen" id="screen-otp">
    <div class="otp-back" onclick="goTo('screen-login')">←</div>
    <div class="otp-header anim-fade-up">
      <h2>Verify OTP</h2>
      <p>A 4-digit code was sent to<br><strong id="otp-phone-display">+91 98765 43210</strong></p>
    </div>
    <div class="otp-boxes">
      <input class="otp-box" maxlength="1" inputmode="numeric" pattern="[0-9]" id="otp-0" oninput="otpInput(this,0)">
      <input class="otp-box" maxlength="1" inputmode="numeric" pattern="[0-9]" id="otp-1" oninput="otpInput(this,1)">
      <input class="otp-box" maxlength="1" inputmode="numeric" pattern="[0-9]" id="otp-2" oninput="otpInput(this,2)">
      <input class="otp-box" maxlength="1" inputmode="numeric" pattern="[0-9]" id="otp-3" oninput="otpInput(this,3)">
    </div>
    <div class="otp-timer">
      <span>Resend OTP in <strong id="otp-countdown">30s</strong></span><br>
      <button class="resend-btn" id="resend-btn" disabled onclick="resendOTP()">Resend</button>
    </div>
    <p style="font-family:var(--font-main);font-size:12px;color:rgba(255,214,10,0.7);text-align:center;margin-bottom:20px;">🔑 Demo OTP: <strong style="letter-spacing:4px;">1234</strong></p>
    <button class="btn-primary" id="verify-btn" onclick="verifyOTP()" disabled>Verify &amp; Continue</button>
    <p style="font-family:var(--font-main);font-size:11px;color:var(--text-muted);text-align:center;margin-top:20px;">Having trouble? Contact support at 1091</p>
  </div>

  <!-- SCREEN 4: HOME DASHBOARD -->
  <div class="screen" id="screen-home">
    <div class="home-header">
      <div class="home-logo-wrap">
        <h1>Abhaya</h1>
        <span class="home-tamil">அபயா</span>
        <span class="home-tagline">Protection before danger</span>
      </div>
      <div class="lang-toggle">
        <button class="lang-btn active" id="lang-en" onclick="setLang('en')">EN</button>
        <button class="lang-btn" id="lang-ta" onclick="setLang('ta')">தமிழ்</button>
      </div>
    </div>
    <div class="status-bar anim-fade-up">
      <div class="status-dot"></div>
      <span class="status-text" id="status-text">You are safe • Location shared with 3 guardians</span>
    </div>
    <div class="sos-section">
      <div class="sos-ring-outer">
        <button class="sos-btn" id="sos-main-btn" onclick="triggerSOS()">
          <span class="sos-icon">🆘</span>
          <span class="sos-label">SOS</span>
          <span class="sos-sub" id="sos-sub-text">HOLD FOR HELP</span>
        </button>
      </div>
      <p class="sos-hint" id="sos-hint"><strong>Tap once</strong> for instant alert · <strong>Shake 3×</strong> for auto-trigger<br>Your live location will be shared with all guardians</p>
    </div>
    <div class="travel-card anim-fade-up delay-1" id="travel-card">
      <div class="travel-header">
        <span class="travel-title" id="travel-card-title">🚶 Live Travel</span>
        <span class="travel-status-badge safe" id="travel-badge">Safe</span>
      </div>
      <div class="travel-route">
        <span class="route-point">📍 Anna Nagar</span>
        <span class="route-arrow">→</span>
        <span class="route-point">🏠 Velachery</span>
      </div>
      <div class="travel-progress-bar">
        <div class="travel-progress-fill" id="travel-progress" style="width:45%"></div>
      </div>
      <p class="travel-eta" id="travel-eta-text">ETA: <strong>28 mins</strong> · Shared with 3 guardians</p>
    </div>
    <p class="features-label" id="quick-actions-label">Quick Actions</p>
    <div class="features-grid">
      <div class="feat-card teal" onclick="activateFakeCall()">
        <span class="feat-badge on"></span><span class="feat-icon">📞</span>
        <div class="feat-title" id="feat-fake-call">Fake Call</div>
        <div class="feat-desc"  id="desc-fake-call">Simulate an incoming call to escape danger</div>
      </div>
      <div class="feat-card blue" onclick="goTo('screen-map')">
        <span class="feat-badge on"></span><span class="feat-icon">🗺️</span>
        <div class="feat-title" id="feat-live-map">Live Map</div>
        <div class="feat-desc"  id="desc-live-map">View danger zones &amp; safe routes</div>
      </div>
      <div class="feat-card gold" onclick="toggleVoice()">
        <span class="feat-badge" id="voice-badge"></span><span class="feat-icon">🎤</span>
        <div class="feat-title" id="feat-voice">Voice Trigger</div>
        <div class="feat-desc"  id="voice-desc">Say codeword to send SOS</div>
      </div>
      <div class="feat-card rose" onclick="goTo('screen-guardians')">
        <span class="feat-badge on"></span><span class="feat-icon">👥</span>
        <div class="feat-title" id="feat-guardians">Guardians</div>
        <div class="feat-desc"  id="desc-guardians">3 trusted contacts ready</div>
      </div>
    </div>
    <div style="height:8px;"></div>
  </div>

  <!-- SCREEN 5: LIVE MAP -->
  <div class="screen" id="screen-map">
    <div class="map-header">
      <h2>🗺️ Live Safety Map</h2>
      <button class="map-report-btn" onclick="showReportModal()">⚠️ Report Unsafe</button>
    </div>
    <div class="map-alert" id="map-alert"><span>⚠️</span><span class="map-alert-text">This area was reported unsafe recently by 3 users</span></div>
    <div id="map-container"></div>
    <div class="map-legend">
      <div class="legend-item"><div class="legend-dot" style="background:#3b82f6;box-shadow:0 0 6px rgba(59,130,246,0.6)"></div><span class="legend-text">You</span></div>
      <div class="legend-item"><div class="legend-dot" style="background:#ff2d55;box-shadow:0 0 6px rgba(255,45,85,0.6)"></div><span class="legend-text">Danger Zone</span></div>
      <div class="legend-item"><div class="legend-dot" style="background:#00c9a7;box-shadow:0 0 6px rgba(0,201,167,0.6)"></div><span class="legend-text">Safe Zone</span></div>
      <div class="legend-item"><div class="legend-dot" style="background:#ffd60a;box-shadow:0 0 6px rgba(255,214,10,0.6)"></div><span class="legend-text">Guardian</span></div>
    </div>
  </div>

  <!-- SCREEN 6: GUARDIANS -->
  <div class="screen" id="screen-guardians">
    <div class="screen-header">
      <h2>👥 Guardians</h2>
      <div class="header-action" onclick="toggleAddGuardian()">➕</div>
    </div>
    <div class="add-guardian-form" id="add-guardian-form">
      <p style="font-family:var(--font-main);font-size:13px;font-weight:600;color:var(--text-primary);margin-bottom:14px;">Add Trusted Contact</p>
      <div class="form-row" style="margin-bottom:12px;">
        <input class="form-input-sm" id="g-name"     placeholder="Full Name">
        <input class="form-input-sm" id="g-phone"    placeholder="Phone (10 digits)" inputmode="numeric" maxlength="10">
      </div>
      <input class="form-input-sm" id="g-relation" placeholder="Relationship (e.g. Mother, Sister)" style="margin-bottom:12px;">
      <button class="btn-primary" style="padding:14px;" onclick="addGuardian()">Add Guardian</button>
    </div>
    <div id="guardians-list"></div>
  </div>

  <!-- SCREEN 7: SETTINGS -->
  <div class="screen" id="screen-settings">
    <div class="screen-header"><h2>⚙️ Settings</h2></div>
    <div class="profile-card">
      <div class="profile-avatar-lg">👩</div>
      <div class="profile-info"><h3 id="profile-name">Priya Devi</h3><p id="profile-phone">+91 98765 43210</p></div>
      <div class="profile-badge">Protected</div>
    </div>
    <div class="settings-section">
      <p class="settings-section-label">Safety Features</p>
      <div class="setting-row" onclick="toggleSetting('shake')">
        <div class="setting-left"><div class="setting-icon-wrap" style="background:rgba(255,45,85,0.1);">📳</div><div class="setting-texts"><div class="setting-title">Shake Detection</div><div class="setting-sub">Shake 3× to trigger SOS alert</div></div></div>
        <div class="toggle-switch on" id="toggle-shake"><div class="toggle-knob"></div></div>
      </div>
      <div class="setting-row" onclick="toggleSetting('voice')">
        <div class="setting-left"><div class="setting-icon-wrap" style="background:rgba(255,214,10,0.1);">🎤</div><div class="setting-texts"><div class="setting-title">Voice Trigger</div><div class="setting-sub" id="voice-codeword-display">Codeword: "Help me"</div></div></div>
        <div class="toggle-switch" id="toggle-voice"><div class="toggle-knob"></div></div>
      </div>
      <div class="setting-row" onclick="toggleSetting('location')">
        <div class="setting-left"><div class="setting-icon-wrap" style="background:rgba(59,130,246,0.1);">📍</div><div class="setting-texts"><div class="setting-title">Live Location Sharing</div><div class="setting-sub">Always share with guardians</div></div></div>
        <div class="toggle-switch on" id="toggle-location"><div class="toggle-knob"></div></div>
      </div>
    </div>
    <div class="settings-section">
      <p class="settings-section-label">Preferences</p>
      <div class="setting-row" onclick="goTo('screen-guardians')">
        <div class="setting-left"><div class="setting-icon-wrap" style="background:rgba(0,201,167,0.1);">👥</div><div class="setting-texts"><div class="setting-title">Manage Guardians</div><div class="setting-sub">3 contacts configured</div></div></div>
        <span class="chevron">›</span>
      </div>
      <div class="setting-row" onclick="changeCodword()">
        <div class="setting-left"><div class="setting-icon-wrap" style="background:rgba(255,107,138,0.1);">🔑</div><div class="setting-texts"><div class="setting-title">Change Codeword</div><div class="setting-sub">Currently: "Help me"</div></div></div>
        <span class="chevron">›</span>
      </div>
      <div class="setting-row">
        <div class="setting-left"><div class="setting-icon-wrap" style="background:rgba(255,214,10,0.1);">🌐</div><div class="setting-texts"><div class="setting-title">Language</div><div class="setting-sub">English / தமிழ்</div></div></div>
        <div class="lang-toggle"><button class="lang-btn active" onclick="setLang('en')">EN</button><button class="lang-btn" onclick="setLang('ta')">தமிழ்</button></div>
      </div>
    </div>
    <div class="settings-section">
      <p class="settings-section-label">Emergency</p>
      <div class="setting-row" style="border-color:rgba(255,45,85,0.15);" onclick="callEmergency()">
        <div class="setting-left"><div class="setting-icon-wrap" style="background:rgba(255,45,85,0.15);">📞</div><div class="setting-texts"><div class="setting-title" style="color:var(--accent-red);">Call Women Helpline</div><div class="setting-sub">1091 · Available 24/7</div></div></div>
        <span class="chevron" style="color:var(--accent-red);">›</span>
      </div>
      <div class="setting-row" onclick="confirmLogout()">
        <div class="setting-left"><div class="setting-icon-wrap" style="background:rgba(255,255,255,0.05);">🚪</div><div class="setting-texts"><div class="setting-title">Sign Out</div><div class="setting-sub">Logout from this device</div></div></div>
        <span class="chevron">›</span>
      </div>
    </div>
    <div style="height:8px;"></div>
  </div>
`;

function goTo(screenId) {
  const prev = document.getElementById(state.currentScreen);
  const next = document.getElementById(screenId);
  if (!next || screenId === state.currentScreen) return;
  prev.classList.add('slide-left');
  setTimeout(() => {
    prev.classList.remove('active', 'slide-left');
    next.classList.add('active');
    state.currentScreen = screenId;
    if (screenId === 'screen-map' && !state.mapInitialized) initMap();
  }, 350);
}

function switchTab(tab) {
  const screenMap = { home:'screen-home', map:'screen-map', guardians:'screen-guardians', settings:'screen-settings' };
  const navMap    = { home:'nav-home',    map:'nav-map',    guardians:'nav-guardians',    settings:'nav-settings'    };
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(navMap[tab]).classList.add('active');
  const prev = document.getElementById(state.currentScreen);
  const next = document.getElementById(screenMap[tab]);
  if (!next || screenMap[tab] === state.currentScreen) return;
  prev.classList.remove('active');
  next.classList.add('active');
  state.currentScreen = screenMap[tab];
  if (tab === 'map' && !state.mapInitialized) setTimeout(initMap, 100);
}