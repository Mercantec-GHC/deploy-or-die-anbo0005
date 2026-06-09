## День 3 — (10 июня) — **Настройка базы данных с Docker**

- Установка Docker
- Контейнер с базой данных (PostgreSQL/MySQL)
- Конфигурация базы данных и подключение
- **Цель**: база данных работает в контейнере

**:learning-motives: Цели обучения на день : встреча в Teams в 08:30** :teams_icon: Докладчик @MAGS

1. Я могу установить Docker и запустить контейнер с базой данных (PostgreSQL, MySQL или альтернатива)
2. Я могу настроить доступ и подключения к базе данных из внешних сервисов
3. Я могу объяснить преимущества запуска баз данных в контейнерах вместо установки напрямую на сервере
- :theory-icon: Теория дня

    # День 3 – Настройка базы данных с Docker

    ---

    ## Docker Desktop и Docker на Linux (сервер)

    На Дне 3 рассматриваем Docker **двумя способами**: **Docker Desktop** (на своём ПК) и **Docker на Linux-сервере**. Оба могут запускать те же images и контейнеры — но использование разное.

    | | Docker Desktop | Docker на Linux (сервер) |
    | --- | --- | --- |
    | **Где** | Windows/macOS (локально на вашей машине) | Ubuntu/Debian-сервер (например, доступ с Дня 1) |
    | **Интерфейс** | Графический UI (контейнеры, images, logs, terminal) + `docker` в командной строке | Только командная строка: `docker`, `docker compose` |
    | **Типичное использование** | Разработка, быстрый тест контейнеров и БД локально, сборка images | Место, где *ваше* приложение и база реально работают для других (продакшен/эксплуатация) |
    | **Установка** | Скачать с docker.com, установить, запустить Docker Desktop | `apt install docker.io` (или официальный пакет Docker), `systemctl enable docker` |

    **Зачем оба варианта:** Локально с Docker Desktop можно пробовать database-контейнеры и команды без сервера. На Linux-сервере настраиваете Docker, который *важен* для deployment — здесь работает база и позже приложение. Те же команды (`docker run`, `docker ps` и т.д.) работают в обоих местах — то, что учите локально, применяете на сервере.

    ---

    ## Docker – краткий обзор

    **Docker** запускает приложения в **контейнерах**: изолированные среды со своей файловой системой и сетью, но с общим ядром ОС. Вы описываете, что должно работать, в **image** (собранном из Dockerfile или скачанном с Docker Hub); Docker запускает **контейнер** из этого image.

    - **Установка на Linux (сервер):** На Ubuntu/Debian обычно `sudo apt update`, `sudo apt install docker.io` (или официальный пакет Docker). После установки: `sudo systemctl enable docker`, `sudo systemctl start docker`. Проверка: `docker run hello-world`.
    - **Docker Desktop:** Установка с docker.com; после запуска — UI и `docker` в терминале как на Linux.
    - **Базовые команды (везде):** `docker pull <image>` (скачать image), `docker run [options] <image>` (запустить контейнер), `docker ps` (показать запущенные контейнеры), `docker stop <container>`, `docker rm <container>`.

    На Дне 3 Docker используется для **database-контейнера** — локально в Desktop для практики и на Linux-сервере как среда для приложения.

    ---

    ## База данных в контейнере (PostgreSQL / MySQL)

    **PostgreSQL** и **MySQL** (и MariaDB) есть как официальные images на Docker Hub. Запускаете один контейнер с БД и настраиваете **переменными окружения** (пользователь, пароль, имя БД). Данные лучше хранить в **volume** (подробнее на Дне 9), чтобы БД пережила перезапуск контейнера.

    ### Пример: PostgreSQL

    ```bash
    docker run -d \
      --name postgres \
      -e POSTGRES_USER=myuser \
      -e POSTGRES_PASSWORD=secret \
      -e POSTGRES_DB=myapp \
      -p 5432:5432 \
      -v pgdata:/var/lib/postgresql/data \
      postgres:16-alpine
    ```

    - `d`: фоновый режим (detached).
    - `e`: переменные окружения — пользователь, пароль и имя БД при старте Postgres.
    - `p 5432:5432`: проброс порта — 5432 хоста → 5432 контейнера; приложение подключается к `localhost:5432` или server-IP:5432.
    - `v pgdata:/var/lib/postgresql/data`: volume для сохранения данных (важно в продакшене).
    - `postgres:16-alpine`: image и tag с Docker Hub.

    ### Пример: MySQL

    ```bash
    docker run -d \
      --name mysql \
      -e MYSQL_ROOT_PASSWORD=rootsecret \
      -e MYSQL_DATABASE=myapp \
      -e MYSQL_USER=myuser \
      -e MYSQL_PASSWORD=brugersecret \
      -p 3306:3306 \
      -v mysqldata:/var/lib/mysql \
      mysql:8
    ```

    - Порт **3306** — стандарт MySQL. `MYSQL_DATABASE` создаёт БД при первом запуске; `MYSQL_USER` и `MYSQL_PASSWORD` — пользователь с доступом.

    ---

    ## Конфигурация и подключение из внешних сервисов

    - **Внутри контейнера:** БД слушает обычный порт (5432 Postgres, 3306 MySQL). Пользователь, пароль и имя БД — те, что задали через `-e`.
    - **С хоста или других контейнеров:** При `-p 5432:5432` приложение на **том же сервере** подключается к `localhost:5432` (или IP сервера) с теми же user/password/db.
    - **Из другого контейнера (тот же хост):** Оба контейнера в одной **Docker-сети** (`docker network create mynet`, `docker run --network mynet ...`). App подключается по **имени сервиса** (например `postgres`) как hostname. Connection string: `host=postgres port=5432 user=myuser password=secret dbname=myapp`.
    - **Безопасность:** Сильные пароли; не открывайте порт БД в интернет без веской причины (firewall только для нужных IP). Обычно только приложение на сервере (или в той же сети) должно достучаться до БД.

    ---

    ## Преимущества БД в контейнере (vs напрямую на сервере)

    | Аспект | Контейнер | Напрямую на сервере |
    | --- | --- | --- |
    | **Установка** | Один `docker run` (или Compose); тот же image везде. Без ручного управления пакетами на host. | Пакеты ставятся и обновляются на каждом сервере; версии могут расходиться. |
    | **Изоляция** | БД и файлы в контейнере (volume); меньше конфликтов с другими сервисами. | Общий сервер со всем; конфиг влияет на систему. |
    | **Переносимость** | Тот же image и env на других серверах или Kubernetes; проще повторить среду. | Документация и ручная настройка каждый раз. |
    | **Очистка** | Stop и удалить контейнер (данные в volume можно оставить); сервер без пакетов БД. | Удаление и очистка сложнее. |

    Кратко: контейнеры дают **единообразие**, **изоляцию** и **проще переиспользовать** среду БД — особенно с Docker Compose или Kubernetes.

    ---

    ## Цели обучения (итог)

    1. Установить Docker и запустить контейнер с БД (PostgreSQL, MySQL или альтернатива).
    2. Настроить доступ и подключения из внешних сервисов (порт, сеть, connection string).
    3. Объяснить преимущества БД в контейнерах вместо установки напрямую на сервере.

