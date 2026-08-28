import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Landmark, Users } from 'lucide-react';

import { useSovereignConfig } from '../../context/PlatformContext.js';
import { OutcomeScreen } from '../landing/LandingOutcomesSection.js';
import type { HeroAudience } from './HomeHeroTitleRotator.js';

type CapCardProps = {
  id: HeroAudience;
  tone: 'chat' | 'build' | 'bot';
  icon: ReactNode;
  title: string;
  what: string;
  does: string;
  href: string;
  cta: string;
  spotlight: boolean;
  onFocusAudience: () => void;
  children: ReactNode;
};

function CapCard({
  id,
  tone,
  icon,
  title,
  what,
  does,
  href,
  cta,
  spotlight,
  onFocusAudience,
  children,
}: CapCardProps) {
  return (
    <article
      className={`ls-cap-card ls-cap-card--${tone}${spotlight ? ' is-spotlight' : ''}`}
      data-audience={id}
      onMouseEnter={onFocusAudience}
      onFocus={onFocusAudience}
    >
      <div className="ls-cap-body">{children}</div>
      <div className="ls-cap-explain">
        <div className="ls-cap-explain-head">
          <span className="ls-cap-explain-icon" aria-hidden>
            {icon}
          </span>
          <h3 className="ls-cap-explain-title">{title}</h3>
        </div>
        <p className="ls-cap-explain-row">
          <span className="ls-cap-explain-k">{tLabel(what)}</span> {tBody(what)}
        </p>
        <p className="ls-cap-explain-row">
          <span className="ls-cap-explain-k">{tLabel(does)}</span> {tBody(does)}
        </p>
      </div>
      <footer className="ls-cap-foot">
        <span className="ls-cap-foot-label">{title}</span>
        <Link to={href} className="ls-cap-foot-link">
          {cta}
          <span aria-hidden> →</span>
        </Link>
      </footer>
    </article>
  );
}

function tLabel(line: string) {
  const i = line.indexOf('·');
  return i === -1 ? '' : `${line.slice(0, i).trim()} ·`;
}

function tBody(line: string) {
  const i = line.indexOf('·');
  return i === -1 ? line : line.slice(i + 1).trim();
}

type Props = {
  audience: HeroAudience;
  onAudienceChange: (audience: HeroAudience) => void;
};

/** Tres tarjetas sincronizadas con el rotor del título. */
export function HomeHeroInteractiveStage({ audience, onAudienceChange }: Props) {
  const { t } = useSovereignConfig();

  return (
    <div className="ls-cap-grid" role="list" aria-label={t('hero.cards.aria')}>
      <CapCard
        id="government"
        tone="chat"
        icon={<Landmark className="h-4 w-4" />}
        title={t('hero.card.gov.title')}
        what={t('hero.card.gov.what')}
        does={t('hero.card.gov.does')}
        href="/?resultado=gubernamental#utilidad"
        cta={t('hero.card.learnMore')}
        spotlight={audience === 'government'}
        onFocusAudience={() => onAudienceChange('government')}
      >
        <div className="ls-cap-preview ls-cap-preview--outcome">
          <OutcomeScreen audience="government" compact />
        </div>
      </CapCard>

      <CapCard
        id="business"
        tone="chat"
        icon={<Building2 className="h-4 w-4" />}
        title={t('hero.card.biz.title')}
        what={t('hero.card.biz.what')}
        does={t('hero.card.biz.does')}
        href="/?resultado=empresarial#utilidad"
        cta={t('hero.card.learnMore')}
        spotlight={audience === 'business'}
        onFocusAudience={() => onAudienceChange('business')}
      >
        <div className="ls-cap-preview ls-cap-preview--outcome">
          <OutcomeScreen audience="business" compact />
        </div>
      </CapCard>

      <CapCard
        id="citizen"
        tone="bot"
        icon={<Users className="h-4 w-4" />}
        title={t('hero.card.citizen.title')}
        what={t('hero.card.citizen.what')}
        does={t('hero.card.citizen.does')}
        href="/?resultado=ciudadano#utilidad"
        cta={t('hero.card.learnMore')}
        spotlight={audience === 'citizen'}
        onFocusAudience={() => onAudienceChange('citizen')}
      >
        <div className="ls-cap-preview ls-cap-preview--outcome">
          <OutcomeScreen audience="citizen" compact />
        </div>
      </CapCard>
    </div>
  );
}
