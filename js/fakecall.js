/* js/fakecall.js — Fake incoming call simulation */
function activateFakeCall() {
  document.getElementById('fake-call-overlay').classList.add('show');
  if (navigator.vibrate) navigator.vibrate([300, 100, 300, 100, 300]);
}
function endFakeCall() {
  document.getElementById('fake-call-overlay').classList.remove('show');
}
function acceptFakeCall() {
  document.getElementById('fake-call-overlay').classList.remove('show');
  showToast('📱', 'Call connected. Stay safe!');
}