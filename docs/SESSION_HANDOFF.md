# Session handoff — Deploy

> Andrii Bondar · `anbo0005@edu.mercantec.dk` · **resume 2026-06-09** · [GitHub](https://github.com/Mercantec-GHC/deploy-or-die-anbo0005)

**Workflow:** [WORKFLOW.md](./WORKFLOW.md) · **App:** `app/` в этом же репо

---

## Статус курса

| День | Статус |
|------|--------|
| **Day 1** SSH, VM, hardening | ✅ |
| **Day 2** UFW + tunnel DNS | **UFW ✅** · домен ✅ · NIS2/CRA устно ⬜ |
| **Day 3** Docker + DB + tunnel | ✅ |
| **Day 4** Nginx + static site | ✅ · Certbot на VM ⬜ (tunnel → CF HTTPS) |
| **Day 5** Reverse proxy, docs | ✅ · nginx `location /api/` → :5000 |
| **Day 6** Dockerfile | ⬜ теория в notes · container после app |

---

## Структура репо

```text
deploy-or-die-anbo0005/
├── docs/              # notes, handoff, workflow
├── app/               # ASP.NET Web API + Dockerfile (создашь)
│   └── MercantecApi/
├── README.md
└── .gitignore         # + bin/, obj/, appsettings.*.local
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
| **nginx** | `:8080` static + **`/api/` → :5000** |
| **app container** | ⬜ |
| **.NET SDK на VM** | ⬜ не нужен для dev (только внутри `docker build`) |

---

## Следующий шаг — ASP.NET Web API (ты на Mac)

> Команды ниже — для **тебя**. Агент не ставит пакеты без «сделай».

### 1. .NET 8 SDK на Mac

```bash
# macOS — официальный install script (или brew install dotnet@8)
# Проверка:
dotnet --version
```

Документация: https://dotnet.microsoft.com/download/dotnet/8.0

### 2. Создать проект в `app/`

Из корня Deploy-репо на Mac:

```bash
cd /Users/andriibondar/Projects/VSCode/Mercantec/Deploy
mkdir -p app
cd app
dotnet new webapi -n MercantecApi -o MercantecApi --use-controllers
cd MercantecApi
dotnet run --urls http://127.0.0.1:5000
```

### 3. Проверка локально (второй терминал)

```bash
curl http://127.0.0.1:5000/weatherforecast
```

### 4. Commit + push (когда готов)

```bash
cd /Users/andriibondar/Projects/VSCode/Mercantec/Deploy
git add app/ .gitignore
git status   # нет bin/, obj/, секретов
git commit -m "Add MercantecApi Web API scaffold"
git push
```

### 5. На VM — clone/pull + Docker (Day 6)

```bash
mkdir -p ~/GitHub
cd ~/GitHub
git clone https://github.com/Mercantec-GHC/deploy-or-die-anbo0005.git
# или git pull если уже есть

cd deploy-or-die-anbo0005/app/MercantecApi
# после Dockerfile:
docker build -t mercantec-api .
docker run -d --name mercantec-api -p 127.0.0.1:5000:8080 --restart unless-stopped mercantec-api
```

### 6. Проверка через nginx

```bash
curl http://127.0.0.1:8080/api/weatherforecast
curl https://andrii.mercantec.tech/api/weatherforecast
```

### 7. После успеха — сказать агенту обновить

- `SERVER_INFO.md` · `DEPLOY_RESULTS_LOG.md` · `MY_NOTES.md`

**Не открывать в UFW:** 5432, 8080, 5000.

---

## Быстрый чек после reboot

```bash
docker ps
systemctl status nginx
curl -I http://127.0.0.1:8080/
```

---

## Ключевые факты (для агента)

- **Dev:** Mac · **Run on VM:** Docker container → `:5000` · nginx `/api/`
- **Repo path app:** `app/MercantecApi/`
- **502** origin · **530** tunnel
- Commit/push только по запросу пользователя

---

## Блокеры

- SSH host key MFyp ↔ P4Z
- Tunnel периодический 530
- `dotnet` not on Mac yet — шаг 1 выше
