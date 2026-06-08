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
| [../README.md](../README.md) | Корневое описание проекта |
| [SESSION_HANDOFF.md](./SESSION_HANDOFF.md) | Resume / handoff между сессиями |
| [DEPLOY_RESULTS_LOG.md](./DEPLOY_RESULTS_LOG.md) | Короткий лог результатов по дням (без команд) |

---

## Статус курса

| День | Файл | Статус |
|------|------|--------|
| 1 | [notes/day1-ssh.md](./notes/day1-ssh.md) | ✅ complete |
| 2 | [notes/day2-dns-firewall.md](./notes/day2-dns-firewall.md) | UFW ✅ · tunnel DNS ✅ (teacher) |
| 3 | [notes/day3-docker-database.md](./notes/day3-docker-database.md) | ✅ complete |
| 4 | [notes/day4-nginx-https.md](./notes/day4-nginx-https.md) | ✅ nginx VM · Hello World · :8080 |
| 5–15 | `notes/dayN-....md` | по мере прохождения |

---

## Конспекты (`docs/notes/`)

Лекционная теория, практика и команды курса.

### Именование файлов

- `day1-ssh.md`
- `day2-dns-firewall.md`
- `day3-docker-database.md`
- `day4-nginx-https.md`
- ...
- `day15-aflevering-fremlaeggelse.md`

Корень репо: `SERVER_INFO.md`, `MY_NOTES.md` — конфиг и личные заметки.

### Шаблон структуры дня

1. Заголовок дня (датский + русский)
2. Дневные цели
3. Теория
4. Практика
5. Чеклист дня
6. **Команды (практика)** — терминал + `#` комментарии
7. Короткий текст для Teams

---

*Обновлено: 2026-06-08 (Day 4 ✅ · GitHub pushed)*
