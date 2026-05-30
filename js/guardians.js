/* ============================================================
   js/guardians.js
   Render, add, and remove guardians.
   Syncs with the DB via the guardians API endpoint.
   ============================================================ */

/* ── Load guardians from DB on login ── */
async function loadGuardiansFromDB() {
  try {
    const res  = await fetch(`${API}/guardians?user_id=${state.userId}`);
    const data = await res.json();
    if (data.success && data.data.length > 0) {
      /* Map DB rows to the shape the UI expects */
      state.guardians = data.data.map(g => ({
        id:       g.id,
        name:     g.name,
        phone:    g.phone,
        relation: g.relation || 'Contact',
        emoji:    '👤',
        color:    'rgba(148,163,184,0.15)',
      }));
      renderGuardians();
    }
  } catch (err) {
    console.warn('Could not load guardians from DB:', err);
  }
}

/* ── Render guardian cards ── */
function renderGuardians() {
  const list = document.getElementById('guardians-list');
  if (state.guardians.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">👥</div>
        <p class="empty-text">No guardians added yet.<br>Add trusted contacts to protect you.</p>
      </div>`;
    return;
  }
  list.innerHTML = state.guardians.map(g => `
    <div class="guardian-card">
      <div class="guardian-avatar" style="background:${g.color}">${g.emoji}</div>
      <div class="guardian-info">
        <div class="guardian-name">${g.name}</div>
        <div class="guardian-phone">+91 ${g.phone}</div>
        <span class="guardian-relation">${g.relation}</span>
      </div>
      <div class="guardian-actions">
        <button class="guardian-btn call" onclick="showToast('📞','Calling ${g.name}...')">📞</button>
        <button class="guardian-btn"      onclick="removeGuardian(${g.id})">🗑️</button>
      </div>
    </div>
  `).join('');
}

function toggleAddGuardian() {
  document.getElementById('add-guardian-form').classList.toggle('show');
}

/* ── Add guardian → POST to DB ── */
async function addGuardian() {
  const name     = document.getElementById('g-name').value.trim();
  const phone    = document.getElementById('g-phone').value.trim();
  const relation = document.getElementById('g-relation').value.trim();

  if (!name)                   { showToast('⚠️', 'Please enter a name'); return; }
  if (!/^\d{10}$/.test(phone)) { showToast('⚠️', 'Enter a valid 10-digit phone number'); return; }

  const newGuardian = {
    id:       Date.now(),   /* temp id, replaced by DB id below */
    name, phone,
    relation: relation || 'Contact',
    emoji:    '👤',
    color:    'rgba(148,163,184,0.15)',
  };

  /* Optimistic UI update */
  state.guardians.push(newGuardian);
  renderGuardians();
  document.getElementById('g-name').value     = '';
  document.getElementById('g-phone').value    = '';
  document.getElementById('g-relation').value = '';
  document.getElementById('add-guardian-form').classList.remove('show');
  showToast('✅', 'Guardian added!');

  /* Persist to DB */
  if (state.userId) {
    try {
      const res  = await fetch(`${API}/guardians`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          user_id:  state.userId,
          name, phone,
          relation: relation || 'Contact',
        }),
      });
      const data = await res.json();
      /* Replace temp id with the real DB id */
      if (data.success) {
        newGuardian.id = data.data.id;
      }
    } catch (err) {
      console.warn('Could not save guardian to DB:', err);
    }
  }
}

/* ── Remove guardian → DELETE in DB ── */
async function removeGuardian(id) {
  state.guardians = state.guardians.filter(g => g.id !== id);
  renderGuardians();
  showToast('🗑️', 'Guardian removed');

  if (state.userId) {
    try {
      await fetch(`${API}/guardians`, {
        method:  'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ user_id: state.userId, guardian_id: id }),
      });
    } catch (err) {
      console.warn('Could not delete guardian from DB:', err);
    }
  }
}