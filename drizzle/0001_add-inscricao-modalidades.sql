CREATE TABLE "inscricao_modalidades" (
	"id" serial PRIMARY KEY NOT NULL,
	"inscricaoId" integer NOT NULL,
	"modalidade" varchar(50) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "inscricao_modalidades" ADD CONSTRAINT "inscricao_modalidades_inscricaoId_inscricoes_id_fk" FOREIGN KEY ("inscricaoId") REFERENCES "public"."inscricoes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "inscricao_modalidades_modalidade_idx" ON "inscricao_modalidades" USING btree ("modalidade");