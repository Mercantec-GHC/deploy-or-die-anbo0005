# Mercantec Deploy 2026

Курс **Deploy or Die** · VM `andrii-deploy` · домен [andrii.mercantec.tech](https://andrii.mercantec.tech)

**GitHub:** [Mercantec-GHC/deploy-or-die-anbo0005](https://github.com/Mercantec-GHC/deploy-or-die-anbo0005) (public)

## Статус

| День | Тема | Статус |
|------|------|--------|
| 1 | SSH, VM, hardening | ✅ |
| 2 | UFW, DNS, Cloudflare Tunnel | ✅ (NIS2/CRA устно ⬜) |
| 3 | Docker, PostgreSQL, tunnel | ✅ |
| 4 | Nginx на VM, static site | ✅ (Certbot на VM ⬜ — HTTPS от Cloudflare) |

## Документы

| Файл | Назначение |
|------|------------|
| [docs/SESSION_HANDOFF.md](docs/SESSION_HANDOFF.md) | Resume между сессиями |
| [docs/DOCS_INDEX.md](docs/DOCS_INDEX.md) | Индекс документации |
| [docs/DEPLOY_RESULTS_LOG.md](docs/DEPLOY_RESULTS_LOG.md) | Лог результатов по дням |
| [docs/notes/day1-ssh.md](docs/notes/day1-ssh.md) | Day 1 — теория + команды |
| [docs/notes/day2-dns-firewall.md](docs/notes/day2-dns-firewall.md) | Day 2 |
| [docs/notes/day3-docker-database.md](docs/notes/day3-docker-database.md) | Day 3 |
| [docs/notes/day4-nginx-https.md](docs/notes/day4-nginx-https.md) | Day 4 |

**Private (не в git):** `SERVER_INFO.md` · `MY_NOTES.md` — см. `.gitignore`

## Стек на VM

- **На сервере:** SSH, UFW, Docker Engine, Nginx (`:8080` → tunnel)
- **В Docker:** `postgres`, `cloudflared`
- **Доступ:** Cloudflare Tunnel (нет public IP)
