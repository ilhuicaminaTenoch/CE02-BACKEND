-- 1) Add column
ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS "leadId" text;

-- 2) FK to leads (ON DELETE SET NULL = no pierdes la orden si borras el lead)
DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1
            FROM pg_constraint
            WHERE conname = 'orders_leadId_fkey'
        ) THEN
            ALTER TABLE orders
                ADD CONSTRAINT orders_leadId_fkey
                    FOREIGN KEY ("leadId") REFERENCES leads(id)
                        ON UPDATE CASCADE
                        ON DELETE SET NULL;
        END IF;
    END $$;

-- 3) Index
CREATE INDEX IF NOT EXISTS orders_leadId_idx
    ON orders("leadId");
