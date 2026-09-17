ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS monthly_bill DECIMAL(12,2),
  ADD COLUMN IF NOT EXISTS roof_area_sqft DECIMAL(12,2),
  ADD COLUMN IF NOT EXISTS recommended_kw DECIMAL(8,2),
  ADD COLUMN IF NOT EXISTS subsidy_amount DECIMAL(12,2),
  ADD COLUMN IF NOT EXISTS estimated_savings DECIMAL(12,2),
  ADD COLUMN IF NOT EXISTS city VARCHAR(120),
  ADD COLUMN IF NOT EXISTS calculator_payload JSONB;

CREATE INDEX IF NOT EXISTS idx_leads_status_created_at ON leads(status, created_at DESC);
