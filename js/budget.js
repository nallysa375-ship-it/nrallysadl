/* =====================================================================
   budget.js: the Budget page.
   One colour card for each category, with a box to set your own budget.
   ===================================================================== */

/* ---------- 1. Draw one card for each category ---------- */
const render = () => {
  cards.innerHTML = CATS.map(c => {
    const s = spentBy(c), b = BUDGET[c];
    const pct = Math.round(s / b * 100), w = Math.min(pct, 100);                       // the meter never goes past 100%
    const msg = pct > 100 ? "Over budget by " + rm(s - b) : pct >= 80 ? "Almost at the limit" : rm(b - s) + " left";
    return `<div class="col-12 col-md-6 col-lg-4"><div class="pc bcard" style="--c:${CAT_COLOR[c]}">
      <span class="pill" style="background:${CAT_COLOR[c]}">${c}</span>
      <p class="big amt">${rm(s)}</p><p class="mb-2 text-muted">of ${rm(b)} budget</p>
      <div class="meter" role="progressbar" aria-label="${c} budget used" aria-valuenow="${w}" aria-valuemin="0" aria-valuemax="100"><span style="width:${w}%"></span></div>
      <p class="mt-2 mb-0 fw-bold">${pct}% used. ${msg}</p>
      <form class="setb" data-c="${c}" novalidate>
        <label class="visually-hidden" for="b-${c}">New budget for ${c} in RM</label>
        <input id="b-${c}" type="number" min="1" step="1" value="${b}" class="form-control">
        <button class="btn-go sm" type="submit">Set</button>
      </form></div></div>`;
  }).join("");
};
render();

/* ---------- 2. Set a new budget for one category ---------- */
cards.addEventListener("submit", ev => {
  ev.preventDefault();
  const f = ev.target, c = f.dataset.c, v = parseFloat(f.querySelector("input").value);
  if (!(v > 0)) { budgetMsg.textContent = "Type a budget above 0."; budgetMsg.className = "fw-bold text-danger"; return; }
  BUDGET[c] = v;
  save();
  setFlag("budgetSet");                                                                // marks step 2 of the starter guide as done
  render();                                                                            // redraw the cards with the new numbers
  budgetMsg.textContent = `Budget for ${c} is now ${rm(v)}.`; budgetMsg.className = "fw-bold text-success";
});