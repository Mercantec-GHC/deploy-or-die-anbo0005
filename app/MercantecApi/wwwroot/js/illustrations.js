/**
 * Deploy Course Helper — friendly character illustrations.
 * Docker = blue whale · Daemon = robot · CLI = messenger with terminal.
 */

function scene(ariaLabel, body) {
  return `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${ariaLabel}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#dbeafe"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </linearGradient>
    <linearGradient id="whale" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
    <filter id="soft" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#0f172a" flood-opacity="0.12"/>
    </filter>
  </defs>
  <rect width="720" height="300" fill="url(#sky)"/>
  ${body}
</svg>`;
}

/** Blue whale — Docker mascot carrying containers */
function whale(x, y, w, containers) {
  const cx = x + w * 0.45;
  const cy = y + w * 0.35;
  const boxes = (containers || []).map((c, i) => {
    const bx = x + w * 0.15 + i * (w * 0.22);
    const by = y - w * 0.05;
    return `
      <g filter="url(#soft)">
        <rect x="${bx}" y="${by}" width="${w * 0.18}" height="${w * 0.16}" rx="8" fill="#fff" stroke="#2563eb" stroke-width="2.5"/>
        <text x="${bx + w * 0.09}" y="${by + w * 0.07}" text-anchor="middle" font-size="11" fill="#64748b" font-weight="600">${c.label}</text>
        <text x="${bx + w * 0.09}" y="${by + w * 0.13}" text-anchor="middle" font-size="16">${c.icon}</text>
      </g>`;
  }).join("");
  return `
  <g filter="url(#soft)">
    ${boxes}
    <ellipse cx="${cx}" cy="${cy}" rx="${w * 0.38}" ry="${w * 0.18}" fill="url(#whale)"/>
    <ellipse cx="${cx + w * 0.32}" cy="${cy - w * 0.02}" rx="${w * 0.1}" ry="${w * 0.08}" fill="#1d4ed8"/>
    <circle cx="${cx - w * 0.28}" cy="${cy - w * 0.04}" r="${w * 0.04}" fill="#fff"/>
    <circle cx="${cx - w * 0.27}" cy="${cy - w * 0.04}" r="${w * 0.02}" fill="#0f172a"/>
    <path d="M ${cx - w * 0.38} ${cy} Q ${cx - w * 0.55} ${cy - w * 0.12} ${cx - w * 0.5} ${cy + w * 0.02}" fill="none" stroke="#1d4ed8" stroke-width="6" stroke-linecap="round"/>
    <text x="${cx}" y="${cy + w * 0.28}" text-anchor="middle" font-size="13" fill="#1e40af" font-weight="700">Docker</text>
  </g>`;
}

/** Robot — dockerd daemon on the VM */
function daemon(x, y) {
  return `
  <g filter="url(#soft)">
    <rect x="${x}" y="${y}" width="88" height="100" rx="14" fill="#6366f1" stroke="#4338ca" stroke-width="2"/>
    <rect x="${x + 18}" y="${y + 22}" width="52" height="36" rx="6" fill="#e0e7ff"/>
    <circle cx="${x + 32}" cy="${y + 40}" r="6" fill="#22c55e"/>
    <circle cx="${x + 56}" cy="${y + 40}" r="6" fill="#22c55e"/>
    <rect x="${x + 28}" y="${y + 68}" width="32" height="6" rx="3" fill="#c7d2fe"/>
    <line x1="${x + 44}" y1="${y}" x2="${x + 44}" y2="${y - 14}" stroke="#4338ca" stroke-width="3"/>
    <circle cx="${x + 44}" cy="${y - 16}" r="5" fill="#fbbf24"/>
    <text x="${x + 44}" y="${y + 118}" text-anchor="middle" font-size="11" fill="#4338ca" font-weight="700">dockerd</text>
    <text x="${x + 44}" y="${y + 132}" text-anchor="middle" font-size="9" fill="#64748b">daemon</text>
  </g>`;
}