# День 3 – Docker и настройка базы данных

---

# 1. Docker Desktop vs Docker на Linux

## В чём разница?

```mermaid
graph LR
    subgraph Desktop ["Docker Desktop (Windows/Mac)"]
        D1["Графический интерфейс"]
        D2["Обзор контейнеров"]
        D3["Логи в UI"]
        D4["Локальная разработка"]
    end
    subgraph Linux ["Docker на Linux (сервер)"]
        L1["Только командная строка"]
        L2["Продакшен/эксплуатация"]
        L3["Доступ по SSH"]
        L4["Те же команды"]
    end
    BOTH["Оба используют: docker run,<br>docker ps, docker-compose"]
    Desktop --> BOTH
    Linux --> BOTH
```

---

## Workflow установки

```mermaid
graph TD
    subgraph InstallDesktop ["Установка Docker Desktop"]
        DD1["Скачать с docker.com"]
        DD2["Установить через wizard"]
        DD3["Запустить Docker Desktop"]
        DD4["Готово"]
        DD1 --> DD2 --> DD3 --> DD4
    end
    subgraph InstallLinux ["Docker на Linux (Ubuntu)"]
        DL1["sudo apt update"]
        DL2["sudo apt install docker.io"]
        DL3["sudo systemctl enable docker"]
        DL4["sudo systemctl start docker"]
        DL5["docker run hello-world"]
        DL6["Готово"]
        DL1 --> DL2 --> DL3 --> DL4 --> DL5 --> DL6
    end
```

