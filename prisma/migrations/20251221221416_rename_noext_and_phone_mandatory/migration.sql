-- AlterTable
ALTER TABLE "addresses" RENAME COLUMN "NoExt" TO "noExt";

-- Clean existing phone numbers (keep only last 10 digits of digits)
UPDATE "customers" SET "phone" = RIGHT(regexp_replace("phone", '\D', '', 'g'), 10) WHERE "phone" IS NOT NULL;
UPDATE "customers" SET "phone" = '0000000000' WHERE "phone" IS NULL OR length(RIGHT(regexp_replace("phone", '\D', '', 'g'), 10)) < 10;

-- AlterTable
ALTER TABLE "customers" ALTER COLUMN "phone" SET NOT NULL;

-- Add CHECK constraint for 10 digits phone
ALTER TABLE "customers" ADD CONSTRAINT "phone_ten_digits" CHECK (phone ~ '^\d{10}$');
