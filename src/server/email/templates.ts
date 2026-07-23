import type {
  AckVars,
  ActivationVars,
  BaselineReadyVars,
  EmailLocale,
  RenderedEmail,
} from './types.js';

const TTL_DEFAULT = 20;

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return '***';
  const head = local.slice(0, 1);
  return `${head}****@${domain}`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wrapHtml(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"/><title>${escapeHtml(title)}</title></head>
<body style="font-family:Georgia,serif;line-height:1.5;color:#0f172a;max-width:560px;margin:0 auto;padding:24px;">
${bodyHtml}
<p style="margin-top:32px;font-size:12px;color:#64748b;">AGIGOV · Acceso institucional</p>
</body>
</html>`;
}

function resolveLocale(locale?: EmailLocale): EmailLocale {
  return locale === 'en' ? 'en' : 'es';
}

/** 1) ACK — registro recibido. */
export function renderAckEmail(vars: AckVars): RenderedEmail {
  const locale = resolveLocale(vars.locale);
  const masked = maskEmail(vars.email);
  const when = new Date().toISOString();

  if (locale === 'en') {
    const subject = `[AGIGOV] Request received · ref ${vars.ticketId}`;
    const text = `Dear ${vars.institutionName},

We received your request for access to the verifiable fiscal pilot (EGS).

Reference: ${vars.ticketId}
Registered email: ${masked}
Date: ${when}

Next step: we will send an activation link to this same address to verify the institutional mailbox.

If you did not request this access, ignore this message.

— AGIGOV · Institutional access
`;
    const html = wrapHtml(
      subject,
      `<p>Dear <strong>${escapeHtml(vars.institutionName)}</strong>,</p>
<p>We received your request for access to the verifiable fiscal pilot (EGS).</p>
<ul>
<li>Reference: <code>${escapeHtml(vars.ticketId)}</code></li>
<li>Registered email: ${escapeHtml(masked)}</li>
<li>Date: ${escapeHtml(when)}</li>
</ul>
<p>Next step: an activation link will be sent to this address to verify the institutional mailbox.</p>
<p>If you did not request this, ignore this message.</p>`,
    );
    return { kind: 'ack', locale, to: vars.email, subject, text, html, ticketId: vars.ticketId };
  }

  const subject = `[AGIGOV] Solicitud recibida · ref ${vars.ticketId}`;
  const text = `Estimada institución ${vars.institutionName},

Recibimos su solicitud de acceso al piloto fiscal verificable (EGS).

Referencia: ${vars.ticketId}
Correo registrado: ${masked}
Fecha: ${when}

Próximo paso: le enviaremos un enlace de activación a este mismo correo para verificar que el buzón es institucional.

Si usted no solicitó este acceso, ignore este mensaje.

— AGIGOV · Acceso institucional
`;
  const html = wrapHtml(
    subject,
    `<p>Estimada institución <strong>${escapeHtml(vars.institutionName)}</strong>,</p>
<p>Recibimos su solicitud de acceso al piloto fiscal verificable (EGS).</p>
<ul>
<li>Referencia: <code>${escapeHtml(vars.ticketId)}</code></li>
<li>Correo registrado: ${escapeHtml(masked)}</li>
<li>Fecha: ${escapeHtml(when)}</li>
</ul>
<p>Próximo paso: le enviaremos un enlace de activación a este mismo correo para verificar que el buzón es institucional.</p>
<p>Si usted no solicitó este acceso, ignore este mensaje.</p>`,
  );
  return { kind: 'ack', locale, to: vars.email, subject, text, html, ticketId: vars.ticketId };
}

/** 2) Activación — magic link. */
export function renderActivationEmail(vars: ActivationVars): RenderedEmail {
  const locale = resolveLocale(vars.locale);
  const ttl = vars.ttlMinutes > 0 ? vars.ttlMinutes : TTL_DEFAULT;

  if (locale === 'en') {
    const subject = `[AGIGOV] Activate your access · valid ${ttl} min · ref ${vars.ticketId}`;
    const text = `${vars.institutionName},

To continue, confirm your institutional email:

Activate access: ${vars.magicLinkUrl}
(single use · expires in ${ttl} minutes)

Reference: ${vars.ticketId}

After activation you can:
1. Sign in at /institucional/acceso
2. Continue the EGS pilot at /institucional/piloto

We never send passwords by email.
If you did not request this, ignore the message.

— AGIGOV · Institutional access
`;
    const html = wrapHtml(
      subject,
      `<p><strong>${escapeHtml(vars.institutionName)}</strong>,</p>
<p>To continue, confirm your institutional email:</p>
<p><a href="${escapeHtml(vars.magicLinkUrl)}" style="display:inline-block;padding:12px 20px;background:#0f172a;color:#fff;text-decoration:none;border-radius:6px;">Activate access</a></p>
<p style="font-size:13px;color:#64748b;">Single use · expires in ${ttl} minutes<br/>Reference: <code>${escapeHtml(vars.ticketId)}</code></p>
<p>If the button fails, copy this URL:<br/><code style="word-break:break-all;">${escapeHtml(vars.magicLinkUrl)}</code></p>
<p>We never send passwords by email.</p>`,
    );
    return {
      kind: 'activation',
      locale,
      to: vars.email,
      subject,
      text,
      html,
      ticketId: vars.ticketId,
    };
  }

  const subject = `[AGIGOV] Active su acceso · válido ${ttl} min · ref ${vars.ticketId}`;
  const text = `${vars.institutionName},

Para continuar, confirme su correo institucional:

Activar acceso: ${vars.magicLinkUrl}
(un solo uso · caduca en ${ttl} minutos)

Referencia: ${vars.ticketId}

Después de activar podrá:
1. Iniciar sesión en /institucional/acceso
2. Continuar el piloto EGS en /institucional/piloto

No compartimos contraseñas por correo.
Si no solicitó esto, ignore el mensaje.

— AGIGOV · Acceso institucional
`;
  const html = wrapHtml(
    subject,
    `<p><strong>${escapeHtml(vars.institutionName)}</strong>,</p>
<p>Para continuar, confirme su correo institucional:</p>
<p><a href="${escapeHtml(vars.magicLinkUrl)}" style="display:inline-block;padding:12px 20px;background:#0f172a;color:#fff;text-decoration:none;border-radius:6px;">Activar acceso</a></p>
<p style="font-size:13px;color:#64748b;">Un solo uso · caduca en ${ttl} minutos<br/>Referencia: <code>${escapeHtml(vars.ticketId)}</code></p>
<p>Si el botón no funciona, copie esta URL:<br/><code style="word-break:break-all;">${escapeHtml(vars.magicLinkUrl)}</code></p>
<p>No compartimos contraseñas por correo.</p>`,
  );
  return {
    kind: 'activation',
    locale,
    to: vars.email,
    subject,
    text,
    html,
    ticketId: vars.ticketId,
  };
}

/** 3) Baseline lista — ingest_ready (sin token en el mail). */
export function renderBaselineReadyEmail(vars: BaselineReadyVars): RenderedEmail {
  const locale = resolveLocale(vars.locale);
  const pilotUrl = `${appBaseUrl()}/institucional/piloto`;
  const consoleUrl = `${appBaseUrl()}/modelos/egs/consola`;

  if (locale === 'en') {
    const subject = `[AGIGOV] Baseline ratified · pilot ready · ref ${vars.ticketId}`;
    const text = `${vars.institutionName},

Your pilot baseline was ratified (multi-sig).
Status: ready for verified milestone ingest.

Reference: ${vars.ticketId}
Tenant: ${vars.slug}
Ministry / line: ${vars.ministryCode} · ${vars.budgetCode}

Next steps (inside the authenticated console):
1. Sign in at /institucional/acceso
2. Open /institucional/piloto → Ingest step
3. Upload milestones with evidence
4. The system will reconcile; if numbers do not match, FREEZE (no publish)

Ingest tokens and signer keys are only available after sign-in — never by email.

Open pilot: ${pilotUrl}
EGS console: ${consoleUrl}

— AGIGOV · Pilot operations
`;
    const html = wrapHtml(
      subject,
      `<p><strong>${escapeHtml(vars.institutionName)}</strong>,</p>
<p>Your pilot baseline was ratified (multi-sig). Status: <strong>ready for ingest</strong>.</p>
<ul>
<li>Reference: <code>${escapeHtml(vars.ticketId)}</code></li>
<li>Tenant: <code>${escapeHtml(vars.slug)}</code></li>
<li>Ministry / line: ${escapeHtml(vars.ministryCode)} · ${escapeHtml(vars.budgetCode)}</li>
</ul>
<p><a href="${escapeHtml(pilotUrl)}" style="display:inline-block;padding:12px 20px;background:#0f172a;color:#fff;text-decoration:none;border-radius:6px;">Open my pilot</a></p>
<p style="font-size:13px;"><a href="${escapeHtml(consoleUrl)}">EGS console</a></p>
<p>Ingest tokens and signer keys are only available after sign-in — never by email.</p>`,
    );
    return {
      kind: 'baseline_ready',
      locale,
      to: vars.email,
      subject,
      text,
      html,
      ticketId: vars.ticketId,
    };
  }

  const subject = `[AGIGOV] Baseline ratificada · piloto listo · ref ${vars.ticketId}`;
  const text = `${vars.institutionName},

La baseline de su piloto fue ratificada (multi-sig).
Estado: listo para ingest de hitos verificados.

Referencia: ${vars.ticketId}
Tenant: ${vars.slug}
Ministerio / rubro: ${vars.ministryCode} · ${vars.budgetCode}

Siguiente paso (dentro de la consola autenticada):
1. Entre a /institucional/acceso
2. Abra /institucional/piloto → paso Ingest
3. Cargue hitos con evidencia
4. El sistema reconciliará; si no cuadra, FREEZE (no publica)

El token de ingest y las claves de firmantes solo están disponibles tras iniciar sesión — no se envían por correo.

Abrir piloto: ${pilotUrl}
Consola EGS: ${consoleUrl}

— AGIGOV · Operaciones de piloto
`;
  const html = wrapHtml(
    subject,
    `<p><strong>${escapeHtml(vars.institutionName)}</strong>,</p>
<p>La baseline de su piloto fue ratificada (multi-sig). Estado: <strong>listo para ingest</strong>.</p>
<ul>
<li>Referencia: <code>${escapeHtml(vars.ticketId)}</code></li>
<li>Tenant: <code>${escapeHtml(vars.slug)}</code></li>
<li>Ministerio / rubro: ${escapeHtml(vars.ministryCode)} · ${escapeHtml(vars.budgetCode)}</li>
</ul>
<p><a href="${escapeHtml(pilotUrl)}" style="display:inline-block;padding:12px 20px;background:#0f172a;color:#fff;text-decoration:none;border-radius:6px;">Abrir mi piloto</a></p>
<p style="font-size:13px;"><a href="${escapeHtml(consoleUrl)}">Consola EGS</a></p>
<p>El token de ingest y las claves de firmantes solo están disponibles tras iniciar sesión — no se envían por correo.</p>`,
  );
  return {
    kind: 'baseline_ready',
    locale,
    to: vars.email,
    subject,
    text,
    html,
    ticketId: vars.ticketId,
  };
}

function appBaseUrl(): string {
  return (
    process.env.AGIGOV_APP_URL?.replace(/\/$/, '') ||
    process.env.APP_URL?.replace(/\/$/, '') ||
    'http://localhost:3000'
  );
}