---

# 2. Что такое Docker?

## Контейнеры vs виртуальные машины

```mermaid
graph TD
    subgraph VM ["Виртуальная машина"]
        VM1["Hardware"]
        VM2["Hypervisor"]
        VM3["Гостевая ОС (полная копия)"]
        VM4["Binaries/Libraries"]
        VM5["App"]
        VM1 --> VM2 --> VM3 --> VM4 --> VM5
    end
    subgraph Container ["Контейнер"]
        C1["Hardware"]
        C2["Ядро ОС (общее)"]
        C3["Docker Engine"]
        C4["Binaries/Libraries (минимум)"]
        C5["App"]
        C1 --> C2 --> C3 --> C4 --> C5
    end
    VM --> Compare{"Сравнение"}
    Container --> Compare
    Compare --> R1["Контейнер: быстрее старт"]
    Compare --> R2["Контейнер: меньше размер"]
    Compare --> R3["Контейнер: меньше ресурсов"]
    Compare --> R4["VM: сильнее изоляция"]
```

---

## Архитектура Docker

```mermaid
graph LR
    CLI["Docker CLI<br>(вы)"]
    Daemon["Docker Daemon<br>(dockerd)"]
    Images["Images<br>(read-only шаблоны)"]
    Containers["Containers<br>(запущенные экземпляры)"]
    Registry["Docker Hub<br>(registry образов)"]
    CLI -->|docker run| Daemon
    CLI -->|docker build| Daemon
    CLI -->|docker pull| Daemon
    Daemon -->|создаёт из| Images
    Images -->|запускается как| Containers
    Daemon <-->|pull/push| Registry
```

📺 **Video: Docker explained in 100 Seconds – Fireship**

https://www.youtube.com/watch?v=Gjnup-PuquQ

📺 **Video: Docker Tutorial for Beginners (3 hours) – TechWorld with Nana**

https://www.youtube.com/watch?v=3c-iBn73dDE

---

# 3. База данных в контейнере – зачем?

## Преимущества database-контейнеров

```mermaid
graph TD
    DB["База данных в контейнере"] --> F1["Быстрая настройка<br>Одна команда: docker run"]
    DB --> F2["Единая среда<br>Тот же image везде"]
    DB --> F3["Изоляция<br>Меньше конфликтов"]
    DB --> F4["Переносимость<br>Тот же setup dev → prod"]
    DB --> F5["Простая очистка<br>Stop + удалить контейнер"]
    DB --> F6["Версионирование<br>postgres:14 vs postgres:16"]
```

---

## Контейнер vs установка напрямую

```mermaid
graph LR
    subgraph DirectInstall ["Напрямую на сервере"]
        DI1["apt install postgresql"]
        DI2["Ручная конфигурация"]
        DI3["Версия привязана<br>к пакетам ОС"]
        DI4["Сложно перенести"]
    end
    subgraph ContainerInstall ["В контейнере"]
        CI1["docker run postgres:16"]
        CI2["Env vars для config"]
        CI3["Точная версия<br>(14, 15, 16, alpine)"]
        CI4["Тот же image везде"]
    end
    DirectInstall --> VS{"Выбор"}
    ContainerInstall --> VS
    VS --> Rec["Рекомендация: контейнер<br>для разработки и<br>containerized apps"]
```

---

# 4. PostgreSQL Container – полное руководство

## Настройка PostgreSQL container

```mermaid
sequenceDiagram
    participant U as Вы
    participant D as Docker
    participant DH as Docker Hub
    participant C as PostgreSQL Container
    U->>D: docker run postgres:16-alpine
    D->>DH: Скачивает image (первый раз)
    DH-->>D: postgres:16-alpine downloaded
    D->>C: Запускает контейнер
    Note over C: Читает POSTGRES_USER<br>POSTGRES_PASSWORD<br>POSTGRES_DB из -e
    C->>C: Инициализирует базу
    C-->>U: Контейнер на порту 5432
    U->>C: Подключение из app<br>или psql
```

---

## Команда PostgreSQL с пояснением

```bash
docker run -d \
  --name postgres \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_PASSWORD=secret \
  -e POSTGRES_DB=myapp \
  -p 5432:5432 \
  -v pgdata:/var/lib/postgresql/data \
  postgres:16-alpine
```

