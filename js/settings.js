/* ============================================================
   js/settings.js
   Feature toggles, codeword, emergency call, logout.
   Persists settings to DB after every toggle.
   ============================================================ */

function toggleSetting(key) {
  if (key === 'shake') {
    state.shakeEnabled = !state.shakeEnabled;
    document.getElementById('toggle-shake').classList.toggle('on', state.shakeEnabled);
    showToast(state.shakeEnabled ? '📳' : '🔕',
      `Shake detection ${state.shakeEnabled ? 'enabled' : 'disabled'}`);
  } else if (key === 'voice') {
    toggleVoice();
  } else if (key === 'location') {
    state.locationEnabled = !state.locationEnabled;
    document.getElementById('toggle-location').classList.toggle('on', state.locationEnabled);
    showToast(state.locationEnabled ? '📍' : '📵',
      `Location sharing ${state.locationEnabled ? 'enabled' : 'disabled'}`);
  }
  saveSettingsToDB();
}

function changeCodword() { showModal('codeword-modal'); }

function saveCodword() {
  const val = document.getElementById('new-codeword').value.trim();
  if (!val) return;
  state.codeword = val;
  document.getElementById('voice-codeword-display').textContent = 'Codeword: "' + val + '"';
  hideModal('codeword-modal');
  showToast('🔑', 'Codeword updated to "' + val + '"');
  saveSettingsToDB();
}

function callEmergency() {
  showToast('📞', 'Connecting to Women Helpline 1091...');
}

function confirmLogout() {
  if (confirm('Are you sure you want to sign out?')) {
    document.getElementById('bottom-nav').style.display = 'none';
    /* Clear session */
    state.userId    = null;
    state.authToken = null;
    goTo('screen-login');
    showToast('👋', 'Signed out successfully');
  }
}

/* ── Save all current settings to DB ── */
async function saveSettingsToDB() {
  if (!state.userId) return;
  try {
    await fetch(`${API}/settings`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        user_id:          state.userId,
        language:         state.lang,
        voice_enabled:    state.voiceEnabled ? 1 : 0,
        shake_enabled:    state.shakeEnabled ? 1 : 0,
        location_enabled: state.locationEnabled ? 1 : 0,
        codeword:         state.codeword,
        fake_caller_name: 'Amma',
      }),
    });
  } catch (err) {
    console.warn('Could not save settings to DB:', err);
  }
}

/* ── Load settings from DB on login ── */
async function loadSettingsFromDB() {
  if (!state.userId) return;
  try {
    const res  = await fetch(`${API}/settings?user_id=${state.userId}`);
    const data = await res.json();
    if (!data.success || !data.data) return;

    const s = data.data;
    if (!s.user_id) return;  /* empty row */

    state.lang             = s.language         || 'en';
    state.voiceEnabled     = !!parseInt(s.voice_enabled);
    state.shakeEnabled     = !!parseInt(s.shake_enabled);
    state.locationEnabled  = !!parseInt(s.location_enabled);
    state.codeword         = s.codeword         || 'Help me';

    /* Sync UI toggles */
    document.getElementById('toggle-shake')
      .classList.toggle('on', state.shakeEnabled);
    document.getElementById('toggle-location')
      .classList.toggle('on', state.locationEnabled);
    document.getElementById('toggle-voice')
      .classList.toggle('on', state.voiceEnabled);
    document.getElementById('voice-codeword-display').textContent =
      'Codeword: "' + state.codeword + '"';

    /* Apply saved language */
    setLang(state.lang);

  } catch (err) {
    console.warn('Could not load settings from DB:', err);
  }
}