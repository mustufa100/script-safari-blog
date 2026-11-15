import { useId, useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { uploadMedia } from '@/lib/mediaUpload';
import { IMAGE_ACCEPT, validateImage, type MediaFolder } from '@/lib/mediaValidation';
import { toast } from 'sonner';

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  folder: MediaFolder;
  onBusyChange?: (busy: boolean) => void;
}

export function ImageUploadField({ label, value, onChange, folder, onBusyChange }: Props) {
  const id = useId();
  const picker = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [brokenUrl, setBrokenUrl] = useState('');

  const selectFile = async (file?: File) => {
    if (!file) return;
    const invalid = validateImage(file);
    if (invalid) { setError(invalid); toast.error(invalid); return; }
    setError(''); setBusy(true); onBusyChange?.(true);
    try {
      // Reject renamed non-images before uploading any bytes.
      const bitmap = await createImageBitmap(file).catch(() => { throw new Error('This file is not a readable image.'); });
      bitmap.close();
      const url = await uploadMedia(file, folder, setProgress);
      onChange(url); setBrokenUrl(''); toast.success('Image uploaded');
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Image upload failed.';
      setError(message); toast.error(message);
    } finally { setBusy(false); onBusyChange?.(false); }
  };

  return <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <div className="flex flex-col sm:flex-row gap-2">
      <Input id={id} value={value} onChange={event => { onChange(event.target.value); setBrokenUrl(''); }} placeholder="https://..." disabled={busy} className="bg-muted/50 min-w-0" />
      <Button type="button" variant="outline" disabled={busy} onClick={() => picker.current?.click()} className="shrink-0">
        {busy ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}Upload from PC
      </Button>
      <input ref={picker} type="file" accept={IMAGE_ACCEPT} aria-label={`Upload ${label}`} className="hidden" onChange={event => { void selectFile(event.target.files?.[0]); event.target.value = ''; }} />
    </div>
    {busy && <div role="status" className="text-sm text-muted-foreground"><progress max={100} value={progress} className="w-full accent-primary" aria-label="Upload progress" />Uploading… {progress}%</div>}
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    {value && value !== brokenUrl && <img src={value} alt={`${label} preview`} onError={() => setBrokenUrl(value)} className="w-full max-h-48 aspect-video object-contain rounded-md border border-border bg-muted/30" />}
    {value && value === brokenUrl && <p className="text-sm text-destructive">Image preview unavailable. Check the image URL.</p>}
  </div>;
}