```mermaid
graph TD
    CMD["docker run"] --> D["-d = detached<br>(в фоне)"]
    CMD --> N["--name postgres<br>(имя для ссылок)"]
    CMD --> E1["-e POSTGRES_USER"]
    CMD --> E2["-e POSTGRES_PASSWORD"]
    CMD --> E3["-e POSTGRES_DB"]
    CMD --> P["-p 5432:5432<br>(port mapping)"]
    CMD --> V["-v pgdata:/var/lib/postgresql/data<br>(persistent data)"]
    CMD --> I["postgres:16-alpine<br>(image:tag)"]
    D --> RUN["Контейнер работает"]
    N --> RUN
    E1 --> RUN
    E2 --> RUN
    E3 --> RUN
    P --> RUN
    V --> RUN
    I --> RUN
```

---

## Port mapping

```mermaid
graph LR
    H["Host (сервер)<br>Порт 5432"] -->|mapping| C["Container<br>Порт 5432"]
    APP1["App на том же host"] -->|localhost:5432| H
    APP2["App снаружи"] -->|server-ip:5432| H
    C --> PG["PostgreSQL<br>слушает 5432"]
```

**Важно:** `-p 5432:5432` означает:

- **Первый 5432** = порт на host (снаружи)
- **Второй 5432** = порт в контейнере (внутри)

📺 **Video: How to run PostgreSQL in Docker – Unbounded Systems**

https://www.youtube.com/watch?v=sNXVP2suMA8

---

# 5. MySQL Container – альтернатива

## Настройка MySQL

```bash
docker run -d \
  --name mysql \
  -e MYSQL_ROOT_PASSWORD=rootsecret \
  -e MYSQL_DATABASE=myapp \
  -e MYSQL_USER=myuser \
  -e MYSQL_PASSWORD=brugersecret \
  -p 3306:3306 \
  -v mysqldata:/var/lib/mysql \
  mysql:8
```

---

## PostgreSQL vs MySQL – ключевые моменты

```mermaid
graph TD
    subgraph PG ["PostgreSQL"]
        PG1["Порт: 5432"]
        PG2["Env: POSTGRES_*"]
        PG3["Data: /var/lib/postgresql/data"]
        PG4["Стандарт для advanced apps"]
    end
    subgraph MY ["MySQL"]
        MY1["Порт: 3306"]
        MY2["Env: MYSQL_*"]
        MY3["Data: /var/lib/mysql"]
        MY4["Популярно для web-apps"]
    end
    CHOICE["Выбор по потребностям проекта"]
    PG --> CHOICE
    MY --> CHOICE
```

---

# 6. Подключение к БД из приложения

## Подключение с того же host

```mermaid
sequenceDiagram
    participant A as Ваше приложение (localhost)
    participant H as Host
    participant C as Postgres Container
    A->>H: Подключение к localhost:5432
    H->>C: Port mapping в контейнер
    C-->>H: Connection accepted
    H-->>A: Connected
    A->>C: SELECT * FROM users
    C-->>A: Query result
```

**Пример connection string:**

```
postgresql://myuser:secret@localhost:5432/myapp
```

---

## Подключение из другого контейнера (Docker network)

```mermaid
graph LR
    NET["Docker Network<br>'mynet'"]
    DB["Container: db<br>(postgres)"]
    APP["Container: app<br>(ваше приложение)"]
    NET --- DB
    NET --- APP
    APP -->|host=db| DB
    APP2["Connection string:<br>postgresql://user:pass@db:5432/myapp"]
    APP2 -.-> APP
```

**Важно:** В одной Docker network **имя контейнера** используется как hostname!

---

## Выбор схемы подключения

```mermaid
graph TD
    START{"Где работает<br>ваше приложение?"}
    START -->|Тот же host| LOCAL["localhost:5432<br>или server-ip:5432"]
    START -->|Другой контейнер| NETWORK{"Одна<br>Docker network?"}
    NETWORK -->|Да| SERVICENAME["Имя контейнера<br>как hostname: db:5432"]
    NETWORK -->|Нет| CREATENET["Создать Docker network<br>и подключить оба"]
    CREATENET --> SERVICENAME
    START -->|Внешний сервер| EXTERNAL["Public IP<br>+ открыть firewall"]
```

---

# 7. Environment Variables (переменные окружения)

## Что такое environment variables?

