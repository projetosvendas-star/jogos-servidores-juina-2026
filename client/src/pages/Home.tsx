import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Trophy, Zap, Shield, Users } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Trophy Icon */}
          <motion.div
            className="flex justify-center mb-8"
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="relative"
            >
              <Trophy className="w-20 h-20 text-yellow-400 drop-shadow-lg" />
            </motion.div>
          </motion.div>

          {/* Main Title */}
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
            Público / Juína-MT 2026
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-lg sm:text-xl text-gray-300 mb-12 leading-relaxed"
            variants={itemVariants}
          >
            Celebre a excelência, a competição e o espírito de equipe. Inscreva-se agora e faça parte da maior celebração esportiva de Juína!
          </motion.p>

          {/* Features Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            variants={containerVariants}
          >
            {[
              {
                icon: Trophy,
                title: "Competição",
                description: "Modalidades variadas",
              },
              {
                icon: Users,
                title: "Comunidade",
                description: "Todos os setores",
              },
              {
                icon: Zap,
                title: "Energia",
                description: "Espírito esportivo",
              },
              {
                icon: Shield,
                title: "Segurança",
                description: "Dados protegidos",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300"
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                }}
              >
                <feature.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h3 className="text-white font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => setLocation("/inscricao")}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Inscrever-se Agora
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => setLocation("/admin")}
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300"
              >
                Painel Administrativo
              </Button>
            </motion.div>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            className="mt-16 flex justify-center gap-4"
            variants={containerVariants}
          >
            {["⚽", "🏐", "🏀", "🏃"].map((emoji, index) => (
              <motion.div
                key={index}
                className="text-4xl"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  delay: index * 0.2,
                  repeat: Infinity,
                }}
              >
                {emoji}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
