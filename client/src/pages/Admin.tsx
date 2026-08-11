import { useAuth } from "@/_core/hooks/useAuth";
import { LoginForm } from "@/components/LoginForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Spinner } from "@/components/ui/spinner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Download, FileText, LogOut, Lock } from "lucide-react";
import { toast } from "sonner";
import { exportModalidadesReport } from "@/lib/pdfReport";
import { SiteFooter } from "@/components/SiteFooter";
import { useState } from "react";

export default function Admin() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [categoria, setCategoria] = useState("Todas");
  const { data: inscricoes, isLoading } = trpc.inscricoes.list.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
        <motion.div
          className="text-center max-w-md w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="flex justify-center mb-6"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <Lock className="w-16 h-16 text-yellow-400" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Painel Administrativo
          </h1>
          <p className="text-gray-300 mb-8">
            Entre com sua conta para acessar o painel dos Jogos dos Servidores.
          </p>
          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
            <CardContent className="pt-6">
              <LoginForm />
            </CardContent>
          </Card>
          <Button
            onClick={() => setLocation("/")}
            variant="outline"
            className="mt-6 border-white text-white hover:bg-white/10"
          >
            Voltar ao site
          </Button>
        </motion.div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-white mb-4">
            Acesso Negado
          </h1>
          <p className="text-gray-300 mb-8">
            Apenas administradores podem acessar este painel.
          </p>
          <Button
            onClick={() => {
              logout();
              setLocation("/");
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Sair e Voltar
          </Button>
        </motion.div>
      </div>
    );
  }

  const handleExport = () => {
    if (!inscricoes || inscricoes.length === 0) {
      toast.error("Nenhuma inscrição para exportar");
      return;
    }

    const csv = [
      ["ID", "Nome", "Setor", "Efetivo", "Seguimento", "Telefone", "Modalidades", "Data"],
      ...inscricoes.map((insc) => [
        insc.id,
        insc.nomeCompleto,
        insc.setor,
        insc.efetivo,
        insc.seguimento,
        insc.telefone,
        insc.modalidades,
        new Date(insc.createdAt).toLocaleString("pt-BR"),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
    element.setAttribute("download", `inscricoes-${new Date().toISOString().split("T")[0]}.csv`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast.success("Inscrições exportadas com sucesso!");
  };

  const handleExportPDF = (filtroCategoria?: string) => {
    if (!inscricoes || inscricoes.length === 0) {
      toast.error("Nenhuma inscrição para exportar");
      return;
    }
    try {
      exportModalidadesReport(
        inscricoes,
        filtroCategoria && filtroCategoria !== "Todas" ? filtroCategoria : undefined
      );
      toast.success("Relatório PDF gerado com sucesso!");
    } catch (error) {
      console.error("[Admin] Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar o relatório PDF");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Painel Administrativo
            </h1>
            <p className="text-gray-300">
              Bem-vindo, {user?.name || "Administrador"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => handleExportPDF()}
              className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Exportar PDF
            </Button>
            <Button
              onClick={handleExport}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar CSV
            </Button>
            <Button
              onClick={() => {
                logout();
                setLocation("/");
              }}
              variant="outline"
              className="border-white text-white hover:bg-white/10 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Total de Inscrições
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {inscricoes?.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Efetivos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">
                {inscricoes?.filter((i) => i.efetivo === "Sim").length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Não Efetivos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-400">
                {inscricoes?.filter((i) => i.efetivo === "Não").length || 0}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Relatório por categoria */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-400" />
                Relatório por Categoria de Modalidade
              </CardTitle>
              <CardDescription className="text-gray-300">
                Escolha a categoria e emita o relatório em PDF
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3 items-end">
                <div className="space-y-2 flex-1">
                  <Label htmlFor="categoria" className="text-white">
                    Categoria da Modalidade
                  </Label>
                  <Select value={categoria} onValueChange={setCategoria}>
                    <SelectTrigger
                      id="categoria"
                      className="bg-white/10 border-white/20 text-white"
                    >
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/20">
                      <SelectItem value="Todas" className="text-white">
                        Todas
                      </SelectItem>
                      <SelectItem value="Futsal" className="text-white">
                        Futsal
                      </SelectItem>
                      <SelectItem value="Voleibol" className="text-white">
                        Voleibol
                      </SelectItem>
                      <SelectItem value="Basquetebol" className="text-white">
                        Basquetebol
                      </SelectItem>
                      <SelectItem value="Corrida" className="text-white">
                        Corrida
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={() => handleExportPDF(categoria)}
                  className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Emitir Relatório
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Inscrições</CardTitle>
              <CardDescription className="text-gray-300">
                Lista completa de participantes inscritos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner className="w-8 h-8" />
                </div>
              ) : inscricoes && inscricoes.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-white/5">
                        <TableHead className="text-gray-300">Nome</TableHead>
                        <TableHead className="text-gray-300">Setor</TableHead>
                        <TableHead className="text-gray-300">Efetivo</TableHead>
                        <TableHead className="text-gray-300">Seguimento</TableHead>
                        <TableHead className="text-gray-300">Telefone</TableHead>
                        <TableHead className="text-gray-300">Modalidades</TableHead>
                        <TableHead className="text-gray-300">Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inscricoes.map((insc) => (
                        <TableRow
                          key={insc.id}
                          className="border-white/10 hover:bg-white/5 transition-colors"
                        >
                          <TableCell className="text-white font-medium">
                            {insc.nomeCompleto}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {insc.setor}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                insc.efetivo === "Sim"
                                  ? "bg-blue-500/20 text-blue-300"
                                  : "bg-orange-500/20 text-orange-300"
                              }`}
                            >
                              {insc.efetivo}
                            </span>
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {insc.seguimento}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {insc.telefone}
                          </TableCell>
                          <TableCell className="text-gray-300 text-sm">
                            {typeof insc.modalidades === "string"
                              ? JSON.parse(insc.modalidades).length
                              : 0}{" "}
                            modalidade(s)
                          </TableCell>
                          <TableCell className="text-gray-300 text-sm">
                            {new Date(insc.createdAt).toLocaleString("pt-BR")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-300">Nenhuma inscrição encontrada</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      <SiteFooter />
    </div>
  );
}
