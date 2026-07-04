import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eyuwxcxrieofkefhsjjt.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5dXd4Y3hyaWVvZmtlZmhzamp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5NDA3NDMsImV4cCI6MjA5ODUxNjc0M30.mU_zrTCUV6EqG70S4tsOJE5ZGjOFW_y1ecZsi5rl4Gc';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: true, autoRefreshToken: true }
});

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;   // 10 MB
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;   // 50 MB — safer default for Supabase free tier

export async function uploadImage(file: File, folder: string) {
  if (!file) return '';
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('Image must be 10 MB or smaller.');
  }

  const ext = file.name.split('.').pop() || 'jpg';
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { data, error: uploadError } = await supabase.storage
    .from('images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || undefined
    });

  if (uploadError) {
    console.error('Image upload error:', uploadError);
    throw new Error(
      `${uploadError.message}. Make sure the "images" bucket exists, is PUBLIC, and the RLS policy "Admins can upload images" is set.`
    );
  }
  if (!data?.path) {
    throw new Error('Upload returned no path — the file may not have been stored.');
  }

  const { data: urlData } = supabase.storage.from('images').getPublicUrl(data.path);
  if (!urlData?.publicUrl) {
    throw new Error('Failed to generate public URL for the uploaded image.');
  }
  return urlData.publicUrl;
}

export async function uploadVideo(file: File, folder: string = 'uploads') {
  if (!file) return '';
  if (file.size > MAX_VIDEO_BYTES) {
    throw new Error(
      'Video must be 50 MB or smaller. Supabase free-tier projects cap uploads at 50 MB by default — raise it in Project Settings > Storage if you need more.'
    );
  }
  if (!file.type.startsWith('video/')) {
    throw new Error('Please choose a valid video file (MP4, WebM, or MOV).');
  }

  const ext = file.name.split('.').pop() || 'mp4';
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { data, error } = await supabase.storage
    .from('videos')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type
    });

  if (error) {
    console.error('Video upload error:', error);
    throw new Error(
      `${error.message}. Make sure the "videos" bucket exists, is PUBLIC, and the RLS policy "Admins can upload videos storage" is set.`
    );
  }
  if (!data?.path) {
    throw new Error('Upload returned no path — the file may not have been stored.');
  }

  const { data: urlData } = supabase.storage.from('videos').getPublicUrl(data.path);
  if (!urlData?.publicUrl) {
    throw new Error('Failed to generate public URL for the uploaded video.');
  }
  return urlData.publicUrl;
}
