/* ============================================================
   js/auth.js
   Phone validation, OTP send/verify via real PHP API.
   Stores user_id + token in state on successful login.
   ============================================================ */

/* ── Live input: strip non-digits ── */
document.addEventListener('DOMContentLoaded', () => {
  const phoneInput = document.getElementById('phone-input');
  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      this.value = this.value.replace(/\D/g, '');
      this.classList.remove('error');
      document.getElementById('phone-error').classList.remove('show');
    });
  }
});

/* ── Send OTP: calls api/send-otp ── */
async function handleGetOTP() {
  const input = document.getElementById('phone-input');
  const phone = input.value;

  if (!/^\d{10}$/.test(phone)) {
    input.classList.add('error');
    document.getElementById('phone-error').classList.add('show');
    return;
  }

  const btn = document.getElementById('get-otp-btn');
  btn.disabled = true;
  btn.textContent = 'Sending...';

  try {
    const res  = await fetch('api/index.php/send-otp', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ phone }),
    });
    const data = await res.json();

    if (!data.success) {
      showToast('❌', data.error || 'Failed to send OTP');
      btn.disabled = false;
      btn.textContent = 'Get OTP →';
      return;
    }

    /* Save phone in state */
    state.userPhone = phone;
    document.getElementById('otp-phone-display').textContent =
      '+91 ' + phone.slice(0, 5) + ' ' + phone.slice(5);
    document.getElementById('profile-phone').textContent = '+91 ' + phone;

    showToast('📤', 'OTP sent to +91 ' + phone);
    goTo('screen-otp');
    startOTPCountdown();

    /* Clear OTP boxes */
    for (let i = 0; i < 4; i++) {
      document.getElementById('otp-' + i).value = '';
      document.getElementById('otp-' + i).classList.remove('filled');
    }
    document.getElementById('verify-btn').disabled = true;
    setTimeout(() => document.getElementById('otp-0').focus(), 400);

  } catch (err) {
    showToast('⚠️', 'Cannot reach server. Check XAMPP is running.');
    console.error(err);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Get OTP →';
  }
}

/* ── Skip login — demo mode ── */
function skipToDemo() {
  state.userPhone  = '9876543210';
  state.userId     = 1;
  state.authToken  = 'demo-token';
  document.getElementById('profile-phone').textContent = '+91 98765 43210';
  enterDashboard();
}

/* ── OTP countdown timer ── */
let otpInterval;

function startOTPCountdown() {
  let secs = 30;
  document.getElementById('otp-countdown').textContent = secs + 's';
  document.getElementById('resend-btn').disabled = true;
  clearInterval(otpInterval);

  otpInterval = setInterval(() => {
    secs--;
    document.getElementById('otp-countdown').textContent = secs + 's';
    if (secs <= 0) {
      clearInterval(otpInterval);
      document.getElementById('resend-btn').disabled = false;
      document.getElementById('otp-countdown').textContent = '0s';
    }
  }, 1000);
}

/* ── Resend OTP ── */
function resendOTP() {
  handleGetOTP();
}

/* ── OTP box input handler ── */
function otpInput(el, idx) {
  el.value = el.value.replace(/\D/, '');
  if (el.value) {
    el.classList.add('filled');
    if (idx < 3) document.getElementById('otp-' + (idx + 1)).focus();
  } else {
    el.classList.remove('filled');
  }
  let full = '';
  for (let i = 0; i < 4; i++) full += document.getElementById('otp-' + i).value;
  document.getElementById('verify-btn').disabled = full.length < 4;
}

/* ── Verify OTP: calls api/verify-otp ── */
async function verifyOTP() {
  let otp = '';
  for (let i = 0; i < 4; i++) otp += document.getElementById('otp-' + i).value;

  const btn = document.getElementById('verify-btn');
  btn.disabled = true;
  btn.textContent = 'Verifying...';

  try {
    const res  = await fetch('api/index.php/verify-otp', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ phone: state.userPhone, otp }),
    });
    const data = await res.json();

    if (!data.success) {
      /* Shake boxes on wrong OTP */
      for (let i = 0; i < 4; i++) {
        document.getElementById('otp-' + i).classList.add('error');
        setTimeout(() => document.getElementById('otp-' + i).classList.remove('error'), 400);
      }
      showToast('❌', data.error || 'Invalid OTP. Try again.');
      btn.disabled = false;
      btn.textContent = 'Verify & Continue';
      return;
    }

    /* Store credentials in state */
    state.userId    = data.data.user_id;
    state.authToken = data.data.token;

    showToast('✅', 'Verified successfully!');
    setTimeout(enterDashboard, 800);

  } catch (err) {
    showToast('⚠️', 'Cannot reach server. Check XAMPP is running.');
    console.error(err);
    btn.disabled = false;
    btn.textContent = 'Verify & Continue';
  }
}

/* ── Enter dashboard ── */
function enterDashboard() {
  document.getElementById('bottom-nav').style.display = 'flex';

  /* Load guardians from DB (if real user) */
  if (state.userId && state.userId !== 1) {
    loadGuardiansFromDB();
  }

  /* Load settings from DB */
  if (state.userId) {
    loadSettingsFromDB();
  }

  goTo('screen-home');
}