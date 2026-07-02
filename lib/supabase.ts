import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kuxwbxnenjdnvpvuuuel.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_rTJ6oJAHmK0fuwE1tXLX2g__3EeUzN5';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: true, autoRefreshToken: true }
});

export async function uploadImage(file: File, folder: string) {
  if (!file) return '';

  try {
    const ext = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from('images').upload(fileName, file);
    if (error) throw error;
    const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName);
    return urlData.publicUrl;
  } catch {
    return '';
  }
}
