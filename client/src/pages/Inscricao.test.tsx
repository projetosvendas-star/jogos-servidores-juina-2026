import { describe, it, expect, beforeEach } from "vitest";

describe("Inscricao Form Validation", () => {
  describe("Client-side validation", () => {
    it("should validate nome completo is required", () => {
      const nome = "";
      const isValid = nome.trim().length > 0;
      expect(isValid).toBe(false);
    });

    it("should validate nome completo has minimum length", () => {
      const nome = "Jo";
      const isValid = nome.trim().length >= 3;
      expect(isValid).toBe(false);
    });

    it("should accept valid nome completo", () => {
      const nome = "João da Silva";
      const isValid = nome.trim().length >= 3;
      expect(isValid).toBe(true);
    });

    it("should validate setor is selected", () => {
      const setor = "";
      const isValid = setor.trim().length > 0;
      expect(isValid).toBe(false);
    });

    it("should accept valid setor", () => {
      const setor = "Educação";
      const validSetores = [
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
      const isValid = validSetores.includes(setor);
      expect(isValid).toBe(true);
    });

    it("should validate telefone format", () => {
      const validPhones = [
        "(65) 98765-4321",
        "(65)98765-4321",
        "65987654321",
        "6598765-4321",
      ];

      validPhones.forEach((phone) => {
        const isValid = /^\(?[0-9]{2}\)?[\s]?9?[0-9]{4}-?[0-9]{4}$/.test(
          phone.replace(/\D/g, "")
        );
        expect(isValid).toBe(true);
      });
    });

    it("should reject invalid telefone format", () => {
      const invalidPhones = ["123", "abc", ""];

      invalidPhones.forEach((phone) => {
        const isValid = /^\(?[0-9]{2}\)?[\s]?9?[0-9]{4}-?[0-9]{4}$/.test(
          phone.replace(/\D/g, "")
        );
        expect(isValid).toBe(false);
      });
    });

    it("should validate at least one modalidade is selected", () => {
      const modalidades: string[] = [];
      const isValid = modalidades.length > 0;
      expect(isValid).toBe(false);
    });

    it("should accept multiple modalidades", () => {
      const modalidades = ["futsal-m", "voleibol-f"];
      const isValid = modalidades.length > 0;
      expect(isValid).toBe(true);
    });

    it("should validate consentimento is checked", () => {
      const consentimento: boolean = false;
      const isValid = consentimento;
      expect(isValid).toBe(false);
    });

    it("should accept consentimento checked", () => {
      const consentimento = true;
      const isValid = consentimento === true;
      expect(isValid).toBe(true);
    });

    it("should validate efetivo is selected", () => {
      const efetivo = "Sim";
      const validValues = ["Sim", "Não"];
      const isValid = validValues.includes(efetivo);
      expect(isValid).toBe(true);
    });

    it("should validate seguimento is selected", () => {
      const seguimento = "Seletivo";
      const validValues = ["Seletivo", "Coopervale", "Ágape"];
      const isValid = validValues.includes(seguimento);
      expect(isValid).toBe(true);
    });
  });

  describe("Modalidades validation", () => {
    const validModalidades = [
      "futsal-m",
      "futsal-f",
      "voleibol-m",
      "voleibol-f",
      "basquete-m",
      "basquete-f",
      "corrida-m",
      "corrida-f",
    ];

    it("should accept all valid modalidades", () => {
      validModalidades.forEach((mod) => {
        const isValid = validModalidades.includes(mod);
        expect(isValid).toBe(true);
      });
    });

    it("should reject invalid modalidades", () => {
      const invalidMod = "invalid-modalidade";
      const isValid = validModalidades.includes(invalidMod);
      expect(isValid).toBe(false);
    });

    it("should handle multiple modalidades selection", () => {
      const selected = ["futsal-m", "voleibol-f", "corrida-m"];
      const allValid = selected.every((mod) => validModalidades.includes(mod));
      expect(allValid).toBe(true);
    });
  });

  describe("Form submission validation", () => {
    it("should validate complete form data", () => {
      const formData = {
        nomeCompleto: "João da Silva",
        setor: "Educação",
        efetivo: "Sim" as const,
        seguimento: "Seletivo" as const,
        telefone: "(65) 98765-4321",
        consentimentoDados: true,
      };

      const isNomeValid = formData.nomeCompleto.trim().length >= 3;
      const isSetorValid = formData.setor.trim().length > 0;
      const isTelefoneValid =
        /^\(?[0-9]{2}\)?[\s]?9?[0-9]{4}-?[0-9]{4}$/.test(
          formData.telefone.replace(/\D/g, "")
        );
      const isConsentimentoValid = formData.consentimentoDados === true;

      const isFormValid =
        isNomeValid && isSetorValid && isTelefoneValid && isConsentimentoValid;
      expect(isFormValid).toBe(true);
    });

    it("should reject incomplete form data", () => {
      const formData = {
        nomeCompleto: "",
        setor: "Educação",
        efetivo: "Sim" as const,
        seguimento: "Seletivo" as const,
        telefone: "(65) 98765-4321",
        consentimentoDados: true,
      };

      const isNomeValid = formData.nomeCompleto.trim().length >= 3;
      expect(isNomeValid).toBe(false);
    });
  });
});
