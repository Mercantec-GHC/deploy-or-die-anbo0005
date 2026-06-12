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
| 5 | Reverse proxy, docs, refleksion | ✅ |
| 6 | Dockerfile, app в container | ✅ |
| 7 | Docker Compose (app + db) | ✅ `docker compose` на VM |
| 8 | Volumes, persistence, CI/CD, Dokploy | ⬜ теория · backup · Actions |
| — | **ASP.NET Web API** (`app/MercantecApi/`) | ✅ Mac dev · Compose deploy |

## Структура репо

```text
docs/     — конспекты и handoff
app/MercantecApi/  — ASP.NET Web API + Dockerfile + docker-compose.yml
```

**Dev на Mac** → `git push` → **VM:** `git pull` + `docker compose up -d --build`

## Документы

| Файл | Назначение |
|------|------------|
| [docs/SESSION_HANDOFF.md](docs/SESSION_HANDOFF.md) | Resume между сессиями |
| [docs/WORKFLOW.md](docs/WORKFLOW.md) | Workflow · commit checklist |
| [docs/DOCS_INDEX.md](docs/DOCS_INDEX.md) | Индекс документации |
| [docs/DEPLOY_RESULTS_LOG.md](docs/DEPLOY_RESULTS_LOG.md) | Лог результатов по дням |
| [docs/notes/day1-ssh.md](docs/notes/day1-ssh.md) | Day 1 — теория + команды |
| [docs/notes/day2-dns-firewall.md](docs/notes/day2-dns-firewall.md) | Day 2 |
| [docs/notes/day3-docker-database.md](docs/notes/day3-docker-database.md) | Day 3 |
| [docs/notes/day4-nginx-https.md](docs/notes/day4-nginx-https.md) | Day 4 |
| [docs/notes/day5-reverse-proxy-release.md](docs/notes/day5-reverse-proxy-release.md) | Day 5 |
| [docs/notes/day6-docker-dockerfile.md](docs/notes/day6-docker-dockerfile.md) | Day 6 |
| [docs/notes/day7-docker-compose.md](docs/notes/day7-docker-compose.md) | Day 7 |
| [docs/notes/day8-volumes-cicd-dokploy.md](docs/notes/day8-volumes-cicd-dokploy.md) | Day 8 |

**Private (не в git):** `SERVER_INFO.md` · `MY_NOTES.md` — см. `.gitignore`

## Стек на VM

- **На сервере:** SSH, UFW, Docker Engine, Nginx (`:8080` → tunnel · `/api/` → `:5000`)
- **Compose:** `mercantecapi-app-1` + `mercantecapi-db-1` (`:5000` / `:5432`)
- **В Docker (вне compose):** `cloudflared`
- **App:** `app/MercantecApi/` — Web API · `/api/weatherforecast` через nginx
- **Доступ:** Cloudflare Tunnel (нет public IP)
