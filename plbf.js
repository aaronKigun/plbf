/* ============================================
   PLBF MAIN WEBSITE — Supabase Version
   ============================================ */

// ── Mobile Menu Toggle ────────────────────
var menuToggle = document.getElementById('menuToggle');
var mobileMenu = document.getElementById('mobileMenu');
var bar1 = document.getElementById('bar1');
var bar2 = document.getElementById('bar2');
var bar3 = document.getElementById('bar3');
var menuOpen = false;

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', function () {
    menuOpen = !menuOpen;
    if (menuOpen) {
      mobileMenu.style.display = 'block';
      bar1.style.transform = 'translateY(7px) rotate(45deg)';
      bar2.style.opacity = '0';
      bar3.style.transform = 'translateY(-7px) rotate(-45deg)';
      document.body.style.overflow = 'hidden';
    } else {
      mobileMenu.style.display = 'none';
      bar1.style.transform = '';
      bar2.style.opacity = '1';
      bar3.style.transform = '';
      document.body.style.overflow = '';
    }
  });

  document.querySelectorAll('.mobile-link').forEach(function (l) {
    l.addEventListener('click', function () {
      menuOpen = false;
      mobileMenu.style.display = 'none';
      bar1.style.transform = '';
      bar2.style.opacity = '1';
      bar3.style.transform = '';
      document.body.style.overflow = '';
    });
  });
}

// ── Navbar Shadow on Scroll ───────────────
var navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', function () {
    navbar.style.boxShadow = window.scrollY > 50 ? '0 1px 2px 0 rgb(0 0 0 / 0.05)' : 'none';
  });
}

// ── Back to Top Button ────────────────────
var backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', function () {
    backToTop.style.opacity = window.scrollY > 600 ? '1' : '0';
    backToTop.style.pointerEvents = window.scrollY > 600 ? 'auto' : 'none';
  });
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── Toast Notification ────────────────────
function showToast(m) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = m;
  t.classList.add('show');
  setTimeout(function () { t.classList.remove('show'); }, 3500);
}

// ── Membership Form → Supabase ───────────
var mf = document.getElementById('membershipForm');
if (mf) {
  mf.addEventListener('submit', async function (e) {
    e.preventDefault();
    var inputs = mf.querySelectorAll('input, select');
    var { error } = await supabase.from('members').insert([{
      name: inputs[0].value.trim(),
      email: inputs[1].value.trim(),
      phone: inputs[2].value.trim(),
      call_to_bar_year: inputs[3].value.trim(),
      practice_area: inputs[4].value
    }]);
    if (error) {
      showToast('Error submitting. Please try again.');
    } else {
      showToast('✓ Application submitted! We will contact you shortly.');
      mf.reset();
    }
  });
}

// ── Contact Form → Supabase + EmailJS ────
var cf = document.getElementById('contactForm');
if (cf) {
  cf.addEventListener('submit', async function (e) {
    e.preventDefault();
    var inputs = cf.querySelectorAll('input, textarea');
    var data = {
      name: inputs[0].value.trim(),
      email: inputs[1].value.trim(),
      subject: inputs[2].value.trim(),
      message: inputs[3].value.trim()
    };

    // Save to Supabase
    await supabase.from('messages').insert([data]);

    // Send email via EmailJS if configured
    if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY.indexOf('PASTE') === -1) {
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: data.name,
        from_email: data.email,
        subject: data.subject,
        message: data.message
      }).then(function () {
        showToast('✓ Message sent! We will respond within 24 hours.');
      }).catch(function () {
        showToast('✓ Message saved! We will respond within 24 hours.');
      });
    } else {
      showToast('✓ Message saved! We will respond within 24 hours.');
    }
    cf.reset();
  });
}

// ── Newsletter → Supabase ────────────────
var nf = document.getElementById('newsletterForm');
if (nf) {
  nf.addEventListener('submit', async function (e) {
    e.preventDefault();
    var email = nf.querySelector('input[type="email"]').value.trim();
    var { error } = await supabase.from('subscribers').insert([{ email: email }]);
    if (error) {
      showToast('Error. Please try again.');
    } else {
      showToast('✓ Subscribed to newsletter!');
      nf.reset();
    }
  });
}

// ── Scroll Reveal Animation ───────────────
var obs = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('section > div').forEach(function (el) {
  if (el.closest('#hero')) return;
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
  obs.observe(el);
});

// Place this at the top of plbf.js, right after the scroll reveal section
if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY.indexOf('PASTE') === -1) {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}
// ═══════════════════════════════════════════
// SUPABASE DYNAMIC CONTENT LOADERS
// ═══════════════════════════════════════════

function fmtDate(ds) {
  var d = new Date(ds + 'T00:00:00');
  return {
    day: d.getDate(),
    month: d.toLocaleDateString('en-NG', { month: 'short' }),
    year: d.getFullYear()
  };
}

// ── Load Trustees ──────────────────────────
async function loadTrustees() {
  var c = document.getElementById('trusteesGrid');
  if (!c) return;
  var client = await waitForSupabase();
  if (!client) return;
  var { data } = await client.from('trustees').select('*').order('display_order', { ascending: true });
  if (!data || data.length === 0) return;
  c.innerHTML = data.map(function (t) {
    return '<div class="text-center group">' +
      '<div class="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-2 border-gold/30 relative">' +
      '<img src="' + t.image + '" alt="' + t.name + '" class="w-full h-full object-cover transition-all duration-[800ms] group-hover:scale-105" style="filter:grayscale(15%);">' +
      '</div>' +
      '<h3 class="text-base font-normal text-white tracking-tight mb-1">' + t.name + '</h3>' +
      '<p class="text-xs text-gold uppercase tracking-widest mb-3">' + t.position + '</p>' +
      '<p class="text-sm font-light text-gray-400 leading-relaxed max-w-xs mx-auto">' + (t.bio || '') + '</p>' +
      '</div>';
  }).join('');
}

