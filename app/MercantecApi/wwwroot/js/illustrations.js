/**
 * Deploy Course Helper — metaphor illustrations (one per term id).
 * Each topic uses a simple visual story, not a tech diagram.
 */

function scene(label, body) {
  return `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#dbeafe"/><stop offset="100%" stop-color="#f8fafc"/>
    </linearGradient>
    <linearGradient id="whale" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
    <filter id="soft" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#0f172a" flood-opacity="0.12"/>
    </filter>
    <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8"/>
    </marker>
  </defs>
  <rect width="720" height="300" fill="url(#sky)"/>
  ${body}
</svg>`;
}

// Auto-sizing speech bubble: grows to fit the text at full font size and
// stays inside the 720-wide canvas, so long captions never clip.
function bubble(x, y, w, text) {
  const fs = 15;
  const center = x + w / 2;
  const needed = text.length * fs * 0.56 + 28;
  const bw = Math.max(w, needed);
  const bx = Math.max(8, Math.min(center - bw / 2, 712 - bw));
  const cx = bx + bw / 2;
  return `<rect x="${bx}" y="${y}" width="${bw}" height="38" rx="11" fill="#fff" stroke="#cbd5e1"/>
  <text x="${cx}" y="${y + 24}" text-anchor="middle" font-size="${fs}" fill="#334155">${text}</text>`;
}

function arrow(x1, y1, x2, y2, label) {
  const mid = (x1 + x2) / 2;
  return `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="#94a3b8" stroke-width="2.5" marker-end="url(#arr)"/>
  ${label ? `<text x="${mid}" y="${y1 - 9}" text-anchor="middle" font-size="13" fill="#64748b">${label}</text>` : ""}`;
}

function emojiBox(x, y, w, h, emoji, title, sub) {
  return `<g filter="url(#soft)">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#fff" stroke="#cbd5e1" stroke-width="2"/>
    <text x="${x + w / 2}" y="${y + h * 0.44}" text-anchor="middle" font-size="${Math.min(h * 0.34, 38)}">${emoji}</text>
    <text x="${x + w / 2}" y="${y + h * 0.73}" text-anchor="middle" font-size="15" fill="#334155" font-weight="700">${title}</text>
    ${sub ? `<text x="${x + w / 2}" y="${y + h * 0.89}" text-anchor="middle" font-size="13" fill="#64748b">${sub}</text>` : ""}
  </g>`;
}

// Containers ride on the whale's back: each box is sized for its label,
// the row is centered over the whale, and the icon+label sit inside the box.
function whale(x, y, w, boxes) {
  const list = boxes || [];
  const cx = x + w * 0.45, cy = y + w * 0.4;
  const ry = w * 0.17;
  const bw = 72, bh = 48, gap = 14;
  const totalW = list.length * bw + Math.max(0, list.length - 1) * gap;
  const startX = cx - totalW / 2;
  const boxY = cy - ry - bh - 6;
  const cont = list.map((c, i) => {
    const bx = startX + i * (bw + gap);
    return `<g>
      <rect x="${bx}" y="${boxY}" width="${bw}" height="${bh}" rx="8" fill="#fff" stroke="#2563eb" stroke-width="2"/>
      <text x="${bx + bw / 2}" y="${boxY + 26}" text-anchor="middle" font-size="20">${c.icon}</text>
      <text x="${bx + bw / 2}" y="${boxY + 41}" text-anchor="middle" font-size="13" fill="#475569" font-weight="600">${c.label}</text>
    </g>`;
  }).join("");
  return `<g filter="url(#soft)">${cont}
    <ellipse cx="${cx}" cy="${cy}" rx="${w * 0.36}" ry="${ry}" fill="url(#whale)"/>
    <circle cx="${cx - w * 0.26}" cy="${cy - w * 0.03}" r="${w * 0.035}" fill="#fff"/>
    <circle cx="${cx - w * 0.255}" cy="${cy - w * 0.03}" r="${w * 0.018}" fill="#0f172a"/>
    <text x="${cx}" y="${cy + ry + 20}" text-anchor="middle" font-size="15" fill="#1e40af" font-weight="700">Docker</text>
  </g>`;
}

function daemon(x, y) {
  return `<g filter="url(#soft)">
    <rect x="${x}" y="${y}" width="80" height="95" rx="12" fill="#6366f1" stroke="#4338ca" stroke-width="2"/>
    <rect x="${x + 14}" y="${y + 18}" width="52" height="32" rx="6" fill="#e0e7ff"/>
    <circle cx="${x + 28}" cy="${y + 34}" r="5" fill="#22c55e"/><circle cx="${x + 52}" cy="${y + 34}" r="5" fill="#22c55e"/>
    <text x="${x + 40}" y="${y + 114}" text-anchor="middle" font-size="13" fill="#4338ca" font-weight="700">dockerd</text>
  </g>`;
}

