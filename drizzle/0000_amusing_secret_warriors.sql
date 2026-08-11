CREATE TYPE "public"."efetivo" AS ENUM('Sim', 'Não');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."seguimento" AS ENUM('Seletivo', 'Coopervale', 'Ágape');--> statement-breakpoint
CREATE TABLE "inscricoes" (
	"id" serial PRIMARY KEY NOT NULL,
	"nomeCompleto" varchar(255) NOT NULL,
	"setor" varchar(100) NOT NULL,
	"efetivo" "efetivo" NOT NULL,
	"seguimento" "seguimento" NOT NULL,
	"telefone" varchar(20) NOT NULL,
	"consentimentoDados" integer NOT NULL,
	"modalidades" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
