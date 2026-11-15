import { supabase } from '@/integrations/supabase/client';
import { createMediaPath, validateImage, type MediaFolder } from '@/lib/mediaValidation';

export async function uploadMedia(file: File, folder: MediaFolder, onProgress: (percent: number) => void): Promise<string> {
  const validation = validateImage(file);
  if (validation) throw new Error(validation);
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) throw new Error('Please sign in again before uploading.');
  const { data: staff, error: staffError } = await supabase.rpc('is_staff', { _user_id: userData.user.id });
  if (staffError || !staff) throw new Error('Only staff members can upload images.');
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Please sign in again before uploading.');
  const path = createMediaPath(folder, file.name);
  // Storage REST uses the same bearer/RLS enforcement as the SDK; XHR exposes byte progress.
  await new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('POST', `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/media/${path}`);
    request.setRequestHeader('Authorization', `Bearer ${session.access_token}`);
    request.setRequestHeader('apikey', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
    request.setRequestHeader('Content-Type', file.type);
    request.setRequestHeader('Cache-Control', 'max-age=3600');
    request.setRequestHeader('x-upsert', 'false');
    request.timeout = 120000;
    request.upload.onprogress = event => {
      if (event.lengthComputable) onProgress(Math.min(99, Math.round(event.loaded / event.total * 100)));
    };
    request.onerror = () => reject(new Error('Upload failed. Check your connection and try again.'));
    request.ontimeout = () => reject(new Error('The upload timed out. Please try again.'));
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) { onProgress(100); resolve(); return; }
      let message = 'Image upload failed. Please try again.';
      try { const body = JSON.parse(request.responseText); message = body.message ?? body.error ?? message; } catch { /* Keep the readable fallback. */ }
      if (/bucket.*not found/i.test(message)) message = 'Media storage is not ready. Public image storage must be enabled for this workspace.';
      reject(new Error(message));
    };
    onProgress(0);
    request.send(file);
  });
  return supabase.storage.from('media').getPublicUrl(path).data.publicUrl;
}