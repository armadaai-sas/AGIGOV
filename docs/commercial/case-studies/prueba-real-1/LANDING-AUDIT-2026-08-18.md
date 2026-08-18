# Landing layout audit — 2026-08-18 (overnight)

Live: `http://137.184.66.163/` · HEAD at analysis: `6f3cde2` (+ follow-up patch same night)  
Health: `ok:true` · `panicMode:false` · postgres true (curl UTC ~09:23)

## What was actually wrong (root causes)

1. **Forced viewport slides** — every `.landing-section--slide` used `md:min-h-[100svh]` + vertical centering → tiny content islands in huge black voids (FireShot “desastre”).
2. **CSS dual `.landing-section`** — two definitions in `landing-below.css` (`max-w-[1200px]` then `items-center`) made section backgrounds band and children shrink.
3. **Footer CSS missing on `/`** — `app.css` only loads off-home; footer looked like a raw left stack until scoped rules were restored under `.landing-manifest`.
4. **Onboarding modal on home** — `OnboardingModal` (“Bienvenido a AGIGOV”) opened over `/` for first visits and made the product look broken (confirmed in headless audit screenshot).
5. **Page-transition `transform`** — earlier fixed (opacity-only) so fixed nav/rail stop detaching from the viewport.

## Already shipped same night

| Commit | Fix |
|--------|-----|
| `1767744` | OS diagram / flows / Sandbox / boot |
| `97a3b29` | Hero CTAs moved to Sandbox; responsive tighten |
| `3008960` | Rail icons + glass ghost buttons |
| `6f3cde2` | Kill 100vh voids; footer styles on landing |

## Overnight follow-up (this pass)

- Hide onboarding modal on `/`
- Full-bleed slides (`max-w-none`, `items-stretch`)
- Drop sticky security copy under fixed nav

## Gap Board (morning)

| Sev | Item | Status |
|-----|------|--------|
| P0 | Black voids from 100svh | Fixed `6f3cde2` |
| P0 | Onboarding covering product | Fixed overnight (deploy) |
| P0 | Section max-width banding | Fixed overnight |
| P1 | Verify live after hard refresh (SW) | Needs human eyeball |
| P1 | Lighthouse / Slow 4G on landing | PENDING |
| P2 | Soft hero min-height on tall monitors | Optional |
| P2 | Dead `100svh` rules in unused hero stages | Latent cleanup |
| P2 | Rail only from `xl` — OK for tablets | By design |

## Evidence

- Health JSON: live curl OK
- Bundle: `/assets/index-uoCdzsCL.js` (pre-overnight patch); new deploy will rotate hash
- Screenshot: `docs/commercial/case-studies/prueba-real-1/lighthouse/landing-audit-2026-08-18.png` (shows modal problem)

## First thing tomorrow

1. Hard refresh `http://137.184.66.163/?v=NOW`
2. Confirm: no welcome modal on `/`, tight sections, 3-col footer, rail icons on XL
3. If still “descuadrado”, send one fresh FireShot of **full page** after hard refresh
