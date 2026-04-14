-- Add DELETE and UPDATE policies for voice-intros bucket so users can manage their own recordings
CREATE POLICY "Users can delete own voice intros"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'voice-intros' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update own voice intros"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'voice-intros' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Add admin SELECT policy for verifications bucket so admins can review selfies
CREATE POLICY "Admins can view verification selfies"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'verifications' AND
  public.has_role(auth.uid(), 'admin')
);