// ── Load Events ────────────────────────────
async function loadEvents() {
  var c = document.getElementById('eventsGrid');
  if (!c) return;
  var client = await waitForSupabase();
  if (!client) return;
  var { data } = await client.from('events').select('*').order('date', { ascending: true }).limit(3);
  if (!data || data.length === 0) return;
  c.innerHTML = data.map(function (e) {
    var dt = fmtDate(e.date);
    return '<div class="bg-white overflow-hidden group shadow-sm">' +
      '<div class="aspect-[16/10] overflow-hidden relative">' +
      '<img src="' + e.image + '" alt="' + e.title + '" class="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" style="filter:grayscale(10%);">' +
      '<div class="absolute top-4 left-4 bg-navy text-white px-3 py-2 text-center">' +
      '<div class="text-lg font-normal leading-none">' + dt.day + '</div>' +
      '<div class="text-[10px] uppercase tracking-widest">' + dt.month + '</div>' +
      '</div></div>' +
      '<div class="p-6">' +
      '<span class="text-[10px] uppercase tracking-widest text-gold">' + e.category + '</span>' +
      '<h3 class="text-lg font-normal tracking-tight mt-2 mb-3">' + e.title + '</h3>' +
      '<p class="text-sm font-light text-gray-500 leading-relaxed mb-4">' + e.description + '</p>' +
      '<div class="flex items-center gap-2 text-xs text-gray-400">' +
      '<iconify-icon icon="mdi:map-marker-outline" width="14" class="text-gold"></iconify-icon>' +
      '<span>' + e.location + '</span></div></div></div>';
  }).join('');
}

// ── Load Leaders ──────────────────────────
async function loadLeaders() {
  var c = document.getElementById('leadersGrid');
  if (!c) return;
  var client = await waitForSupabase();
  if (!client) return;
  var { data } = await client.from('leaders').select('*').order('display_order', { ascending: true });
  if (!data || data.length === 0) return;
  c.innerHTML = data.map(function (l) {
    return '<div class="text-center group">' +
      '<div class="aspect-[3/4] overflow-hidden mb-4 relative">' +
      '<img src="' + l.image + '" alt="' + l.name + '" class="w-full h-full object-cover transition-all duration-[800ms] group-hover:scale-105" style="filter:grayscale(20%);">' +
      '</div>' +
      '<h3 class="text-sm font-normal tracking-tight">' + l.name + '</h3>' +
      '<p class="text-xs text-gold uppercase tracking-widest mt-1">' + l.position + '</p>' +
      '</div>';
  }).join('');
}

// ── Load Programmes ───────────────────────
async function loadProgrammes() {
  var c = document.getElementById('programmesGrid');
  if (!c) return;
  var client = await waitForSupabase();
  if (!client) return;
  var { data } = await client.from('programmes').select('*');
  if (!data || data.length === 0) return;
  c.innerHTML = data.map(function (p) {
    return '<div class="bg-white p-8 group hover:-translate-y-1 transition-transform duration-300 shadow-sm">' +
      '<div class="w-12 h-12 flex items-center justify-center border border-gold/30 text-gold mb-6 group-hover:scale-110 transition-transform duration-300">' +
      '<iconify-icon icon="' + p.icon + '" width="24"></iconify-icon></div>' +
      '<h3 class="text-lg font-normal tracking-tight mb-3">' + p.title + '</h3>' +
      '<p class="text-sm font-light leading-relaxed text-gray-500">' + p.description + '</p>' +
      '</div>';
  }).join('');
}

// ── Load News ─────────────────────────────
async function loadNews() {
  var c = document.getElementById('newsGrid');
  if (!c) return;
  var client = await waitForSupabase();
  if (!client) return;
  var { data } = await client.from('news').select('*').order('date', { ascending: false }).limit(3);
  if (!data || data.length === 0) {
    var empty = document.getElementById('newsEmptyState');
    if (empty) empty.style.display = 'block';
    return;
  }
  c.innerHTML = data.map(function (n) {
    return '<article class="group cursor-pointer">' +
      '<div class="aspect-[16/10] overflow-hidden mb-5">' +
      '<img src="' + n.image + '" alt="' + n.title + '" class="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" style="filter:grayscale(15%);">' +
      '</div>' +
      '<div class="text-[10px] uppercase tracking-widest text-gold mb-3">' + n.category + ' · ' + fmtDate(n.date).month + ' ' + fmtDate(n.date).year + '</div>' +
      '<h3 class="text-lg font-normal tracking-tight mb-3 group-hover:text-gold transition-colors duration-300">' + n.title + '</h3>' +
      '<p class="text-sm font-light text-gray-500 leading-relaxed">' + (n.excerpt || '') + '</p>' +
      '</article>';
  }).join('');
}

// ── Initialize Everything ─────────────────
document.addEventListener('DOMContentLoaded', function () {
  loadTrustees();
  loadEvents();
  loadLeaders();
  loadProgrammes();
  loadNews();
});