```mermaid
graph LR
    ENV["Environment Variables"] --> E1["Конфигурация<br>без hardcoding"]
    ENV --> E2["Разные значения<br>dev vs prod"]
    ENV --> E3["Задаются через -e<br>в docker run"]
    E1 --> EX1["DATABASE_HOST=db"]
    E2 --> EX2["NODE_ENV=production"]
    E3 --> EX3["-e POSTGRES_PASSWORD=secret"]
```

---

## Env vars на практике – PostgreSQL

```mermaid
graph TD
    RUN["docker run postgres:16"] --> CHECK{"Env vars заданы?"}
    CHECK -->|Да| USE["POSTGRES_USER,<br>POSTGRES_PASSWORD,<br>POSTGRES_DB"]
    CHECK -->|Нет| DEFAULT["Defaults:<br>user=postgres<br>db=postgres"]
    USE --> INIT["БД с вашими значениями"]
    DEFAULT --> INIT2["БД с defaults"]
```

---

# 8. Volumes – постоянные данные

## Зачем volumes?

**Проблема:** Данные в контейнере пропадают при удалении контейнера!

```mermaid
graph LR
    C1["Контейнер стартует"] --> W["Запись в /var/lib/postgresql/data"]
    W --> STOP["Контейнер остановлен"]
    STOP --> RM["docker rm"]
    RM --> GONE["ВСЕ ДАННЫЕ ПОТЕРЯНЫ"]
```

**Решение:** volumes!

```mermaid
graph LR
    C1["Контейнер стартует"] --> V["Volume 'pgdata'<br>mount в<br>/var/lib/postgresql/data"]
    V --> W["Данные в volume"]
    W --> STOP["Контейнер остановлен"]
    STOP --> RM["docker rm"]
    RM --> V2["Volume 'pgdata'<br>цел"]
    V2 --> NEW["Новый контейнер<br>тот же volume"]
    NEW --> DATA["Данные на месте"]
```

---

## Команды named volume

```mermaid
graph TD
    CREATE["Volume создаётся автоматически<br>при первом docker run -v"]
    CREATE --> LIST["docker volume ls"]
    LIST --> INSPECT["docker volume inspect pgdata"]
    INSPECT --> REMOVE["docker volume rm pgdata<br>(только когда контейнер не использует)"]
```

📺 **Video: Docker Volumes explained – TechWorld with Nana (из Docker full tutorial)**

https://www.youtube.com/watch?v=3c-iBn73dDE

---

# 9. Docker команды – survival guide

## Основные команды

```mermaid
graph TD
    DOCKER["Docker команды"] --> RUN["docker run"]
    DOCKER --> PS["docker ps"]
    DOCKER --> PSA["docker ps -a"]
    DOCKER --> LOGS["docker logs <name>"]
    DOCKER --> EXEC["docker exec -it <name> bash"]
    DOCKER --> STOP["docker stop <name>"]
    DOCKER --> START["docker start <name>"]
    DOCKER --> RM["docker rm <name>"]
    DOCKER --> IMAGES["docker images"]
    DOCKER --> PULL["docker pull <image>"]
```

---

## Жизненный цикл контейнера

```mermaid
stateDiagram-v2
    [*] --> Created: docker run
    Created --> Running: Start
    Running --> Paused: docker pause
    Paused --> Running: docker unpause
    Running --> Stopped: docker stop
    Stopped --> Running: docker start
    Stopped --> Removed: docker rm
    Running --> Removed: docker rm -f
    Removed --> [*]
```

---

# 10. Troubleshooting

## «Database container не стартует!»

```mermaid
graph TD
    START["Контейнер не стартует"] --> LOGS{"docker logs postgres"}
    LOGS --> ERR1["Порт занят?"]
    LOGS --> ERR2["Неверный пароль?"]
    LOGS --> ERR3["Проблема volume?"]
    ERR1 --> FIX1["Другой порт:<br>-p 5433:5432"]
    ERR2 --> FIX2["Проверить -e POSTGRES_PASSWORD"]
    ERR3 --> FIX3["docker volume rm pgdata<br>(УДАЛЯЕТ данные!)"]
    FIX1 --> TEST["docker run снова"]
    FIX2 --> TEST
    FIX3 --> TEST
    TEST --> OK["Работает"]
```

---

## «Не могу подключиться к БД!»

