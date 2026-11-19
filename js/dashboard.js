/* =====================================================================
   dashboard.js: the dashboard page.
   Starter guide, balance card with monthly limit, mood message,
   category tiles, summary tiles and two ApexCharts.
   ===================================================================== */

/* ---------- 1. Work out the numbers ---------- */
const total = expenses.reduce((s, e) => s + e.amt, 0);                          // everything spent so far
const categoryTotal = Object.values(BUDGET).reduce((a, b) => a + b, 0);        // all category budgets added together
const budgetTotal = LIMIT > 0 ? LIMIT : categoryTotal;                          // the user's own limit, or the category total
const pct = Math.round(total / budgetTotal * 100);                              // percent of the budget used
const hasSpends = expenses.length > 0;
const topCat = hasSpends ? CATS.slice().sort((a, b) => spentBy(b) - spentBy(a))[0] : "None yet";   // category with the most spending

/* ---------- 2. "Get started in 3 steps" guide for new users ---------- */
if (getFlag("guideDone")) guide.classList.add("d-none");                        // hidden if the user closed it before
const steps = [                                                                 // [text, link, button text, done?]
  ["Add your first spend", "expenses.html", "Go to Expenses", hasSpends],
  ["Set your own budget", "budget.html", "Go to Budget", getFlag("budgetSet")],
  ["Come back here to see your charts", "", "", hasSpends]
];
guide.innerHTML = `<h2 class="h4">New here? Get started in 3 steps</h2>
  <ol>${steps.map((s, i) => `<li><span class="stepno">${i + 1}</span><span class="fw-bold">${s[0]}</span>
    <span class="state"><span class="pill ${s[3] ? "done" : "todo"}">${s[3] ? "Done" : "To do"}</span>
    ${s[1] && !s[3] ? `<a class="btn-go sm" href="${s[1]}">${s[2]}</a>` : ""}</span></li>`).join("")}</ol>
  <div class="d-flex flex-wrap gap-2">
    ${hasSpends ? "" : `<button type="button" class="btn-go" id="useSample">Try with sample data</button>`}
    <button type="button" class="chip" id="hideGuide">Hide this guide</button></div>`;
guide.onclick = ev => {
  if (ev.target.closest("#useSample")) { expenses = SAMPLE.map(e => ({...e})); save(); location.reload(); }   // load sample spends
  if (ev.target.closest("#hideGuide")) { setFlag("guideDone"); guide.classList.add("d-none"); }              // hide and remember
};

/* ---------- 3. Mood message: the text and colour change with the situation (checked from top to bottom) ---------- */
const overCats = CATS.filter(c => spentBy(c) > BUDGET[c]);                      // categories that are over their own budget
let mood, moodBg;
if (!hasSpends)           { mood = "A fresh start. Add your first spend!";          moodBg = "#fff"; }
else if (pct > 100)       { mood = "Oops, over your limit this month.";             moodBg = "#FFB199"; }
else if (pct >= 95)       { mood = "So close to your limit. Time to slow down!";    moodBg = "#FFB199"; }
else if (pct >= 80)       { mood = "Careful now, almost at the limit.";             moodBg = "#FFF1A8"; }
else if (overCats.length) { mood = overCats.length === 1 ? `Careful, ${overCats[0]} is over its budget.` : `Careful, ${overCats.length} categories are over budget.`; moodBg = "#FFF1A8"; }
else if (pct < 25)        { mood = "Your wallet is smiling.";                       moodBg = "#CBEBA0"; }
else if (pct < 50)        { mood = "Looking good. You are spending slowly.";        moodBg = "#CBEBA0"; }
else                      { mood = "Steady and sweet. Keep going!";                 moodBg = "#fff"; }

