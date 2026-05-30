/* js/lang.js — setLang() updates every translatable string on screen */
function setLang(lang) {
  state.lang = lang;
  const tv = t[lang];
  // Nav labels (data-en / data-ta attributes)
  document.querySelectorAll('[data-en]').forEach(el => {
    el.textContent = el.dataset[lang] || el.dataset.en;
  });
  // Status bar
  document.getElementById('status-text').textContent = tv.status;
  // SOS
  document.getElementById('sos-sub-text').textContent = tv.sosSub;
  document.getElementById('sos-hint').innerHTML       = tv.sosHint;
  // Feature card titles
  document.getElementById('feat-fake-call').textContent  = tv.featFakeCall;
  document.getElementById('feat-live-map').textContent   = tv.featLiveMap;
  document.getElementById('feat-voice').textContent      = tv.featVoice;
  document.getElementById('feat-guardians').textContent  = tv.featGuardians;
  // Feature card descriptions
  document.getElementById('desc-fake-call').textContent  = tv.descFakeCall;
  document.getElementById('desc-live-map').textContent   = tv.descLiveMap;
  document.getElementById('desc-guardians').textContent  = tv.descGuardians;
  document.getElementById('voice-desc').innerHTML        = state.voiceEnabled ? tv.voiceOn : tv.voiceOff;
  // Travel card
  document.getElementById('travel-card-title').innerHTML = tv.travelTitle;
  document.getElementById('travel-eta-text').innerHTML   = tv.travelEta;
  // Section label
  document.getElementById('quick-actions-label').textContent = tv.quickActions;
  // Highlight active lang buttons (both home and settings toggles)
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  const homeBtn = document.getElementById(lang === 'en' ? 'lang-en' : 'lang-ta');
  if (homeBtn) homeBtn.classList.add('active');
  document.querySelectorAll('.lang-btn').forEach(b => {
    if ((lang === 'en' && b.textContent.trim() === 'EN') ||
        (lang === 'ta' && b.textContent.trim() === 'தமிழ்')) {
      b.classList.add('active');
    }
  });
}