// Terminal box is wide enough for a short command at a legible size.
function cli(x, y, cmd) {
  return `<g filter="url(#soft)">
    <circle cx="${x + 20}" cy="${y + 14}" r="15" fill="#fcd34d" stroke="#f59e0b" stroke-width="2"/>
    <rect x="${x}" y="${y + 34}" width="116" height="40" rx="8" fill="#1e293b"/>
    <text x="${x + 9}" y="${y + 59}" font-size="14" fill="#4ade80" font-family="monospace">$ ${cmd}</text>
    <text x="${x + 20}" y="${y + 92}" text-anchor="middle" font-size="13" fill="#1e40af" font-weight="700">CLI</text>
  </g>`;
}

/** Compose = shared environment / island where containers live together */
function composeIsland(x, y, w, h) {
  return `<g filter="url(#soft)">
    <ellipse cx="${x + w / 2}" cy="${y + h * 0.72}" rx="${w * 0.48}" ry="${h * 0.22}" fill="#86efac" stroke="#16a34a" stroke-width="2"/>
    <ellipse cx="${x + w / 2}" cy="${y + h * 0.68}" rx="${w * 0.42}" ry="${h * 0.16}" fill="#bbf7d0"/>
    <text x="${x + w / 2}" y="${y + 20}" text-anchor="middle" font-size="15" fill="#166534" font-weight="700">Compose-miljø</text>
    <text x="${x + w / 2}" y="${y + 36}" text-anchor="middle" font-size="13" fill="#64748b">containers bor sammen her</text>
    ${emojiBox(x + w * 0.1, y + h * 0.4, w * 0.34, h * 0.36, "🚀", "app", "service")}
    ${emojiBox(x + w * 0.56, y + h * 0.4, w * 0.34, h * 0.36, "🐘", "db", "service")}
    <path d="M${x + w * 0.44} ${y + h * 0.58} L${x + w * 0.56} ${y + h * 0.58}" stroke="#2563eb" stroke-width="2" stroke-dasharray="5 3"/>
    <text x="${x + w / 2}" y="${y + h * 0.64}" text-anchor="middle" font-size="13" fill="#2563eb">compose net</text>
  </g>`;
}

/** SSH = locker on server door */
function lockerScene() {
  return scene("SSH", `
    ${emojiBox(50, 110, 90, 85, "💻", "Mac", "dig")}
    ${arrow(145, 150, 195, 150, "port 22")}
    <g filter="url(#soft)">
      <rect x="200" y="70" width="130" height="170" rx="10" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/>
      <rect x="220" y="90" width="90" height="80" rx="6" fill="#94a3b8"/>
      <circle cx="265" cy="130" r="22" fill="#fbbf24" stroke="#d97706" stroke-width="3"/>
      <rect x="255" y="118" width="20" height="24" rx="4" fill="#fde68a" stroke="#d97706"/>
      <circle cx="265" cy="126" r="4" fill="#92400e"/>
      <text x="265" y="205" text-anchor="middle" font-size="14" fill="#334155" font-weight="700">VM-dør</text>
      <text x="265" y="224" text-anchor="middle" font-size="13" fill="#64748b">låst med nøgle</text>
    </g>
    <g filter="url(#soft)">
      <text x="400" y="130" font-size="36">🔑</text>
      <text x="400" y="160" font-size="13" fill="#854d0e">privat nøgle</text>
      <text x="400" y="175" font-size="13" fill="#64748b">kun på Mac</text>
    </g>
    ${arrow(335, 140, 385, 140)}
    ${bubble(460, 55, 230, "SSH = sikker tunnel + lås")}
  `);
}

