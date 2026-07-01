/* ============================================
   PLBF ADMIN PANEL — Complete Supabase Version
   ============================================ */

// ── Safety: Wait for Supabase ─────────────────
function waitForSupabase() {
  if (typeof ensureSupabaseReady === 'function') {
    return ensureSupabaseReady();
  }
  return new Promise(function (resolve) {
    if (supabase) { resolve(supabase); return; }
    var attempts = 0;
    var interval = setInterval(function () {
      attempts++;
      if (supabase) { clearInterval(interval); resolve(supabase); }
      if (attempts > 30) { clearInterval(interval); resolve(null); }
    }, 300);
  });
}
waitForSupabase();

// ── Auth ───────────────────────────────────
var loginForm = document.getElementById('loginForm');
var loginScreen = document.getElementById('loginScreen');
var adminWrapper = document.getElementById('adminWrapper');
var loginError = document.getElementById('loginError');

if (sessionStorage.getItem('plbf_admin') === 'true') {
  loginScreen.style.display = 'none';
  adminWrapper.classList.add('active');
  showPage('page-dashboard');
}

loginForm.addEventListener('submit', function (e) {
  e.preventDefault();
  var pwd = document.getElementById('loginPassword').value;
  if (pwd === ADMIN_PASSWORD) {
    sessionStorage.setItem('plbf_admin', 'true');
    loginScreen.style.display = 'none';
    adminWrapper.classList.add('active');
    loginError.style.display = 'none';
    showPage('page-dashboard');
  } else {
    loginError.style.display = 'block';
    document.getElementById('loginPassword').value = '';
  }
});

function logout() {
  sessionStorage.removeItem('plbf_admin');
  location.reload();
}

// ── Toast ──────────────────────────────────
function showToast(m, t) {
  t = t || 'success';
  var ex = document.querySelector('.admin-toast');
  if (ex) ex.remove();
  var to = document.createElement('div');
  to.className = 'admin-toast ' + t;
  var ic = { success: 'mdi:check-circle', error: 'mdi:alert-circle', info: 'mdi:information' };
  to.innerHTML = '<iconify-icon icon="' + (ic[t] || ic.info) + '" width="18"></iconify-icon> ' + m;
  document.body.appendChild(to);
  requestAnimationFrame(function () { to.classList.add('show'); });
  setTimeout(function () { to.classList.remove('show'); setTimeout(function () { to.remove(); }, 400); }, 3000);
}

// ── Navigation ─────────────────────────────
function showPage(pid) {
  document.querySelectorAll('.page-section').forEach(function (s) { s.classList.remove('active'); });
  document.querySelectorAll('.sidebar nav a').forEach(function (a) { a.classList.remove('active'); });
  var t = document.getElementById(pid);
  if (t) t.classList.add('active');
  var nl = document.querySelector('.sidebar nav a[data-page="' + pid + '"]');
  if (nl) nl.classList.add('active');
  var titles = {
    'page-dashboard': 'Dashboard',
    'page-trustees': 'Manage Trustees',
    'page-news': 'Manage News',
    'page-events': 'Manage Events',
    'page-leaders': 'Manage Leadership',
    'page-programmes': 'Manage Programmes',
    'page-members': 'Members',
    'page-messages': 'Messages'
  };
  document.getElementById('topbarTitle').textContent = titles[pid] || 'Dashboard';
  closeSidebar();
  if (pid === 'page-dashboard') renderDashboard();
  if (pid === 'page-events') renderEventsTable();
  if (pid === 'page-leaders') renderLeadersTable();
  if (pid === 'page-programmes') renderProgrammesTable();
  if (pid === 'page-trustees') renderTrusteesTable();
  if (pid === 'page-news') renderNewsTable();
  if (pid === 'page-members') renderMembersTable();
  if (pid === 'page-messages') renderMessagesTable();
}

function toggleSidebar() {
  document.querySelector('.sidebar').classList.toggle('open');
  document.querySelector('.sidebar-overlay').classList.toggle('active');
}
function closeSidebar() {
  document.querySelector('.sidebar').classList.remove('open');
  document.querySelector('.sidebar-overlay').classList.remove('active');
}
function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

