import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { isSupabaseAuthConfigured, loginWithPassword, signUpWithEmail } from "./_core/supabaseAuth";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { createInscricao, getInscricoes, getInscricoesByModalidade, upsertUser } from "./db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const SETORES = [
  "Administração(Prefeitura todos os setores)",
  "Educação",
  "Saúde",
  "Infraestrutura",
  "Assistência Social",
  "Cultura",
  "Daes",
  "Secretaria de Agricultura",
  "Secretaria de Esporte",
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
  "queimada-m",
  "queimada-f",
  "truco-m",
  "truco-f",
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
    login: publicProcedure
      .input(z.object({ email: z.string().email("Email inválido"), password: z.string().min(6, "Senha muito curta") }))
      .mutation(async ({ ctx, input }) => {
        if (!isSupabaseAuthConfigured()) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Autenticação não configurada',
          });
        }
        let session;
        try {
          session = await loginWithPassword(input.email, input.password);
        } catch (error) {
          console.error("[Auth] Login failed:", error);
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Email ou senha inválidos',
          });
        }
        const supabaseUser = session.supabaseUser;
        await upsertUser({
          openId: supabaseUser.id,
          name:
            (supabaseUser.user_metadata?.name as string | undefined) ??
            supabaseUser.email ??
            null,
          email: supabaseUser.email ?? null,
          loginMethod: 'supabase',
          lastSignedIn: new Date(),
        });
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, session.accessToken, {
          ...cookieOptions,
          maxAge: ONE_YEAR_MS,
        });
        return { success: true } as const;
      }),
    register: publicProcedure
      .input(
        z.object({
          email: z.string().email("Email inválido"),
          password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
          name: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (!isSupabaseAuthConfigured()) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Autenticação não configurada',
          });
        }
        let result;
        try {
          result = await signUpWithEmail(input.email, input.password, input.name);
        } catch (error) {
          console.error("[Auth] Signup failed:", error);
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: error instanceof Error ? error.message : 'Falha ao criar conta',
          });
        }
        if (result.needsConfirmation || !result.accessToken || !result.supabaseUser) {
          return { success: true, needsConfirmation: true } as const;
        }
        await upsertUser({
          openId: result.supabaseUser.id,
          name: input.name ?? input.email,
          email: input.email,
          loginMethod: 'supabase',
          lastSignedIn: new Date(),
        });
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, result.accessToken, {
          ...cookieOptions,
          maxAge: ONE_YEAR_MS,
        });
        return { success: true, needsConfirmation: false } as const;
      }),
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
    porModalidade: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Acesso negado',
          });
        }
        try {
          return await getInscricoesByModalidade();
        } catch (error) {
          console.error("[Inscricoes] Error fetching inscriptions by modality:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Erro ao buscar inscrições por modalidade',
          });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
