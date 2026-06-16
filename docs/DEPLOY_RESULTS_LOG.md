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
- **Известная проблема:** иногда тот же IP отвечает чужой ключ — `SHA256:P4Z...` или `SHA256:UjhJSXHEy...` (2026-06-10) — **keyscan перед входом**, не `yes` на не-MFyp
- **IP VM:** выдавался `.122` · после reboot 2026-06-11 → **`.121`** (`~/.ssh/config` HostName)

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

### Следующее ✅ (Day 7)

- Docker Compose — см. Day 7

---

## Day 7 — Docker Compose (app + db) ✅

### Repo + VM setup ✅

- `docker-compose.yml` + `.env.example` + `.gitignore` (`app/**/.env`)
- Commit `ecaad70` — Compose setup
- VM: `apt install docker-compose-v2` (плагин `docker compose`)
- `.env` на VM вручную (не в git)

### Миграция с отдельных containers ✅

- `docker stop/rm mercantec-api postgres` (volume `pgdata` сохранён)
- `docker compose up -d --build` в `app/MercantecApi/`
- Network: `mercantecapi_default`
- Containers: **`mercantecapi-db-1`** (healthy) · **`mercantecapi-app-1`**
- `cloudflared` — **не трогали** · Up

### Проверка ✅

- `docker compose ps` — db **healthy**, app **Up**
- `docker compose exec db psql ... SELECT 1` → **OK**
- `curl :5000/weatherforecast` → **200**
- `curl :8080/api/weatherforecast` → **200**
- `https://andrii.mercantec.tech/api/weatherforecast` → **200**

### Env / сеть

- `ConnectionStrings__Postgres` в env app: `Host=db` (Compose DNS)
- App **пока не читает** строку в коде — endpoint `/Health/db` ⬜ (опционально)

### Следующее ⬜

- `/Health/db` в коде — опционально

---

## Day 8 — Volumes, CI/CD, Dokploy ✅

### GitHub Actions (CI) ✅

- `.github/workflows/ci.yml` — `docker build` на push/PR `main`
- Первый push workflow: scope `workflow` (`gh auth refresh -s workflow`)
- Проверка: GitHub → Actions → **CI** green (~30s)

### Dokploy (CD) ✅

- Install на VM · Swarm · UI `andriidokploy.mercantec.tech` :3000
- Project **MercantecApi** · Git tab + PAT · `main` · `app/MercantecApi/docker-compose.yml`
- Env `DB_*` · volume **`pgdata`** external
- Autodeploy **ON**
- Webhook: Content-Type **`application/json`** (не `form` → 301 Branch Not Match)
- Push → webhook **200** → redeploy ~1 min

### Проверка ✅

- `curl :5000/weatherforecast` · `:8080/api/` · домен **200**
- CI + CD full flow tested (2026-06-12)

### Tunnel ⚠️

- Иногда webhook **530** при живом `cloudflared` → `docker restart cloudflared`

---

## Day 9 — Volumes, K8s теория, backup ✅

### Volumes & persistence ✅

- `pgdata` named volume · path `/var/lib/docker/volumes/pgdata/_data`
- `docker restart mercantecapi-sdn21v-db-1` → `SELECT 1` OK (2026-06-15)

### Backup ✅

- `pg_dump` → `/home/andrii/backup_20260615.sql`

### Kubernetes / K3s ⬜ (теория)

- Pod, Deployment, Service, Ingress, PVC — конспект `day9-kubernetes-dokploy.md`
- Proxi demo — не на своей VM
- Свой stack: Compose + Dokploy (не K3s)

### Dokploy + GitHub

- Уже закрыто на Day 8 ✅

### Следующее ⬜

- Revoke/rotate GitHub PAT (был на скринах)
- NIS2/CRA устно (Day 2)

---

## Day 10 — Monitoring, logging, Uptime Kuma ✅

### Dokploy monitoring & logs ✅

- Открыты **Logs** app container `mercantecapi-sdn21v-app-1` — ASP.NET startup OK
- Предупреждение HTTPS redirect за reverse proxy — нормально (tunnel + nginx)

### Uptime Kuma ✅

- Отдельный container на VM · **не** в app compose (как `cloudflared`)
- Image `louislam/uptime-kuma` · port `127.0.0.1:3001` · volume `uptime-kuma-data`
- UI: SSH `-L 3001:127.0.0.1:3001` → `http://localhost:3001`
- Admin создан · monitor **Mercantec API**

### Monitor ✅

- URL: `https://andrii.mercantec.tech/api/health` (ранее `/api/weatherforecast`, заменён на health endpoint)
- Type HTTP(s) · GET · interval 60s · retries 1 · auth None
- Статус: **Up** · **200 OK** · ~164 ms (2026-06-15)

### Идея Day 10

- **Dokploy** = внутри VM (status, logs container)
- **Uptime Kuma** = снаружи (ping публичного URL, весь путь tunnel → nginx → app)

### Следующее ⬜

- (Опционально) тест Down: `docker stop` app → Kuma red → `docker start`
- Prometheus/Grafana — теория в конспекте, на VM не ставили

---

## Day 11 — OWASP Top 10, security headers ✅ (частично)

### Теория ✅

- Конспект `day11-owasp-security-headers.md` — OWASP A01–A10, headers, input validation, security review

### Security headers в nginx ✅

- Backup → `/etc/nginx/sites-available/andrii.mercantec.tech.bak.20260615`
- Добавлены: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- `nginx -t` + reload OK
- `curl -I https://andrii.mercantec.tech/` — все 5 headers видны (2026-06-15)

### Следующее ⬜

- Security review (3 риска + mitigations) — aflevering
- (Опционально) `dotnet list package --vulnerable`

---

*Обновлено: 2026-06-15 · Day 8–11 · nginx security headers · Kuma · Dokploy CD*
