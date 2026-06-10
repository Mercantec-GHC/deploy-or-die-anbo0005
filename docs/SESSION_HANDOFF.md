# Session handoff — Deploy

> Andrii Bondar · `anbo0005@edu.mercantec.dk` · **resume 2026-06-09** · [GitHub](https://github.com/Mercantec-GHC/deploy-or-die-anbo0005)

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
| **Day 6** Dockerfile + container | ✅ · `mercantec-api` на VM · `/api/weatherforecast` **200** |

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
| SSH | `ssh mercantec-andrii` → `andrii@10.133.51.122` |
| Hostname | `andrii-deploy` · expire **2026-06-26** |
| Resources | **4 CPU** · **8 GB RAM** (~40% used) |
| UFW | active — 22, 80, 443 |
| Domain | `https://andrii.mercantec.tech` → **200** (иногда **530**) |

**Пароли / token:** `SERVER_INFO.md`

---

## На VM сейчас

| Компонент | Статус |
|-----------|--------|
| `postgres` | Docker · `127.0.0.1:5432` |
| `cloudflared` | Docker · `--network host` |
| **`mercantec-api`** | Docker · `127.0.0.1:5000→3000` · **Up** |
| **nginx** | `:8080` static + **`/api/` → :5000** · weatherforecast **200** |
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
| 5432 | Docker → postgres | ❌ · app пока не подключена |

**`127.0.0.1` в container ≠ VM** — postgres с app позже через network / `host.docker.internal`.

---

## Обновить app на VM (повторный deploy)

```bash
cd ~/GitHub/deploy-or-die-anbo0005
git pull
cd app/MercantecApi
docker build -t mercantec-api .
docker stop mercantec-api && docker rm mercantec-api
docker run -d --name mercantec-api -p 127.0.0.1:5000:3000 --restart unless-stopped mercantec-api
curl http://127.0.0.1:5000/weatherforecast
curl http://127.0.0.1:8080/api/weatherforecast
curl https://andrii.mercantec.tech/api/weatherforecast
```

**Не открывать в UFW:** 5432, 8080, 5000.

---

## Быстрый чек после reboot

```bash
docker ps
systemctl status nginx
curl -I http://127.0.0.1:8080/
curl http://127.0.0.1:8080/api/weatherforecast
```

---

## Ключевые факты (для агента)

- **Dev:** Mac · **Run on VM:** Docker `mercantec-api` → host `:5000` · nginx `/api/`
- **502** origin (app down) · **530** tunnel
- Commit/push только по запросу пользователя

---

## Блокеры

- SSH host key MFyp ↔ P4Z
- Tunnel периодический 530

---

## Следующее ⬜

- Day 7+ по программе курса
- App ↔ postgres (endpoint `/Health/db`) — **отложено**
