"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Phone, Globe2 } from "lucide-react";

const WA_NUMBER = "5551993583936";

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const nome = formData.get("nome");
    const empresa = formData.get("empresa");
    const mensagem = formData.get("mensagem");
    
    const text = `Olá! Sou ${nome}, da empresa ${empresa}. ${mensagem}`.trim();
    const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
    
    window.open(waUrl, "_blank");
    setIsSubmitting(false);
  };

  return (
    <section id="contato" className="relative py-24 sm:py-32 bg-background overflow-hidden">
      {/* Glow de fundo */}
      <div aria-hidden className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container-luxe relative z-10">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-start">
          
          {/* Coluna da Esquerda: Formulário */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-blue-500/20 bg-blue-500/5 text-xs font-bold uppercase tracking-widest text-blue-400">
              Iniciar Projeto
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display uppercase tracking-tight mb-6">
              Pronto para acelerar os seus <span className="text-blue-gradient">Resultados?</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              Preencha o formulário e conte-nos um pouco sobre a sua empresa. Retornaremos rapidamente para discutirmos a melhor solução tecnológica.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="nome" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Nome</label>
                  <input id="nome" name="nome" type="text" required className="w-full bg-card/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-foreground" placeholder="Seu nome" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="empresa" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Empresa</label>
                  <input id="empresa" name="empresa" type="text" required className="w-full bg-card/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-foreground" placeholder="Nome da empresa" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="mensagem" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Como podemos ajudar?</label>
                <textarea id="mensagem" name="mensagem" required rows={4} className="w-full bg-card/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-foreground resize-none" placeholder="Descreva brevemente o seu projeto ou objetivo..." />
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-gradient text-white font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-blue-glow"
              >
                Solicitar Orçamento
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          </motion.div>

          {/* Coluna da Direita: Contatos Diretos */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" as const }}
            className="bg-card border border-border rounded-3xl p-8 lg:p-10"
          >
            <h3 className="text-2xl font-display font-bold mb-8 text-foreground">Contacto Direto</h3>
            
            <div className="space-y-6">
              <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 p-4 rounded-2xl bg-background/50 border border-border hover:border-blue-500/40 transition-colors group">
                <div className="bg-blue-500/10 p-3 rounded-xl group-hover:bg-blue-500 text-blue-400 group-hover:text-white transition-colors">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">WhatsApp</p>
                  <p className="text-foreground font-medium">(51) 99358-3936</p>
                </div>
              </a>

              <a href="mailto:contato@focuspulse.site" className="flex items-start gap-4 p-4 rounded-2xl bg-background/50 border border-border hover:border-blue-500/40 transition-colors group">
                <div className="bg-blue-500/10 p-3 rounded-xl group-hover:bg-blue-500 text-blue-400 group-hover:text-white transition-colors">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">E-mail</p>
                  <p className="text-foreground font-medium">contato@focuspulse.site</p>
                </div>
              </a>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-background/50 border border-border">
                <div className="bg-blue-500/10 p-3 rounded-xl text-blue-400">
                  <Globe2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Atendimento</p>
                  <p className="text-foreground font-medium">100% Remoto para todo o Brasil</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}