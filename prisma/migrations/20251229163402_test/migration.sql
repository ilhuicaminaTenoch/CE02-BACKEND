-- RenameForeignKey
ALTER TABLE "lead_events" RENAME CONSTRAINT "lead_events_customerid_fkey" TO "lead_events_customerId_fkey";

-- RenameForeignKey
ALTER TABLE "lead_events" RENAME CONSTRAINT "lead_events_leadid_fkey" TO "lead_events_leadId_fkey";

-- RenameForeignKey
ALTER TABLE "orders" RENAME CONSTRAINT "orders_leadid_fkey" TO "orders_leadId_fkey";

-- RenameIndex
ALTER INDEX "lead_events_customerid_createdat_idx" RENAME TO "lead_events_customerId_createdAt_idx";

-- RenameIndex
ALTER INDEX "lead_events_leadid_createdat_idx" RENAME TO "lead_events_leadId_createdAt_idx";

-- RenameIndex
ALTER INDEX "lead_events_type_createdat_idx" RENAME TO "lead_events_type_createdAt_idx";

-- RenameIndex
ALTER INDEX "orders_leadid_idx" RENAME TO "orders_leadId_idx";
