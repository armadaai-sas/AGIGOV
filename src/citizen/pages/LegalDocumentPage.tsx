import { Link } from 'react-router-dom';

import { PageShell } from '../components/PageShell.js';
import { useSovereignConfig } from '../context/PlatformContext.js';
import { TEAM_CONTACT_MAILTO } from '../platform/institutionalRoutes.js';

const PRIVACY_KEYS = [
  'legal.privacy.p1',
  'legal.privacy.p2',
  'legal.privacy.p3',
  'legal.privacy.p4',
] as const;

const PILOT_KEYS = [
  'legal.pilot.p1',
  'legal.pilot.p2',
  'legal.pilot.p3',
  'legal.pilot.p4',
  'legal.pilot.p5',
] as const;

type LegalDoc = 'privacy' | 'pilot';

type Props = {
  doc: LegalDoc;
};

export default function LegalDocumentPage({ doc }: Props) {
  const { t } = useSovereignConfig();
  const title = doc === 'privacy' ? t('legal.privacy.title') : t('legal.pilot.title');
  const keys = doc === 'privacy' ? PRIVACY_KEYS : PILOT_KEYS;

  return (
    <PageShell shell narrow>
      <article className="os-workspace">
        <header className="os-workspace-head os-workspace-head--stack">
          <div className="os-workspace-head-text">
            <h1 className="os-workspace-title">{title}</h1>
            <p className="os-workspace-sub">{t('legal.updated')}</p>
          </div>
        </header>

        <div className="space-y-4 text-[14px] leading-relaxed text-zinc-700">
          {keys.map((key) => (
            <p key={key}>{t(key)}</p>
          ))}
        </div>

        <p className="mt-8 text-[13px] text-zinc-600">
          {t('legal.contact')}{' '}
          <a href={TEAM_CONTACT_MAILTO} className="font-medium text-zinc-900 underline-offset-2 hover:underline">
            contacto@agigov.org
          </a>
          {' · '}
          <Link to="/institucional" className="font-medium text-zinc-900 underline-offset-2 hover:underline">
            {t('landing.footer.link.institutional')}
          </Link>
        </p>
      </article>
    </PageShell>
  );
}
