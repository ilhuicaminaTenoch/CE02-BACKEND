CREATE UNIQUE INDEX IF NOT EXISTS customers_phone_unique_notnull
    ON customers(phone)
    WHERE phone IS NOT NULL;
