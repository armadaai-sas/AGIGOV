/** Institutional transactional email — types. */

export type EmailLocale = 'es' | 'en';

export type InstitutionalEmailKind = 'ack' | 'activation' | 'baseline_ready';

export type RenderedEmail = {
  kind: InstitutionalEmailKind;
  locale: EmailLocale;
  to: string;
  subject: string;
  text: string;
  html: string;
  ticketId: string;
};

export type AckVars = {
  institutionName: string;
  email: string;
  ticketId: string;
  locale?: EmailLocale;
};

export type ActivationVars = {
  institutionName: string;
  email: string;
  ticketId: string;
  magicLinkUrl: string;
  ttlMinutes: number;
  locale?: EmailLocale;
};

export type BaselineReadyVars = {
  institutionName: string;
  email: string;
  ticketId: string;
  slug: string;
  ministryCode: string;
  budgetCode: string;
  locale?: EmailLocale;
};