const ILLUSTRATIONS = {
  ssh: lockerScene(),

  "ssh-keys": scene("SSH keys", `
    ${emojiBox(80, 90, 140, 120, "🔑", "Privat nøgle", "bliv på Mac")}
    ${emojiBox(280, 90, 140, 120, "🗝️", "Offentlig nøgle", "authorized_keys")}
    ${arrow(225, 150, 275, 150, "hører sammen")}
    ${emojiBox(480, 90, 140, 120, "🚪", "VM", "åbner kun med par")}
    ${bubble(180, 230, 360, "Nøglen sendes aldrig over nettet")}
  `),

  "vm-basics": scene("VM", `
    ${bubble(220, 40, 280, "VM = mini-computer i datacentret")}
    <g filter="url(#soft)">
      <rect x="180" y="85" width="360" height="150" rx="16" fill="#f1f5f9" stroke="#64748b" stroke-width="2"/>
      <text x="360" y="140" text-anchor="middle" font-size="48">🏠</text>
      <text x="360" y="175" text-anchor="middle" font-size="16" fill="#334155" font-weight="700">Hele huset = VM</text>
      <text x="360" y="198" text-anchor="middle" font-size="13" fill="#64748b">Ubuntu = operativsystemet inde i huset</text>
      <text x="360" y="218" text-anchor="middle" font-size="13" fill="#94a3b8">Containere = rum inde i huset (senere)</text>
    </g>
  `),

  "vm-hardening": scene("Hardening", `
    <g filter="url(#soft)">
      <rect x="200" y="55" width="320" height="175" rx="16" fill="#fef2f2" stroke="#ef4444" stroke-width="2"/>
      <text x="360" y="110" text-anchor="middle" font-size="44">🏰</text>
      <text x="360" y="145" text-anchor="middle" font-size="15" fill="#334155" font-weight="700">Færre åbne døre</text>
      <text x="360" y="168" text-anchor="middle" font-size="13" fill="#dc2626">❌ root · ❌ password-login</text>
      <text x="360" y="188" text-anchor="middle" font-size="13" fill="#16a34a">✅ SSH-nøgle · ✅ UFW</text>
      <text x="360" y="210" text-anchor="middle" font-size="13" fill="#64748b">Hardening = gør huset sværere at bryde ind i</text>
    </g>
  `),

  "dns-basics": scene("DNS", `
    ${emojiBox(60, 100, 120, 100, "📖", "DNS", "telefonbog")}
    ${arrow(185, 150, 240, 150, "andrii.mercantec.tech?")}
    ${emojiBox(245, 100, 120, 100, "☁️", "Cloudflare", "svar: herhen!")}
    ${arrow(370, 150, 425, 150)}
    ${emojiBox(430, 100, 120, 100, "🖥️", "Din VM", "via tunnel")}
    ${bubble(200, 220, 320, "Navn → adresse (ikke altid VM's IP)")}
  `),

  cloudflared: scene("cloudflared", `
    ${emojiBox(40, 110, 100, 90, "☁️", "Cloudflare", "")}
    ${arrow(145, 155, 200, 155, "tunnel")}
    <g filter="url(#soft)">
      <rect x="205" y="115" width="90" height="70" rx="10" fill="#e0f2fe" stroke="#0ea5e9" stroke-width="2"/>
      <text x="250" y="155" text-anchor="middle" font-size="28">🕳️</text>
      <text x="250" y="200" text-anchor="middle" font-size="13" fill="#0369a1" font-weight="700">cloudflared</text>
    </g>
    ${arrow(300, 155, 355, 155)}
    ${emojiBox(360, 110, 100, 90, "🚦", "nginx", ":8080")}
    ${bubble(470, 50, 220, "Udgående forbindelse — ingen åben 8080 i UFW")}
  `),

  ufw: scene("UFW", `
    <g filter="url(#soft)">
      <rect x="260" y="65" width="200" height="155" rx="14" fill="#fee2e2" stroke="#ef4444" stroke-width="3"/>
      <text x="360" y="125" text-anchor="middle" font-size="52">🛡️</text>
      <text x="360" y="165" text-anchor="middle" font-size="15" fill="#b91c1c" font-weight="700">Portvagt UFW</text>
      <text x="360" y="188" text-anchor="middle" font-size="13" fill="#64748b">"Har du tilladelse?"</text>
    </g>
    <text x="90" y="120" font-size="13" fill="#16a34a">✅ 22 SSH</text>
    <text x="90" y="142" font-size="13" fill="#16a34a">✅ 80/443</text>
    ${arrow(175, 130, 255, 130)}
    <text x="520" y="120" font-size="13" fill="#dc2626">❌ 5432</text>
    <text x="520" y="142" font-size="13" fill="#dc2626">❌ 8080</text>
    ${arrow(465, 130, 515, 130)}
  `),

  "cloudflare-tunnel": scene("Tunnel", `
    ${emojiBox(30, 115, 80, 80, "👤", "Bruger", "")}
    ${arrow(115, 155, 155, 155, "HTTPS")}
    ${emojiBox(160, 105, 100, 90, "☁️", "Cloudflare", "TLS")}
    ${arrow(265, 155, 310, 155)}
    <path d="M310 155 Q380 100 450 155" fill="none" stroke="#0ea5e9" stroke-width="4" stroke-dasharray="8 4"/>
    <text x="380" y="115" text-anchor="middle" font-size="13" fill="#0369a1">sikker tunnel</text>
    ${emojiBox(455, 105, 100, 90, "🖥️", "VM", "ingen public IP")}
    ${bubble(180, 220, 360, "Internet ser Cloudflare — ikke din skole-IP")}
  `),

  "docker-ecosystem": scene("Docker ecosystem", `
    ${cli(20, 110, "docker run")}
    ${arrow(140, 150, 205, 150, "1. besked")}
    ${daemon(210, 105)}
    ${arrow(295, 150, 360, 160, "2. bygger")}
    ${whale(375, 135, 175, [{ label: "container", icon: "📦" }])}
    ${bubble(70, 35, 580, "Du → CLI → daemon → container på Docker-hvalen")}
  `),

  "docker-cli": scene("CLI", `
    ${cli(50, 95, "compose up")}
    ${arrow(175, 140, 290, 140, "sender kommando")}
    ${daemon(295, 95)}
    ${bubble(395, 45, 295, "CLI = budbringeren du skriver til")}
    <text x="360" y="255" text-anchor="middle" font-size="13" fill="#64748b">docker run · docker build · docker compose</text>
  `),

  "docker-daemon": scene("Daemon", `
    ${daemon(120, 95)}
    ${arrow(205, 140, 280, 140, "styrer")}
    ${whale(295, 125, 175, [{ label: "job", icon: "⚙️" }])}
    ${bubble(60, 40, 600, "dockerd = motoren på VM der gør alt arbejdet")}
    <text x="360" y="260" text-anchor="middle" font-size="13" fill="#64748b">Pull · build · start/stop containers · kører som systemd-service</text>
  `),

  "docker-container": scene("Container", `
    ${whale(80, 110, 200, [{ label: "container", icon: "📦" }])}
    ${bubble(320, 50, 360, "Container = kasse på hvalen — app bor inde i kassen")}
    <g filter="url(#soft)">
      <rect x="340" y="100" width="160" height="120" rx="10" fill="#fff" stroke="#2563eb" stroke-width="2"/>
      <text x="420" y="145" text-anchor="middle" font-size="13" fill="#64748b">VM = hele huset</text>
      <text x="420" y="168" text-anchor="middle" font-size="13" fill="#64748b">Container = ét rum</text>
      <text x="420" y="191" text-anchor="middle" font-size="13" fill="#64748b">App = møbler i rummet</text>
    </g>
  `),

  "docker-image": scene("Image", `
    <g filter="url(#soft)">
      <rect x="80" y="70" width="150" height="160" rx="12" fill="#fff8e1" stroke="#f59e0b" stroke-width="2"/>
      <text x="155" y="105" text-anchor="middle" font-size="14" fill="#b45309" font-weight="700">Opskrift</text>
      <text x="155" y="130" text-anchor="middle" font-size="13" fill="#78716c" font-family="monospace">FROM · COPY</text>
      <text x="155" y="165" text-anchor="middle" font-size="36">📋</text>
      <text x="155" y="210" text-anchor="middle" font-size="13" fill="#64748b">image (frossen)</text>
    </g>
    ${arrow(235, 150, 295, 150, "docker run")}
    ${whale(300, 115, 170, [{ label: "container", icon: "🍽️" }])}
    ${bubble(480, 55, 210, "Image = skabelon · Container = den levende kopi")}
  `),

  "postgres-volume": scene("Volume", `
    ${whale(50, 115, 160, [{ label: "Postgres", icon: "🐘" }])}
    ${arrow(220, 155, 280, 155, "monterer")}
    <g filter="url(#soft)">
      <rect x="285" y="85" width="130" height="140" rx="10" fill="#dcfce7" stroke="#16a34a" stroke-width="3"/>
      <text x="350" y="125" text-anchor="middle" font-size="36">🗄️</text>
      <text x="350" y="160" text-anchor="middle" font-size="14" fill="#166534" font-weight="700">pgdata</text>
      <text x="350" y="180" text-anchor="middle" font-size="13" fill="#64748b">skab på væggen</text>
      <text x="350" y="200" text-anchor="middle" font-size="13" fill="#64748b">(udenfor kassen)</text>
    </g>
    ${bubble(440, 45, 250, "Slet container → data i volume overlever")}
  `),

  nginx: scene("Nginx", `
    ${emojiBox(40, 110, 90, 85, "🌐", "Besøgende", "")}
    ${arrow(135, 150, 200, 150)}
    <g filter="url(#soft)">
      <rect x="205" y="80" width="150" height="120" rx="14" fill="#dcfce7" stroke="#16a34a" stroke-width="3"/>
      <text x="280" y="130" text-anchor="middle" font-size="40">🚦</text>
      <text x="280" y="165" text-anchor="middle" font-size="14" fill="#166534" font-weight="700">nginx</text>
      <text x="280" y="182" text-anchor="middle" font-size="13" fill="#64748b">portvagt / reception</text>
    </g>
    <text x="420" y="125" font-size="13" fill="#334155">/ → statisk fil</text>
    ${arrow(360, 140, 410, 125)}
    <text x="420" y="165" font-size="13" fill="#334155">/api/ → app :5000</text>
    ${arrow(360, 155, 410, 160)}
  `),

  "https-edge": scene("HTTPS", `
    ${emojiBox(60, 110, 90, 85, "👤", "Bruger", "")}
    <g filter="url(#soft)">
      <rect x="180" y="100" width="360" height="80" rx="12" fill="#dcfce7" stroke="#22c55e" stroke-width="3"/>
      <text x="360" y="150" text-anchor="middle" font-size="36">🔒</text>
    </g>
    ${emojiBox(560, 110, 90, 85, "☁️", "Cloudflare", "HTTPS")}
    ${bubble(160, 210, 400, "Krypteret vej — Certbot på VM ikke nødvendig")}
  `),

  "reverse-proxy": scene("Reverse proxy", `
    ${emojiBox(50, 115, 85, 80, "👤", "Én dør", "domæne")}
    ${arrow(140, 155, 195, 155)}
    <g filter="url(#soft)">
      <rect x="200" y="85" width="140" height="110" rx="12" fill="#e0e7ff" stroke="#6366f1" stroke-width="2"/>
      <text x="270" y="135" text-anchor="middle" font-size="36">🧭</text>
      <text x="270" y="168" text-anchor="middle" font-size="13" fill="#4338ca" font-weight="700">nginx videresender</text>
    </g>
    <text x="400" y="130" font-size="13" fill="#334155">/ → HTML</text>
    ${arrow(345, 135, 395, 128)}
    <text x="400" y="165" font-size="13" fill="#334155">/api/ → Kestrel</text>
    ${arrow(345, 160, 395, 163)}
    ${emojiBox(500, 110, 90, 85, "🚀", "App", ":5000")}
  `),

  dockerfile: scene("Dockerfile", `
    ${cli(20, 105, "build .")}
    ${arrow(140, 150, 185, 150)}
    ${daemon(190, 100)}
    ${arrow(275, 150, 320, 150)}
    <g filter="url(#soft)">
      <rect x="325" y="75" width="115" height="140" rx="10" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="382" y="110" text-anchor="middle" font-size="14" fill="#92400e" font-weight="700">Dockerfile</text>
      <text x="382" y="160" text-anchor="middle" font-size="40">👨‍🍳</text>
      <text x="382" y="198" text-anchor="middle" font-size="13" fill="#64748b">kok laver image</text>
    </g>
    ${arrow(445, 150, 495, 160)}
    ${whale(500, 130, 160, [{ label: "image", icon: "📦" }])}
  `),

  "docker-compose": scene("Compose environment", `
    ${cli(20, 90, "compose up")}
    ${arrow(140, 130, 185, 130)}
    ${daemon(190, 85)}
    ${arrow(275, 135, 310, 145)}
    ${composeIsland(315, 50, 380, 195)}
    ${bubble(20, 235, 410, "Compose = fælles miljø hvor app og db lever sammen")}
  `),

  "github-actions": scene("CI", `
    ${emojiBox(50, 110, 100, 90, "📤", "git push", "")}
    ${arrow(155, 155, 210, 155)}
    <g filter="url(#soft)">
      <rect x="215" y="85" width="160" height="120" rx="12" fill="#f1f5f9" stroke="#64748b" stroke-width="2"/>
      <text x="295" y="135" text-anchor="middle" font-size="40">🏭</text>
      <text x="295" y="170" text-anchor="middle" font-size="13" fill="#334155" font-weight="700">GitHub Actions</text>
      <text x="295" y="188" text-anchor="middle" font-size="13" fill="#64748b">CI = kvalitetskontrol</text>
    </g>
    ${arrow(380, 155, 435, 155)}
    ${emojiBox(440, 110, 100, 90, "✅", "Build OK", "eller ❌")}
    ${bubble(180, 220, 360, "Tjekker at image kan bygges — rører ikke VM")}
  `),

  dokploy: scene("Dokploy", `
    <g filter="url(#soft)">
      <rect x="200" y="55" width="320" height="170" rx="16" fill="#eef2ff" stroke="#6366f1" stroke-width="3"/>
      <text x="360" y="115" text-anchor="middle" font-size="48">🎛️</text>
      <text x="360" y="155" text-anchor="middle" font-size="16" fill="#4338ca" font-weight="700">Dokploy-panel</text>
      <rect x="300" y="170" width="120" height="36" rx="8" fill="#6366f1"/>
      <text x="360" y="193" text-anchor="middle" font-size="13" fill="#fff" font-weight="600">DEPLOY</text>
    </g>
    ${bubble(80, 235, 280, "Deploy-knap på VM i stedet for ssh")}
  `),

  webhook: scene("Webhook", `
    ${emojiBox(60, 110, 110, 90, "🐙", "GitHub", "push!")}
    ${arrow(175, 155, 240, 155, "råber")}
    <g filter="url(#soft)">
      <rect x="245" y="100" width="100" height="80" rx="10" fill="#fef9c3" stroke="#eab308" stroke-width="2"/>
      <text x="295" y="148" text-anchor="middle" font-size="32">📣</text>
      <text x="295" y="195" text-anchor="middle" font-size="13" fill="#854d0e">webhook URL</text>
    </g>
    ${arrow(350, 155, 415, 155)}
    ${emojiBox(420, 110, 110, 90, "🎛️", "Dokploy", "deploy")}
    ${bubble(150, 220, 420, "Content-Type skal være application/json")}
  `),

  "kubernetes-pod": scene("Kubernetes", `
    <g filter="url(#soft)">
      <ellipse cx="360" cy="155" rx="220" ry="75" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
      <text x="360" y="100" text-anchor="middle" font-size="14" fill="#1d4ed8" font-weight="700">K8s cluster = børnehave for pods</text>
      <circle cx="260" cy="160" r="30" fill="#fff" stroke="#2563eb" stroke-width="2"/>
      <text x="260" y="166" text-anchor="middle" font-size="20">📦</text>
      <circle cx="360" cy="160" r="30" fill="#fff" stroke="#2563eb" stroke-width="2"/>
      <text x="360" y="166" text-anchor="middle" font-size="20">📦</text>
      <circle cx="460" cy="160" r="30" fill="#fff" stroke="#2563eb" stroke-width="2"/>
      <text x="460" y="166" text-anchor="middle" font-size="20">📦</text>
      <text x="360" y="210" text-anchor="middle" font-size="13" fill="#64748b">Vi bruger Compose + Dokploy i praksis</text>
    </g>
  `),

  "pg-dump": scene("Backup", `
    ${emojiBox(80, 100, 120, 100, "🐘", "Postgres", "live data")}
    ${arrow(205, 150, 270, 150, "pg_dump")}
    <g filter="url(#soft)">
      <rect x="275" y="95" width="130" height="110" rx="10" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="340" y="140" text-anchor="middle" font-size="36">📄</text>
      <text x="340" y="175" text-anchor="middle" font-size="13" fill="#92400e" font-weight="700">backup.sql</text>
      <text x="340" y="192" text-anchor="middle" font-size="13" fill="#64748b">kopi udenfor volume</text>
    </g>
    ${emojiBox(450, 100, 120, 100, "🏦", "Sikker kopi", "på VM")}
    ${bubble(150, 220, 420, "Volume = live · Backup = ekstra forsikring")}
  `),

  monitoring: scene("Monitoring", `
    <g filter="url(#soft)">
      <rect x="120" y="80" width="200" height="130" rx="12" fill="#f0fdf4" stroke="#22c55e" stroke-width="2"/>
      <text x="220" y="130" text-anchor="middle" font-size="40">🩺</text>
      <text x="220" y="165" text-anchor="middle" font-size="14" fill="#166534" font-weight="700">Monitoring</text>
      <text x="220" y="185" text-anchor="middle" font-size="13" fill="#64748b">"Lever det?"</text>
    </g>
    ${emojiBox(400, 80, 200, 130, "📊", "CPU · RAM · Status", "Dokploy dashboard")}
    ${bubble(200, 230, 320, "Dokploy = inde i VM")}
  `),

  logging: scene("Logging", `
    <g filter="url(#soft)">
      <rect x="200" y="70" width="320" height="160" rx="14" fill="#fffbeb" stroke="#f59e0b" stroke-width="2"/>
      <text x="360" y="120" text-anchor="middle" font-size="44">📔</text>
      <text x="360" y="160" text-anchor="middle" font-size="15" fill="#92400e" font-weight="700">App-dagbog</text>
      <text x="360" y="185" text-anchor="middle" font-size="13" fill="#64748b">stdout / stderr → Dokploy Logs</text>
      <text x="360" y="205" text-anchor="middle" font-size="13" fill="#dc2626">Log aldrig passwords!</text>
    </g>
  `),

  "uptime-kuma": scene("Uptime Kuma", `
    <g filter="url(#soft)">
      <circle cx="200" cy="140" r="55" fill="#f0fdf4" stroke="#22c55e" stroke-width="3"/>
      <text x="200" y="150" text-anchor="middle" font-size="40">🐕</text>
      <text x="200" y="210" text-anchor="middle" font-size="13" fill="#166534" font-weight="700">Uptime Kuma</text>
    </g>
    ${arrow(260, 140, 330, 140, "pinger hvert 60s")}
    ${emojiBox(335, 100, 150, 100, "🌐", "Din URL", "hele vejen")}
    ${bubble(120, 230, 480, "Hundehuset holder øje udefra — tunnel → nginx → app")}
  `),

  "owasp-top10": scene("OWASP", `
    <g filter="url(#soft)">
      <rect x="160" y="45" width="400" height="190" rx="14" fill="#fff" stroke="#ef4444" stroke-width="3"/>
      <text x="360" y="90" text-anchor="middle" font-size="16" fill="#b91c1c" font-weight="800">OWASP Top 10</text>
      <text x="360" y="120" text-anchor="middle" font-size="13" fill="#64748b">Opslagstavle over typiske web-fejl</text>
      <text x="220" y="150" font-size="20">🚫</text><text x="280" y="150" font-size="20">💉</text>
      <text x="340" y="150" font-size="20">⚙️</text><text x="400" y="150" font-size="20">📦</text>
      <text x="460" y="150" font-size="20">🔑</text>
      <text x="360" y="190" text-anchor="middle" font-size="13" fill="#64748b">Access · Injection · Config · Outdated · Auth …</text>
      <text x="360" y="215" text-anchor="middle" font-size="36">⚠️</text>
    </g>
  `),

  "security-headers": scene("Headers", `
    <g filter="url(#soft)">
      <rect x="180" y="70" width="360" height="150" rx="12" fill="#f8fafc" stroke="#334155" stroke-width="2"/>
      <text x="360" y="115" text-anchor="middle" font-size="40">✉️</text>
      <text x="360" y="150" text-anchor="middle" font-size="14" fill="#0f172a" font-weight="700">HTTP-svar med ekstra mærker</text>
      <text x="360" y="175" text-anchor="middle" font-size="13" fill="#16a34a">CSP · HSTS · X-Frame · X-Content-Type</text>
      <text x="360" y="195" text-anchor="middle" font-size="13" fill="#64748b">Browseren får regler med hvert svar</text>
    </g>
  `),

  "env-vs-secrets": scene("Secrets", `
    <g filter="url(#soft)">
      <rect x="80" y="90" width="200" height="120" rx="12" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="180" y="140" text-anchor="middle" font-size="40">🔐</text>
      <text x="180" y="175" text-anchor="middle" font-size="13" fill="#166534" font-weight="700">.env / secrets</text>
      <text x="180" y="192" text-anchor="middle" font-size="13" fill="#64748b">passwords her ✅</text>
    </g>
    <g filter="url(#soft)">
      <rect x="440" y="90" width="200" height="120" rx="12" fill="#fee2e2" stroke="#ef4444" stroke-width="2"/>
      <text x="540" y="140" text-anchor="middle" font-size="40">📂</text>
      <text x="540" y="175" text-anchor="middle" font-size="13" fill="#b91c1c" font-weight="700">git repo</text>
      <text x="540" y="192" text-anchor="middle" font-size="13" fill="#64748b">aldrig secrets ❌</text>
    </g>
    ${bubble(220, 230, 280, "docker inspect kan læse env")}
  `),

  trivy: scene("Trivy", `
    ${whale(60, 115, 150, [{ label: "image", icon: "📦" }])}
    ${arrow(220, 155, 285, 155)}
    <g filter="url(#soft)">
      <circle cx="350" cy="140" r="55" fill="#fef2f2" stroke="#ef4444" stroke-width="2"/>
      <text x="350" y="150" text-anchor="middle" font-size="40">🔍</text>
      <text x="350" y="210" text-anchor="middle" font-size="13" fill="#b91c1c" font-weight="700">Trivy</text>
    </g>
    ${bubble(430, 50, 260, "Finder kendte huller (CVE) i image")}
  `),

  "non-root-container": scene("Non-root", `
    <g filter="url(#soft)">
      <rect x="200" y="80" width="140" height="120" rx="12" fill="#fee2e2" stroke="#ef4444" stroke-width="2"/>
      <text x="270" y="135" text-anchor="middle" font-size="40">👑</text>
      <text x="270" y="175" text-anchor="middle" font-size="13" fill="#b91c1c">root ❌</text>
    </g>
    ${arrow(345, 140, 395, 140)}
    <g filter="url(#soft)">
      <rect x="400" y="80" width="140" height="120" rx="12" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="470" y="135" text-anchor="middle" font-size="40">👤</text>
      <text x="470" y="175" text-anchor="middle" font-size="13" fill="#166534">appuser ✅</text>
    </g>
    ${bubble(180, 220, 360, "Mindre skade hvis nogen bryder ind")}
  `),

  ctf: scene("CTF", `
    <g filter="url(#soft)">
      <rect x="180" y="55" width="360" height="175" rx="16" fill="#fffbeb" stroke="#f59e0b" stroke-width="3"/>
      <text x="360" y="120" text-anchor="middle" font-size="48">🏁</text>
      <text x="360" y="160" text-anchor="middle" font-size="16" fill="#b45309" font-weight="700">Skattejagt i test-app</text>
      <text x="360" y="185" text-anchor="middle" font-size="13" fill="#64748b">Find FLAG{...} · kun med tilladelse</text>
      <text x="360" y="210" text-anchor="middle" font-size="13" fill="#64748b">recon → test → exploit → lær</text>
    </g>
  `),

  "sql-injection": scene("SQL injection", `
    ${emojiBox(60, 110, 100, 90, "😈", "Input", "' OR 1=1")}
    ${arrow(165, 155, 220, 155)}
    <g filter="url(#soft)">
      <rect x="225" y="85" width="150" height="120" rx="12" fill="#fee2e2" stroke="#ef4444" stroke-width="2"/>
      <text x="300" y="135" text-anchor="middle" font-size="40">🐘</text>
      <text x="300" y="175" text-anchor="middle" font-size="13" fill="#b91c1c">SQL bliver gift</text>
    </g>
    ${arrow(380, 155, 435, 155)}
    ${emojiBox(440, 110, 100, 90, "🛡️", "ORM", "parametre")}
    ${bubble(150, 220, 420, "Aldrig sæt brugerinput direkte i SQL-strenge")}
  `),

  "incident-response": scene("Incident", `
    ${["Detect", "Contain", "Fix", "Recover", "Learn"].map((s, i) => {
      const cx = 72 + i * 132;
      return `<g filter="url(#soft)">
        <circle cx="${cx}" cy="135" r="36" fill="#fff" stroke="#3b82f6" stroke-width="2"/>
        <text x="${cx}" y="130" text-anchor="middle" font-size="22">${["🔍", "🧱", "🔧", "♻️", "📚"][i]}</text>
        <text x="${cx}" y="152" text-anchor="middle" font-size="10" fill="#334155" font-weight="600">${s}</text>
      </g>${i < 4 ? `<path d="M${cx + 38} 135 L${cx + 92} 135" stroke="#94a3b8" stroke-width="2" marker-end="url(#arr)"/>` : ""}`;
    }).join("")}
    ${bubble(200, 210, 320, "Plan på forhånd — ikke panik")}
  `),

  "security-logs": scene("Security logs", `
    <g filter="url(#soft)">
      <circle cx="200" cy="135" r="50" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
      <text x="200" y="145" text-anchor="middle" font-size="40">🕵️</text>
      <text x="200" y="200" text-anchor="middle" font-size="13" fill="#1d4ed8" font-weight="700">Detektiv</text>
    </g>
    ${arrow(255, 135, 310, 135)}
    <g filter="url(#soft)">
      <rect x="315" y="85" width="200" height="120" rx="12" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>
      <text x="415" y="125" text-anchor="middle" font-size="13" fill="#64748b" font-family="monospace">404 404 404 …</text>
      <text x="415" y="145" text-anchor="middle" font-size="13" fill="#dc2626" font-family="monospace">401 401 401 …</text>
      <text x="415" y="175" text-anchor="middle" font-size="13" fill="#334155">nginx + Dokploy logs</text>
    </g>
    ${bubble(120, 230, 480, "Mange 404 = scanning · Mange 401 = brute force")}
  `)
};

// Legacy diagram keys → term illustrations
const ALIASES = {
  container: "docker-container",
  image: "docker-image",
  volume: "postgres-volume",
  compose: "docker-compose",
  tunnel: "cloudflare-tunnel",
  firewall: "ufw",
  vm: "vm-basics",
  cicd: "github-actions",
  headers: "security-headers",
  secrets: "env-vs-secrets",
  owasp: "owasp-top10",
  incident: "incident-response"
};

function renderIllustration(key) {
  const id = ALIASES[key] || key;
  const svg = ILLUSTRATIONS[id] || ILLUSTRATIONS["docker-container"];
  return `<figure class="illustration-box">${svg}</figure>`;
}

function renderDiagram(key) {
  return renderIllustration(key);
}
