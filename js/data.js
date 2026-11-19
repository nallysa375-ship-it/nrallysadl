/* =====================================================================
   data.js: the shared data and helper functions used by every page.
   It is loaded first on every page, so the other scripts can use it.
   ===================================================================== */

/* ---------- 1. Built-in demo login (simulated, no database) ---------- */
const USER = "student", PASS = "pocket2026";

/* ---------- 2. Categories, suggested budgets and sample spending ---------- */
// Suggested monthly budget (RM) for each category. Users can change these on the Budget page.
const DEFAULT_BUDGET = {Food:150, Transport:60, Study:50, Bills:40, Fun:60, Shopping:80};
const CATS = Object.keys(DEFAULT_BUDGET);   // the list of category names

// Sample spends, used by the demo account and the "Try with sample data" button
const SAMPLE = [
  {date:"2026-11-01", item:"Nasi lemak",        cat:"Food",      amt:6.5},
  {date:"2026-11-02", item:"Bus to campus",     cat:"Transport", amt:4},
  {date:"2026-11-03", item:"Printing notes",    cat:"Study",     amt:8.2},
  {date:"2026-11-04", item:"Phone bill",        cat:"Bills",     amt:30},
  {date:"2026-11-06", item:"Cafe with friends", cat:"Fun",       amt:24.9},
  {date:"2026-11-08", item:"Lunch",             cat:"Food",      amt:9},
  {date:"2026-11-09", item:"Grab to the mall",  cat:"Transport", amt:12.5},
  {date:"2026-11-10", item:"Highlighters",      cat:"Study",     amt:11.9},
  {date:"2026-11-12", item:"Tote bag",          cat:"Shopping",  amt:35},
  {date:"2026-11-14", item:"Dinner",            cat:"Food",      amt:14},
  {date:"2026-11-18", item:"Movie ticket",      cat:"Fun",       amt:16},
  {date:"2026-11-22", item:"Groceries",         cat:"Food",      amt:42.3},
  {date:"2026-11-25", item:"Notebook set",      cat:"Study",     amt:18}
];

// One colour per category, used on every page so a colour always means the same thing
const CAT_COLOR = {Food:"#FFB199", Transport:"#8EDDC8", Study:"#C7B2FF", Bills:"#A9D8FF", Fun:"#FF9EC7", Shopping:"#CBEBA0"};

/* ---------- 3. Saved data ----------
   Every user has their own data, saved in this browser (localStorage).
   New accounts start empty; the demo account starts with the sample spends. */
const me = sessionStorage.getItem("user");          // who is logged in (null if nobody)
const key = k => "pp_" + k + "_" + me;              // each user gets their own storage keys

// Read saved data, or use the fallback if nothing was saved yet (or storage is unavailable)
const load = (k, fallback) => {
  try { const v = JSON.parse(localStorage.getItem(key(k))); return v === null ? fallback : v; }
  catch (e) { return fallback; }
};
let expenses = load("expenses", me === USER ? SAMPLE.map(e => ({...e})) : []);   // the list of spends
const BUDGET = load("budget", {...DEFAULT_BUDGET});                              // budget for each category
let LIMIT = load("limit", null);                                                // own monthly limit (null = use the category budgets)

// Save the current data
const save = () => {
  try {
    localStorage.setItem(key("expenses"), JSON.stringify(expenses));
    localStorage.setItem(key("budget"), JSON.stringify(BUDGET));
    localStorage.setItem(key("limit"), JSON.stringify(LIMIT));
  } catch (e) {}
};

// Small yes/no notes, for example "the guide was hidden"
const getFlag = k => { try { return localStorage.getItem(key(k)) === "1"; } catch (e) { return false; } };
const setFlag = k => { try { localStorage.setItem(key(k), "1"); } catch (e) {} };

/* ---------- 4. Helper functions ---------- */
const rm = n => "RM " + n.toFixed(2);                                          // 8 becomes "RM 8.00"
const esc = t => t.replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));   // makes text safe to show in HTML
const spentBy = c => expenses.filter(e => e.cat === c).reduce((s,e) => s + e.amt, 0);                // total spent in one category