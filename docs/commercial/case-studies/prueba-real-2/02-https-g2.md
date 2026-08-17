# G2 HTTPS — evidencia do-prod-light

| Campo | Valor |
|-------|-------|
| UTC | 2026-08-16T23:16:58Z |
| Deploy | Actions run `31978651833` · commit `1957074` |
| HTTPS | https://photos-speaking-editing-dicke.trycloudflare.com/ |
| UI | HTTP 200 · CF-Ray presente |
| Health HTTPS | `ok:true` |
| HTTP IP | http://137.184.66.163/ sigue 200 |

## Limitaciones (honestas)

- URL `*.trycloudflare.com` **efímera** (cambia en redeploy)
- Dominio fijo / túnel named → **PENDING** (token Cloudflare)

## Veredicto gap G2

- HTTPS público verificable: **PASS** (quick tunnel)
- Dominio canónico estable: **PENDING**