/* ---------- 4. Hero card: money left, progress meter, mood and monthly limit box ---------- */
const over = total > budgetTotal;
hero.innerHTML = `<p class="fw-bold mb-0">${over ? "Over your limit by" : "Left to spend this month"}</p>
  <p class="big huge">${rm(Math.abs(budgetTotal - total))}</p>
  <div class="meter" role="progressbar" aria-label="Budget used" aria-valuenow="${Math.min(pct, 100)}" aria-valuemin="0" aria-valuemax="100"><span style="width:${Math.min(pct, 100)}%"></span></div>
  <p class="mt-2 mb-0 fw-bold">${rm(total)} spent of ${rm(budgetTotal)} (${pct}%)</p>
  <span class="mood" style="background:${moodBg}">${mood}</span>
  <form id="limitForm" class="limitbox" novalidate>
    <label for="limitInput" class="fw-bold">My monthly limit (RM)</label>
    <div class="setb"><input id="limitInput" type="number" min="1" step="1" value="${budgetTotal}" class="form-control"><button class="btn-go sm" type="submit">Set</button></div>
    <div id="limitMsg" class="small fw-bold text-danger" role="status"></div>
  </form>`;

// Save a new monthly limit
hero.addEventListener("submit", ev => {
  ev.preventDefault();
  const v = parseFloat(limitInput.value);
  if (!(v > 0)) { limitMsg.textContent = "Type an amount above 0."; return; }
  LIMIT = v; save(); setFlag("budgetSet"); location.reload();                   // reload to refresh every number
});

/* ---------- 5. One coloured tile per category ---------- */
catTiles.innerHTML = CATS.map(c => `<div class="tile" style="background:${CAT_COLOR[c]}"><span>${c}</span><b>${rm(spentBy(c))}</b></div>`).join("");

/* ---------- 6. Three summary tiles ---------- */
const tile = (bg, label, value) => `<div class="tile" style="background:${bg}"><span>${label}</span><b>${value}</b></div>`;
tiles.innerHTML = tile("#FFC1DC", "Entries", expenses.length)
  + tile(CAT_COLOR[topCat] || "#FFF1A8", "Biggest category", topCat)
  + tile("#8EDDC8", "Average per entry", rm(hasSpends ? total / expenses.length : 0));

/* ---------- 7. Charts (ApexCharts) ---------- */
const chartFont = "-apple-system, BlinkMacSystemFont, Inter, sans-serif";
if (!hasSpends) {
  // Empty state: no charts yet, so explain what to do
  donutChart.innerHTML = barChart.innerHTML = `<p class="empty">No spends yet. Add your first one on the Expenses page and your charts will appear here.</p>`;
} else {
  // Donut chart: where the money goes (only categories that have spending)
  const used = CATS.filter(c => spentBy(c) > 0);
  new ApexCharts(document.getElementById("donutChart"), {
    chart: {type: "donut", height: 300, fontFamily: chartFont},
    series: used.map(c => +spentBy(c).toFixed(2)), labels: used, colors: used.map(c => CAT_COLOR[c]),
    stroke: {colors: ["#3D2450"], width: 2}, legend: {position: "bottom"}
  }).render();

  // Bar chart: spending per week of the month (days 1-7 = week 1, and so on)
  const wk = [0, 0, 0, 0];
  expenses.forEach(e => { const d = +e.date.slice(8, 10); wk[Math.min(Math.ceil(d / 7), 4) - 1] += e.amt; });
  new ApexCharts(document.getElementById("barChart"), {
    chart: {type: "bar", height: 300, toolbar: {show: false}, fontFamily: chartFont},
    series: [{name: "Spent (RM)", data: wk.map(v => +v.toFixed(2))}],
    xaxis: {categories: ["Week 1", "Week 2", "Week 3", "Week 4"]},
    colors: ["#FFC1DC"], stroke: {show: true, width: 3, colors: ["#3D2450"]},
    plotOptions: {bar: {borderRadius: 8, columnWidth: "55%"}}, dataLabels: {enabled: false}
  }).render();
}