document.querySelectorAll('.modal-overlay').forEach(function (o) {
  o.addEventListener('click', function (e) { if (e.target === o) o.classList.remove('active'); });
});

// ── File Input Preview ────────────────────
function setupFileInput(inputId, previewId) {
  var inp = document.getElementById(inputId);
  var prev = document.getElementById(previewId);
  if (!inp || !prev) return;
  inp.addEventListener('change', function () {
    if (inp.files && inp.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        prev.innerHTML = '<img src="' + e.target.result + '" style="max-height:120px;border-radius:4px;margin-top:0.5rem;">';
      };
      reader.readAsDataURL(inp.files[0]);
    } else { prev.innerHTML = ''; }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  setupFileInput('eventFile', 'eventFilePreview');
  setupFileInput('leaderFile', 'leaderFilePreview');
  setupFileInput('trusteeFile', 'trusteeFilePreview');
  setupFileInput('newsFile', 'newsFilePreview');
});

// ── Dashboard ──────────────────────────────
async function renderDashboard() {
  if (!supabase) {
    document.getElementById('topbarTitle').textContent = 'Dashboard (Offline Mode)';
    return;
  }
  var tables = ['events', 'leaders', 'programmes', 'trustees', 'news', 'members'];
  for (var i = 0; i < tables.length; i++) {
    try {
      var table = tables[i];
      var res = await supabase.from(table).select('*', { count: 'exact', head: true });
      var el = document.getElementById('stat' + table.charAt(0).toUpperCase() + table.slice(1));
      if (el) el.textContent = res.count || 0;
    } catch (e) { /* table may not exist yet */ }
  }

  // Recent events on dashboard
  try {
    var { data: evts } = await supabase.from('events').select('*').order('date', { ascending: false }).limit(5);
    var tb = document.getElementById('recentEventsBody');
    if (evts && evts.length > 0) {
      tb.innerHTML = evts.map(function (e) {
        var d = new Date(e.date + 'T00:00:00');
        var ds = d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
        var past = d < new Date();
        return '<tr><td style="font-weight:400;">' + e.title + '</td><td>' + ds + '</td><td><span class="table-badge">' + e.category + '</span></td><td>' + (past ? '<span style="color:#9CA3AF;">Past</span>' : '<span style="color:#065f46;">Upcoming</span>') + '</td></tr>';
      }).join('');
    } else {
      tb.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#9CA3AF;padding:2rem;">No events yet</td></tr>';
    }
  } catch (e) { /* skip */ }
}

// ═══════════════════════════════════════════
// EVENTS CRUD
// ═══════════════════════════════════════════
async function renderEventsTable() {
  if (!supabase) return;
  var { data, error } = await supabase.from('events').select('*').order('date', { ascending: false });
  var tb = document.getElementById('eventsTableBody');
  var em = document.getElementById('eventsEmpty');
  if (!data || data.length === 0) { tb.innerHTML = ''; em.style.display = 'block'; tb.closest('.table-wrapper').style.display = 'none'; return; }
  em.style.display = 'none'; tb.closest('.table-wrapper').style.display = 'block';
  tb.innerHTML = data.map(function (e) {
    return '<tr><td><img src="' + (e.image || '') + '" class="table-img" alt=""></td>' +
      '<td style="font-weight:400;">' + e.title + '</td>' +
      '<td>' + new Date(e.date + 'T00:00:00').toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) + '</td>' +
      '<td>' + e.location + '</td>' +
      '<td><span class="table-badge">' + e.category + '</span></td>' +
      '<td><div class="table-actions">' +
      '<button onclick="editEvent(' + e.id + ')"><iconify-icon icon="mdi:pencil" width="14"></iconify-icon> Edit</button>' +
      '<button class="delete" onclick="deleteItem(\'events\',' + e.id + ',\'' + e.title.replace(/'/g, "\\'") + '\')"><iconify-icon icon="mdi:delete" width="14"></iconify-icon> Del</button>' +
      '</div></td></tr>';
  }).join('');
}

