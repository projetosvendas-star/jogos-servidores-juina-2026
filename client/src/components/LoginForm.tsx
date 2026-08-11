import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { TRPCClientError } from "@trpc/client";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  onSuccess?: () => void;
};

export function LoginForm({ onSuccess }: Props) {
  const utils = trpc.useUtils();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const login = trpc.auth.login.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      await utils.inscricoes.list.invalidate();
      toast.success("Login realizado com sucesso!");
      onSuccess?.();
    },
    onError: (err) => {
      setError(
        err instanceof TRPCClientError ? err.message : "Falha ao entrar"
      );
    },
  });

  const register = trpc.auth.register.useMutation({
    onSuccess: async (result) => {
      if (result.needsConfirmation) {
        setError(
          "Conta criada! Verifique seu email para confirmar o cadastro antes de entrar."
        );
        setMode("login");
        return;
      }
      await utils.auth.me.invalidate();
      await utils.inscricoes.list.invalidate();
      toast.success("Conta criada com sucesso!");
      onSuccess?.();
    },
    onError: (err) => {
      setError(
        err instanceof TRPCClientError ? err.message : "Falha ao criar conta"
      );
    },
  });

  const pending = login.isPending || register.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (mode === "login") {
      login.mutate({ email, password });
    } else {
      register.mutate({ email, password, name: name || undefined });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      {mode === "register" && (
        <div className="space-y-2">
          <Label htmlFor="login-name" className="text-gray-300">
            Nome
          </Label>
          <Input
            id="login-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="login-email" className="text-gray-300">
          Email
        </Label>
        <Input
          id="login-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@exemplo.com"
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="login-password" className="text-gray-300">
          Senha
        </Label>
        <Input
          id="login-password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
        />
      </div>

      {error && (
        <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3"
      >
        {pending ? (
          <Spinner className="w-4 h-4" />
        ) : mode === "login" ? (
          "Entrar"
        ) : (
          "Criar conta"
        )}
      </Button>

      <button
        type="button"
        onClick={() => {
          setMode(mode === "login" ? "register" : "login");
          setError(null);
        }}
        className="w-full text-center text-sm text-blue-300 hover:text-blue-200 underline underline-offset-4"
      >
        {mode === "login"
          ? "Não tem conta? Criar uma"
          : "Já tem conta? Fazer login"}
      </button>
    </form>
  );
}
