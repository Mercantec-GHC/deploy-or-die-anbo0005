(function () {
  const listEl = document.getElementById("term-list");
  const detailEl = document.getElementById("term-detail");
  const layoutEl = document.getElementById("layout");
  const loadingEl = document.getElementById("loading");
  const errorEl = document.getElementById("error");
  const searchEl = document.getElementById("search");
  const dayFilterEl = document.getElementById("day-filter");

  let terms = [];
  let selectedId = null;

  function showError(msg) {
    loadingEl.classList.add("hidden");
    layoutEl.classList.add("hidden");
    errorEl.textContent = msg;
    errorEl.classList.remove("hidden");
  }

  function normalize(s) {
    return (s || "").toLowerCase();
  }

  function filteredTerms() {
    const q = normalize(searchEl.value);
    const day = dayFilterEl.value ? parseInt(dayFilterEl.value, 10) : null;

    return terms.filter((t) => {
      if (day !== null && t.day !== day) return false;
      if (!q) return true;
      const hay = [t.title, t.summary, t.body, t.dayTitle, String(t.day)].join(" ");
      return normalize(hay).includes(q);
    });
  }

  function renderList() {
    const items = filteredTerms();
    listEl.innerHTML = "";

    if (items.length === 0) {
      listEl.innerHTML = '<p class="placeholder" style="padding:1rem">Ingen emner fundet.</p>';
      return;
    }

    items.forEach((t) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "term-btn" + (t.id === selectedId ? " active" : "");
      btn.dataset.id = t.id;
      btn.innerHTML =
        '<span class="day-badge">Dag ' + t.day + "</span>" +
        '<span class="title">' + escapeHtml(t.title) + "</span>" +
        '<span class="summary">' + escapeHtml(t.summary) + "</span>";
      btn.addEventListener("click", () => selectTerm(t.id));
      listEl.appendChild(btn);
    });
  }

  function escapeHtml(text) {
    const d = document.createElement("div");
    d.textContent = text;
    return d.innerHTML;
  }

  function selectTerm(id) {
    selectedId = id;
    const t = terms.find((x) => x.id === id);
    if (!t) return;

    history.replaceState(null, "", "#" + encodeURIComponent(id));
    renderList();

    detailEl.innerHTML =
      "<h2>" + escapeHtml(t.title) + "</h2>" +
      '<p class="meta">Dag ' + t.day + " · " + escapeHtml(t.dayTitle) + "</p>" +
      '<p class="lead">' + escapeHtml(t.summary) + "</p>" +
      renderIllustration(t.diagram) +
      '<div class="body">' + formatBody(t.body) + "</div>";
  }

  function formatBody(text) {
    return escapeHtml(text || "")
      .split(/\n\n+/)
      .map(function (p) { return "<p>" + p.replace(/\n/g, "<br>") + "</p>"; })
      .join("");
  }

  function populateDayFilter(days) {
    days.forEach((d) => {
      const opt = document.createElement("option");
      opt.value = String(d.day);
      opt.textContent = "Dag " + d.day + " — " + d.title;
      dayFilterEl.appendChild(opt);
    });
  }

  async function init() {
    try {
      const [termsRes, daysRes] = await Promise.all([
        fetch("/api/terms"),
        fetch("/api/terms/days")
      ]);

      if (!termsRes.ok) throw new Error("Kunne ikke hente emner.");
      terms = await termsRes.json();

      if (daysRes.ok) {
        populateDayFilter(await daysRes.json());
      }

      loadingEl.classList.add("hidden");
      layoutEl.classList.remove("hidden");

      const hash = location.hash.replace(/^#/, "");
      if (hash) {
        const decoded = decodeURIComponent(hash);
        if (terms.some((t) => t.id === decoded)) {
          selectTerm(decoded);
        }
      }

      renderList();
    } catch (e) {
      showError(e.message || "Ukendt fejl.");
    }
  }

  searchEl.addEventListener("input", renderList);
  dayFilterEl.addEventListener("change", renderList);

  init();
})();
