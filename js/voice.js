/* js/voice.js — Voice codeword detection (Web Speech API) */
function toggleVoice() {
  state.voiceEnabled = !state.voiceEnabled;
  const badge = document.getElementById('voice-badge');
  const desc  = document.getElementById('voice-desc');
  badge.className = 'feat-badge ' + (state.voiceEnabled ? 'on' : 'off');
  const tv = t[state.lang];
  desc.innerHTML = state.voiceEnabled ? tv.voiceOn : tv.voiceOff;
  if (state.voiceEnabled) {
    showToast('🎤', 'Voice trigger enabled. Say "' + state.codeword + '"');
    startVoiceDetection();
    document.getElementById('toggle-voice').classList.add('on');
  } else {
    showToast('🔇', 'Voice trigger disabled');
    document.getElementById('toggle-voice').classList.remove('on');
  }
}

function startVoiceDetection() {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    showToast('⚠️', 'Speech recognition not supported in this browser');
    return;
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SR();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-IN';
  recognition.onresult = (e) => {
    const transcript = Array.from(e.results).map(r => r[0].transcript).join('').toLowerCase();
    if (transcript.includes(state.codeword.toLowerCase())) {
      recognition.stop();
      triggerSOS();
    }
  };
  recognition.onerror = () => {};
  try { recognition.start(); } catch(e) {}
}