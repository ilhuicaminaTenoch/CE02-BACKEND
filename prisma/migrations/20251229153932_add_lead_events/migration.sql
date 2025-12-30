DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1
            FROM pg_type t
                     JOIN pg_namespace n ON n.oid = t.typnamespace
            WHERE t.typname = 'LeadEventType' AND n.nspname = 'ce02'
        ) THEN
            CREATE TYPE LeadEventType AS ENUM (
                'CUSTOMER_CREATED',
                'LEAD_CREATED',
                'LEAD_UPDATED',
                'APPOINTMENT_SCHEDULED',
                'APPOINTMENT_COMPLETED',
                'ORDER_SUBMITTED',
                'ORDER_QUOTED',
                'DEAL_WON',
                'DEAL_LOST',
                'SPAM_FLAGGED'
                );
        END IF;
    END $$;

-- Tabla
CREATE TABLE IF NOT EXISTS lead_events (
                                                id text PRIMARY KEY,
                                                "customerId" text NOT NULL,
                                                "leadId" text NULL,
                                                type LeadEventType NOT NULL,
                                                metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
                                                ip inet NULL,
                                                user_agent text NULL,
                                                "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- FKs
DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'lead_events_customerId_fkey'
        ) THEN
            ALTER TABLE lead_events
                ADD CONSTRAINT lead_events_customerId_fkey
                    FOREIGN KEY ("customerId") REFERENCES customers(id)
                        ON UPDATE CASCADE
                        ON DELETE CASCADE;
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'lead_events_leadId_fkey'
        ) THEN
            ALTER TABLE lead_events
                ADD CONSTRAINT lead_events_leadId_fkey
                    FOREIGN KEY ("leadId") REFERENCES leads(id)
                        ON UPDATE CASCADE
                        ON DELETE CASCADE;
        END IF;
    END $$;

-- Índices
CREATE INDEX IF NOT EXISTS lead_events_customerId_createdAt_idx
    ON lead_events("customerId", "createdAt");

CREATE INDEX IF NOT EXISTS lead_events_leadId_createdAt_idx
    ON lead_events("leadId", "createdAt");

CREATE INDEX IF NOT EXISTS lead_events_type_createdAt_idx
    ON lead_events(type, "createdAt");