function openEventModal(id) {
  document.getElementById('eventForm').reset();
  document.getElementById('eventId').value = '';
  document.getElementById('eventFilePreview').innerHTML = '';
  document.getElementById('eventModalTitle').textContent = 'Add Event';
  if (id) {
    supabase.from('events').select('*').eq('id', id).single().then(function ({ data }) {
      if (data) {
        document.getElementById('eventModalTitle').textContent = 'Edit Event';
        document.getElementById('eventId').value = data.id;
        document.getElementById('eventTitle').value = data.title || '';
        document.getElementById('eventDate').value = data.date || '';
        document.getElementById('eventCategory').value = data.category || '';
        document.getElementById('eventLocation').value = data.location || '';
        document.getElementById('eventDescription').value = data.description || '';
        if (data.image) document.getElementById('eventFilePreview').innerHTML = '<img src="' + data.image + '" style="max-height:120px;border-radius:4px;margin-top:0.5rem;">';
      }
    });
  }
  openModal('eventModal');
}

async function saveEvent() {
  var client = await waitForSupabase();
  if (!client) { showToast('Database not connected. Check your Supabase keys in supabase-config.js', 'error'); return; }
  var fm = document.getElementById('eventForm');
  if (!fm.checkValidity()) { fm.reportValidity(); return; }
  var id = document.getElementById('eventId').value;
  var file = document.getElementById('eventFile').files[0];
  showToast('Uploading image...', 'info');
  try {
    var imgUrl = await uploadImage(file, 'events');
    var rowData = {
      title: document.getElementById('eventTitle').value.trim(),
      date: document.getElementById('eventDate').value,
      category: document.getElementById('eventCategory').value,
      location: document.getElementById('eventLocation').value.trim(),
      description: document.getElementById('eventDescription').value.trim(),
      image: imgUrl || 'https://picsum.photos/seed/evt-' + Math.random().toString(36).substring(2, 8) + '/600/375.jpg',
      updated_at: new Date().toISOString()
    };
    var result;
    if (id) { result = await client.from('events').update(rowData).eq('id', id); }
    else { result = await client.from('events').insert([rowData]); }
    if (result.error) throw result.error;
    closeModal('eventModal');
    showToast(id ? 'Event updated!' : 'Event added!');
    renderEventsTable();
  } catch (err) { showToast('Error: ' + err.message, 'error'); }
}
function editEvent(id) { openEventModal(id); }

