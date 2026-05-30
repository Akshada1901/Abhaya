/* ============================================================
   js/sos.js
   SOS trigger, countdown, cancel, execute.
   Logs each alert to the DB via api/sos.
   ============================================================ */

function triggerSOS() {
  if (state.sosActive) return;
  state.sosActive = true;
  document.getElementById('sos-main-btn').classList.add('triggered');
  document.getElementById('sos-overlay').classList.add('show');

  state.sosCountdown = 5;
  document.getElementById('sos-countdown').textContent = state.sosCountdown;
  document.getElementById('sos-count-text').textContent = state.sosCountdown;

  state.sosTimer = setInterval(() => {
    state.sosCountdown--;
    document.getElementById('sos-countdown').textContent = state.sosCountdown;
    document.getElementById('sos-count-text').textContent = state.sosCountdown;
    if (state.sosCountdown <= 0) {
      clearInterval(state.sosTimer);
      executeSOS('button');
    }
  }, 1000);
}

async function executeSOS(triggerMethod = 'button') {
  document.getElementById('sos-overlay').classList.remove('show');
  state.sosActive = false;
  document.getElementById('sos-main-btn').classList.remove('triggered');

  showToast('🚨', 'SOS sent to all guardians! Location shared.');

  /* Show per-guardian toasts */
  state.guardians.forEach((g, i) => {
    setTimeout(() => showToast('📤', 'Alert sent to ' + g.name), (i + 1) * 1500);
  });

  /* Log to DB */
  if (state.userId) {
    try {
      await fetch(`${API}/sos`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          user_id:        state.userId,
          trigger_method: triggerMethod,
          latitude:       state.userLat || 0,
          longitude:      state.userLng || 0,
          address:        '',
        }),
      });
    } catch (err) {
      console.warn('Could not log SOS to DB:', err);
    }
  }
}

function cancelSOS() {
  clearInterval(state.sosTimer);
  state.sosActive = false;
  document.getElementById('sos-overlay').classList.remove('show');
  document.getElementById('sos-main-btn').classList.remove('triggered');
  showToast('✋', 'SOS Cancelled');
}