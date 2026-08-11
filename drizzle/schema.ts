import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);
export const efetivoEnum = pgEnum("efetivo", ["Sim", "Não"]);
export const seguimentoEnum = pgEnum("seguimento", ["Seletivo", "Coopervale", "Ágape"]);

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: serial("id").primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn", { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Inscrições para os Jogos dos Servidores Público / Juína-MT 2026
 */
export const inscricoes = pgTable("inscricoes", {
  id: serial("id").primaryKey(),
  nomeCompleto: varchar("nomeCompleto", { length: 255 }).notNull(),
  setor: varchar("setor", { length: 100 }).notNull(),
  efetivo: efetivoEnum("efetivo").notNull(),
  seguimento: seguimentoEnum("seguimento").notNull(),
  telefone: varchar("telefone", { length: 20 }).notNull(),
  consentimentoDados: integer("consentimentoDados").notNull(), // 1 = true, 0 = false
  modalidades: text("modalidades").notNull(), // JSON array
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
});

export type Inscricao = typeof inscricoes.$inferSelect;
export type InsertInscricao = typeof inscricoes.$inferInsert;
