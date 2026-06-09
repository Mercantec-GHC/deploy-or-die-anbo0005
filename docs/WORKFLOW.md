# Workflow — как работаем с проектом

> Правила для сессий Andrii + агента. Обновляй этот файл, если договоримся иначе.

---

## Роли

| Кто | Что делает |
|-----|------------|
| **Andrii** | Команды на VM / Mac · Teams · teacher · booking |
| **Агент** | Говорит **что** делать по шагам · **обновляет md** (по запросу) · **не** ставит пакеты без явного «сделай» |

**По умолчанию:** ты выполняешь команды сам; я объясняю и правлю документы.

---

## Структура репо

```text
deploy-or-die-anbo0005/
├── docs/                 # курс: notes, handoff, log
├── app/                  # ASP.NET Web API
│   ├── MercantecApi/     # dotnet project
│   ├── Dockerfile        # Day 6 — рядом с кодом или в MercantecApi/
│   └── .dockerignore
├── README.md
├── .gitignore
├── SERVER_INFO.md        # private, не в git
└── MY_NOTES.md           # private, не в git
```

| Что | Где |
|-----|-----|
| Разработка кода | **Mac** (`dotnet run` локально) |
| Документация курса | `docs/` |
| Деплой app | **VM** — `git pull` + `docker build` / `docker run` |
| SDK на VM постоянно | **Не нужен** — SDK только внутри Dockerfile (build stage) |

---

## Какие файлы обновлять и когда

| Файл | Git | Когда обновлять |
|------|:---:|-----------------|
| `app/**` | ✅ | код API · Dockerfile · `.dockerignore` |
| `docs/notes/dayN-*.md` | ✅ | новый день · чеклист · команды |
| `docs/DEPLOY_RESULTS_LOG.md` | ✅ | после практики (итог, без паролей) |
| `docs/SESSION_HANDOFF.md` | ✅ | конец сессии · next step |
| `docs/DOCS_INDEX.md` | ✅ | статус курса |
| `README.md` | ✅ | статус · структура репо |
| `SERVER_INFO.md` | ❌ | VM, docker, nginx, app container |
| `MY_NOTES.md` | ❌ | концепции, не error logs |

---

## Перед commit + push (чеклист)

1. [ ] `app/` — только исходники; **нет** `bin/`, `obj/`, `.vs/`
2. [ ] **Нет секретов:** `appsettings.*.local`, пароли, tunnel token
3. [ ] `docs/notes/dayN-*.md` актуальны
4. [ ] `docs/DEPLOY_RESULTS_LOG.md` — что сделано на VM
5. [ ] `docs/SESSION_HANDOFF.md` — статус · next step
6. [ ] `docs/DOCS_INDEX.md` + `README.md`
7. [ ] `SERVER_INFO.md` + `MY_NOTES.md` (local)
8. [ ] `git status` · `git diff` — только нужные файлы
9. [ ] Commit message — **зачем**
10. [ ] Push — **только** когда явно просишь

**Агент не commit/push** без «commit» / «push».

---

## Dev → deploy flow

```text
Mac                          GitHub                    VM
───                          ──────                    ──
edit app/MercantecApi/  →    git push main        →    git pull
dotnet run :5000                                      docker build
test curl localhost                                   docker run → :5000
                                                      nginx /api/ → app
```

---

## Новая сессия

1. `docs/SESSION_HANDOFF.md`
2. VM: `docker ps` · `nginx` · `curl :8080`
3. Mac: открыть `app/MercantecApi/` если есть
4. Секреты — `SERVER_INFO.md`

---

## Следующая задача

1. **Day 6 ✅** — `mercantec-api` на VM · `/api/weatherforecast` **200**
2. Публичная проверка `https://andrii.mercantec.tech/api/weatherforecast`
3. Day 7+ по программе курса

Детали: `docs/SESSION_HANDOFF.md`

---

## Язык и правила

- Чат: **русский**
- Перед изменением файлов — спросить (кроме «обнови docs» / «commit»)
- UFW: не открывать 5432, 8080, 5000 наружу

---

*Обновлено: 2026-06-09 · Day 6 deploy ✅ · mercantec-api на VM*
