ALTER TYPE "public"."seguimento" ADD VALUE 'Comissionado';--> statement-breakpoint
ALTER TABLE "inscricoes" ALTER COLUMN "seguimento" DROP NOT NULL;