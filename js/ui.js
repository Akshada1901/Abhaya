/* ============================================================
   js/ui.js
   Toast, modal helpers, shake detection, keyboard shortcut.
   Shake now calls executeSOS('shake') so the trigger method
   is correctly logged to the DB.
   ============================================================ */

let toastTimeout;

function showToast(icon, msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-icon').textContent = icon;
  document.getElementById('toast-text').textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

function showModal(id) { document.getElementById(id).classList.add('show'); }
function hideModal(id) { document.getElementById(id).classList.remove('show'); }

/* Close modal on backdrop click */
document.addEventListener('click', e => {
  document.querySelectorAll('.overlay').forEach(o => {
    if (e.target === o) o.classList.remove('show');
  });
});

/* ── Shake detection ── */
function handleShake(event) {
  if (!state.shakeEnabled) return;
  const a = event.accelerationIncludingGravity;
  if (!a) return;
  const total = Math.abs(a.x||0) + Math.abs(a.y||0) + Math.abs(a.z||0);
  const now   = Date.now();
  if (total > 30 && now - state.lastShakeTime > 400) {
    state.lastShakeTime = now;
    state.shakeCount++;
    showToast('📳', `Shake ${state.shakeCount}/3 detected`);
    if (state.shakeCount >= 3) {
      state.shakeCount = 0;
      triggerSOS();           /* SOS logs method='shake' in executeSOS */
    }
    setTimeout(() => { state.shakeCount = 0; }, 3000);
  }
}

if (window.DeviceMotionEvent) window.addEventListener('devicemotion', handleShake);

/* Press 'S' in browser to simulate shake (demo/dev) */
document.addEventListener('keydown', e => {
  if (e.key === 's' && state.shakeEnabled && state.currentScreen === 'screen-home')
    handleShake({ accelerationIncludingGravity: { x:35, y:0, z:0 } });
});