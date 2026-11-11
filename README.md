# Auth0 Login Flow

A simple authentication demo built with **Node.js, Express, and Auth0** as my submission for the **MLH x Auth0 challenge – Set up your first Auth0 log-in flow** during MLH Global Hack Week.

The project follows the official Auth0 Express Quickstart and demonstrates how to integrate Auth0 Universal Login into an Express application, manage authenticated sessions, and protect routes that require users to be signed in.

## Features

- **Auth0 Universal Login:** Authenticate users through Auth0's hosted login experience.
- **Session Management:** Maintain user authentication state using the `express-openid-connect` SDK.
- **Protected Profile Page:** Restrict access to the profile route to authenticated users.
- **User Information:** Display the authenticated user's name, email address, and profile picture when available.
- **Login and Logout:** Support signing in and securely logging out through Auth0.
- **Authentication Status:** Display different home page content depending on whether a user is authenticated.
- **Environment Variables:** Keep application credentials and session secrets outside the source code.

## Tech Stack

- **Node.js** – JavaScript runtime.
- **Express 5** – Web application framework.
- **Auth0** – Authentication and identity management.
- **express-openid-connect** – Auth0's OpenID Connect integration for Express.
- **dotenv** – Environment variable management.
- **Nodemon** – Automatic server restarts during development.
- **HTML & CSS** – Application interface.

## Project Structure

```text
auth0-login-flow/
├── public/
│   └── styles.css
├── .env.example
├── .gitignore
├── index.js
├── package.json
├── package-lock.json
└── README.md
```

## Getting Started

Follow these steps to run the application locally.

### Prerequisites

Make sure you have:

- [Node.js](https://nodejs.org/) version 18 or higher.
- npm (included with Node.js).
- An [Auth0 account](https://auth0.com/signup).

### 1. Clone the repository

```bash
git clone https://github.com/davidnize/auth0-login-flow.git
```

Navigate into the project directory:

```bash
cd auth0-login-flow
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Auth0

Before running the application, you need to create an application in your Auth0 dashboard.

1. Log in to your [Auth0 Dashboard](https://manage.auth0.com/).
2. Navigate to Applications → Applications.
3. Select Create Application.
4. Give your application a name, for example, `Auth0 Login Flow`.
5. Select Regular Web Application as the application type.
6. Create the application.

Once your application has been created, open its Settings tab.

Under Application URIs, configure the following:

| Setting               | URL                              |
| --------------------- | -------------------------------- |
| Allowed Callback URLs | `http://localhost:3000/callback` |
| Allowed Logout URLs   | `http://localhost:3000`          |
| Allowed Web Origins   | `http://localhost:3000`          |

Click Save Changes.

These URLs allow Auth0 to redirect users back to the application after authentication and handle logout redirects.

### 4. Configure environment variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Open the `.env` file and provide your Auth0 application credentials:

```
AUTH0_SECRET=your-long-random-secret
AUTH0_BASE_URL=http://localhost:3000
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_ISSUER_BASE_URL=https://YOUR_AUTH0_DOMAIN
PORT=3000
```

Replace the placeholder values with your actual credentials.

| Variable                | Description                                                           |
| ----------------------- | --------------------------------------------------------------------- |
| `AUTH0_SECRET`          | A random secret used to encrypt the application session.              |
| `AUTH0_BASE_URL`        | The base URL where your Express application runs.                     |
| `AUTH0_CLIENT_ID`       | The Client ID of your Auth0 application.                              |
| `AUTH0_ISSUER_BASE_URL` | Your Auth0 tenant domain, including `https://`.                       |
| `PORT`                  | The port on which the application runs. Optional; defaults to `3000`. |

You can generate a secure session secret using:

```bash
openssl rand -hex 32
```

Find your Client ID and Domain under:

Auth0 Dashboard → Applications → Your Application → Settings

For example, your issuer URL should look like:

```bash
https://dev-abc123.us.auth0.com
```

Important: Never commit your `.env` file or expose your Auth0 credentials and session secret publicly.

### 5. Run the application

For normal execution:

```bash
npm start
```

For development with Nodemon:

```bash
npm run dev
```

The application will be available at:

http://localhost:3000

## Application Routes

The application uses the following routes:

| Route           | Access         | Description                                            |
| --------------- | -------------- | ------------------------------------------------------ |
| `GET /`         | Public         | Displays the home page and authentication status.      |
| `GET /login`    | Public         | Initiates the Auth0 Universal Login flow.              |
| `GET /callback` | Auth0 callback | Handles the authentication response from Auth0.        |
| `GET /profile`  | Protected      | Displays the authenticated user's profile information. |
| `GET /logout`   | Public         | Logs the user out and redirects them to the home page. |

The login, callback, and logout routes are handled by the `express-openid-connect` middleware.

The `/profile` route uses `requiresAuth()` to ensure that only authenticated users can access it.

## How Authentication Works

The application uses the OpenID Connect protocol through Auth0's `express-openid-connect` SDK.

The authentication flow works as follows:

1. A user visits the application at `http://localhost:3000`.
2. The home page checks whether the user is authenticated.
3. If the user is logged out, they can select Log in.
4. The application redirects the user to Auth0 Universal Login.
5. The user authenticates through Auth0.
6. Auth0 redirects the user to the application's `/callback` route.
7. The SDK processes the authentication response and establishes an authenticated session.
8. The user is redirected back to the application.
9. The home page now displays the authenticated user's name and a link to their profile.
10. The user can visit `/profile` to see their available profile information.
11. Selecting Log out ends the session and redirects the user back to the home page.

### Route Protection

The profile route is protected using the `requiresAuth()` middleware:

```
app.get("/profile", requiresAuth(), (req, res) => {
  const user = req.oidc.user || {};

  // Display authenticated user information
});
```

The middleware checks authentication before allowing access to the route.

### Authentication State

The home page uses:

```
const isAuthenticated = req.oidc.isAuthenticated();
```

This determines which content to display:

- Authenticated users see a welcome message, their login status, and links to their profile and logout.
- Unauthenticated users see the getting-started message and a login link.

### User Profile Information

The authenticated user's information is available through:

```
req.oidc.user
```

The application uses the following properties when available:

- `name` – User's display name.
- `nickname` – Fallback when a name is unavailable.
- `email` – User's email address.
- `picture` – User's profile picture URL.

The application also escapes HTML output and validates profile picture URLs to allow only HTTP and HTTPS protocols.

## Available npm Scripts

| Command       | Description                                           |
| ------------- | ----------------------------------------------------- |
| `npm start`   | Starts the Express application.                       |
| `npm run dev` | Starts the application using Nodemon for development. |

## Learning Outcomes

Through this challenge, I explored:

- Setting up an Auth0 application as a Regular Web Application.
- Integrating Auth0 with an Express application.
- Understanding the basics of OpenID Connect authentication.
- Implementing Auth0 Universal Login.
- Configuring callback and logout URLs.
- Managing authentication sessions.
- Protecting Express routes using authentication middleware.
- Accessing authenticated user information.
- Managing application secrets through environment variables.

## Acknowledgements

- [Auth0 Express Quickstart](https://auth0.com/docs/quickstart/webapp/express)
- [Auth0 Documentation](https://auth0.com/docs)
- [Major League Hacking (MLH)](https://mlh.io/) – Global Hack Week.

Built as part of the MLH x Auth0 – Set up your first Auth0 log-in flow challenge.

## Author

David Nizeyimana

- GitHub: [@davidnize](https://github.com/davidnize)

## License

This project is licensed under the MIT License.
