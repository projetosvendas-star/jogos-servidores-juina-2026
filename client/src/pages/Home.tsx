import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";

const orbitBalls = [
  { emoji: "⚽", radius: 92, duration: 14, phase: 0, size: "text-4xl sm:text-5xl" },
  { emoji: "🏀", radius: 70, duration: 9, phase: 90, size: "text-3xl sm:text-4xl" },
  { emoji: "🏐", radius: 108, duration: 18, phase: 180, size: "text-4xl sm:text-5xl" },
  { emoji: "🏈", radius: 82, duration: 11, phase: 270, size: "text-2xl sm:text-3xl" },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [lightbox, setLightbox] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden flex flex-col">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 flex items-center justify-center mx-auto mb-8"
            variants={itemVariants}
          >
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-dashed border-white/15"
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-5 rounded-full border-2 border-dashed border-white/10"
              animate={{ rotate: -360 }}
              transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            />

            {orbitBalls.map((ball, index) => (
              <motion.div
                key={index}
                className="absolute inset-0"
                animate={{ rotate: [ball.phase, ball.phase + 360] }}
                transition={{ duration: ball.duration, repeat: Infinity, ease: "linear" }}
              >
                <motion.div
                  className="absolute left-1/2 top-1/2"
                  style={{ transform: `translateX(${ball.radius}px)` }}
                >
                  <motion.div
                    className={`-translate-x-1/2 -translate-y-1/2 ${ball.size}`}
                    animate={{ rotate: [-ball.phase, -ball.phase - 360] }}
                    transition={{ duration: ball.duration, repeat: Infinity, ease: "linear" }}
                  >
                    <span className="block drop-shadow-lg">{ball.emoji}</span>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}

            <motion.div
              className="relative z-10 flex flex-col items-center justify-center"
              animate={{ y: [0, -30, 0] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                className="absolute right-full top-1/2 mr-1.5 flex items-center gap-1.5 -translate-y-1/2"
                animate={{ opacity: [0, 0.8, 0], x: [-8, -28, -48] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
              >
                {[24, 16, 10].map((w, i) => (
                  <div
                    key={i}
                    className="h-1 rounded-full bg-gradient-to-l from-orange-400 to-transparent"
                    style={{ width: `${w * 4}px` }}
                  />
                ))}
              </motion.div>

              <motion.span
                className="text-7xl sm:text-8xl lg:text-9xl drop-shadow-[0_0_30px_rgba(251,191,36,0.45)]"
                animate={{ rotate: [-6, 6, -6], scale: [1, 1.08, 1] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              >
                🏃
              </motion.span>

              <motion.div
                className="mt-2 h-2 w-24 rounded-full bg-black/40 blur-sm"
                animate={{ scaleX: [1, 0.6, 1], opacity: [0.6, 0.3, 0.6] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              />

              <motion.div
                className="mt-2 h-1 w-52 rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            {["✦", "✦", "✦"].map((spark, index) => (
              <motion.span
                key={index}
                className="absolute text-yellow-300/70 text-lg sm:text-xl"
                style={{ top: `${15 + index * 30}%`, left: `${8 + index * 32}%` }}
                animate={{ y: [0, -14, 0], opacity: [0, 1, 0], rotate: [0, 90, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, delay: index * 0.4 }}
              >
                {spark}
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            className="flex justify-center mb-8 gap-6 flex-wrap"
            variants={itemVariants}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLightbox("/imagem.png")}
              className="cursor-pointer"
            >
              <img
                src="/imagem.png"
                alt="Imagem 1"
                className="w-40 h-40 sm:w-52 sm:h-52 object-cover rounded-xl shadow-lg border border-white/20 hover:border-white/40 transition-all duration-300"
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLightbox("/chatgpt-image.png")}
              className="cursor-pointer"
            >
              <img
                src="/chatgpt-image.png"
                alt="Imagem 2"
                className="w-40 h-40 sm:w-52 sm:h-52 object-cover rounded-xl shadow-lg border border-white/20 hover:border-white/40 transition-all duration-300"
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLightbox("/Screenshot_2.png")}
              className="cursor-pointer"
            >
              <img
                src="/Screenshot_2.png"
                alt="Modalidades - Queimada e Truco"
                className="w-40 h-40 sm:w-52 sm:h-52 object-cover rounded-xl shadow-lg border border-white/20 hover:border-white/40 transition-all duration-300"
              />
            </motion.button>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight"
            variants={itemVariants}
          >
            Jogos dos Servidores
          </motion.h1>

          <motion.h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 via-orange-400 to-red-400 bg-clip-text text-transparent mb-6"
            variants={itemVariants}
          >
            Públicos / Juína-MT 2026
          </motion.h2>

          <motion.p
            className="text-lg sm:text-xl text-gray-300 mb-12 leading-relaxed"
            variants={itemVariants}
          >
            Celebre a excelência, a competição e o espírito de equipe. Inscreva-se agora e faça parte da maior celebração esportiva de Juína!
          </motion.p>

          <motion.div
            className="relative mb-12 max-w-xl mx-auto"
            variants={itemVariants}
          >
            <motion.div
              className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500/40 via-orange-400/40 to-red-500/40 blur-md"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/25 rounded-2xl px-5 sm:px-6 py-4 shadow-lg">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-orange-500 shadow-inner">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-orange-300 mb-1">
                  Treinamento
                </p>
                <p className="text-white font-bold text-sm sm:text-lg leading-snug">
                  Toda Segundas-feiras e Quartas-feiras
                  <span className="text-gray-300 font-medium"> das 19:00Hs às 21:00Hs</span>
                </p>
                <p className="text-gray-300 text-xs sm:text-sm mt-1 leading-relaxed">
                  Na CEM Professor Orlando Pereira, Avenida Loderites da Rosa Correia, nº 550 N, no Módulo 04
                </p>
              </div>
              <motion.span
                className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-green-400"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            variants={itemVariants}
          >
            <motion.div
              className="relative"
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute -inset-1.5 rounded-xl bg-gradient-to-r from-blue-500 via-orange-400 to-red-500 blur-lg"
                animate={{ opacity: [0.5, 0.95, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -inset-1.5 rounded-xl border-2 border-orange-400"
                animate={{ scale: [1, 1.25, 1.5], opacity: [0.9, 0.4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              />
              <Button
                onClick={() => setLocation("/inscricao")}
                className="relative bg-gradient-to-r from-blue-500 via-orange-400 to-red-500 hover:from-blue-600 hover:via-orange-500 hover:to-red-600 text-white font-bold py-4 px-10 rounded-xl text-lg shadow-2xl"
              >
                Inscrever-se Agora
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setLocation("/admin")}
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300"
              >
                Painel Administrativo
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {lightbox && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setLightbox(null)}
        >
          <motion.img
            src={lightbox}
            alt="Imagem ampliada"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          />
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white text-2xl hover:bg-white/20 transition-all duration-300"
            aria-label="Fechar"
          >
            ✕
          </button>
        </motion.div>
      )}

      <SiteFooter />
    </div>
  );
}
