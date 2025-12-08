-- AlterTable
ALTER TABLE "user" 
  ALTER COLUMN "emailVerified" TYPE BOOLEAN 
  USING ("emailVerified" IS NOT NULL),
  ALTER COLUMN "emailVerified" SET DEFAULT false,
  ALTER COLUMN "emailVerified" SET NOT NULL;
