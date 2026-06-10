# Deploy — results log

> Andrii Bondar · только **результаты**, без команд.  
> Конфиг: `SERVER_INFO.md` · команды: `docs/notes/dayN-*.md` (§ Команды)

---

## Day 1 — SSH, VM, hardening ✅

- Получена VM Ubuntu 24.04 (`10.133.51.122`, UUID `96032--191--ubuntu-2404-server`)
- Hostname: `andrii-deploy`
- Создан пользователь `andrii` с `sudo`
- SSH-ключ с Mac (`mercantec-andrii` в `~/.ssh/config`)
- Вход по ключу для `andrii` — работает (`Accepted publickey` в логах sshd)
- `root` по SSH — **закрыт** (`PermitRootLogin no`)
- Вход по паролю по SSH — **выключен** (`PasswordAuthentication no`)
- `sshd` — **active (running)** (был в образе Ubuntu, мы настроили)
- **Host key VM (OK):** `SHA256:MFyp...` — только его принимать
- **Известная проблема:** иногда тот же IP отвечает `SHA256:P4Z...` — keyscan перед входом

---

## Day 2 — UFW, DNS / Cloudflare ✅ (частично)

### UFW ✅

- Firewall **включён** (2026-06-03)
- Политика: deny incoming · allow outgoing
- Открыты порты: **22, 80, 443**

### DNS / домен ✅ (teacher)

- Subdomain: `andrii.mercantec.tech`
- **Cloudflare Tunnel** (DNS у teacher, не Simply/свой CF account)
- Снаружи: только **HTTPS**
- Маршрут: tunnel → `http://localhost:8080` на VM
- Tunnel token от teacher (в `SERVER_INFO.md`)
- **DNS проверен** (`dig` на VM): `104.21.23.58`, `172.67.209.112` — IP **Cloudflare**, не `10.133.51.122`; для tunnel **нормально**

### Теория ⬜

- NIS2 / CRA — устно, не отмечено

---

## Day 3 — Docker, DB, tunnel ✅

### Docker ✅

- `docker.io` установлен (`apt`, не snap)
- `hello-world` — OK (`Hello from Docker!`)
- Пользователь `andrii` в группе **docker** (после re-login — без `sudo`)
- `sudo` без пароля: `/etc/sudoers.d/andrii-nopasswd`

### PostgreSQL ✅

- Контейнер **`postgres`** — **Up** (image `postgres:16-alpine`)
- User / DB: `andrii` / `postgres` (пароль в `SERVER_INFO.md`)
- Volume **`pgdata`** · порт `127.0.0.1:5432` (не в UFW)
- Image скачан, `docker run` — OK
- Логи: `database system is ready to accept connections`
- Подключение проверено: `docker exec ... psql` → `\conninfo` OK
- Volume на диске: `/var/lib/docker/volumes/pgdata/_data` (sudo)

### Cloudflare tunnel ✅

- Контейнер **`cloudflared`** (image `cloudflare/cloudflared:latest`)
- **`--network host`** — иначе `localhost:8080` внутри bridge ≠ хост (502)
- **`--protocol http2`** — QUIC резался в сети Mercantec
- **`--restart unless-stopped`**
- Логи: **Registered tunnel connection** · `protocol=http2`
- Ingress: `andrii.mercantec.tech` → `http://localhost:8080`

### web-test (временный nginx в Docker) ✅ → заменён Day 4

- Контейнер **`web-test`** (image `nginx:alpine`) — Day 3 тест tunnel
- **Удалён** на Day 4 · origin = nginx на VM :8080

### Домен ✅

- `https://andrii.mercantec.tech` → **200** (2026-06-08, было 502)

---

## Day 4 — Nginx на VM, static site ✅

### Nginx (на хосте, не Docker) ✅

- `apt install nginx` · **nginx/1.24.0 (Ubuntu)**
- `systemctl enable nginx` · **active (running)**
- Default site на порту **80** (Welcome to nginx)
- **`web-test` удалён** — origin теперь nginx на VM