```mermaid
graph TD
    NOCONN["Нет подключения"] --> CHECK1{"docker ps?"}
    CHECK1 -->|Нет| START["docker start postgres"]
    CHECK1 -->|Да| CHECK2{"Верный порт?"}
    CHECK2 -->|Нет| FIX["Проверить -p и connection string"]
    CHECK2 -->|Да| CHECK3{"Верный hostname?"}
    CHECK3 -->|localhost| OK1["localhost:5432"]
    CHECK3 -->|имя контейнера| OK2["db:5432<br>(та же network!)"]
    CHECK3 -->|IP сервера| FW["firewall:<br>sudo ufw allow 5432"]
```

---

# 11. Безопасность – best practices

## Безопасность БД в контейнерах

```mermaid
graph TD
    SEC["Безопасность БД"] --> S1["Сильные пароли в env vars"]
    SEC --> S2["НЕ открывать порт в интернет"]
    SEC --> S3["Volumes для backup"]
    SEC --> S4["Ограничить сеть<br>(только app-container)"]
    SEC --> S5["НЕ hardcode пароли в код"]
    S1 --> TIP1["Минимум 16 символов"]
    S2 --> TIP2["Только localhost<br>или Docker network"]
    S3 --> TIP3["Регулярные dumps<br>pg_dump"]
    S4 --> TIP4["Изоляция Docker network"]
```

---

# 12. Следующий шаг – Docker Compose

На **Дне 7** — Docker Compose:

```mermaid
graph LR
    NOW["День 3:<br>docker run"] --> NEXT["День 7:<br>docker-compose.yml"]
    NOW --> N1["По одной команде"]
    NOW --> N2["Много параметров"]
    NEXT --> NX1["Один файл описывает всё"]
    NEXT --> NX2["docker compose up"]
    NEXT --> NX3["App + DB вместе"]
```

---

# Чеклист целей обучения

- [ ]  Я могу установить Docker на сервере и проверить (`docker run hello-world`)
- [ ]  Я могу объяснить разницу Docker Desktop и Docker на Linux
- [ ]  Я могу запустить PostgreSQL container через `docker run`
- [ ]  Я понимаю, что означают `-e`, `-p`, `-v` и `-d` в `docker run`
- [ ]  Я могу подключить приложение к database-container
- [ ]  Я понимаю, зачем volumes для persistent data
- [ ]  Я могу показать запущенные контейнеры (`docker ps`)
- [ ]  Я могу смотреть логи контейнера (`docker logs`)
- [ ]  Я могу объяснить преимущества БД в контейнерах vs установка напрямую
- [ ]  Я могу troubleshoot базовые проблемы контейнеров

---

## Команды (практика)

> Token tunnel → `SERVER_INFO.md`. Пакет: `docker.io` через `apt` — **не** snap.

### 1. Установить Docker

```bash
docker ps
# Command 'docker' not found = ещё не установлен (ожидаемо)

sudo apt update                    # обновить список пакетов
sudo apt install -y docker.io      # Docker daemon + CLI
sudo systemctl enable docker       # автозапуск после reboot
sudo systemctl start docker        # запустить службу
sudo systemctl status docker       # active (running) = dockerd работает

sudo docker run hello-world        # первый контейнер; Hello from Docker!
docker ps                          # пусто = нормально (hello-world Exited)
docker ps -a                       # hello-world STATUS Exited (0)

sudo usermod -aG docker andrii     # docker без sudo
exit                               # re-login — иначе группа не применится
groups                             # должна быть docker
docker ps                          # без sudo
newgrp docker                      # или так в старой сессии без exit
```

### 2. PostgreSQL

```bash
# user/pass/db → SERVER_INFO.md · НЕ: sudo ufw allow 5432
# если контейнер/volume уже был с другими паролями:
# docker rm -f postgres && docker volume rm pgdata

docker run -d \
  --name postgres \
  -e POSTGRES_USER=andrii \
  -e POSTGRES_PASSWORD='ТВОЙ_ПАРОЛЬ' \
  -e POSTGRES_DB=postgres \
  -p 127.0.0.1:5432:5432 \
  -v pgdata:/var/lib/postgresql/data \
  postgres:16-alpine
# -d фон · -e user/pass/db · -p localhost only · -v volume pgdata

docker ps                              # postgres = Up
docker logs postgres --tail 20         # database system is ready to accept connections
docker volume ls                       # pgdata

docker exec -it postgres psql -U andrii -d postgres -c '\conninfo'
docker exec -it postgres psql -U andrii -d postgres -c '\l'   # список баз (опционально)

# интерактивный psql (выход: \q)
docker exec -it postgres psql -U andrii -d postgres

# управление
docker stop postgres
docker start postgres
```

