import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Cpu, 
  Target, 
  Zap, 
  Lock, 
  Activity, 
  ChevronRight, 
  Database, 
  ShieldCheck,
  Radar,
  ArrowRight,
  Eye,
  Terminal,
  Crosshair,
  AlertTriangle,
  Server,
  Skull,
  type LucideIcon,
} from 'lucide-react';

// --- TYPES ---

interface Spec {
  label: string;
  value: string;
}

interface TacticalSectionProps {
  id: string;
  title: string;
  subtitle: string;
  specs: Spec[];
  imagePlaceholder: string;
  icon: LucideIcon;
  serial: string;
}

// --- COMPONENTES TÁCTICOS ---

const TacticalHeader = () => (
  <div className="fixed top-0 left-0 w-full z-[60] pointer-events-none">
    <div className="bg-tactical-amber text-black py-1 px-4 text-[10px] font-black tracking-[0.5em] text-center uppercase animate-pulse shadow-[0_0_20px_rgba(255,176,0,0.3)]">
      PROPRIETARY INFORMATION - FOR OFFICIAL USE ONLY - CONTROLLED ACCESS
    </div>
    <div className="flex justify-between px-6 py-3 font-mono text-[9px] text-white/40 bg-gradient-to-b from-black to-transparent">
      <div className="flex gap-4">
        <span>STRAT_NODE: BOG_CENTER_01</span>
        <span className="text-cyan-500/50">SEC_PROTO: OMEGA_7</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
        <span>CONEXIÓN: DIRECT_ENCRYPTED</span>
      </div>
    </div>
  </div>
);

