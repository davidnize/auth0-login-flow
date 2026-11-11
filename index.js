require("dotenv").config();

const express = require("express");
const { auth, requiresAuth } = require("express-openid-connect");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
const baseURL = process.env.AUTH0_BASE_URL || "http://localhost:3000";

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
};

app.use(express.static(path.join(__dirname, "public")));
app.use(auth(config));

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function safeImageUrl(value) {
  if (!value) return "";
  try {
    const url = new URL(value);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.href;
    }
  } catch {
    return "";
  }
  return "";
}

function layout({ title, body }) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <main class="page">
      <header class="brand">
        <a class="logo" href="/">
          <span class="mark" aria-hidden="true"></span>
          Auth0 Login Flow
        </a>
        <span class="eyebrow">MLH x Auth0</span>
      </header>
      ${body}
    </main>
  </body>
</html>`;
}

app.get("/", (req, res) => {
  const isAuthenticated = req.oidc.isAuthenticated();
  const name = escapeHtml(req.oidc.user?.name || req.oidc.user?.nickname || "there");

  const body = isAuthenticated
    ? `
      <section class="card">
        <p class="eyebrow">Welcome back</p>
        <h1>You are signed in, ${name}.</h1>
        <div class="status in">Logged in</div>
        <p>Your Auth0 session is active. Open your profile to see the details returned by Universal Login.</p>
        <div class="actions">
          <a class="btn btn-primary" href="/profile">View profile</a>
          <a class="btn btn-ghost" href="/logout">Log out</a>
        </div>
      </section>
      <p class="foot">This demo uses Auth0 and the express-openid-connect SDK.</p>
    `
    : `
      <section class="card">
        <p class="eyebrow">Getting started</p>
        <h1>Set up your first Auth0 log-in flow.</h1>
        <div class="status out">Logged out</div>
        <p>Sign in with Auth0 Universal Login to see a protected profile page with your name, email, and picture.</p>
        <div class="actions">
          <a class="btn btn-primary" href="/login">Log in</a>
        </div>
      </section>
      <p class="foot">A small demo for the MLH x Auth0 challenge.</p>
    `;

  res.send(layout({ title: "Auth0 Login Flow", body }));
});

app.get("/profile", requiresAuth(), (req, res) => {
  const user = req.oidc.user || {};
  const name = escapeHtml(user.name || user.nickname || "User");
  const email = escapeHtml(user.email || "Not provided");
  const picture = safeImageUrl(user.picture);

  const body = `
    <section class="card">
      <p class="eyebrow">Protected route</p>
      <h1>Your profile</h1>
      <div class="profile">
        ${picture ? `<img class="avatar" src="${escapeHtml(picture)}" alt="${name}'s profile photo" width="88" height="88" />` : ""}
        <div class="meta">
          <h2>${name}</h2>
          <p>${email}</p>
        </div>
      </div>
      <p>This page is protected with <code>requiresAuth()</code>, so only signed-in users can see it.</p>
      <div class="actions">
        <a class="btn btn-ghost" href="/">Back home</a>
        <a class="btn btn-primary" href="/logout">Log out</a>
      </div>
    </section>
  `;

  res.send(layout({ title: "Profile · Auth0 Login Flow", body }));
});

app.listen(port, () => {
  console.log(`Server running at ${baseURL}`);
});
