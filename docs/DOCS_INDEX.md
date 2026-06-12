# Индекс документации

> Курс Mercantec Deploy.

---

## Основные файлы

| Файл | Назначение |
|------|------------|
| [../SERVER_INFO.md](../SERVER_INFO.md) | Конфиг VM (private, `.gitignore`) |
| [../MY_NOTES.md](../MY_NOTES.md) | Мои объяснения (private, `.gitignore`) |
| [notes/day1-ssh.md](./notes/day1-ssh.md) | Day 1 — теория + команды |
| [notes/day2-dns-firewall.md](./notes/day2-dns-firewall.md) | Day 2 — DNS, Cloudflare, UFW + команды |
| [notes/day3-docker-database.md](./notes/day3-docker-database.md) | Day 3 — Docker, DB, tunnel + команды |
| [notes/day4-nginx-https.md](./notes/day4-nginx-https.md) | Day 4 — Nginx, HTTPS, Certbot + команды |
| [notes/day5-reverse-proxy-release.md](./notes/day5-reverse-proxy-release.md) | Day 5 — Reverse proxy, docs, рефлексия + команды |
| [notes/day6-docker-dockerfile.md](./notes/day6-docker-dockerfile.md) | Day 6 — Dockerfile, build, run + команды |
| [notes/day7-docker-compose.md](./notes/day7-docker-compose.md) | Day 7 — Compose, app+db, env + команды |
| [notes/day8-volumes-cicd-dokploy.md](./notes/day8-volumes-cicd-dokploy.md) | Day 8 — Volumes, persistence, CI/CD, Dokploy |
| [../README.md](../README.md) | Корневое описание проекта |
| [SESSION_HANDOFF.md](./SESSION_HANDOFF.md) | Resume / handoff между сессиями |
| [WORKFLOW.md](./WORKFLOW.md) | Правила: кто что делает · чеклист перед commit |
| [DEPLOY_RESULTS_LOG.md](./DEPLOY_RESULTS_LOG.md) | Короткий лог результатов по дням (без команд) |

---

## Статус курса

| День | Файл | Статус |
|------|------|--------|
| 1 | [notes/day1-ssh.md](./notes/day1-ssh.md) | ✅ complete |
| 2 | [notes/day2-dns-firewall.md](./notes/day2-dns-firewall.md) | UFW ✅ · tunnel DNS ✅ (teacher) |
| 3 | [notes/day3-docker-database.md](./notes/day3-docker-database.md) | ✅ complete |
| 4 | [notes/day4-nginx-https.md](./notes/day4-nginx-https.md) | ✅ nginx VM · Hello World · :8080 |
| 5 | [notes/day5-reverse-proxy-release.md](./notes/day5-reverse-proxy-release.md) | ✅ docs · `/api/` в nginx |
| 6 | [notes/day6-docker-dockerfile.md](./notes/day6-docker-dockerfile.md) | ✅ Dockerfile · `mercantec-api` на VM |
| 7 | [notes/day7-docker-compose.md](./notes/day7-docker-compose.md) | ✅ Compose app+db на VM |
| 8 | [notes/day8-volumes-cicd-dokploy.md](./notes/day8-volumes-cicd-dokploy.md) | ⬜ теория · volumes · CI/CD |
| 9–15 | `notes/dayN-....md` | по мере прохождения |

**Следующая практика:** Day 8 — volumes, backup, GitHub Actions / Dokploy — [notes/day8-volumes-cicd-dokploy.md](./notes/day8-volumes-cicd-dokploy.md)

---

## Конспекты (`docs/notes/`)

Лекционная теория, практика и команды курса.

### Именование файлов

- `day1-ssh.md`
- `day2-dns-firewall.md`
- `day3-docker-database.md`
- `day4-nginx-https.md`
- `day5-reverse-proxy-release.md`
- `day6-docker-dockerfile.md`
- `day7-docker-compose.md`
- `day8-volumes-cicd-dokploy.md`
- ...
- `day15-aflevering-fremlaeggelse.md`

Корень репо: `SERVER_INFO.md`, `MY_NOTES.md` — конфиг и личные заметки.

### Шаблон структуры дня

1. Заголовок дня (русский)
2. Дневные цели
3. Теория
4. Практика
5. Чеклист дня
6. **Команды (практика)** — терминал на **английском** + `#` комментарии на русском
7. Короткий текст для Teams

**Язык конспектов:** объяснения — **русский**; команды, Dockerfile, nginx, env — **английский**.

---

*Обновлено: 2026-06-10 · Day 7 ✅ · Day 8 конспект · следующая практика — backup + CI*
