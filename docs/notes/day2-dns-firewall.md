## Dag 2 - (9. juni) - **Домен, DNS и Firewall**

- Купить домен (или использовать subdomain)
- Настройка DNS (A, CNAME records)
- Настройка Cloudflare
- Настройка UFW/iptables
- **Цель**: домен указывает на ваш сервер, firewall настроен

**:learning-motives: Цели обучения на день : встреча в Teams в 08:30** :teams_icon: Докладчик @Paw

1. Я могу настроить DNS-records (A, CNAME) и привязать домен к серверу
2. Я могу настроить и протестировать firewall с UFW или iptables
3. Я могу использовать Cloudflare для защиты и управления трафиком к моему домену
- :theory-icon: Теория дня

    # День 2 – Домен, DNS и Firewall

    ---

    ## 📚 Содержание

    1. Домены и Subdomains
    2. DNS - Domain Name System (подробно)
    3. DNS Records - подробное руководство
    4. Cloudflare - Setup и архитектура
    5. Firewall - UFW и iptables
    6. NIS2 и CRA - рамки безопасности

    ---

    ## Домены и Subdomains

    ### Что такое домен?

    **Домен** (например `mitprojekt.dk`) — имя, которое пользователи вводят в браузере, чтобы найти ваш сервер. Можно купить домен у registrar (One.com, GoDaddy, Simply и т.д.) или использовать **subdomain** под доменом, к которому у вас есть доступ.

    **Subdomains для курса:** Преподаватель выдаёт subdomain под домены — например `jeresprojekt.mercantec.tech`, `gruppe2.gf2.dk` или `app.mags.dk`. Домены: **mercantec.tech**, **gf2.dk** и **mags.dk**. Куплены у **Simply**, **DNS перенесён в Cloudflare** — все DNS-records настраиваются в Cloudflare, регистрация домена остаётся у Simply. Одно место, чтобы направить subdomain на ваш сервер.

    - Домен сам по себе **не** указывает на сервер — нужен **DNS**.
    - При покупке домена вы получаете доступ к редактированию DNS (у registrar или у того, куда перенесли DNS — здесь Cloudflare).

    ---

    ## DNS (Domain Name System)

    **DNS** переводит доменные имена в IP-адреса и другую информацию. Когда кто-то вводит `https://minside.dk`, браузер спрашивает DNS: «Какой IP у minside.dk?» — и получает, например, `192.0.2.42`. Затем создаётся соединение с этим IP. DNS отвечает на: *Где находится этот сервер?* и *Какой сервер обрабатывает почту для этого домена?* и т.д.

    DNS состоит из **records** (записей) в **zone** вашего домена. У каждой записи есть **тип**, **имя** (host), **значение** и часто **TTL** (Time To Live — как долго ответ может храниться в кэше).

    ### DNS-records — обзор

    | Record type | Назначение | Пример |
    | --- | --- | --- |
    | **A** | Имя host → **IPv4-адрес**. | `app` → `192.0.2.42` |
    | **AAAA** | Как A, но для **IPv6**. | `app` → `2001:db8::1` |
    | **CNAME** | Имя → **другое доменное имя** (alias). DNS затем разрешает A/AAAA для того имени. Нельзя на root (apex) зоны. | `www` → `app.mercantec.tech` |
    | **MX** | **Почтовые серверы** домена (приоритет + host). | `10 mail.provider.com` |
    | **TXT** | Произвольный текст. Верификация владельца, SPF/DKIM для почты и др. | `v=spf1 include:_spf.google.com ~all` |
    | **NS** | **Nameserver** для (sub)домена. Делегирование или перенос DNS. | `ns1.cloudflare.com`, `ns2.cloudflare.com` |
    | **CAA** | Какие **CA** могут выдавать сертификаты для домена. | `0 issue "letsencrypt.org"` |

    В Cloudflare **имя** обычно — subdomain (например `app` для `app.mercantec.tech`) или `@` для root (`mercantec.tech`).

    ### Практика: A и CNAME для deployment

    - **Root-домен** (например `mercantec.tech`): **A-record** с именем `@` на публичный IP сервера.
    - **Subdomain** (например `jeresprojekt.mercantec.tech`): **A-record** с именем `jeresprojekt` и IP сервера — или **CNAME** на другой host, у которого уже есть A-record (обновляете IP в одном месте).

    **TTL:** После сохранения records изменения распространяются от минут до 48 часов. Короткий TTL (например 300 секунд) — быстрее при смене IP, но больше DNS-запросов. Перед сменой сервера многие ставят TTL низко; потом можно поднять.

    ### Роль DNS при deployment

    DNS **связывает доменное имя с инфраструктурой**:

    1. **Go-live / смена сервера:** Меняете A или CNAME на IP нового сервера. Пока DNS не обновился, часть пользователей видит старый IP (кэш).
    2. **HTTPS и сертификаты:** Let's Encrypt (и др.) часто проверяют домен через DNS (TXT для HTTP-01 или DNS-01). Без правильного DNS автоматический SSL не работает.
    3. **Load balancing и CDN:** При Cloudflare proxy A/CNAME может указывать на IP Cloudflare; дальше трафик идёт на ваш сервер. DNS задаёт *первый hop*.
    4. **Отладка:** Если «домен не работает» — `dig` / `nslookup`: DNS на нужный IP? TTL истёк?

    Кратко: DNS — *карта*, где лежит ваш сервис. Без правильных records трафик не дойдёт — или дойдёт не туда.

    ---

    ## Перенос DNS в Cloudflare (nameservers)

    Домены mercantec.tech, gf2.dk и mags.dk куплены у **Simply**, но **DNS в Cloudflare**:

    - **Simply** — *регистрация* (продление домена).
    - **Cloudflare** — *какие records у домена* — куда указывают `mercantec.tech`, `app.mercantec.tech` и т.д.

    ### Зачем DNS в Cloudflare?

    - **Одно место для всех records:** A, CNAME, TXT в dashboard.
    - **Proxy и безопасность:** трафик через Cloudflare (orange sky) — DDoS, кэш, SSL к посетителям.
    - **Скрытый IP сервера:** при proxy видны IP Cloudflare, не ваш.
    - **Быстрая propagation:** глобальная сеть Cloudflare.

    ### Как «перенести» DNS в Cloudflare

    1. **Добавить домен в Cloudflare** (Add site). Cloudflare может просканировать существующие records.
    2. **Cloudflare показывает два nameserver**, например `ada.ns.cloudflare.com` и `bob.ns.cloudflare.com` — используйте те, что дали вам!
    3. **У registrar (Simply)** — **Nameservers** / **DNS-servere**. Заменить Simply NS на Cloudflare.
    4. **Сохранить у Simply.** Cloudflare обрабатывает DNS для домена; records редактируются в Cloudflare.
    5. **Ждать propagation** (15 мин – 24 ч). Статус **Active**, когда NS переключились.

    После переноса **все** DNS-records — в Cloudflare, не у Simply. Subdomains для проектов — A или CNAME в Cloudflare.

    ---

    ## Cloudflare – DNS и proxy

    **Cloudflare** — DNS-провайдер и **proxy** перед сервером: трафик может идти через сеть Cloudflare, затем на сервер. mercantec.tech, gf2.dk, mags.dk уже в Cloudflare — см. раздел выше.

    - **DNS в Cloudflare:** все records (A, CNAME, TXT…) в dashboard; здесь же subdomains проектов.
    - **Proxy:** для каждой записи **Proxied** (orange sky) или **DNS only** (grey sky). При Proxied:
        - трафик через Cloudflare (DDoS, caching);
        - посетители получают SSL/TLS к Cloudflare;
        - реальный IP сервера скрыт.

    **Практика:** A или CNAME на subdomain → IP сервера; **Proxied** для защиты и SSL Cloudflare; **DNS only**, если SSL сами на сервере (например Let's Encrypt на Nginx).

    ---

    ## Firewall – UFW и iptables

    **Firewall** решает, какие входящие и исходящие соединения проходят. В Linux внизу часто **iptables** (или nftables). **UFW** (Uncomplicated Firewall) — проще: правила вроде «разрешить SSH», «разрешить HTTP/HTTPS» без ручного iptables.

    ### UFW – основное

    - **Включить firewall:** `sudo ufw enable`
    - **Разрешить SSH (до enable!):** `sudo ufw allow 22/tcp` или `sudo ufw allow ssh`
    - **HTTP и HTTPS:** `sudo ufw allow 80/tcp` и `sudo ufw allow 443/tcp`
    - **Статус:** `sudo ufw status` (или `status verbose`)
    - **Default policy:** `sudo ufw default deny incoming` и `sudo ufw default allow outgoing`

    Закрыли SSH (порт 22) без другого доступа — **lockout**. Всегда разрешайте SSH перед `ufw enable`.

    ### iptables (кратко)

    **iptables** — более низкоуровневые правила. UFW записывает iptables за вас. На новых системах может быть **nftables**, смысл тот же: порт, протокол, source IP.

    ---

    ## Информационная безопасность – NIS2 и CRA

    На Дне 2 нужно объяснить **основы NIS2 и CRA** — цель и применение в компании.

    ### NIS2 (Network and Information Security Directive 2)

    - **Цель:** EU-директива о **сетевой и информационной безопасности**. Требования к риск-менеджменту, отчётам об инцидентах, техническим и организационным мерам.
    - **В компании:** организации под NIS2 (энергетика, транспорт, здравоохранение, цифровая инфраструктура, часть госсектора) — меры безопасности и отчётность о серьёзных инцидентах. Влияет на приоритеты безопасности, документацию, incident handling.

    ### CRA (Cyber Resilience Act)

    - **Цель:** EU-регуляция **безопасности продуктов с цифровым содержимым** (ПО, IoT). Продукты безопасны «из коробки», уязвимости обрабатываются по жизненному циклу.
    - **В компании:** разработчики/продавцы ПО — риск-оценка, обновления безопасности, документация. Влияет на разработку, цепочку поставок, патчи.

    Кратко: **NIS2** — безопасность **организации**; **CRA** — безопасность **продукта**. Оба поддерживают firewall, обновления, контроль рисков — как на сервере и домене сейчас.

    ---

    ## Цели обучения (итог)

    1. Настроить DNS-records (A, CNAME) и привязать домен к серверу.
    2. Настроить и протестировать firewall (UFW / iptables).
    3. Использовать Cloudflare для защиты и трафика.
    4. Объяснить основы NIS2 и CRA в компании.

# День 2 – Домен, DNS и Firewall

---

# 1. Домены и Subdomains

## Что такое домен?

**Домен** — понятный адрес в браузере. DNS переводит его в IP, по которому компьютеры находят сервер.

```mermaid
graph LR
    A["Пользователь вводит:<br>www.mercantec.dk"] --> B["DNS переводит<br>в IP-адрес"]
    B --> C["IP сервера:<br>192.0.2.42"]
    C --> D["Сайт открыт! ✅"]
```

## Иерархия доменов

Домены — дерево от root до subdomains:

```mermaid
graph TD
    Root[". Root"] --> TLD1[".com"]
    Root --> TLD2[".dk"]
    Root --> TLD3[".tech"]
    TLD2 --> SLD1["mercantec.dk"]
    TLD3 --> SLD2["mercantec.tech"]
    SLD1 --> SUB1["www.mercantec.dk"]
    SLD1 --> SUB2["mail.mercantec.dk"]
    SLD2 --> SUB3["jeresprojekt.mercantec.tech"]
    SLD2 --> SUB4["gruppe2.mercantec.tech"]
```

**TLD** = Top-Level Domain (например `.dk`, `.com`, `.tech`)

**SLD** = Second-Level Domain (например `mercantec`)

**Subdomain** = часть спереди (например `www`, `mail`, `jeresprojekt`)

---

# 2. DNS – Domain Name System

## Полный DNS-запрос

Когда вы вводите `jeresprojekt.mercantec.tech` в браузере:

```mermaid
sequenceDiagram
    participant B as 🖥️ Browser
    participant C as 💾 DNS Cache (ваш ПК)
    participant R as 🔄 Recursive Resolver (провайдер)
    participant Ro as 🌍 Root Nameserver
    participant T as 📋 TLD Nameserver (.tech)
    participant CF as ☁️ Cloudflare NS (авторитативный)
    B->>C: Знаешь mercantec.tech?
    C-->>B: Нет, не в кэше
    B->>R: Найти mercantec.tech
    R->>Ro: Кто знает .tech?
    Ro-->>R: Спроси TLD-сервер
    R->>T: Кто знает mercantec.tech?
    T-->>R: Nameserver Cloudflare
    R->>CF: IP для jeresprojekt.mercantec.tech?
    CF-->>R: 192.0.2.42 (TTL: 300s)
    R-->>B: IP = 192.0.2.42
    B->>B: Сохранить в кэш (300 сек)
```

## DNS Cache и TTL

**TTL (Time To Live)** — как долго ответ DNS хранится в кэше:

```mermaid
graph LR
    A["DNS record обновлён<br>в Cloudflare"] --> B{"Кто-то уже<br>закэшировал?"}
    B -->|Да| C["Старый ответ<br>пока TTL не истёк"]
    B -->|Нет| D["Новый ответ<br>сразу"]
    C --> E["TTL = 300 сек<br>→ ~5 мин ожидания"]
    C --> F["TTL = 86400 сек<br>→ до 24 часов!"]
    D --> G["Пользователи видят новый IP ✅"]
    E --> G
```

**Совет для deployment:** Поставьте TTL низко (300) **ДО** смены IP сервера — обновление быстрее!

📺 **Video: What is DNS? – NetworkChuck**

https://www.youtube.com/watch?v=NiQTs9DbtW4

---

# 3. DNS Records – подробно

## Типы records — обзор

```mermaid
graph TD
    DNS["🗂️ DNS Records"] --> A_rec["A Record<br>Имя → IPv4"]
    DNS --> AAAA["AAAA Record<br>Имя → IPv6"]
    DNS --> CNAME["CNAME Record<br>Alias → Имя"]
    DNS --> MX["MX Record<br>Почтовый сервер"]
    DNS --> TXT["TXT Record<br>Верификация / SPF"]
    DNS --> NS["NS Record<br>Nameserver"]
    DNS --> CAA["CAA Record<br>Разрешение SSL"]
    A_rec --> ex1["jeresprojekt → 192.0.2.42"]
    CNAME --> ex2["www → jeresprojekt.mercantec.tech"]
    MX --> ex3["10 mail.provider.com"]
    TXT --> ex4["v=spf1 include:... ~all"]
```

## A Record vs CNAME – когда что

```mermaid
graph LR
    A{"Нужен IP?"}
    A -->|Да| B["A Record<br>имя @ → IP"]
    A -->|Нет| C{"Указываете на<br>другое доменное имя?"}
    C -->|Да| D["CNAME<br>alias → домен"]
    C -->|Нет| E["TXT/MX<br>другие цели"]
    B --> B1["Пример:<br>jeresprojekt → 192.0.2.42"]
    D --> D1["Пример:<br>www → jeresprojekt.mercantec.tech"]
```

**Важно:** CNAME **нельзя** на root (`@`) — нужен A Record!

---

# 4. Cloudflare – Setup и архитектура

## Роль Cloudflare как proxy и DNS

```mermaid
graph LR
    U["👤 Пользователь"] -->|HTTPS request| CF["☁️ Cloudflare"]
    CF -->|DDoS check| CF
    CF -->|Cache check| CF
    CF -->|Proxied request| S["🖥️ Ваш сервер<br>192.0.2.42"]
    S -->|Response| CF
    CF -->|Cached/Protected response| U
    CF2["🔒 SSL к пользователю"] -.-> CF
    CF3["🛡️ DDoS защита"] -.-> CF
    CF4["⚡ CDN caching"] -.-> CF
    CF5["🔐 Скрывает ваш IP"] -.-> CF
```

## Proxied (🟠) vs DNS Only (⚫)

```mermaid
graph TD
    subgraph Proxied ["🟠 Proxied – Orange sky"]
        P1["Трафик через Cloudflare"]
        P2["DDoS защита ✅"]
        P3["SSL к пользователям ✅"]
        P4["Ваш IP скрыт ✅"]
        P5["Caching ✅"]
    end
    subgraph DNSOnly ["⚫ DNS Only – Grey sky"]
        D1["Трафик напрямую на сервер"]
        D2["Нет DDoS защиты ❌"]
        D3["SSL настраиваете сами"]
        D4["Ваш IP виден ❌"]
        D5["Нет caching ❌"]
    end
    Rec["💡 Рекомендация: Proxied,<br>если нет веской причины для DNS Only"]
    Proxied --> Rec
    DNSOnly --> Rec
```

## Перенос nameserver: Simply → Cloudflare

```mermaid
sequenceDiagram
    participant S as 🏪 Simply (registrar)
    participant CF as ☁️ Cloudflare
    participant U as 👤 Вы
    U->>CF: Добавить домен в Cloudflare
    CF-->>U: Nameserver:<br>ada.ns.cloudflare.com<br>bob.ns.cloudflare.com
    U->>S: Обновить NS на Cloudflare
    S-->>S: Сохранить NS
    Note over S,CF: Propagation: 15 мин – 24 ч
    CF-->>U: Status: Active ✅
    Note over CF,U: Все DNS records<br>теперь в Cloudflare!
```

## DNS в Cloudflare – workflow

```mermaid
graph TD
    A["Войти в Cloudflare"] --> B["Выбрать домен<br>fx mercantec.tech"]
    B --> C["DNS → Records"]
    C --> D["Add record"]
    D --> E{"Что настраиваете?"}
    E -->|Subdomain для app| F["Type: A<br>Name: jeresprojekt<br>IPv4: din-server-ip<br>Proxy: 🟠 Proxied"]
    E -->|Alias| G["Type: CNAME<br>Name: www<br>Target: jeresprojekt.mercantec.tech"]
    E -->|Верификация| H["Type: TXT<br>Name: @<br>Content: verify=abc123"]
    F --> I["Сохранить — через<br>несколько минут ✅"]
    G --> I
    H --> I
```

---

# 5. Firewall – UFW и iptables

## Что такое firewall?

Firewall — «охранник» сетевого трафика:

```mermaid
graph LR
    I1["🌐 HTTP port 80"] -->|Разрешено ✅| FW["🛡️ FIREWALL"]
    I2["🔒 HTTPS port 443"] -->|Разрешено ✅| FW
    I3["🔑 SSH port 22"] -->|Разрешено ✅| FW
    I4["🗄️ Database port 5432"] -->|ЗАБЛОКИРОВАНО ❌| FW
    I5["🚪 Port 8080"] -->|ЗАБЛОКИРОВАНО ❌| FW
    FW --> S["🖥️ Ваш сервер"]
```

## UFW – workflow команд

```mermaid
graph TD
    Start["Новый сервер — без firewall"] --> A["sudo ufw default deny incoming"]
    A --> B["sudo ufw default allow outgoing"]
    B --> C["sudo ufw allow 22/tcp<br>⚠️ ВАЖНО: SSH СНАЧАЛА!"]
    C --> D["sudo ufw allow 80/tcp<br>HTTP"]
    D --> E["sudo ufw allow 443/tcp<br>HTTPS"]
    E --> F["sudo ufw enable"]
    F --> G["sudo ufw status verbose"]
    G --> H["✅ Firewall активен!"]
    C2["Забыли SSH allow"] --> LOCKED["💀 Lockout с сервера!"]
```

## UFW – входящий трафик

```mermaid
graph TD
    P["Входящий пакет"] --> R1{"ALLOW 22/tcp?"}
    R1 -->|Да, port 22| ALLOW1["✅ SSH"]
    R1 -->|Нет| R2{"ALLOW 80/tcp?"}
    R2 -->|Да, port 80| ALLOW2["✅ HTTP"]
    R2 -->|Нет| R3{"ALLOW 443/tcp?"}
    R3 -->|Да, port 443| ALLOW3["✅ HTTPS"]
    R3 -->|Нет| DEF["Default policy:<br>DENY incoming"]
    DEF --> DROP["❌ Пакет отклонён"]
```

## Структура iptables (для любопытных)

UFW пишет правила iptables за вас:

```mermaid
graph LR
    PKT["📦 Пакет"] --> IN["INPUT chain<br>→ приложения на сервере"]
    PKT --> FWD["FORWARD chain<br>→ пересылка"]
    APP["🖥️ Приложение"] --> OUT["OUTPUT chain<br>→ в сеть"]
    IN --> APP
```

**Вывод:** UFW — простой интерфейс к iptables. Синтаксис iptables для UFW не обязателен.

📺 **Video: What is a Firewall?**

https://www.youtube.com/watch?v=kDEX1HXybrU

---

# 6. NIS2 и CRA – рамки безопасности

## NIS2 vs CRA

```mermaid
graph LR
    subgraph NIS2box ["📜 NIS2"]
        N1["Кто: организации<br>в критических секторах"]
        N2["Фокус: сеть и<br>информационная безопасность"]
        N3["Требования: риски,<br>отчёты об инцидентах"]
    end
    subgraph CRAbox ["🔒 CRA"]
        C1["Кто: производители<br>цифровых продуктов"]
        C2["Фокус: безопасность<br>продукта"]
        C3["Требования: дизайн,<br>патчи, документация"]
    end
    BOTH["🎯 Общая цель:<br>кибербезопасность EU"]
    NIS2box --> BOTH
    CRAbox --> BOTH
```

**Правило:**

- **NIS2** = безопасность **организации** (процессы, сеть, инциденты)
- **CRA** = безопасность **продукта**, который вы делаете/продаёте (код, обновления, документация)

---

# 7. Общая картина – Deployment Flow

Как связаны DNS, Cloudflare и Firewall:

```mermaid
sequenceDiagram
    participant U as 👤 Пользователь
    participant CF as ☁️ Cloudflare
    participant FW as 🛡️ Firewall (UFW)
    participant NGX as 🌐 Nginx
    participant APP as 🚀 Ваше приложение
    U->>CF: https://jeresprojekt.mercantec.tech
    Note over CF: DNS → IP из A-record<br>DDoS + SSL
    CF->>FW: Запрос на port 443
    Note over FW: Правило: ALLOW 443/tcp ✅
    FW->>NGX: Nginx
    Note over NGX: Virtual host = домен
    NGX->>APP: Reverse proxy port 3000
    APP-->>NGX: HTTP Response
    NGX-->>CF: Response
    CF-->>U: HTTPS ✅
```

---

# 8. Отладка – «Домен не работает!»

```mermaid
graph TD
    START["Домен не работает 😟"] --> DNS_CHECK{"DNS на правильный IP?<br>dig jeresprojekt.mercantec.tech"}
    DNS_CHECK -->|Нет| FIX_DNS["Исправить A-record в Cloudflare"]
    DNS_CHECK -->|Да| PING{"Доступен<br>сервер?"}
    PING -->|Нет| FW_CHECK["Проверить firewall:<br>sudo ufw status"]
    PING -->|Да| NGINX{"Nginx запущен?"}
    NGINX -->|Нет| START_NGINX["sudo systemctl start nginx"]
    NGINX -->|Да| HTTPS{"Ошибка HTTPS?"}
    HTTPS -->|Да| CERT["sudo certbot certificates"]
    HTTPS -->|Нет| LOGS["sudo tail -f /var/log/nginx/error.log"]
    FIX_DNS --> WAIT["Ждать TTL (до ~5 мин)"]
```

---

# ✅ Чеклист целей обучения

- [ ]  Могу объяснить, что такое домен и subdomain
- [ ]  Могу объяснить DNS-запрос (browser → resolver → авторитативный NS)
- [ ]  Могу объяснить A и CNAME и когда их использовать
- [ ]  Могу настроить A-record в Cloudflare на мой сервер
- [ ]  Понимаю разницу Proxied и DNS Only в Cloudflare
- [ ]  Могу включить UFW и базовые правила
- [ ]  Могу объяснить default deny incoming и почему SSH **до** enable
- [ ]  Могу кратко объяснить NIS2 и CRA и разницу между ними

---

## Команды (практика)

> Конфиг VM (IP, пароли, статус): `SERVER_INFO.md`

### UFW (на сервере, как `andrii`)

```bash
# Сначала allow 22, потом enable — иначе lockout SSH

sudo ufw status verbose
# Status: inactive = выключен · Status: active = правила работают

sudo ufw default deny incoming    # блокировать вход снаружи (кроме allow)
sudo ufw default allow outgoing   # исходящие (apt, DNS) — разрешены

sudo ufw allow 22/tcp             # SSH — обязательно до enable
sudo ufw allow 80/tcp             # HTTP
sudo ufw allow 443/tcp            # HTTPS

sudo ufw enable                   # включить (подтвердить y)
sudo ufw status verbose           # ожидаем: active + 22/80/443 ALLOW
```

Проверка с Mac **в новом** терминале:

```bash
ssh mercantec-andrii
```

### DNS / домен (Mac)

```bash
dig +short andrii.mercantec.tech
# tunnel: часто IP Cloudflare — нормально; A-record не настраиваем сами

curl -I https://andrii.mercantec.tech
# работает когда cloudflared + сервис на localhost:8080
```