### Проверка подключения к БД

```bash
docker ps                              # postgres = Up
docker logs postgres --tail 20         # ready to accept connections

docker exec -it postgres psql -U andrii -d postgres -c '\conninfo'
docker exec -it postgres psql -U andrii -d postgres -c 'SELECT 1;'

# psql на VM не установлен — нормально; используй docker exec выше
# app на VM: Host=localhost;Port=5432 (см. SERVER_INFO.md)
```

### Mac GUI к БД (опционально)

```bash
# только с Mac, не с VM · mercantec-andrii — alias в ~/.ssh/config
ssh -L 5433:127.0.0.1:5432 mercantec-andrii
# терминал не закрывать · порт 5433 занят → закрыть старый ssh или использовать 5434

# TablePlus/DBeaver: 127.0.0.1:5433 · user/db → SERVER_INFO.md
```

### Volumes (данные БД)

```bash
# -v pgdata:/var/lib/postgresql/data — данные на диске VM, не только в контейнере
# docker rm postgres — контейнер удалён, volume pgdata остаётся

docker volume ls                       # список volumes (ожидаем: pgdata)
docker volume inspect pgdata           # Mountpoint — путь на VM

# посмотреть файлы БД на хосте (нужен sudo; в Explorer часто пусто — права)
sudo ls /var/lib/docker/volumes/pgdata/_data

# пересоздать БД с нуля (удалит все данные!)
docker stop postgres && docker rm postgres
docker volume rm pgdata
# потом снова docker run ... -v pgdata:...
```

### 3. Cloudflare tunnel (teacher)

```bash
# TOKEN из Teams → только SERVER_INFO.md (не в чат, не в git)
# скачивает image cloudflared, запускает агент tunnel VM ↔ Cloudflare
# teacher уже настроил маршрут: andrii.mercantec.tech → localhost:8080

# --network host обязателен: иначе localhost:8080 = внутри контейнера, не хост → 502
docker run -d \
  --name cloudflared \
  --restart unless-stopped \
  --network host \
  cloudflare/cloudflared:latest \
  tunnel --no-autoupdate run --protocol http2 --token TOKEN

docker ps                              # cloudflared = Up
docker logs cloudflared --tail 30      # ищи Registered tunnel connection · protocol=http2
# OK: Environment is healthy · Registered tunnel connection
# ERR quic + Retrying = сеть режет UDP → --protocol http2 (см. выше)
# ERR dial tcp [::1]:8080 refused = нет сервиса на 8080 или только IPv4 bind

docker logs cloudflared --tail 20
# всё равно ERR edge → написать teacher (сеть Mercantec)
```

### 4. Тест на 8080 (пока нет Nginx)

```bash
# tunnel один не даёт сайт — на 8080 должен слушать app/nginx
# nginx в Docker (не apt на VM) — временный тест до Day 4
# [::1]:8080 — cloudflared может ходить на IPv6 localhost
docker run -d --name web-test \
  -p 127.0.0.1:8080:80 \
  -p "[::1]:8080:80" \
  nginx:alpine

curl -I http://127.0.0.1:8080/       # HTTP/1.1 200 OK
curl -I https://andrii.mercantec.tech  # HTTP/2 200 (не 502)

# Day 4: убрать web-test, nginx на VM
docker stop web-test && docker rm web-test
```

### Docker — шпаргалка

```bash
docker pull IMAGE      # скачать image заранее (run тоже скачивает сам)
docker run ... IMAGE   # image → контейнер
docker ps              # только Running
docker ps -a           # все, включая Exited
docker logs ИМЯ        # логи
docker exec -it ИМЯ bash       # shell внутри (если есть bash)
docker exec -it postgres psql -U andrii -d postgres   # Postgres: psql, не bash
docker stop ИМЯ        # остановить
docker start ИМЯ       # запустить снова
docker rm ИМЯ          # удалить контейнер (сначала stop, или rm -f)
docker volume ls       # список volumes
docker volume inspect ИМЯ   # путь Mountpoint на VM
docker volume rm ИМЯ   # удалить volume + данные — осторожно!
docker images          # скачанные images
```