/** Messenger — docker CLI in terminal */
function cli(x, y, speech) {
  return `
  <g filter="url(#soft)">
    <circle cx="${x + 28}" cy="${y + 18}" r="18" fill="#fcd34d" stroke="#f59e0b" stroke-width="2"/>
    <rect x="${x + 10}" y="${y + 38}" width="36" height="44" rx="8" fill="#3b82f6"/>
    <rect x="${x + 52}" y="${y + 48}" width="70" height="48" rx="8" fill="#1e293b"/>
    <text x="${x + 62}" y="${y + 66}" font-size="8" fill="#4ade80" font-family="monospace">$ docker</text>
    <text x="${x + 62}" y="${y + 80}" font-size="8" fill="#e2e8f0" font-family="monospace">${speech || "run app"}</text>
    <text x="${x + 28}" y="${y + 108}" text-anchor="middle" font-size="11" fill="#1e40af" font-weight="700">CLI</text>
  </g>`;
}

function arrow(x1, y1, x2, y2, label) {
  const mid = (x1 + x2) / 2;
  return `
  <path d="M ${x1} ${y1} L ${x2} ${y2}" stroke="#94a3b8" stroke-width="2.5" marker-end="url(#arr)"/>
  ${label ? `<text x="${mid}" y="${y1 - 8}" text-anchor="middle" font-size="10" fill="#64748b">${label}</text>` : ""}`;
}

function speechBubble(x, y, w, text) {
  return `
  <rect x="${x}" y="${y}" width="${w}" height="36" rx="10" fill="#fff" stroke="#cbd5e1" stroke-width="1.5"/>
  <text x="${x + w / 2}" y="${y + 22}" text-anchor="middle" font-size="11" fill="#334155">${text}</text>`;
}

const ARR = `<defs><marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8"/></marker></defs>`;

