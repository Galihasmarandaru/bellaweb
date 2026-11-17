-- Create tables for Generate Invoice master options: KEPADA and ITEM INVOICE descriptions

CREATE TABLE IF NOT EXISTS public.invoice_recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.invoice_item_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.invoice_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_item_templates ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoice_recipients TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoice_item_templates TO authenticated;

DROP POLICY IF EXISTS "Authenticated users can manage invoice_recipients" ON public.invoice_recipients;
CREATE POLICY "Authenticated users can manage invoice_recipients"
  ON public.invoice_recipients
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can manage invoice_item_templates" ON public.invoice_item_templates;
CREATE POLICY "Authenticated users can manage invoice_item_templates"
  ON public.invoice_item_templates
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

INSERT INTO public.invoice_recipients (name)
VALUES ('Jogja Lodge')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.invoice_item_templates (description)
VALUES
  ('Konten on-site oleh content creator (1-2 konten/2 minggu, 2-3 kunjungan/bulan)'),
  ('Instagram Story harian (3-5 hari/minggu) - Dengan opsi mirror social media KOL (@bellarhemaagnesia)')
ON CONFLICT (description) DO NOTHING;