### Static site + virtual host ✅

- Статика: `/var/www/andrii/index.html` — Hello World
- Конфиг: `/etc/nginx/sites-available/andrii.mercantec.tech`
- Symlink: `sites-enabled/andrii.mercantec.tech`
- Слушает **`127.0.0.1:8080`** + **`[::1]:8080`** (tunnel origin)
- `sudo nginx -t` → **successful** · `systemctl reload nginx`

### Проверка ✅

- `curl -I http://127.0.0.1:8080/` → **200**
- `https://andrii.mercantec.tech` → **HTTP/2 200** (2026-06-08)

### Certbot ⬜ (теория; с tunnel не на VM)

- HTTPS снаружи — **Cloudflare** (tunnel)
- `certbot --nginx` — для сценария A-record → IP сервера; у нас не делали
- Теория: HTTP→HTTPS redirect, auto-renewal — для устного

---

## Day 5 — Reverse proxy, dokumentation ✅

### nginx `/api/` ✅

- В `/etc/nginx/sites-available/andrii.mercantec.tech` добавлен `location /api/` → `proxy_pass http://127.0.0.1:5000/`
- Proxy headers: `Host`, `X-Real-IP`, `X-Forwarded-For`, `X-Forwarded-Proto`
- Backup конфига: `andrii.mercantec.tech.bak.20260609`
- `nginx -t` + reload — OK

### Проверка ✅ / ожидаемо ⬜

- `curl http://127.0.0.1:8080/` → **200** (static)
- `curl http://127.0.0.1:8080/api/` → **502** (до Day 6) · после container → **200** `/api/weatherforecast`
- `https://andrii.mercantec.tech` → **200** (иногда **530** — tunnel reconnect)

### Dokumentation + refleksion ✅

- Компоненты и request flow — в `docs/notes/day5-reverse-proxy-release.md`
- Чеклист дня отмечен

### Следующее ✅ (Day 6)

- ASP.NET Core Web API · Docker container на `:5000` — см. Day 6

---

## Day 6 — Dockerfile, app container ✅

### MercantecApi (Mac + repo) ✅

- Web API в `app/MercantecApi/` · .NET 8 · локально на Mac `:5000`
- `Dockerfile` multi-stage (sdk → aspnet) · `.dockerignore`
- Commit `f1a7aac` — Dockerfile + docs

### Docker build + run на VM ✅

- Repo на VM: `~/GitHub/deploy-or-die-anbo0005` · `git pull`
- `docker build -t mercantec-api .` — OK
- Images: `mcr.microsoft.com/dotnet/sdk:8.0`, `aspnet:8.0`, `mercantec-api:latest`
- Container **`mercantec-api`** — **Up** · `-p 127.0.0.1:5000:3000` · `--restart unless-stopped`
- Kestrel в container **:3000** (не 8080 — чтобы не путать с nginx :8080 на VM)
- **.NET SDK на хосте VM** — нет (только внутри Docker build/runtime)

### Проверка ✅

- `curl http://127.0.0.1:5000/weatherforecast` → **200** JSON (Docker :5000 → container :3000)
- `curl http://127.0.0.1:8080/api/weatherforecast` → **200** JSON (nginx `/api/`)
- `https://andrii.mercantec.tech/api/weatherforecast` → **200** JSON (через CF + tunnel)

### Порты (итог Day 6)

| Порт | Где | Роль |
|------|-----|------|
| 8080 | nginx на VM | tunnel origin · static + `/api/` |
| 5000 | Docker на VM | nginx → mercantec-api |
| 3000 | внутри mercantec-api | Kestrel |
| 5432 | Docker → postgres | БД · app **не** подключена |

### Следующее ⬜

- Day 7+ по программе курса
- App ↔ postgres — отложено

---

*Обновлено: 2026-06-10 · Day 6 ✅ · порты 8080/5000/3000*