// ═══════════════════════════════════════════
// LEADERS CRUD
// ═══════════════════════════════════════════
async function renderLeadersTable() {
  if (!supabase) return;
  var { data } = await supabase.from('leaders').select('*').order('display_order', { ascending: true });
  var tb = document.getElementById('leadersTableBody');
  var em = document.getElementById('leadersEmpty');
  if (!data || data.length === 0) { tb.innerHTML = ''; em.style.display = 'block'; tb.closest('.table-wrapper').style.display = 'none'; return; }
  em.style.display = 'none'; tb.closest('.table-wrapper').style.display = 'block';
  tb.innerHTML = data.map(function (l) {
    return '<tr><td><img src="' + (l.image || '') + '" class="table-img" alt=""></td>' +
      '<td style="font-weight:400;">' + l.name + '</td>' +
      '<td><span class="table-badge">' + l.position + '</span></td>' +
      '<td>' + l.display_order + '</td>' +
      '<td><div class="table-actions">' +
      '<button onclick="editLeader(' + l.id + ')"><iconify-icon icon="mdi:pencil" width="14"></iconify-icon> Edit</button>' +
      '<button class="delete" onclick="deleteItem(\'leaders\',' + l.id + ',\'' + l.name.replace(/'/g, "\\'") + '\')"><iconify-icon icon="mdi:delete" width="14"></iconify-icon> Del</button>' +
      '</div></td></tr>';
  }).join('');
}

function openLeaderModal(id) {
  document.getElementById('leaderForm').reset();
  document.getElementById('leaderId').value = '';
  document.getElementById('leaderOrder').value = '1';
  document.getElementById('leaderFilePreview').innerHTML = '';
  document.getElementById('leaderModalTitle').textContent = 'Add Leader';
  if (id) {
    supabase.from('leaders').select('*').eq('id', id).single().then(function ({ data }) {
      if (data) {
        document.getElementById('leaderModalTitle').textContent = 'Edit Leader';
        document.getElementById('leaderId').value = data.id;
        document.getElementById('leaderName').value = data.name || '';
        document.getElementById('leaderPosition').value = data.position || '';
        document.getElementById('leaderOrder').value = data.display_order || 1;
        if (data.image) document.getElementById('leaderFilePreview').innerHTML = '<img src="' + data.image + '" style="max-height:120px;border-radius:4px;margin-top:0.5rem;">';
      }
    });
  }
  openModal('leaderModal');
}

async function saveLeader() {
  var client = await waitForSupabase();
  if (!client) { showToast('Database not connected. Check your Supabase keys in supabase-config.js', 'error'); return; }
  var fm = document.getElementById('leaderForm');
  if (!fm.checkValidity()) { fm.reportValidity(); return; }
  var id = document.getElementById('leaderId').value;
  var file = document.getElementById('leaderFile').files[0];
  showToast('Uploading image...', 'info');
  try {
    var imgUrl = await uploadImage(file, 'leaders');
    var rowData = {
      name: document.getElementById('leaderName').value.trim(),
      position: document.getElementById('leaderPosition').value.trim(),
      display_order: parseInt(document.getElementById('leaderOrder').value) || 1,
      image: imgUrl || 'https://picsum.photos/seed/ldr-' + Math.random().toString(36).substring(2, 8) + '/400/533.jpg',
      updated_at: new Date().toISOString()
    };
    var result;
    if (id) { result = await client.from('leaders').update(rowData).eq('id', id); }
    else { result = await client.from('leaders').insert([rowData]); }
    if (result.error) throw result.error;
    closeModal('leaderModal');
    showToast(id ? 'Leader updated!' : 'Leader added!');
    renderLeadersTable();
  } catch (err) { showToast('Error: ' + err.message, 'error'); }
}
function editLeader(id) { openLeaderModal(id); }

// ═══════════════════════════════════════════
// TRUSTEES CRUD
// ═══════════════════════════════════════════
async function renderTrusteesTable() {
  if (!supabase) return;
  var { data } = await supabase.from('trustees').select('*').order('display_order', { ascending: true });
  var tb = document.getElementById('trusteesTableBody');
  var em = document.getElementById('trusteesEmpty');
  if (!data || data.length === 0) { tb.innerHTML = ''; em.style.display = 'block'; tb.closest('.table-wrapper').style.display = 'none'; return; }
  em.style.display = 'none'; tb.closest('.table-wrapper').style.display = 'block';
  tb.innerHTML = data.map(function (t) {
    return '<tr><td><img src="' + (t.image || '') + '" class="table-img" alt=""></td>' +
      '<td style="font-weight:400;">' + t.name + '</td>' +
      '<td><span class="table-badge">' + t.position + '</span></td>' +
      '<td>' + t.display_order + '</td>' +
      '<td><div class="table-actions">' +
      '<button onclick="editTrustee(' + t.id + ')"><iconify-icon icon="mdi:pencil" width="14"></iconify-icon> Edit</button>' +
      '<button class="delete" onclick="deleteItem(\'trustees\',' + t.id + ',\'' + t.name.replace(/'/g, "\\'") + '\')"><iconify-icon icon="mdi:delete" width="14"></iconify-icon> Del</button>' +
      '</div></td></tr>';
  }).join('');
}

function openTrusteeModal(id) {
  document.getElementById('trusteeForm').reset();
  document.getElementById('trusteeId').value = '';
  document.getElementById('trusteeOrder').value = '1';
  document.getElementById('trusteeFilePreview').innerHTML = '';
  document.getElementById('trusteeModalTitle').textContent = 'Add Trustee';
  if (id) {
    supabase.from('trustees').select('*').eq('id', id).single().then(function ({ data }) {
      if (data) {
        document.getElementById('trusteeModalTitle').textContent = 'Edit Trustee';
        document.getElementById('trusteeId').value = data.id;
        document.getElementById('trusteeName').value = data.name || '';
        document.getElementById('trusteePosition').value = data.position || '';
        document.getElementById('trusteeOrder').value = data.display_order || 1;
        document.getElementById('trusteeBio').value = data.bio || '';
        if (data.image) document.getElementById('trusteeFilePreview').innerHTML = '<img src="' + data.image + '" style="max-height:120px;border-radius:4px;margin-top:0.5rem;">';
      }
    });
  }
  openModal('trusteeModal');
}

async function saveTrustee() {
  var client = await waitForSupabase();
  if (!client) { showToast('Database not connected. Check your Supabase keys in supabase-config.js', 'error'); return; }
  var fm = document.getElementById('trusteeForm');
  if (!fm.checkValidity()) { fm.reportValidity(); return; }
  var id = document.getElementById('trusteeId').value;
  var file = document.getElementById('trusteeFile').files[0];
  showToast('Uploading image...', 'info');
  try {
    var imgUrl = await uploadImage(file, 'trustees');
    var rowData = {
      name: document.getElementById('trusteeName').value.trim(),
      position: document.getElementById('trusteePosition').value.trim(),
      display_order: parseInt(document.getElementById('trusteeOrder').value) || 1,
      image: imgUrl || 'https://picsum.photos/seed/tru-' + Math.random().toString(36).substring(2, 8) + '/400/400.jpg',
      bio: document.getElementById('trusteeBio').value.trim(),
      updated_at: new Date().toISOString()
    };
    var result;
    if (id) { result = await client.from('trustees').update(rowData).eq('id', id); }
    else { result = await client.from('trustees').insert([rowData]); }
    if (result.error) throw result.error;
    closeModal('trusteeModal');
    showToast(id ? 'Trustee updated!' : 'Trustee added!');
    renderTrusteesTable();
  } catch (err) { showToast('Error: ' + err.message, 'error'); }
}
function editTrustee(id) { openTrusteeModal(id); }

// ═══════════════════════════════════════════
// NEWS CRUD
// ═══════════════════════════════════════════
async function renderNewsTable() {
  if (!supabase) return;
  var { data } = await supabase.from('news').select('*').order('date', { ascending: false });
  var tb = document.getElementById('newsTableBody');
  var em = document.getElementById('newsEmpty');
  if (!data || data.length === 0) { tb.innerHTML = ''; em.style.display = 'block'; tb.closest('.table-wrapper').style.display = 'none'; return; }
  em.style.display = 'none'; tb.closest('.table-wrapper').style.display = 'block';
  tb.innerHTML = data.map(function (n) {
    return '<tr><td><img src="' + (n.image || '') + '" class="table-img" alt=""></td>' +
      '<td style="font-weight:400;">' + n.title + '</td>' +
      '<td>' + new Date(n.date + 'T00:00:00').toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) + '</td>' +
      '<td><span class="table-badge">' + n.category + '</span></td>' +
      '<td><div class="table-actions">' +
      '<button onclick="editNews(' + n.id + ')"><iconify-icon icon="mdi:pencil" width="14"></iconify-icon> Edit</button>' +
      '<button class="delete" onclick="deleteItem(\'news\',' + n.id + ',\'' + n.title.replace(/'/g, "\\'") + '\')"><iconify-icon icon="mdi:delete" width="14"></iconify-icon> Del</button>' +
      '</div></td></tr>';
  }).join('');
}

function openNewsModal(id) {
  document.getElementById('newsForm').reset();
  document.getElementById('newsId').value = '';
  document.getElementById('newsFilePreview').innerHTML = '';
  document.getElementById('newsModalTitle').textContent = 'Add News';
  if (id) {
    supabase.from('news').select('*').eq('id', id).single().then(function ({ data }) {
      if (data) {
        document.getElementById('newsModalTitle').textContent = 'Edit News';
        document.getElementById('newsId').value = data.id;
        document.getElementById('newsTitle').value = data.title || '';
        document.getElementById('newsDate').value = data.date || '';
        document.getElementById('newsCategory').value = data.category || '';
        document.getElementById('newsExcerpt').value = data.excerpt || '';
        document.getElementById('newsContent').value = data.content || '';
        if (data.image) document.getElementById('newsFilePreview').innerHTML = '<img src="' + data.image + '" style="max-height:120px;border-radius:4px;margin-top:0.5rem;">';
      }
    });
  }
  openModal('newsModal');
}

async function saveNews() {
  var client = await waitForSupabase();
  if (!client) { showToast('Database not connected. Check your Supabase keys in supabase-config.js', 'error'); return; }
  var fm = document.getElementById('newsForm');
  if (!fm.checkValidity()) { fm.reportValidity(); return; }
  var id = document.getElementById('newsId').value;
  var file = document.getElementById('newsFile').files[0];
  showToast('Uploading image...', 'info');
  try {
    var imgUrl = await uploadImage(file, 'news');
    var rowData = {
      title: document.getElementById('newsTitle').value.trim(),
      date: document.getElementById('newsDate').value,
      category: document.getElementById('newsCategory').value,
      excerpt: document.getElementById('newsExcerpt').value.trim(),
      content: document.getElementById('newsContent').value.trim(),
      image: imgUrl || 'https://picsum.photos/seed/news-' + Math.random().toString(36).substring(2, 8) + '/600/375.jpg',
      updated_at: new Date().toISOString()
    };
    var result;
    if (id) { result = await client.from('news').update(rowData).eq('id', id); }
    else { result = await client.from('news').insert([rowData]); }
    if (result.error) throw result.error;
    closeModal('newsModal');
    showToast(id ? 'News updated!' : 'News added!');
    renderNewsTable();
  } catch (err) { showToast('Error: ' + err.message, 'error'); }
}
function editNews(id) { openNewsModal(id); }

// ═══════════════════════════════════════════
// PROGRAMMES CRUD
// ═══════════════════════════════════════════
async function renderProgrammesTable() {
  if (!supabase) return;
  var { data } = await supabase.from('programmes').select('*');
  var tb = document.getElementById('programmesTableBody');
  var em = document.getElementById('programmesEmpty');
  if (!data || data.length === 0) { tb.innerHTML = ''; em.style.display = 'block'; tb.closest('.table-wrapper').style.display = 'none'; return; }
  em.style.display = 'none'; tb.closest('.table-wrapper').style.display = 'block';
  tb.innerHTML = data.map(function (p) {
    return '<tr><td><iconify-icon icon="' + (p.icon || 'mdi:briefcase-outline') + '" width="24" style="color:#C5A059;"></iconify-icon></td>' +
      '<td style="font-weight:400;">' + p.title + '</td>' +
      '<td style="max-width:300px;">' + p.description.substring(0, 100) + (p.description.length > 100 ? '...' : '') + '</td>' +
      '<td><div class="table-actions">' +
      '<button onclick="editProgramme(' + p.id + ')"><iconify-icon icon="mdi:pencil" width="14"></iconify-icon> Edit</button>' +
      '<button class="delete" onclick="deleteItem(\'programmes\',' + p.id + ',\'' + p.title.replace(/'/g, "\\'") + '\')"><iconify-icon icon="mdi:delete" width="14"></iconify-icon> Del</button>' +
      '</div></td></tr>';
  }).join('');
}

function openProgrammeModal(id) {
  document.getElementById('programmeForm').reset();
  document.getElementById('programmeId').value = '';
  document.getElementById('programmeModalTitle').textContent = 'Add Programme';
  if (id) {
    supabase.from('programmes').select('*').eq('id', id).single().then(function ({ data }) {
      if (data) {
        document.getElementById('programmeModalTitle').textContent = 'Edit Programme';
        document.getElementById('programmeId').value = data.id;
        document.getElementById('programmeTitle').value = data.title || '';
        document.getElementById('programmeIcon').value = data.icon || 'mdi:gavel';
        document.getElementById('programmeDescription').value = data.description || '';
      }
    });
  }
  openModal('programmeModal');
}

async function saveProgramme() {
  var client = await waitForSupabase();
  if (!client) { showToast('Database not connected. Check your Supabase keys in supabase-config.js', 'error'); return; }
  var fm = document.getElementById('programmeForm');
  if (!fm.checkValidity()) { fm.reportValidity(); return; }
  var id = document.getElementById('programmeId').value;
  var rowData = {
    title: document.getElementById('programmeTitle').value.trim(),
    icon: document.getElementById('programmeIcon').value,
    description: document.getElementById('programmeDescription').value.trim(),
    updated_at: new Date().toISOString()
  };
  var result;
  if (id) { result = await client.from('programmes').update(rowData).eq('id', id); }
  else { result = await client.from('programmes').insert([rowData]); }
  if (result.error) { showToast('Error: ' + result.message, 'error'); return; }
  closeModal('programmeModal');
  showToast(id ? 'Programme updated!' : 'Programme added!');
  renderProgrammesTable();
}
function editProgramme(id) { openProgrammeModal(id); }

// ═══════════════════════════════════════════
// MEMBERS (read-only)
// ═══════════════════════════════════════════
async function renderMembersTable() {
  if (!supabase) return;
  var { data } = await supabase.from('members').select('*').order('created_at', { ascending: false });
  var tb = document.getElementById('membersTableBody');
  var em = document.getElementById('membersEmpty');
  if (!data || data.length === 0) { tb.innerHTML = ''; em.style.display = 'block'; tb.closest('.table-wrapper').style.display = 'none'; return; }
  em.style.display = 'none'; tb.closest('.table-wrapper').style.display = 'block';
  tb.innerHTML = data.map(function (m) {
    return '<tr><td style="font-weight:400;">' + m.name + '</td>' +
      '<td>' + m.email + '</td><td>' + m.phone + '</td>' +
      '<td>' + (m.practice_area || '-') + '</td>' +
      '<td>' + new Date(m.created_at).toLocaleDateString('en-NG') + '</td>' +
      '<td><button class="delete" onclick="deleteItem(\'members\',' + m.id + ',\'' + m.name.replace(/'/g, "\\'") + '\')"><iconify-icon icon="mdi:delete" width="14"></iconify-icon> Del</button></td></tr>';
  }).join('');
}

// ═══════════════════════════════════════════
// MESSAGES (read-only)
// ═══════════════════════════════════════════
async function renderMessagesTable() {
  if (!supabase) return;
  var { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
  var tb = document.getElementById('messagesTableBody');
  var em = document.getElementById('messagesEmpty');
  if (!data || data.length === 0) { tb.innerHTML = ''; em.style.display = 'block'; tb.closest('.table-wrapper').style.display = 'none'; return; }
  em.style.display = 'none'; tb.closest('.table-wrapper').style.display = 'block';
  tb.innerHTML = data.map(function (m) {
    return '<tr><td style="font-weight:400;">' + m.name + '</td>' +
      '<td>' + m.email + '</td><td>' + m.subject + '</td>' +
      '<td style="max-width:200px;">' + (m.message || '').substring(0, 80) + '...</td>' +
      '<td>' + new Date(m.created_at).toLocaleDateString('en-NG') + '</td>' +
      '<td><button class="delete" onclick="deleteItem(\'messages\',' + m.id + ',\'' + (m.name || '').replace(/'/g, "\\'") + '\')"><iconify-icon icon="mdi:delete" width="14"></iconify-icon> Del</button></td></tr>';
  }).join('');
}

// ═══════════════════════════════════════════
// DELETE (works for all tables)
// ═══════════════════════════════════════════
async function deleteItem(table, id, name) {
  document.getElementById('deleteMessage').textContent = 'Delete "' + name + '"? This cannot be undone.';
  openModal('deleteModal');

  document.getElementById('confirmDeleteBtn').onclick = async function () {
    if (!supabase) { showToast('Database not connected.', 'error'); closeModal('deleteModal'); return; }
    try {
      var { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      closeModal('deleteModal');
      showToast('Deleted successfully!');
      if (table === 'events') renderEventsTable();
      if (table === 'leaders') renderLeadersTable();
      if (table === 'programmes') renderProgrammesTable();
      if (table === 'trustees') renderTrusteesTable();
      if (table === 'news') renderNewsTable();
      if (table === 'members') renderMembersTable();
      if (table === 'messages') renderMessagesTable();
    } catch (err) { showToast('Error: ' + err.message, 'error'); }
  };
}