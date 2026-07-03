import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eyuwxcxrieofkefhsjjt.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5dXd4Y3hyaWVvZmtlZmhzamp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5NDA3NDMsImV4cCI6MjA5ODUxNjc0M30.mU_zrTCUV6EqG70S4tsOJE5ZGjOFW_y1ecZsi5rl4Gc';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: true, autoRefreshToken: true }
});

export async function uploadImage(file: File, folder: string) {
  if (!file) return '';

  const ext = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from('images').upload(fileName, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined
  });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName);
  return urlData.publicUrl;
}

const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

export async function uploadVideo(file: File, folder: string = 'uploads') {
  if (!file) return '';
  if (file.size > MAX_VIDEO_BYTES) {
    throw new Error('Video must be 100 MB or smaller.');
  }
  if (!file.type.startsWith('video/')) {
    throw new Error('Please choose a valid video file (MP4, WebM, or MOV).');
  }

  const ext = file.name.split('.').pop() || 'mp4';
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from('videos').upload(fileName, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type
  });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from('videos').getPublicUrl(fileName);
  return urlData.publicUrl;
}
