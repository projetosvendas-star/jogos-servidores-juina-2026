import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { SiteFooter } from "@/components/SiteFooter";

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

const MODALIDADES = [
  { id: "futsal-m", label: "Futsal Masculino", categoria: "Futsal" },
  { id: "futsal-f", label: "Futsal Feminino", categoria: "Futsal" },
  { id: "voleibol-m", label: "Voleibol Masculino", categoria: "Voleibol" },
  { id: "voleibol-f", label: "Voleibol Feminino", categoria: "Voleibol" },
  { id: "basquete-m", label: "Basquetebol Arremesso Masculino", categoria: "Basquetebol" },
  { id: "basquete-f", label: "Basquetebol Arremesso Feminino", categoria: "Basquetebol" },
  { id: "corrida-m", label: "Corrida de Rua Masculina", categoria: "Corrida" },
  { id: "corrida-f", label: "Corrida de Rua Feminina", categoria: "Corrida" },
];

interface FormData {
  nomeCompleto: string;
  setor: string;
  efetivo: "Sim" | "Não";
  seguimento: "Seletivo" | "Coopervale" | "Ágape";
  telefone: string;
  consentimentoDados: boolean;
}

export default function Inscricao() {
  const [, setLocation] = useLocation();
  const [selectedModalidades, setSelectedModalidades] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors: formErrors },
  } = useForm<FormData>({
    mode: "onBlur",
    defaultValues: {
      efetivo: "Sim",
      seguimento: "Seletivo",
      consentimentoDados: false,
    },
  });

  const createInscricao = trpc.inscricoes.create.useMutation();
  const isLoading = createInscricao.isPending;
  const setor = watch("setor");
  const consentimento = watch("consentimentoDados");
  const efetivo = watch("efetivo");

  const validateForm = (data: FormData): boolean => {
    const newErrors: Record<string, string> = {};

    if (!data.nomeCompleto || data.nomeCompleto.trim().length === 0) {
      newErrors.nomeCompleto = "Nome completo é obrigatório";
    }

    if (!setor || setor.trim().length === 0) {
      newErrors.setor = "Setor é obrigatório";
    }

    if (!data.telefone || data.telefone.trim().length === 0) {
      newErrors.telefone = "Telefone/WhatsApp é obrigatório";
    } else if (!/^\(?[0-9]{2}\)?[\s]?9?[0-9]{4}-?[0-9]{4}$/.test(data.telefone.replace(/\D/g, ""))) {
      newErrors.telefone = "Telefone inválido";
    }

    if (selectedModalidades.length === 0) {
      newErrors.modalidades = "Selecione pelo menos uma modalidade esportiva";
    }

    if (data.efetivo === "Não" && !data.seguimento) {
      newErrors.seguimento = "Seguimento é obrigatório";
    }

    if (!data.consentimentoDados) {
      newErrors.consentimento = "Você deve consentir com o uso dos dados pessoais";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (data: FormData) => {
    if (!validateForm(data)) {
      toast.error("Por favor, corrija os erros no formulário");
      return;
    }

    try {
      await createInscricao.mutateAsync({
        nomeCompleto: data.nomeCompleto,
        setor: data.setor,
        efetivo: data.efetivo,
        seguimento: data.seguimento,
        telefone: data.telefone,
        consentimentoDados: data.consentimentoDados ? 1 : 0,
        modalidades: selectedModalidades as unknown as string,
      });

      toast.success("Inscrição realizada com sucesso! 🎉");
      setTimeout(() => setLocation("/"), 2000);
    } catch (error) {
      toast.error("Erro ao realizar inscrição. Tente novamente.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <Button
            onClick={() => setLocation("/")}
            variant="ghost"
            className="text-white hover:bg-white/10 mb-4"
          >
            ← Voltar
          </Button>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Inscrição
          </h1>
          <p className="text-gray-300">
            Jogos dos Servidores Público / Juína-MT 2026
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Dados Pessoais</CardTitle>
              <CardDescription className="text-gray-300">
                Preencha os campos abaixo para se inscrever
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Nome Completo */}
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="nomeCompleto" className="text-white">
                    Nome Completo *
                  </Label>
                  <Input
                    id="nomeCompleto"
                    placeholder="Digite seu nome completo"
                    {...register("nomeCompleto", { required: true })}
                    className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 ${
                      errors.nomeCompleto ? "border-red-500" : ""
                    }`}
                  />
                  {errors.nomeCompleto && (
                    <p className="text-red-400 text-sm">{errors.nomeCompleto}</p>
                  )}
                </motion.div>

                {/* Setor */}
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="setor" className="text-white">
                    Setor *
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      setValue("setor", value);
                      if (value) {
                        setErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.setor;
                          return newErrors;
                        });
                      }
                    }}
                  >
                    <SelectTrigger
                      className={`bg-white/10 border-white/20 text-white ${
                        errors.setor ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Selecione seu setor" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/20">
                      {SETORES.map((setor) => (
                        <SelectItem key={setor} value={setor} className="text-white">
                          {setor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.setor && (
                    <p className="text-red-400 text-sm">{errors.setor}</p>
                  )}
                </motion.div>

                {/* Efetivo */}
                <motion.div className="space-y-3" variants={itemVariants}>
                  <Label className="text-white">Efetivo *</Label>
                  <RadioGroup
                    onValueChange={(value) => {
                      setValue("efetivo", value as "Sim" | "Não");
                      if (value === "Não") {
                        setErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.seguimento;
                          return newErrors;
                        });
                      }
                    }}
                    defaultValue="Sim"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Sim" id="efetivo-sim" />
                      <Label htmlFor="efetivo-sim" className="text-gray-300 cursor-pointer">
                        Sim
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Não" id="efetivo-nao" />
                      <Label htmlFor="efetivo-nao" className="text-gray-300 cursor-pointer">
                        Não
                      </Label>
                    </div>
                  </RadioGroup>
                </motion.div>

                {/* Seguimento */}
                {efetivo === "Não" && (
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Label htmlFor="seguimento" className="text-white">
                      Seguimento *
                    </Label>
                    <Select
                      onValueChange={(value) => {
                        setValue("seguimento", value as "Seletivo" | "Coopervale" | "Ágape");
                        if (value) {
                          setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.seguimento;
                            return newErrors;
                          });
                        }
                      }}
                    >
                      <SelectTrigger
                        className={`bg-white/10 border-white/20 text-white ${
                          errors.seguimento ? "border-red-500" : ""
                        }`}
                      >
                        <SelectValue placeholder="Selecione o seguimento" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/20">
                        <SelectItem value="Seletivo" className="text-white">
                          Seletivo
                        </SelectItem>
                        <SelectItem value="Coopervale" className="text-white">
                          Coopervale
                        </SelectItem>
                        <SelectItem value="Ágape" className="text-white">
                          Ágape
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.seguimento && (
                      <p className="text-red-400 text-sm">{errors.seguimento}</p>
                    )}
                  </motion.div>
                )}

                {/* Telefone */}
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="telefone" className="text-white">
                    Telefone / WhatsApp *
                  </Label>
                  <Input
                    id="telefone"
                    placeholder="(00) 00000-0000"
                    {...register("telefone", { required: true })}
                    className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 ${
                      errors.telefone ? "border-red-500" : ""
                    }`}
                  />
                  {errors.telefone && (
                    <p className="text-red-400 text-sm">{errors.telefone}</p>
                  )}
                </motion.div>

                {/* Modalidades */}
                <motion.div className="space-y-3" variants={itemVariants}>
                  <Label className="text-white">Modalidades Esportivas *</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {MODALIDADES.map((mod) => (
                      <motion.div
                        key={mod.id}
                        className="flex items-center space-x-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Checkbox
                          id={mod.id}
                          checked={selectedModalidades.includes(mod.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedModalidades([
                                ...selectedModalidades,
                                mod.id,
                              ]);
                              setErrors((prev) => {
                                const newErrors = { ...prev };
                                delete newErrors.modalidades;
                                return newErrors;
                              });
                            } else {
                              setSelectedModalidades(
                                selectedModalidades.filter((m) => m !== mod.id)
                              );
                            }
                          }}
                        />
                        <Label
                          htmlFor={mod.id}
                          className="text-gray-300 cursor-pointer flex-1"
                        >
                          {mod.label}
                        </Label>
                      </motion.div>
                    ))}
                  </div>
                  {errors.modalidades && (
                    <p className="text-red-400 text-sm">{errors.modalidades}</p>
                  )}
                </motion.div>

                {/* Consentimento */}
                <motion.div
                  className={`flex items-start space-x-3 p-4 rounded-lg border ${
                    errors.consentimento
                      ? "bg-red-500/10 border-red-500/20"
                      : "bg-blue-500/10 border-blue-500/20"
                  }`}
                  variants={itemVariants}
                >
                  <Checkbox
                    id="consentimento"
                    checked={consentimento}
                    onCheckedChange={(checked) => {
                      setValue("consentimentoDados", !!checked);
                      if (checked) {
                        setErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.consentimento;
                          return newErrors;
                        });
                      }
                    }}
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="consentimento"
                      className="text-gray-300 cursor-pointer text-sm leading-relaxed"
                    >
                      Eu concordo com a utilização dos meus dados pessoais para fins
                      de inscrição e comunicação sobre os Jogos dos Servidores Público
                      / Juína-MT 2026 *
                    </Label>
                    {errors.consentimento && (
                      <p className="text-red-400 text-sm mt-2">{errors.consentimento}</p>
                    )}
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition-all duration-300"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Spinner className="w-4 h-4" />
                        Enviando...
                      </div>
                    ) : (
                      "Confirmar Inscrição"
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
        <SiteFooter />
      </motion.div>
    </div>
  );
}
