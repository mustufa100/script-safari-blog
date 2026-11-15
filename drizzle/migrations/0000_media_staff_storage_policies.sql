DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Media public read') THEN
    CREATE POLICY "Media public read" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'media');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Media staff insert') THEN
    CREATE POLICY "Media staff insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND public.is_staff(auth.uid()) AND (storage.foldername(name))[1] IN ('posts','web-stories','authors','categories') AND lower(storage.extension(name)) IN ('jpg','jpeg','png','webp'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Media staff update') THEN
    CREATE POLICY "Media staff update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'media' AND public.is_staff(auth.uid())) WITH CHECK (bucket_id = 'media' AND public.is_staff(auth.uid()) AND (storage.foldername(name))[1] IN ('posts','web-stories','authors','categories') AND lower(storage.extension(name)) IN ('jpg','jpeg','png','webp'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Media staff delete') THEN
    CREATE POLICY "Media staff delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media' AND public.is_staff(auth.uid()));
  END IF;
END $$;