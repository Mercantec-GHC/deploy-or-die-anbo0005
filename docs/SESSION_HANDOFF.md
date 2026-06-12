# Session handoff — Deploy

> Andrii Bondar · `anbo0005@edu.mercantec.dk` · **resume 2026-06-10** · Day 8 · [GitHub](https://github.com/Mercantec-GHC/deploy-or-die-anbo0005)

**Workflow:** [WORKFLOW.md](./WORKFLOW.md) · **App:** `app/MercantecApi/` в этом же репо

---

## Статус курса

| День | Статус |
|------|--------|
| **Day 1** SSH, VM, hardening | ✅ |
| **Day 2** UFW + tunnel DNS | **UFW ✅** · домен ✅ · NIS2/CRA устно ⬜ |
| **Day 3** Docker + DB + tunnel | ✅ |
| **Day 4** Nginx + static site | ✅ · Certbot на VM ⬜ (tunnel → CF HTTPS) |
| **Day 5** Reverse proxy, docs | ✅ · nginx `location /api/` → :5000 |
| **Day 6** Dockerfile + container | ✅ |
| **Day 7** Docker Compose | ✅ · `mercantecapi-app-1` + `mercantecapi-db-1` · `/api/weatherforecast` **200** |
| **Day 8** Volumes, CI/CD, Dokploy | ⬜ теория · `pgdata` уже есть · backup · GitHub Actions / Dokploy |

**Конспект:** [notes/day8-volumes-cicd-dokploy.md](./notes/day8-volumes-cicd-dokploy.md)

---

## Структура репо

```text
deploy-or-die-anbo0005/
├── docs/              # notes, handoff, workflow
├── app/
│   └── MercantecApi/  # Web API + Dockerfile + .dockerignore
├── README.md
└── .gitignore
```

**Решение:** один repo — docs + app. Dev **на Mac**, на VM только **Docker** (SDK на сервере не нужен постоянно).

---

## VM

| | |
|---|---|
| SSH | `ssh mercantec-andrii` → `andrii@10.133.51.121` *(IP сменился после reboot 2026-06-11)* |
| Hostname | `andrii-deploy` · expire **2026-06-26** |
| Resources | **4 CPU** · **8 GB RAM** (~40% used) |
| UFW | active — 22, 80, 443 |
| Domain | `https://andrii.mercantec.tech` → **200** (иногда **530**) |

**Пароли / token:** `SERVER_INFO.md`

---

## На VM сейчас

| Компонент | Статус |
|-----------|--------|
| **Compose `db`** | `mercantecapi-db-1` · `127.0.0.1:5432` · **healthy** · volume `pgdata` |
| **Compose `app`** | `mercantecapi-app-1` · `127.0.0.1:5000→3000` · **Up** |
| `cloudflared` | Docker · `--network host` · вне compose |
| **nginx** | `:8080` static + **`/api/` → :5000** · weatherforecast **200** |
| **docker compose v2** | `apt` · `docker-compose-v2` |
| **.NET SDK на VM (хост)** | ❌ не установлен — только в Docker images |

**Repo на VM:** `~/GitHub/deploy-or-die-anbo0005`

---

## Порт `-p 127.0.0.1:5000:3000` (кратко)

Формат: **`хост_IP : порт_на_VM : порт_внутри_container`**

| Часть | Значение |
|-------|----------|
| `127.0.0.1` | слушать только localhost VM (не из интернета) |
| `5000` | снаружи container — сюда стучится nginx (`proxy_pass :5000`) |
| `3000` | внутри container — Kestrel (`ASPNETCORE_URLS=http://+:3000`) |

nginx на VM **`8080`** (tunnel) · app в container **`3000`** — разные порты.

## Трафик client → container (кратко)

```text
Client → HTTPS Cloudflare → tunnel → nginx VM :8080
  /           → static /var/www/andrii/
  /api/...    → proxy :5000 → Docker → container :3000 → Kestrel
```

| Порт | Кто слушает | С интернета? |
|------|-------------|--------------|
| 443 | Cloudflare | ✅ client |
| 8080 | nginx (VM) | ❌ tunnel only |
| 5000 | Docker → API (VM) | ❌ |
| 3000 | Kestrel (container) | ❌ |
| 5432 | Docker → db (compose) | ❌ · app → `db:5432` в compose-сети |

**`127.0.0.1` в container ≠ VM** — app в compose ходит на **`db`**, не `localhost`.

---

## Обновить app на VM (повторный deploy)

```bash
cd ~/GitHub/deploy-or-die-anbo0005
git pull
cd app/MercantecApi
docker compose up -d --build
docker compose ps
curl http://127.0.0.1:5000/weatherforecast
curl http://127.0.0.1:8080/api/weatherforecast
curl https://andrii.mercantec.tech/api/weatherforecast
```

**Не открывать в UFW:** 5432, 8080, 5000.

---

## Быстрый чек после reboot

**Mac — перед SSH** (IP мог смениться, host key — только `MFyp`):

```bash
ssh-keyscan -t ed25519 10.133.51.121 2>/dev/null | ssh-keygen -lf -
# MFyp = yes · P4Z / Ujh... = не yes — teacher / web-console
ssh mercantec-andrii
```

**VM:**

```bash
docker ps
systemctl status nginx
curl -I http://127.0.0.1:8080/
curl http://127.0.0.1:8080/api/weatherforecast
```

---

## Ключевые факты (для агента)

- **Dev:** Mac · **Run on VM:** `docker compose` (`app`+`db`) · nginx `/api/` → `:5000`
- **502** origin (app down) · **530** tunnel
- Commit/push только по запросу пользователя

---

## Блокеры

- **SSH host key:** правильный `SHA256:MFyp...` · не принимать `P4Z...` или `UjhJSXHEy...` (видели 2026-06-10) — всегда `keyscan` перед `yes`
- IP после reboot: `.122` → **`.121`** — `HostName` в `~/.ssh/config` обновлён
- Tunnel периодический **530**

---

## Следующее ⬜ (Day 8)

1. Прочитать [day8-volumes-cicd-dokploy.md](./notes/day8-volumes-cicd-dokploy.md)
2. VM: `volume inspect pgdata` · `compose restart db` · **`pg_dump`** backup
3. (Опционально) `.github/workflows/ci.yml` — build на push
4. (По teacher) Dokploy + webhook
5. `/Health/db` в коде — опционально (env уже в compose)

**Незакоммичено в git:** day8 конспект + обновления docs (Day 7 log, handoff, index) — commit по запросу.
