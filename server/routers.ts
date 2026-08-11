import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { createInscricao, getInscricoes } from "./db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const SETORES = [
  "Administração",
  "Educação",
  "Saúde",
  "Infraestrutura",
  "Segurança",
  "Assistência Social",
  "Cultura",
  "Meio Ambiente",
  "Desenvolvimento Econômico",
];

const MODALIDADES_VALIDAS = [
  "futsal-m",
  "futsal-f",
  "voleibol-m",
  "voleibol-f",
  "basquete-m",
  "basquete-f",
  "corrida-m",
  "corrida-f",
];

const inscricaoSchema = z.object({
  nomeCompleto: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").max(255),
  setor: z.string().refine((val) => SETORES.includes(val), "Setor inválido"),
  efetivo: z.enum(["Sim", "Não"]),
  seguimento: z.enum(["Seletivo", "Coopervale", "Ágape"]),
  telefone: z.string().min(10, "Telefone inválido").max(20),
  consentimentoDados: z.number().refine((val) => val === 1, {
    message: "Consentimento é obrigatório",
  }),
  modalidades: z.string().refine((val) => {
    try {
      const parsed = JSON.parse(val);
      if (!Array.isArray(parsed)) return false;
      if (parsed.length === 0) return false;
      return parsed.every((m) => MODALIDADES_VALIDAS.includes(m));
    } catch {
      return false;
    }
  }, "Modalidades inválidas"),
});

export const inscricaoFiltersSchema = z.object({
  search: z.string().optional(),
  setor: z.string().optional(),
  efetivo: z.enum(["Sim", "Não"]).optional(),
  seguimento: z.enum(["Seletivo", "Coopervale", "Ágape"]).optional(),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  inscricoes: router({
    create: publicProcedure
      .input(inscricaoSchema)
      .mutation(async ({ input }) => {
        try {
          await createInscricao({
            nomeCompleto: input.nomeCompleto,
            setor: input.setor,
            efetivo: input.efetivo as 'Sim' | 'Não',
            seguimento: input.seguimento as 'Seletivo' | 'Coopervale' | 'Ágape',
            telefone: input.telefone,
            consentimentoDados: input.consentimentoDados,
            modalidades: input.modalidades,
          });
          return { success: true };
        } catch (error) {
          console.error("[Inscricoes] Error creating inscription:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Erro ao salvar inscrição',
          });
        }
      }),
    list: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Acesso negado',
          });
        }
        try {
          return await getInscricoes();
        } catch (error) {
          console.error("[Inscricoes] Error fetching inscriptions:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Erro ao buscar inscrições',
          });
        }
      }),
    search: protectedProcedure
      .input(inscricaoFiltersSchema)
      .query(async ({ ctx, input }) => {
        if (ctx.user?.role !== 'admin') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Acesso negado',
          });
        }
        try {
          let inscricoesList = await getInscricoes();
          
          // Filtrar por busca (nome ou telefone)
          if (input.search && input.search.trim().length > 0) {
            const searchLower = input.search.toLowerCase();
            inscricoesList = inscricoesList.filter((insc) =>
              insc.nomeCompleto.toLowerCase().includes(searchLower) ||
              insc.telefone.includes(searchLower)
            );
          }
          
          // Filtrar por setor
          if (input.setor) {
            inscricoesList = inscricoesList.filter((insc) => insc.setor === input.setor);
          }
          
          // Filtrar por efetivo
          if (input.efetivo) {
            inscricoesList = inscricoesList.filter((insc) => insc.efetivo === input.efetivo);
          }
          
          // Filtrar por seguimento
          if (input.seguimento) {
            inscricoesList = inscricoesList.filter((insc) => insc.seguimento === input.seguimento);
          }
          
          return inscricoesList;
        } catch (error) {
          console.error("[Inscricoes] Error searching inscriptions:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Erro ao buscar inscrições',
          });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
