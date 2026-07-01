/* ============================================
   ADMIN PASSWORD (always loaded first)
   ============================================ */
const ADMIN_PASSWORD = 'plbf2025';

/* ============================================
   EMAILJS (optional — won't crash if empty)
   ============================================ */
var EMAILJS_PUBLIC_KEY = 'eDN0ZudkEvsrGwC1C';
var EMAILJS_SERVICE_ID = 'service_7jqgzyh';
var EMAILJS_TEMPLATE_ID = 'template_543zig9';

/* ============================================
   SUPABASE (waits for SDK to load)
   ============================================ */
var supabase = null;

function initSupabase() {
  try {
    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
      console.warn('Supabase SDK not loaded yet, retrying...');
      return false;
    }

    var SUPABASE_URL = 'https://kuxwbxnenjdnvpvuuuel.supabase.co';
    var SUPABASE_KEY = 'sb_publishable_rTJ6oJAHmK0fuwE1tXLX2g__3EeUzN5';

    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
    window.__plbfSupabase = supabase;
    console.log('Supabase connected successfully.');
    return true;
  } catch (err) {
    console.warn('Supabase init failed:', err.message);
    return false;
  }
}

function ensureSupabaseReady() {
  if (supabase) return Promise.resolve(supabase);
  initSupabase();
  return new Promise(function (resolve) {
    var attempts = 0;
    var interval = setInterval(function () {
      attempts++;
      if (supabase) { clearInterval(interval); resolve(supabase); return; }
      if (attempts >= 20) { clearInterval(interval); resolve(null); }
    }, 250);
  });
}

// Try immediately
initSupabase();

// Try again after 1 second if SDK was slow
setTimeout(initSupabase, 1000);

// Try again after 3 seconds
setTimeout(initSupabase, 3000);

/* ============================================
   IMAGE UPLOAD
   ============================================ */
async function uploadImage(file, folder) {
  if (!file) return '';
  if (!supabase) return 'https://picsum.photos/seed/' + Math.random().toString(36).substring(2, 8) + '/600/375.jpg';

  try {
    var ext = file.name.split('.').pop();
    var fileName = folder + '/' + Date.now() + '-' + Math.random().toString(36).substring(2, 8) + '.' + ext;

    var { data, error } = await supabase.storage.from('images').upload(fileName, file);
    if (error) throw error;

    var { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName);
    return urlData.publicUrl;
  } catch (err) {
    console.warn('Upload failed, using placeholder:', err.message);
    return 'https://picsum.photos/seed/' + Math.random().toString(36).substring(2, 8) + '/600/375.jpg';
  }
}