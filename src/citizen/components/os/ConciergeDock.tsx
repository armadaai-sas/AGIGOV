import { MessageCircle, Send, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { INSTITUTION_ROUTES, TEAM_CONTACT_MAILTO } from '../../platform/institutionalRoutes.js';
import { EGS_MODEL_PATH } from '../../platform/agigovModels.js';

const FAQ = [
  {
    q: '¿Qué es AGIGOV?',
    a: 'Somos AGIGOV — multi-agente de modelos verificables para el Estado y la ciudadanía.',
  },
  {
    q: '¿Cómo empiezo?',
    a: 'Abre el entorno de prueba (registro gratis) o explora modelos sin registrarte.',
    to: INSTITUTION_ROUTES.register,
    cta: 'Abrir entorno de prueba',
  },
  {
    q: '¿Qué es EGS?',
    a: 'Reparto del ahorro por eficiencia: comisión solo sobre ahorro verificado.',
    to: EGS_MODEL_PATH,
    cta: 'Ver modelo EGS',
  },
  {
    q: '¿Necesito hablar con alguien?',
    a: 'Para piloto guiado o enterprise, escríbenos — correo humano real.',
    href: TEAM_CONTACT_MAILTO,
    cta: 'Contacto',
  },
] as const;

function matchFaq(input: string) {
  const q = input.toLowerCase();
  if (q.includes('precio') || q.includes('costo') || q.includes('comisión')) {
    return 'Comisión solo sobre ahorro certificado (EGS). Piloto institucional: contacto humano para cotización.';
  }
  if (q.includes('registr') || q.includes('empez') || q.includes('sandbox')) {
    return 'Registro en /institucional/registro — cuenta gratis para probar la plataforma.';
  }
  if (q.includes('api') || q.includes('desarroll')) {
    return 'Documentación en /desarrolladores. Verifica health en vivo antes de integrar.';
  }
  if (q.includes('congel') || q.includes('centinela') || q.includes('freeze')) {
    return 'Centinela pausa mutaciones si la evidencia no cuadra. Un humano decide antes de publicar.';
  }
  return null;
}

/** Concierge FAQ-first — ventas, onboarding y ayuda (Grok en ola posterior). */
export function ConciergeDock() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [reply, setReply] = useState<string | null>(null);

  const suggestions = useMemo(() => FAQ.slice(0, 3), []);

  function ask(text: string) {
    setInput(text);
    const ans = matchFaq(text);
    setReply(ans ?? 'Puedo orientarte con registro, modelos, API o contacto humano. Prueba una pregunta concreta o elige abajo.');
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    ask(input.trim());
  }

  return (
    <div className={`os-concierge ${open ? 'os-concierge--open' : ''}`}>
      {open ? (
        <div className="os-concierge-panel" role="dialog" aria-label="Concierge AGIGOV">
          <header className="os-concierge-head">
            <span className="os-concierge-title">Concierge</span>
            <button type="button" className="os-modal-close" onClick={() => setOpen(false)} aria-label="Minimizar">
              <X className="h-4 w-4" />
            </button>
          </header>
          <p className="os-concierge-lead">Ventas · onboarding · ayuda — respuestas honestas, sin inventar producción.</p>

          {reply ? <p className="os-concierge-reply">{reply}</p> : null}

          <ul className="os-concierge-faq">
            {FAQ.map((item) => (
              <li key={item.q}>
                <button type="button" className="os-concierge-faq-q" onClick={() => ask(item.q)}>
                  {item.q}
                </button>
                {'to' in item && item.to ? (
                  <Link to={item.to} className="os-btn-text os-concierge-link" onClick={() => setOpen(false)}>
                    {item.cta}
                  </Link>
                ) : 'href' in item && item.href ? (
                  <a href={item.href} className="os-btn-text os-concierge-link">
                    {item.cta}
                  </a>
                ) : null}
              </li>
            ))}
          </ul>

          {!reply ? (
            <div className="os-concierge-chips">
              {suggestions.map((s) => (
                <button key={s.q} type="button" className="os-concierge-chip" onClick={() => ask(s.q)}>
                  {s.q}
                </button>
              ))}
            </div>
          ) : null}

          <form className="os-concierge-form" onSubmit={submit}>
            <input
              type="text"
              className="os-concierge-input"
              placeholder="Pregunta sobre modelos, piloto o API…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="os-btn-primary os-btn-icon" aria-label="Enviar">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        className="os-concierge-fab"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Minimizar concierge' : 'Abrir concierge'}
      >
        <MessageCircle className="h-5 w-5" />
        {!open ? <span className="os-concierge-fab-label">Ayuda</span> : null}
      </button>
    </div>
  );
}
