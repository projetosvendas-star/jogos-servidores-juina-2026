import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  const adminUser: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user: adminUser,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("inscricoes.create", () => {
  it("should accept valid inscription data", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.inscricoes.create({
      nomeCompleto: "João da Silva",
      setor: "Educação",
      efetivo: "Sim",
      seguimento: "Seletivo",
      telefone: "(65) 98765-4321",
      consentimentoDados: 1,
      modalidades: JSON.stringify(["futsal-m", "voleibol-m"]),
    });

    expect(result.success).toBe(true);
  });

  it("should reject inscription with empty name", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.inscricoes.create({
        nomeCompleto: "",
        setor: "Educação",
        efetivo: "Sim",
        seguimento: "Seletivo",
        telefone: "(65) 98765-4321",
        consentimentoDados: 1,
        modalidades: JSON.stringify(["futsal-m"]),
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should reject inscription with invalid setor", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.inscricoes.create({
        nomeCompleto: "João da Silva",
        setor: "Setor Inválido",
        efetivo: "Sim",
        seguimento: "Seletivo",
        telefone: "(65) 98765-4321",
        consentimentoDados: 1,
        modalidades: JSON.stringify(["futsal-m"]),
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should reject inscription with invalid efetivo", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.inscricoes.create({
        nomeCompleto: "João da Silva",
        setor: "Educação",
        efetivo: "Talvez" as any,
        seguimento: "Seletivo",
        telefone: "(65) 98765-4321",
        consentimentoDados: 1,
        modalidades: JSON.stringify(["futsal-m"]),
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should reject inscription with invalid seguimento", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.inscricoes.create({
        nomeCompleto: "João da Silva",
        setor: "Educação",
        efetivo: "Sim",
        seguimento: "Outro" as any,
        telefone: "(65) 98765-4321",
        consentimentoDados: 1,
        modalidades: JSON.stringify(["futsal-m"]),
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should reject inscription without consentimento", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.inscricoes.create({
        nomeCompleto: "João da Silva",
        setor: "Educação",
        efetivo: "Sim",
        seguimento: "Seletivo",
        telefone: "(65) 98765-4321",
        consentimentoDados: 0,
        modalidades: JSON.stringify(["futsal-m"]),
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should reject inscription with empty modalidades", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.inscricoes.create({
        nomeCompleto: "João da Silva",
        setor: "Educação",
        efetivo: "Sim",
        seguimento: "Seletivo",
        telefone: "(65) 98765-4321",
        consentimentoDados: 1,
        modalidades: JSON.stringify([]),
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should reject inscription with invalid modalidades", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.inscricoes.create({
        nomeCompleto: "João da Silva",
        setor: "Educação",
        efetivo: "Sim",
        seguimento: "Seletivo",
        telefone: "(65) 98765-4321",
        consentimentoDados: 1,
        modalidades: JSON.stringify(["modalidade-invalida"]),
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should accept all valid setores", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const setores = [
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

    for (const setor of setores) {
      const result = await caller.inscricoes.create({
        nomeCompleto: "João da Silva",
        setor,
        efetivo: "Sim",
        seguimento: "Seletivo",
        telefone: "(65) 98765-4321",
        consentimentoDados: 1,
        modalidades: JSON.stringify(["futsal-m"]),
      });
      expect(result.success).toBe(true);
    }
  });

  it("should accept all valid modalidades", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const modalidades = [
      "futsal-m",
      "futsal-f",
      "voleibol-m",
      "voleibol-f",
      "basquete-m",
      "basquete-f",
      "corrida-m",
      "corrida-f",
    ];

    for (const mod of modalidades) {
      const result = await caller.inscricoes.create({
        nomeCompleto: "João da Silva",
        setor: "Educação",
        efetivo: "Sim",
        seguimento: "Seletivo",
        telefone: "(65) 98765-4321",
        consentimentoDados: 1,
        modalidades: JSON.stringify([mod]),
      });
      expect(result.success).toBe(true);
    }
  });
});

describe("inscricoes.list", () => {
  it("should reject access for unauthenticated users", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.inscricoes.list();
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should reject access for non-admin users", async () => {
    const ctx = createAdminContext();
    if (ctx.user) {
      ctx.user.role = "user";
    }
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.inscricoes.list();
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should allow access for admin users", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.inscricoes.list();
    expect(Array.isArray(result)).toBe(true);
  });
});
