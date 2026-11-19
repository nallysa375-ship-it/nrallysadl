/* =====================================================================
   login.js: log in, sign up and forgot password (all simulated).
   Accounts are kept in this browser only, not in a real database.
   ===================================================================== */
const err = document.getElementById("loginError");    // the message box above the forms

// Shows a red message, or a green one when ok is true
const showMsg = (text, ok) => { err.textContent = text; err.className = "alert " + (ok ? "alert-success" : "alert-danger"); };

/* ---------- Saved accounts: { username: { p: password, hint: recovery word } } ---------- */
const getUsers = () => { try { return JSON.parse(localStorage.getItem("pp_users")) || {}; } catch (e) { return {}; } };
const saveUsers = u => { try { localStorage.setItem("pp_users", JSON.stringify(u)); return true; } catch (e) { return false; } };
const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);     // safe check that a username really exists
const pwOf = acc => typeof acc === "string" ? acc : acc.p;            // older accounts stored just the password

/* ---------- Three views share one card: log in, sign up, forgot password ---------- */
const views = {login: loginForm, signup: signupForm, forgot: forgotForm};
const texts = {                                                       // title and description for each view
  login:  ["Welcome back", "Log in to open your pocket."],
  signup: ["Welcome", "Create an account to start tracking your spending."],
  forgot: ["Reset your password", "Enter your username and recovery word, then choose a new password."]
};

// Show one view and hide the others
const show = v => {
  Object.keys(views).forEach(k => views[k].classList.toggle("d-none", k !== v));
  tabLogin.classList.toggle("on", v === "login");
  tabSignup.classList.toggle("on", v === "signup");
  formTitle.textContent = texts[v][0];
  formDesc.textContent = texts[v][1];
  err.className = "alert d-none";                                     // hide any old message
};
tabLogin.onclick = () => show("login");
tabSignup.onclick = () => show("signup");
goForgot.onclick = () => show("forgot");
backLogin.onclick = () => show("login");

/* ---------- Log in: the built-in student account or any account made with Sign up ---------- */
loginForm.addEventListener("submit", e => {
  e.preventDefault();                                                 // stop the page from reloading
  const u = user.value.trim(), p = pass.value, users = getUsers();
  if (!u || !p) return showMsg("Enter your username and password.");
  if ((u === USER && p === PASS) || (own(users, u) && pwOf(users[u]) === p)) {
    sessionStorage.setItem("user", u);                                // remember who is logged in
    location.href = "dashboard.html";
  } else showMsg("Invalid username or password. Try again.");
});

/* ---------- Sign up: check the details, save the account, then go back to Log in ---------- */
signupForm.addEventListener("submit", e => {
  e.preventDefault();
  const u = newUser.value.trim(), p = newPass.value, p2 = newPass2.value, w = newWord.value.trim().toLowerCase(), users = getUsers();
  if (u.length < 3) return showMsg("Username must be at least 3 characters.");
  if (u.length > 20) return showMsg("Username must be 20 characters or fewer.");
  if (u === USER || own(users, u)) return showMsg("That username is already taken.");
  if (p.length < 6) return showMsg("Password must be at least 6 characters.");
  if (p !== p2) return showMsg("The two passwords do not match.");
  if (w.length < 3) return showMsg("Recovery word must be at least 3 characters.");
  users[u] = {p, hint: w};
  if (!saveUsers(users)) return showMsg("Could not save the account in this browser.");
  show("login");
  user.value = u; pass.value = "";                                    // fill in the username for them
  showMsg("Account created! Log in with your new username.", true);
});

/* ---------- Forgot password: the username and recovery word must match, then a new password is saved ---------- */
forgotForm.addEventListener("submit", e => {
  e.preventDefault();
  const u = fUser.value.trim(), w = fWord.value.trim().toLowerCase(), p = fPass.value, p2 = fPass2.value, users = getUsers();
  const acc = own(users, u) ? users[u] : null;
  if (!acc || typeof acc === "string" || acc.hint !== w) return showMsg("Username or recovery word is not correct.");
  if (p.length < 6) return showMsg("New password must be at least 6 characters.");
  if (p !== p2) return showMsg("The two passwords do not match.");
  acc.p = p;
  if (!saveUsers(users)) return showMsg("Could not save the new password in this browser.");
  show("login");
  user.value = u; pass.value = "";
  showMsg("Password changed! Log in with your new password.", true);
  forgotForm.reset();
});