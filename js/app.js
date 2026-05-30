/* js/app.js — Bootstrap: splash, navigation init, travel simulation */
window.addEventListener('DOMContentLoaded', () => {
  // Start splash progress bar
  setTimeout(() => {
    const bar = document.getElementById('splash-bar');
    if (bar) bar.style.width = '100%';
  }, 100);
  // Advance to login after splash
  setTimeout(() => goTo('screen-login'), 2800);
  // Render initial guardian list
  renderGuardians();
  // Simulate live travel progress
  simulateTravelProgress();
});

function simulateTravelProgress() {
  let pct = 45;
  setInterval(() => {
    pct = Math.min(100, pct + Math.random() * 1.5);
    const bar = document.getElementById('travel-progress');
    if (bar) bar.style.width = pct + '%';
    if (pct >= 95) {
      const badge = document.getElementById('travel-badge');
      if (badge) {
        badge.textContent = state.lang === 'ta' ? 'சேர்ந்தது' : 'Reached';
        badge.className = 'travel-status-badge safe';
      }
    }
  }, 8000);
}