const TelemetryOverlay = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [bitrate, setBitrate] = useState(640.4);
  
  useEffect(() => {
    const symbols = ['SIG_INT', 'CYBER_DEF', 'NEURAL_SCAN', 'PQC_VERIFY', 'SAT_LINK'];
    const interval = setInterval(() => {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const newLog = `[${new Date().toLocaleTimeString('en-US', { hour12: false })}] ${symbol} >> ${Math.random().toString(36).slice(2, 7).toUpperCase()}_STABLE`;
      setLogs(prev => [...prev.slice(-5), newLog]);
      setBitrate(prev => +(prev + (Math.random() - 0.5) * 10).toFixed(1));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-10 right-6 z-40 font-mono text-[10px] text-cyan-400 bg-black/80 p-4 border border-white/10 backdrop-blur-xl hidden xl:block min-w-[300px]">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-cyan-500/20 text-cyan-400 font-bold">
        <div className="flex items-center gap-2">
          <Terminal className="w-3 h-3" />
          CMD_INTERFACE
        </div>
        <span className="text-[9px] bg-red-600 text-white px-1 tracking-widest font-black">EN_VIVO</span>
      </div>
      <div className="space-y-1 h-[100px] overflow-hidden">
        <AnimatePresence mode="popLayout">
          {logs.map((log, i) => (
            <motion.p 
              key={log}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="whitespace-nowrap border-l border-cyan-500/30 pl-2 py-0.5"
            >
              <span className="text-cyan-600 mr-2">$</span>{log}
            </motion.p>
          ))}
        </AnimatePresence>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4 pt-2 border-t border-cyan-500/10 text-[9px] uppercase">
        <div className="flex flex-col">
          <span className="text-white/20">Data_Thru</span>
          <span className="text-white font-bold">{bitrate} MB/SEC</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-white/20">Threat_Lvl</span>
          <span className="text-tactical-amber font-bold">INF_LOW</span>
        </div>
      </div>
    </div>
  );
};

const TacticalSection = ({ id, title, subtitle, specs, imagePlaceholder, icon: Icon, serial }: TacticalSectionProps) => (
  <motion.div 
    id={id}
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    className="min-h-screen flex flex-col justify-center px-6 md:px-12 py-32 border-b border-white/5 relative overflow-hidden bg-zinc-950/80 tactical-grid"
  >
    <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
      <div className="z-10 relative">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-tactical-cyan/10 border border-tactical-cyan/30 p-2 text-tactical-cyan">
             <Icon className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-[0.4em] mb-1">MÓDULO_{id.toUpperCase()}</span>
            <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-[0.2em]">{serial}</span>
          </div>
        </div>

        <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter text-white font-display uppercase italic leading-none">
          {title}
        </h2>
        
        <div className="bg-black border border-white/10 p-8 mb-12 shadow-[inset_0_0_40px_rgba(6,182,212,0.05)] relative group overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 rotate-12 group-hover:opacity-10 transition-opacity">
            <Icon className="w-24 h-24" />
          </div>
          <p className="text-xl text-zinc-400 font-mono italic leading-relaxed relative z-10">
            // {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {specs.map((spec, i) => (
            <div key={i} className="bg-white/5 border border-white/5 p-6 hover:bg-tactical-cyan/10 transition-all group">
              <span className="block text-[10px] text-white/30 uppercase mb-2 font-mono tracking-widest">{spec.label}</span>
              <span className="text-2xl font-bold text-white uppercase font-display group-hover:text-tactical-cyan transition-colors">{spec.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute -top-6 -left-6 w-24 h-24 border-t border-l border-white/20" />
        <div className="absolute -bottom-6 -right-6 w-24 h-24 border-b border-r border-white/20" />
        
        <div className="relative group overflow-hidden border border-white/10 p-1 bg-white/5 shadow-2xl">
           <div className="relative aspect-[4/3] bg-black overflow-hidden">
              <img 
                src={imagePlaceholder} 
                alt={title} 
                className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-90 transition-all duration-700"
              />
              {/* HUD Elements */}
              <div className="absolute inset-0 pointer-events-none p-6 font-mono">
                 <div className="flex justify-between items-start text-[10px]">
                    <div className="bg-black/60 px-2 py-1 border border-white/20 text-tactical-cyan">
                      COORD_REF: 4.7119° N, 74.0721° W
                    </div>
                    <Crosshair className="w-6 h-6 text-white/30 animate-pulse" />
                 </div>
                 
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/5 rounded-full" />
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/5 rounded-full opacity-50" />

                 <div className="absolute bottom-6 left-6 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                       <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />
                       <span className="text-[9px] text-red-500 font-bold uppercase">Target_Lock_Active</span>
                    </div>
                    <div className="bg-black/40 px-2 py-1 text-[8px] text-white/40">
                       V_FEED_V4.02.1 // STABLE
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function App() {
  return (
    <div className="bg-black text-zinc-100 min-h-screen font-sans relative">
      <div className="scanline pointer-events-none" />
      <TacticalHeader />

      {/* TOP NAV BAR */}
      <nav className="fixed top-14 left-0 w-full z-50 px-6 py-4 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-6 pointer-events-auto">
          <div className="w-12 h-12 bg-white flex items-center justify-center font-black text-black text-3xl skew-x-[-15deg] shadow-[6px_6px_0px_#06b6d4]">
            <span className="skew-x-[15deg]">A</span>
          </div>
          <div className="flex flex-col text-left leading-none uppercase">
            <span className="font-black text-2xl tracking-tighter font-display">Armada IA</span>
            <span className="text-tactical-cyan font-mono text-[9px] tracking-[0.3em]">C4ISR_DEFENSE_SAS</span>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-8 pointer-events-auto bg-black/60 backdrop-blur-xl border border-white/5 p-2 pr-6 shadow-2xl">
          <a href="#capacidad" className="font-mono text-[10px] text-white/40 hover:text-white transition-all pl-4 tracking-widest">01. CAPACIDAD</a>
          <a href="#blindaje" className="font-mono text-[10px] text-white/40 hover:text-white transition-all tracking-widest">02. BLINDAJE</a>
          <a href="#roi" className="font-mono text-[10px] text-white/40 hover:text-white transition-all tracking-widest">03. RESULTADOS</a>
          <button className="bg-tactical-amber text-black px-6 py-2 font-black text-[11px] tracking-widest uppercase skew-x-[-15deg] shadow-[4px_4px_0px_#7c2d12] hover:shadow-none transition-all">
            <span className="skew-x-[15deg] block">ACCESO_NIVEL_0</span>
          </button>
        </div>
      </nav>

      <TelemetryOverlay />

      {/* HERO SECTION */}
      <section className="h-screen flex items-center justify-center relative overflow-hidden bg-black text-white px-6">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-10" />
          <div className="w-full h-full bg-zinc-950 tactical-grid opacity-20" />
          {/* Animated radar center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-white/5 rounded-full" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border-l border-tactical-cyan/10 rounded-full"
          />
        </div>
        
        <div className="z-20 text-center max-w-7xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <span className="inline-block relative">
              <span className="absolute -inset-1 bg-red-600/20 blur-sm" />
              <span className="relative px-6 py-2 border border-red-600/40 text-red-500 font-mono text-[11px] font-black tracking-[0.5em] uppercase">
                ESTADO_CRÍTICO // SOBERANÍA_DE_DATOS
              </span>
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-[200px] font-black tracking-tighter leading-[0.75] mb-16 uppercase italic font-display mix-blend-overlay"
          >
            Digital <br /> 
            <span className="text-tactical-cyan">Warfare</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-xl md:text-2xl font-mono text-white/40 tracking-[0.4em] uppercase max-w-4xl mx-auto mb-20 leading-relaxed">
              Resiliencia Estratégica Digital para la <span className="text-white border-b-2 border-white/20">Fuerza Aeroespacial Colombiana</span>
            </p>
            
            <div className="flex flex-wrap justify-center gap-12">
               <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 border border-white/10 flex items-center justify-center bg-white/5 group-hover:border-tactical-cyan transition-colors">
                     <AlertTriangle className="w-5 h-5 text-tactical-amber" />
                  </div>
                  <div className="flex flex-col text-left">
                     <span className="text-[10px] text-white/30 uppercase font-mono">Prioridad</span>
                     <span className="text-sm font-black tracking-widest text-white uppercase">MÁXIMA</span>
                  </div>
               </div>
               <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 border border-white/10 flex items-center justify-center bg-white/5 group-hover:border-tactical-cyan transition-colors">
                     <Eye className="w-5 h-5 text-tactical-cyan" />
                  </div>
                  <div className="flex flex-col text-left">
                     <span className="text-[10px] text-white/30 uppercase font-mono">Visibilidad</span>
                     <span className="text-sm font-black tracking-widest text-white uppercase">VIGILANCIA_PERMANENTE</span>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator overlay */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-white to-transparent" />
          <span className="font-mono text-[9px] uppercase tracking-[0.5em]">AUTORIDAD_DE_SCROLL</span>
        </div>
      </section>

      {/* SECCIÓN 1: INTELIGENCIA AGÉNTICA */}
      <TacticalSection 
        id="capacidad"
        serial="SER_LOG: AD_C2_ALPHA_091"
        title="Agentes IA"
        subtitle="Inteligencia agéntica propietaria para el procesamiento masivo de pliegos, contratos y auditoría financiera legal de alta fidelidad."
        imagePlaceholder="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200"
        icon={Cpu}
        specs={[
          { label: "Modo_Operativo", value: "Autónomo_Soberano" },
          { label: "Criptoanálisis", value: "AES-512_SECURED" },
          { label: "Nodo_Base", value: "Air-Gapped_FAC" },
          { label: "Latencia_Ops", value: "< 0.04 MS" }
        ]}
      />

      {/* SECCIÓN 2: BLINDAJE CUÁNTICO */}
      <TacticalSection 
        id="blindaje"
        serial="SER_LOG: Q_SHLD_PROT_882"
        title="Blindaje PQC"
        subtitle="Infraestructura de tesorería descentralizada blindada frente a la amenaza cuántica de 2028. Independencia absoluta de SWIFT."
        imagePlaceholder="https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=1200"
        icon={ShieldCheck}
        specs={[
          { label: "Protocolo", value: "Post-Quantum Crypt" },
          { label: "Jurisdicción", value: "Marshall_Islands_DAO" },
          { label: "Integridad", value: "100.00% Verification" },
          { label: "Riesgo_Confisc.", value: "0.00% (Neutralizado)" }
        ]}
      />

      {/* SECCIÓN 3: ROI PARA EL GSED (LA GANANCIA) */}
      <section id="roi" className="min-h-screen bg-white text-black flex flex-col justify-center px-12 py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="flex items-center gap-6 mb-20">
            <div className="w-20 h-3 bg-black" />
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic font-display">Retorno Estratégico</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 opacity-90">
            <div className="bg-zinc-100 p-12 border-b-8 border-black hover:bg-zinc-200 transition-all group">
              <div className="text-8xl font-black leading-none tracking-tighter mb-8 italic group-hover:scale-105 transition-transform origin-left">90%</div>
              <p className="text-2xl font-black uppercase mb-4 leading-tight">Ahorro en Tiempos de Auditoría</p>
              <p className="font-mono text-sm text-zinc-500 uppercase tracking-widest">Optimización de procesos SECOP II mediante agentes entrenados en Derecho Operacional.</p>
            </div>
            
            <div className="bg-zinc-900 p-12 text-white border-b-8 border-tactical-cyan hover:bg-black transition-all group">
              <div className="text-8xl font-black leading-none tracking-tighter mb-8 italic group-hover:scale-105 transition-transform origin-left">100%</div>
              <p className="text-2xl font-black uppercase mb-4 leading-tight">Inmunidad de Activos Digitales</p>
              <p className="font-mono text-sm text-white/40 uppercase tracking-widest">Tesorería DAO LLC blindada. Cero riesgo de congelación o intervención por entidades externas.</p>
            </div>

            <div className="bg-zinc-100 p-12 border-b-8 border-black hover:bg-zinc-200 transition-all group">
              <div className="text-8xl font-black leading-none tracking-tighter mb-8 italic group-hover:scale-105 transition-transform origin-left">6.3T</div>
              <p className="text-2xl font-black uppercase mb-4 leading-tight">Protección de Valor Crítico</p>
              <p className="font-mono text-sm text-zinc-500 uppercase tracking-widest">Neutralización efectiva de amenazas de baja observabilidad (Drones FO) en infraestructuras vitales.</p>
            </div>
          </div>
          
          <div className="mt-32 flex flex-col md:flex-row items-center gap-12">
            <button className="bg-black text-white text-3xl font-black px-16 py-8 hover:bg-tactical-cyan hover:shadow-[15px_15px_0px_#164e63] transition-all uppercase tracking-widest italic flex items-center gap-8 group">
              <span>Descargar Dossier Táctico</span>
              <ArrowRight className="w-8 h-8 group-hover:translate-x-4 transition-transform" />
            </button>
            <div className="flex flex-col gap-2">
               <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-widest">Acceso Restringido</span>
               </div>
               <p className="text-[10px] font-mono text-zinc-400 max-w-sm uppercase">Recomendado para directores del GSED, MDN y altos mandos de la Fuerza Aeroespacial Colombiana.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-24 px-12 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none translate-x-1/2 -translate-y-1/2">
           <Skull className="w-full h-full text-white" />
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-12 relative z-10">
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-8 h-8 bg-zinc-800 flex items-center justify-center font-black text-white text-sm">A</div>
               <span className="font-mono text-xs tracking-[0.5em] text-white/40 uppercase">Secretaría de Transparencia Armada</span>
            </div>
            <div className="font-mono text-[9px] text-zinc-700 tracking-widest uppercase leading-loose">
              <p>© 2026 ARMADA IA SAS - REGISTRO DAO LLC ISLANDS MARSHALL</p>
              <p>OPERACIÓN BAJO DIRECTIVA DE SEGURIDAD NACIONAL_v2.0</p>
              <p>CONTENIDO ALTAMENTE SENSIBLE // NO REPRODUCIR SIN AUTORIZACIÓN</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-4">
             <div className="flex gap-1">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div key={i} className={`w-1 h-3 ${i % 3 === 0 ? 'bg-cyan-500' : 'bg-white/5'}`} />
                ))}
             </div>
             <p className="font-mono text-[9px] text-zinc-600 uppercase tracking-[0.3em]">FAC / MDN / GSED - TERMINAL_ID: {Math.random().toString(36).slice(2, 6).toUpperCase()}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
