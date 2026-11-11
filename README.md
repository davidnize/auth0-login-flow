# Auth0 Login Flow

A small Node.js + Express demo that sets up a first Auth0 log-in flow with the official [`express-openid-connect`](https://github.com/auth0/express-openid-connect) SDK.

This project was built for the [MLH x Auth0 challenge](https://www.mlh.com/partners/auth0): **Set up your first Auth0 log-in flow**. Submission is a link to this code repository.

It includes:

- A public home page that shows whether you are logged in or out
- Built-in **Log in** (`/login`) and **Log out** (`/logout`) routes from the Auth0 SDK
- A protected `/profile` page (`requiresAuth`) that shows the user's name, email, and picture

Follows the official Auth0 Express quickstart: [Add Login to Your Express Application](https://auth0.com/docs/quickstart/webapp/express).

## Screenshots

Add screenshots here after you run the app and complete a login:

- Home page (logged out)
- Auth0 Universal Login
- Home page (logged in)
- Profile page with name, email, and picture

## Prerequisites

- Node.js 18 or newer
- An [Auth0](https://auth0.com/) account (a free tenant is enough)

## Set up the Auth0 application

1. Go to the [Auth0 Dashboard](https://manage.auth0.com/).
2. Open **Applications** → **Create Application**.
3. Enter a name, for example `Auth0 Login Flow`.
4. Choose **Regular Web Application** and click **Create**.
5. Open the **Settings** tab and set these Application URIs:

   | Setting | Value |
   | --- | --- |
   | Allowed Callback URLs | `http://localhost:3000/callback` |
   | Allowed Logout URLs | `http://localhost:3000` |

6. Click **Save Changes**.
7. From **Basic Information**, copy:
   - **Domain** (for example `dev-abc123.us.auth0.com`)
   - **Client ID**

You do not need a Client Secret for this demo. The default login flow uses the authorization code flow with PKCE.

## Run the app locally

```bash
npm install
cp .env.example .env
```

Edit `.env` and fill in your values:

```bash
# Generate a session secret:
# openssl rand -hex 32
AUTH0_SECRET=paste-the-generated-secret-here
AUTH0_BASE_URL=http://localhost:3000
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_ISSUER_BASE_URL=https://YOUR_AUTH0_DOMAIN
```

`AUTH0_ISSUER_BASE_URL` must include `https://` and use your Auth0 Domain, for example `https://dev-abc123.us.auth0.com`.

Then start the server:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000). Click **Log in**, complete Auth0 Universal Login, then open **View profile**.

For auto-reload during development:

```bash
npm run dev
```

## Optional: deploy on Render

1. Push this repository to GitHub (or another Git host Render can access).
2. In Render, create a **Web Service** from that repo.
3. Use these settings:
   - **Runtime:** Node
   - **Build command:** `npm install`
   - **Start command:** `npm start`
4. Add environment variables in Render:

   | Key | Value |
   | --- | --- |
   | `AUTH0_SECRET` | A new long random string (`openssl rand -hex 32`) |
   | `AUTH0_BASE_URL` | Your public Render URL, for example `https://your-app.onrender.com` (no trailing slash) |
   | `AUTH0_CLIENT_ID` | The same Client ID from the Auth0 dashboard |
   | `AUTH0_ISSUER_BASE_URL` | `https://YOUR_AUTH0_DOMAIN` |

   Render sets `PORT` for you. The app already reads it.

5. In the Auth0 Dashboard, add the production URLs (comma-separated is fine, so you can keep localhost too):

   | Setting | Value |
   | --- | --- |
   | Allowed Callback URLs | `https://your-app.onrender.com/callback` |
   | Allowed Logout URLs | `https://your-app.onrender.com` |
   | Allowed Web Origins | `https://your-app.onrender.com` |

6. Save the Auth0 settings and deploy the Render service.


## Troubleshooting

On first start over `http://localhost:3000`, the Auth0 SDK may warn that `form_post` can cause login issues over HTTP. This is expected. Chrome usually still works if you finish login within a couple of minutes. If a browser drops the login cookie, try Chrome, or see the [express-openid-connect FAQ](https://github.com/auth0/express-openid-connect/blob/master/FAQ.md). This is not an issue once the app is served over HTTPS, such as on Render.

## Project layout

```
.
├── index.js          # Express app, Auth0 middleware, home and profile routes
├── public/styles.css # Dark theme
├── .env.example      # Placeholder environment variables
├── .gitignore
├── package.json
└── README.md
```

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `AUTH0_SECRET` | Yes | Session encryption secret, at least 32 characters |
| `AUTH0_BASE_URL` | No | App URL. Defaults to `http://localhost:3000` |
| `AUTH0_CLIENT_ID` | Yes | Auth0 application Client ID |
| `AUTH0_ISSUER_BASE_URL` | Yes | Auth0 issuer, `https://` + your tenant Domain |
| `PORT` | No | Server port. Defaults to `3000` |

Never commit a real `.env` file or secrets.
