/** SVG diagrams for Deploy Course Helper — simple inline illustrations */

const DIAGRAMS = {
  ssh: `
<svg viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="SSH">
  <rect x="10" y="30" width="90" height="60" rx="8" fill="#1e3a5f" stroke="#3d8bfd"/>
  <text x="55" y="65" text-anchor="middle" fill="#e8eef4" font-size="12">Mac</text>
  <path d="M110 60 H200" stroke="#3d8bfd" stroke-width="2" marker-end="url(#arr)"/>
  <text x="155" y="50" text-anchor="middle" fill="#9aabbc" font-size="10">SSH nøgle</text>
  <rect x="210" y="30" width="100" height="60" rx="8" fill="#1e3a5f" stroke="#3d8bfd"/>
  <text x="260" y="65" text-anchor="middle" fill="#e8eef4" font-size="12">VM</text>
  <defs><marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#3d8bfd"/></marker></defs>
</svg>`,

  vm: `
<svg viewBox="0 0 320 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="VM">
  <rect x="40" y="15" width="240" height="70" rx="8" fill="#1a2332" stroke="#2d3a4f"/>
  <text x="160" y="42" text-anchor="middle" fill="#9aabbc" font-size="11">root SSH: NEJ</text>
  <text x="160" y="62" text-anchor="middle" fill="#9aabbc" font-size="11">kun nøgle + UFW</text>
</svg>`,

  firewall: `
<svg viewBox="0 0 320 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Firewall">
  <rect x="120" y="10" width="80" height="80" rx="6" fill="#7f1d1d" stroke="#f87171"/>
  <text x="160" y="55" text-anchor="middle" fill="#fff" font-size="11">UFW</text>
  <text x="50" y="55" fill="#4ade80" font-size="10">22✓ 80✓</text>
  <text x="230" y="55" fill="#f87171" font-size="10">5432✗</text>
</svg>`,

  tunnel: `
<svg viewBox="0 0 340 110" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tunnel">
  <text x="30" y="55" fill="#e8eef4" font-size="11">Bruger</text>
  <rect x="80" y="35" width="70" height="40" rx="6" fill="#1e3a5f" stroke="#3d8bfd"/>
  <text x="115" y="60" text-anchor="middle" fill="#e8eef4" font-size="9">CF</text>
  <path d="M155 55 H195" stroke="#3d8bfd" stroke-width="2"/>
  <rect x="200" y="35" width="55" height="40" rx="6" fill="#1e3a5f" stroke="#3d8bfd"/>
  <text x="227" y="58" text-anchor="middle" fill="#e8eef4" font-size="8">tunnel</text>
  <rect x="270" y="35" width="55" height="40" rx="6" fill="#1e3a5f" stroke="#3d8bfd"/>
  <text x="297" y="58" text-anchor="middle" fill="#e8eef4" font-size="8">nginx</text>
</svg>`,

  image: `
<svg viewBox="0 0 320 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Image">
  <rect x="100" y="10" width="120" height="35" rx="6" fill="#374151" stroke="#9ca3af"/>
  <text x="160" y="32" text-anchor="middle" fill="#e8eef4" font-size="11">Docker image</text>
  <text x="160" y="58" text-anchor="middle" fill="#9aabbc" font-size="10">docker run ↓</text>
  <rect x="100" y="68" width="120" height="50" rx="6" fill="#1e3a5f" stroke="#3d8bfd"/>
  <text x="160" y="98" text-anchor="middle" fill="#e8eef4" font-size="11">Container</text>
</svg>`,

  container: `
<svg viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Container">
  <rect x="60" y="20" width="200" height="80" rx="8" fill="none" stroke="#3d8bfd" stroke-width="2" stroke-dasharray="6 4"/>
  <text x="160" y="45" text-anchor="middle" fill="#9aabbc" font-size="10">VM</text>
  <rect x="100" y="50" width="120" height="40" rx="6" fill="#1e3a5f" stroke="#3d8bfd"/>
  <text x="160" y="75" text-anchor="middle" fill="#e8eef4" font-size="11">App container</text>
</svg>`,

  volume: `
<svg viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Volume">
  <rect x="40" y="35" width="90" height="55" rx="6" fill="#1e3a5f" stroke="#3d8bfd"/>
  <text x="85" y="68" text-anchor="middle" fill="#e8eef4" font-size="10">Container</text>
  <path d="M135 62 H175" stroke="#4ade80" stroke-width="2"/>
  <rect x="180" y="25" width="100" height="75" rx="6" fill="#14532d" stroke="#4ade80"/>
  <text x="230" y="55" text-anchor="middle" fill="#e8eef4" font-size="10">Volume</text>
  <text x="230" y="72" text-anchor="middle" fill="#9aabbc" font-size="9">pgdata</text>
</svg>`,

  nginx: `
<svg viewBox="0 0 340 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Nginx">
  <rect x="130" y="25" width="80" height="50" rx="6" fill="#14532d" stroke="#4ade80"/>
  <text x="170" y="55" text-anchor="middle" fill="#e8eef4" font-size="11">nginx</text>
  <text x="60" y="55" fill="#9aabbc" font-size="10">/ → app</text>
  <text x="250" y="50" fill="#9aabbc" font-size="9">/api/→:5000</text>
</svg>`,

  https: `
<svg viewBox="0 0 300 80" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="HTTPS">
  <text x="150" y="35" text-anchor="middle" fill="#4ade80" font-size="14">🔒 HTTPS</text>
  <text x="150" y="58" text-anchor="middle" fill="#9aabbc" font-size="10">Cloudflare → tunnel → VM</text>
</svg>`,

  dockerfile: `
<svg viewBox="0 0 280 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Dockerfile">
  <rect x="40" y="15" width="80" height="70" rx="4" fill="#1a2332" stroke="#2d3a4f"/>
  <text x="80" y="40" text-anchor="middle" fill="#9aabbc" font-size="9">FROM</text>
  <text x="80" y="55" text-anchor="middle" fill="#9aabbc" font-size="9">COPY</text>
  <text x="80" y="70" text-anchor="middle" fill="#9aabbc" font-size="9">CMD</text>
  <text x="140" y="55" fill="#3d8bfd" font-size="18">→</text>
  <rect x="170" y="30" width="70" height="40" rx="6" fill="#1e3a5f" stroke="#3d8bfd"/>
  <text x="205" y="55" text-anchor="middle" fill="#e8eef4" font-size="10">image</text>
</svg>`,

  compose: `
<svg viewBox="0 0 320 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Compose">
  <rect x="30" y="40" width="70" height="45" rx="6" fill="#1e3a5f" stroke="#3d8bfd"/>
  <text x="65" y="68" text-anchor="middle" fill="#e8eef4" font-size="10">app</text>
  <rect x="220" y="40" width="70" height="45" rx="6" fill="#1e3a5f" stroke="#3d8bfd"/>
  <text x="255" y="68" text-anchor="middle" fill="#e8eef4" font-size="10">db</text>
  <path d="M100 62 H220" stroke="#3d8bfd" stroke-width="2"/>
  <text x="160" y="55" text-anchor="middle" fill="#9aabbc" font-size="9">compose net</text>
  <text x="160" y="105" text-anchor="middle" fill="#9aabbc" font-size="10">docker-compose.yml</text>
</svg>`,

  cicd: `
<svg viewBox="0 0 340 90" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="CI/CD">
  <text x="40" y="50" fill="#e8eef4" font-size="10">git push</text>
  <rect x="90" y="30" width="55" height="35" rx="4" fill="#374151" stroke="#9ca3af"/>
  <text x="117" y="52" text-anchor="middle" fill="#e8eef4" font-size="8">CI</text>
  <rect x="165" y="30" width="55" height="35" rx="4" fill="#1e3a5f" stroke="#3d8bfd"/>
  <text x="192" y="52" text-anchor="middle" fill="#e8eef4" font-size="8">CD</text>
  <rect x="240" y="30" width="70" height="35" rx="4" fill="#14532d" stroke="#4ade80"/>
  <text x="275" y="52" text-anchor="middle" fill="#e8eef4" font-size="8">VM</text>
</svg>`,

  dokploy: `
<svg viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Dokploy">
  <rect x="100" y="20" width="100" height="60" rx="8" fill="#1e3a5f" stroke="#3d8bfd"/>
  <text x="150" y="48" text-anchor="middle" fill="#e8eef4" font-size="11">Dokploy</text>
  <text x="150" y="65" text-anchor="middle" fill="#9aabbc" font-size="9">webhook → deploy</text>
</svg>`,

  k8s: `
<svg viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Kubernetes">
  <ellipse cx="150" cy="50" rx="120" ry="35" fill="none" stroke="#3d8bfd" stroke-width="1.5"/>
  <text x="150" y="45" text-anchor="middle" fill="#e8eef4" font-size="11">Kubernetes</text>
  <text x="150" y="62" text-anchor="middle" fill="#9aabbc" font-size="9">pods + services</text>
</svg>`,

  monitoring: `
<svg viewBox="0 0 300 90" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Monitoring">
  <polyline points="40,60 80,45 120,50 160,30 200,35 240,20" fill="none" stroke="#4ade80" stroke-width="2"/>
  <text x="150" y="78" text-anchor="middle" fill="#9aabbc" font-size="10">status + logs + uptime</text>
</svg>`,

  owasp: `
<svg viewBox="0 0 280 80" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="OWASP">
  <text x="140" y="40" text-anchor="middle" fill="#f87171" font-size="16" font-weight="bold">OWASP</text>
  <text x="140" y="58" text-anchor="middle" fill="#9aabbc" font-size="10">Top 10 risici</text>
</svg>`,

  headers: `
<svg viewBox="0 0 300 90" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Headers">
  <rect x="50" y="20" width="200" height="50" rx="4" fill="#1a2332" stroke="#2d3a4f"/>
  <text x="150" y="42" text-anchor="middle" fill="#4ade80" font-size="9">CSP · HSTS · X-Frame</text>
  <text x="150" y="58" text-anchor="middle" fill="#9aabbc" font-size="9">HTTP response headers</text>
</svg>`,

  secrets: `
<svg viewBox="0 0 300 90" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Secrets">
  <rect x="40" y="25" width="90" height="40" rx="4" fill="#1a2332" stroke="#4ade80"/>
  <text x="85" y="50" text-anchor="middle" fill="#e8eef4" font-size="9">.env ✓</text>
  <rect x="170" y="25" width="90" height="40" rx="4" fill="#7f1d1d" stroke="#f87171"/>
  <text x="215" y="50" text-anchor="middle" fill="#e8eef4" font-size="9">git ✗</text>
</svg>`,

  trivy: `
<svg viewBox="0 0 300 90" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Trivy">
  <rect x="80" y="25" width="140" height="40" rx="6" fill="#1e3a5f" stroke="#3d8bfd"/>
  <text x="150" y="50" text-anchor="middle" fill="#e8eef4" font-size="11">trivy image</text>
  <text x="150" y="78" text-anchor="middle" fill="#f87171" font-size="9">CVE scan</text>
</svg>`,

  ctf: `
<svg viewBox="0 0 300 80" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="CTF">
  <text x="150" y="40" text-anchor="middle" fill="#fbbf24" font-size="14">🏁 FLAG{...}</text>
  <text x="150" y="58" text-anchor="middle" fill="#9aabbc" font-size="10">etisk test-app</text>
</svg>`,

  incident: `
<svg viewBox="0 0 320 70" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Incident">
  <text x="40" y="40" fill="#9aabbc" font-size="8">Detect</text>
  <text x="95" y="40" fill="#9aabbc" font-size="8">Contain</text>
  <text x="155" y="40" fill="#9aabbc" font-size="8">Fix</text>
  <text x="210" y="40" fill="#9aabbc" font-size="8">Recover</text>
  <text x="265" y="40" fill="#9aabbc" font-size="8">Learn</text>
  <path d="M55 35 H275" stroke="#3d8bfd" stroke-width="1.5"/>
</svg>`
};

function renderDiagram(key) {
  const svg = DIAGRAMS[key] || DIAGRAMS.container;
  return `<div class="diagram-box">${svg}</div>`;
}
