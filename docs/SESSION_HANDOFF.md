# Session handoff — Deploy

> Andrii Bondar · `anbo0005@edu.mercantec.dk` · **resume 2026-06-08**

## Статус курса

| День | Статус |
|------|--------|
| **Day 1** SSH, VM, hardening | ✅ |
| **Day 2** UFW + tunnel DNS | **UFW ✅** · домен ✅ · NIS2/CRA устно ⬜ |
| **Day 3** Docker + DB + tunnel | ✅ |
| **Day 4** Nginx + static site | ✅ · Certbot на VM ⬜ (tunnel → CF HTTPS) |

---

## VM

| | |
|---|---|
| SSH | `ssh mercantec-andrii` → `andrii@10.133.51.122` |
| Hostname | `andrii-deploy` · expire **2026-06-26** |
| UFW | active — 22, 80, 443 |
| Public IP | **нет** — только internal + Cloudflare Tunnel |
| Domain | `https://andrii.mercantec.tech` → **200** |
| Host key | только **MFyp** · P4Z → `ssh-keyscan` |

**Пароли / token / connection string:** `SERVER_INFO.md`

---

## Контейнеры (2026-06-08)

| Container | Image | Notes |
|-----------|-------|-------|
| `postgres` | `postgres:16-alpine` | user `andrii` · db `postgres` · vol `pgdata` · `127.0.0.1:5432` |
| `cloudflared` | `cloudflare/cloudflared:latest` | `--network host` · `--protocol http2` · `unless-stopped` |

**Nginx на VM** (не Docker): `/etc/nginx/sites-available/andrii.mercantec.tech` · `127.0.0.1:8080` · `/var/www/andrii/`

**Первое в новой сессии:** `docker ps` · `systemctl status nginx` · `curl -I http://127.0.0.1:8080/`

---

## Следующий шаг (Day 5+)

1. .NET app + reverse proxy (nginx → app)
2. Docker network для app в контейнере (Day 7)
3. NIS2/CRA — устно ⬜

**Не открывать в UFW:** 5432, 8080.

---

## Ключевые факты (для агента)

- **Tunnel:** CF → cloudflared → `localhost:8080` (не public IP)
- **502** = tunnel OK, но origin недоступен (пустой 8080 · cloudflared в bridge · нет IPv6 на 8080) · **1003** = прямой IP CF в браузере
- **dig** → Cloudflare IP — нормально
- **БД:** `docker exec ... psql` · с Mac: `ssh -L 5433:127.0.0.1:5432 mercantec-andrii`
- **Команды:** `docs/notes/dayN-*.md` § Команды (`COMMANDS.md` удалён)
- **Лог:** `docs/DEPLOY_RESULTS_LOG.md` · **теория:** `MY_NOTES.md`

---

## Пользователь

- Язык: **русский**
- Спросить перед изменением файлов
- `MY_NOTES.md` — только важные концепции, не error logs

---

## Блокеры

- SSH host key MFyp ↔ P4Z (нестабильно)
- После reboot: `docker start postgres` (если не Up) · `nginx` поднимается сам (`systemctl enable`)