const ILLUSTRATIONS = {
  container: scene("Docker container", `
    ${ARR}
    ${cli(40, 120, "run app")}
    ${arrow(132, 155, 200, 155, "besked")}
    ${daemon(200, 115)}
    ${arrow(290, 155, 360, 170, "bygger")}
    ${whale(360, 130, 200, [{ label: "container", icon: "📦" }])}
    ${speechBubble(420, 55, 200, "App'en bor inde i containeren")}
  `),

  image: scene("Docker image", `
    ${ARR}
    ${speechBubble(80, 30, 220, "Image = opskrift / skabelon")}
    <g filter="url(#soft)">
      <rect x="100" y="80" width="120" height="140" rx="10" fill="#fff8e1" stroke="#f59e0b" stroke-width="2.5"/>
      <text x="160" y="108" text-anchor="middle" font-size="11" fill="#b45309" font-weight="700">IMAGE</text>
      <text x="160" y="130" text-anchor="middle" font-size="9" fill="#78716c" font-family="monospace">FROM dotnet</text>
      <text x="160" y="148" text-anchor="middle" font-size="9" fill="#78716c" font-family="monospace">COPY app</text>
      <text x="160" y="166" text-anchor="middle" font-size="9" fill="#78716c" font-family="monospace">CMD run</text>
      <text x="160" y="200" text-anchor="middle" font-size="28">📋</text>
    </g>
    ${arrow(230, 150, 310, 165, "docker run")}
    ${whale(310, 125, 180, [{ label: "container", icon: "🚀" }])}
  `),

  volume: scene("Docker volume", `
    ${ARR}
    ${whale(60, 120, 170, [{ label: "Postgres", icon: "🐘" }])}
    ${arrow(250, 155, 310, 155)}
    <g filter="url(#soft)">
      <rect x="310" y="95" width="110" height="120" rx="10" fill="#dcfce7" stroke="#16a34a" stroke-width="3"/>
      <text x="365" y="125" text-anchor="middle" font-size="12" fill="#166534" font-weight="700">pgdata</text>
      <text x="365" y="148" text-anchor="middle" font-size="10" fill="#15803d">volume</text>
      <text x="365" y="175" text-anchor="middle" font-size="28">💾</text>
      <text x="365" y="200" text-anchor="middle" font-size="9" fill="#64748b">på VM-disk</text>
    </g>
    ${speechBubble(450, 40, 240, "Data overlever restart af container")}
  `),

  dockerfile: scene("Dockerfile", `
    ${ARR}
    ${cli(30, 115, "build .")}
    ${arrow(130, 155, 195, 155)}
    ${daemon(195, 110)}
    ${arrow(285, 155, 340, 150, "layers")}
    <g filter="url(#soft)">
      <rect x="340" y="70" width="130" height="150" rx="10" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="405" y="98" text-anchor="middle" font-size="12" fill="#92400e" font-weight="700">Dockerfile</text>
      <text x="405" y="125" font-size="9" fill="#78716c" font-family="monospace" text-anchor="middle">FROM · COPY</text>
      <text x="405" y="142" font-size="9" fill="#78716c" font-family="monospace" text-anchor="middle">RUN · CMD</text>
      <text x="405" y="185" text-anchor="middle" font-size="32">👨‍🍳</text>
    </g>
    ${arrow(475, 155, 530, 165)}
    ${whale(520, 125, 160, [{ label: "image", icon: "📦" }])}
  `),

  compose: scene("Docker Compose", `
    ${ARR}
    ${cli(25, 115, "compose up")}
    ${arrow(125, 155, 185, 155)}
    ${daemon(185, 110)}
    ${arrow(275, 165, 330, 175, "starter begge")}
    ${whale(320, 115, 200, [
      { label: "app", icon: "🚀" },
      { label: "db", icon: "🐘" }
    ])}
  `),

  ssh: scene("SSH", `
    ${ARR}
    <g filter="url(#soft)">
      <rect x="50" y="100" width="100" height="75" rx="10" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/>
      <text x="100" y="145" text-anchor="middle" font-size="28">💻</text>
      <text x="100" y="195" text-anchor="middle" font-size="11" fill="#334155" font-weight="600">Din Mac</text>
    </g>
    <g filter="url(#soft)">
      <rect x="200" y="125" width="80" height="50" rx="8" fill="#fef9c3" stroke="#eab308" stroke-width="2"/>
      <text x="240" y="155" text-anchor="middle" font-size="24">🔑</text>
      <text x="240" y="190" text-anchor="middle" font-size="9" fill="#854d0e">SSH-nøgle</text>
    </g>
    ${arrow(155, 140, 195, 140, "krypteret")}
    ${arrow(285, 140, 340, 140)}
    <g filter="url(#soft)">
      <rect x="340" y="85" width="120" height="110" rx="12" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
      <text x="400" y="135" text-anchor="middle" font-size="32">🖥️</text>
      <text x="400" y="165" text-anchor="middle" font-size="11" fill="#1e40af" font-weight="700">VM</text>
      <text x="400" y="182" text-anchor="middle" font-size="9" fill="#64748b">port 22</text>
    </g>
    ${speechBubble(480, 50, 210, "Kun du har den private nøgle")}
  `),

  vm: scene("VM hardening", `
    ${ARR}
    <g filter="url(#soft)">
      <rect x="180" y="60" width="360" height="170" rx="16" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2"/>
      <text x="360" y="100" text-anchor="middle" font-size="40">🏰</text>
      <text x="360" y="135" text-anchor="middle" font-size="14" fill="#334155" font-weight="700">VM — hærdet</text>
      <text x="360" y="158" text-anchor="middle" font-size="11" fill="#64748b">❌ root login · ❌ password</text>
      <text x="360" y="178" text-anchor="middle" font-size="11" fill="#16a34a">✅ kun SSH-nøgle · ✅ UFW</text>
    </g>
    <text x="360" y="260" text-anchor="middle" font-size="11" fill="#64748b">Færre åbne døre = sværere at angribe</text>
  `),

  firewall: scene("UFW firewall", `
    ${ARR}
    <g filter="url(#soft)">
      <rect x="280" y="70" width="160" height="150" rx="14" fill="#fee2e2" stroke="#ef4444" stroke-width="3"/>
      <text x="360" y="130" text-anchor="middle" font-size="48">🛡️</text>
      <text x="360" y="175" text-anchor="middle" font-size="14" fill="#b91c1c" font-weight="700">UFW</text>
    </g>
    <text x="120" y="130" font-size="12" fill="#16a34a">✅ 22 SSH</text>
    <text x="120" y="155" font-size="12" fill="#16a34a">✅ 80/443</text>
    ${arrow(200, 140, 275, 140)}
    <text x="520" y="130" font-size="12" fill="#dc2626">❌ 5432 DB</text>
    <text x="520" y="155" font-size="12" fill="#dc2626">❌ 8080</text>
    ${arrow(445, 140, 510, 140)}
    ${speechBubble(200, 230, 320, "Kun nødvendige porte må ind")}
  `),

  tunnel: scene("Cloudflare Tunnel", `
    ${ARR}
    <g filter="url(#soft)">
      <circle cx="90" cy="140" r="35" fill="#fcd34d" stroke="#f59e0b" stroke-width="2"/>
      <text x="90" y="148" text-anchor="middle" font-size="28">👤</text>
      <text x="90" y="195" text-anchor="middle" font-size="10" fill="#64748b">Bruger</text>
    </g>
    ${arrow(130, 140, 175, 140, "HTTPS")}
    <g filter="url(#soft)">
      <ellipse cx="230" cy="130" rx="55" ry="35" fill="#fff" stroke="#f97316" stroke-width="2"/>
      <text x="230" y="138" text-anchor="middle" font-size="11" fill="#ea580c" font-weight="700">Cloudflare</text>
      <text x="230" y="155" text-anchor="middle" font-size="20">☁️</text>
    </g>
    ${arrow(290, 140, 340, 140, "tunnel")}
    <g filter="url(#soft)">
      <rect x="340" y="105" width="70" height="55" rx="8" fill="#e0f2fe" stroke="#0ea5e9" stroke-width="2"/>
      <text x="375" y="140" text-anchor="middle" font-size="10" fill="#0369a1">cloudflared</text>
    </g>
    ${arrow(415, 140, 470, 140)}
    <g filter="url(#soft)">
      <rect x="470" y="100" width="90" height="65" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="515" y="138" text-anchor="middle" font-size="11" fill="#166534" font-weight="600">nginx</text>
      <text x="515" y="155" text-anchor="middle" font-size="9" fill="#64748b">:8080</text>
    </g>
    ${speechBubble(180, 220, 360, "VM behøver ikke åben public IP")}
  `),

  nginx: scene("Nginx", `
    ${ARR}
    <g filter="url(#soft)">
      <rect x="280" y="75" width="160" height="130" rx="14" fill="#dcfce7" stroke="#16a34a" stroke-width="3"/>
      <text x="360" y="130" text-anchor="middle" font-size="44">🚦</text>
      <text x="360" y="170" text-anchor="middle" font-size="14" fill="#166534" font-weight="700">nginx</text>
      <text x="360" y="190" text-anchor="middle" font-size="10" fill="#64748b">portvagt på VM</text>
    </g>
    <text x="100" y="120" font-size="11" fill="#334155">/ → statisk</text>
    <text x="100" y="145" font-size="11" fill="#334155">/api/ → app</text>
    ${arrow(200, 130, 275, 130)}
    <text x="500" y="120" font-size="11" fill="#334155">:5000 app</text>
    ${arrow(445, 130, 495, 130)}
  `),

  https: scene("HTTPS", `
    ${ARR}
    <g filter="url(#soft)">
      <rect x="200" y="80" width="320" height="120" rx="16" fill="#fff" stroke="#22c55e" stroke-width="3"/>
      <text x="360" y="135" text-anchor="middle" font-size="48">🔒</text>
      <text x="360" y="175" text-anchor="middle" font-size="16" fill="#15803d" font-weight="700">HTTPS</text>
    </g>
    <text x="360" y="230" text-anchor="middle" font-size="11" fill="#64748b">Bruger ↔ Cloudflare er krypteret · Certbot på VM ikke nødvendig med tunnel</text>
  `),

  cicd: scene("CI/CD", `
    ${ARR}
    ${cli(30, 120, "git push")}
    ${arrow(130, 155, 175, 155)}
    <g filter="url(#soft)">
      <rect x="175" y="100" width="90" height="80" rx="10" fill="#f1f5f9" stroke="#64748b" stroke-width="2"/>
      <text x="220" y="135" text-anchor="middle" font-size="24">⚙️</text>
      <text x="220" y="165" text-anchor="middle" font-size="11" fill="#334155" font-weight="700">CI</text>
      <text x="220" y="178" text-anchor="middle" font-size="9" fill="#64748b">GitHub Actions</text>
    </g>
    ${arrow(270, 155, 315, 155)}
    <g filter="url(#soft)">
      <rect x="315" y="100" width="90" height="80" rx="10" fill="#e0e7ff" stroke="#6366f1" stroke-width="2"/>
      <text x="360" y="135" text-anchor="middle" font-size="24">🚀</text>
      <text x="360" y="165" text-anchor="middle" font-size="11" fill="#4338ca" font-weight="700">CD</text>
      <text x="360" y="178" text-anchor="middle" font-size="9" fill="#64748b">Dokploy</text>
    </g>
    ${arrow(410, 155, 455, 155)}
    ${whale(450, 125, 150, [{ label: "live", icon: "✅" }])}
  `),

  dokploy: scene("Dokploy", `
    ${ARR}
    <g filter="url(#soft)">
      <rect x="220" y="60" width="280" height="160" rx="16" fill="#eef2ff" stroke="#6366f1" stroke-width="3"/>
      <text x="360" y="115" text-anchor="middle" font-size="48">🎛️</text>
      <text x="360" y="155" text-anchor="middle" font-size="16" fill="#4338ca" font-weight="700">Dokploy</text>
      <text x="360" y="178" text-anchor="middle" font-size="10" fill="#64748b">Webhook → git pull → compose up</text>
    </g>
    ${speechBubble(80, 200, 200, "Deploy-knap på VM")}
  `),

  k8s: scene("Kubernetes", `
    ${ARR}
    <g filter="url(#soft)">
      <ellipse cx="360" cy="150" rx="200" ry="70" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
      <text x="360" y="130" text-anchor="middle" font-size="14" fill="#1d4ed8" font-weight="700">Kubernetes cluster</text>
      <circle cx="280" cy="155" r="28" fill="#fff" stroke="#2563eb" stroke-width="2"/>
      <text x="280" y="160" text-anchor="middle" font-size="18">📦</text>
      <circle cx="360" cy="155" r="28" fill="#fff" stroke="#2563eb" stroke-width="2"/>
      <text x="360" y="160" text-anchor="middle" font-size="18">📦</text>
      <circle cx="440" cy="155" r="28" fill="#fff" stroke="#2563eb" stroke-width="2"/>
      <text x="440" y="160" text-anchor="middle" font-size="18">📦</text>
      <text x="360" y="200" text-anchor="middle" font-size="10" fill="#64748b">pods · services · ingress</text>
    </g>
    <text x="360" y="260" text-anchor="middle" font-size="10" fill="#64748b">Vi bruger Compose + Dokploy — samme idé, mindre setup</text>
  `),

  monitoring: scene("Monitoring", `
    ${ARR}
    <g filter="url(#soft)">
      <rect x="80" y="80" width="200" height="130" rx="12" fill="#f0fdf4" stroke="#22c55e" stroke-width="2"/>
      <text x="180" y="125" text-anchor="middle" font-size="36">📈</text>
      <text x="180" y="160" text-anchor="middle" font-size="12" fill="#166534" font-weight="700">Uptime Kuma</text>
      <text x="180" y="178" text-anchor="middle" font-size="9" fill="#64748b">Er URL oppe?</text>
    </g>
    <g filter="url(#soft)">
      <rect x="440" y="80" width="200" height="130" rx="12" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
      <text x="540" y="125" text-anchor="middle" font-size="36">📋</text>
      <text x="540" y="160" text-anchor="middle" font-size="12" fill="#1d4ed8" font-weight="700">Dokploy Logs</text>
      <text x="540" y="178" text-anchor="middle" font-size="9" fill="#64748b">Hvad skrev app'en?</text>
    </g>
    <text x="360" y="250" text-anchor="middle" font-size="11" fill="#64748b">Kuma = udefra · Logs = indefra</text>
  `),

  owasp: scene("OWASP", `
    ${ARR}
    <g filter="url(#soft)">
      <rect x="200" y="50" width="320" height="180" rx="16" fill="#fff" stroke="#ef4444" stroke-width="3"/>
      <text x="360" y="110" text-anchor="middle" font-size="20" fill="#b91c1c" font-weight="800">OWASP Top 10</text>
      <text x="360" y="145" text-anchor="middle" font-size="11" fill="#64748b">A01 Access · A03 Injection · A05 Config</text>
      <text x="360" y="165" text-anchor="middle" font-size="11" fill="#64748b">A06 Outdated · A07 Auth · A09 Logging</text>
      <text x="360" y="200" text-anchor="middle" font-size="40">⚠️</text>
    </g>
  `),

  headers: scene("Security headers", `
    ${ARR}
    <g filter="url(#soft)">
      <rect x="180" y="70" width="360" height="140" rx="14" fill="#f8fafc" stroke="#334155" stroke-width="2"/>
      <text x="360" y="110" text-anchor="middle" font-size="13" fill="#0f172a" font-weight="700">HTTP Response Headers</text>
      <text x="360" y="140" text-anchor="middle" font-size="11" fill="#16a34a">CSP · HSTS · X-Frame-Options</text>
      <text x="360" y="165" text-anchor="middle" font-size="11" fill="#2563eb">X-Content-Type · Referrer-Policy</text>
      <text x="360" y="195" text-anchor="middle" font-size="32">🛡️</text>
    </g>
  `),

  secrets: scene("Secrets", `
    ${ARR}
    <g filter="url(#soft)">
      <rect x="100" y="90" width="180" height="110" rx="12" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="190" y="135" text-anchor="middle" font-size="32">🔐</text>
      <text x="190" y="170" text-anchor="middle" font-size="12" fill="#166534" font-weight="700">.env på VM</text>
      <text x="190" y="188" text-anchor="middle" font-size="9" fill="#64748b">✅ passwords her</text>
    </g>
    <g filter="url(#soft)">
      <rect x="440" y="90" width="180" height="110" rx="12" fill="#fee2e2" stroke="#ef4444" stroke-width="2"/>
      <text x="530" y="135" text-anchor="middle" font-size="32">📂</text>
      <text x="530" y="170" text-anchor="middle" font-size="12" fill="#b91c1c" font-weight="700">git repo</text>
      <text x="530" y="188" text-anchor="middle" font-size="9" fill="#64748b">❌ aldrig secrets</text>
    </g>
  `),

  trivy: scene("Trivy", `
    ${ARR}
    ${whale(80, 120, 150, [{ label: "image", icon: "📦" }])}
    ${arrow(250, 155, 310, 155)}
    <g filter="url(#soft)">
      <rect x="310" y="90" width="150" height="120" rx="12" fill="#fef2f2" stroke="#ef4444" stroke-width="2"/>
      <text x="385" y="130" text-anchor="middle" font-size="36">🔍</text>
      <text x="385" y="165" text-anchor="middle" font-size="12" fill="#b91c1c" font-weight="700">Trivy</text>
      <text x="385" y="185" text-anchor="middle" font-size="9" fill="#64748b">finder CVE i image</text>
    </g>
    ${speechBubble(480, 50, 210, "Scan før produktion")}
  `),

  ctf: scene("CTF", `
    ${ARR}
    <g filter="url(#soft)">
      <rect x="200" y="60" width="320" height="160" rx="16" fill="#fffbeb" stroke="#f59e0b" stroke-width="3"/>
      <text x="360" y="120" text-anchor="middle" font-size="48">🏁</text>
      <text x="360" y="160" text-anchor="middle" font-size="14" fill="#b45309" font-weight="700">FLAG{...}</text>
      <text x="360" y="185" text-anchor="middle" font-size="10" fill="#64748b">Kun teacher's test-app · etisk hacking</text>
    </g>
  `),

  incident: scene("Incident response", `
    ${ARR}
    ${["Detect", "Contain", "Fix", "Recover", "Learn"].map((step, i) => {
      const cx = 90 + i * 130;
      return `
      <g filter="url(#soft)">
        <circle cx="${cx}" cy="140" r="38" fill="#fff" stroke="#3b82f6" stroke-width="2.5"/>
        <text x="${cx}" y="135" text-anchor="middle" font-size="20">${["🔍", "🧱", "🔧", "♻️", "📚"][i]}</text>
        <text x="${cx}" y="158" text-anchor="middle" font-size="9" fill="#334155" font-weight="600">${step}</text>
      </g>
      ${i < 4 ? `<path d="M ${cx + 42} 140 L ${cx + 88} 140" stroke="#94a3b8" stroke-width="2" marker-end="url(#arr)"/>` : ""}`;
    }).join("")}
    <text x="360" y="230" text-anchor="middle" font-size="11" fill="#64748b">Plan på forhånd — ikke panik når noget går galt</text>
  `)
};

function renderIllustration(key) {
  const svg = ILLUSTRATIONS[key] || ILLUSTRATIONS.container;
  return `<figure class="illustration-box">${svg}</figure>`;
}

// Backwards compat
function renderDiagram(key) {
  return renderIllustration(key);
}
