# Angular Role-Based Login App

An Angular application with **login, role-based access, and page-visit tracking**.
It has no backend. The browser's **localStorage** works as the database.

**Live demo:** `https://angular-project-mind-milieu.vercel.app/login`

---

## Tech Stack

| Item      | Detail                             |
| --------- | ---------------------------------- |
| Framework | Angular 18 (standalone components) |
| Language  | TypeScript, HTML, CSS              |
| Storage   | Browser localStorage               |
| Hosting   | Vercel                             |

---

## Features

- **Login** with username and password (wrong credentials show an error)
- **Redirect to Home** after a successful login
- **Protected pages**: users who are not logged in are sent to the login page
- **Role-based access**: only `admin` can open the Summary page
- **Visit tracking**: every page a `member` opens is saved with the time
- **Summary page**: shows the visit count and all visit times for every user
- **Clear visits** button (Delete operation)
- **Logout**

---

## Roles and Login Credentials

| Username           | Password          | Role   |
| ------------------ | ----------------- | ------ |
| `user1@localhost`  | `user1@12345678`  | member |
| `user2@localhost`  | `user2@12345678`  | member |
| `admin1@localhost` | `admin1@87651234` | admin  |

| Role   | Home page | Summary page            |
| ------ | --------- | ----------------------- |
| admin  | Yes       | Yes                     |
| member | Yes       | No (redirected to Home) |

---

## Project Structure

```
src/app/
├── models/models.ts           Types: Role, User, SessionUser, Visit
├── services/
│   ├── auth.service.ts        Login, logout, session, role check
│   └── visit.service.ts       Save and read page visits
├── guards/
│   ├── auth.guard.ts          Blocks pages if the user is not logged in
│   └── admin.guard.ts         Blocks Summary if the user is not admin
├── pages/
│   ├── login/                 Login form
│   ├── home/                  Welcome page for all users
│   └── summary/               Visit table (admin only)
├── app.routes.ts              URL to page mapping, with guards
├── app.component.ts           Root component, tracks member visits
└── app.config.ts              App setup (router)
```

---

## How It Works

### 1. Login flow

```
Login page -> AuthService.login()
   -> checks "users" in localStorage
   -> match: saves "currentUser" and goes to /home
   -> no match: shows "Invalid username or password"
```

### 2. Page protection flow

```
User opens a URL
   -> Router runs the guards
   -> authGuard: logged in? No -> /login
   -> adminGuard (Summary only): admin? No -> /home
   -> all pass -> the page opens
```

### 3. Visit tracking flow

```
Page changes -> Router fires "NavigationEnd"
   -> AppComponent checks the user
   -> role is member and page is not /login?
        Yes -> VisitService.track() saves the visit
        No (admin) -> nothing is saved
```

### 4. Summary flow

```
Admin opens /summary
   -> VisitService.getSummary() reads "visits"
   -> groups the visits by username (count + times)
   -> the table shows the result
```

---

## localStorage Data

| Key           | Content                                            | Written by     |
| ------------- | -------------------------------------------------- | -------------- |
| `users`       | The 3 default users, saved on the first run (seed) | `AuthService`  |
| `currentUser` | Logged-in username and role (no password)          | `AuthService`  |
| `visits`      | List of member visits (username, page, time)       | `VisitService` |

You can view them in the browser: DevTools (F12) -> Application -> Local Storage.

### CRUD with localStorage

| Operation | Method                                               |
| --------- | ---------------------------------------------------- |
| Create    | `VisitService.track()`                               |
| Read      | `VisitService.getAll()`, `VisitService.getSummary()` |
| Delete    | `VisitService.clear()`                               |

---

## Run Locally

**Requirements:** Node.js 18.19+ or 20.11+ and npm.

```bash
# 1. Clone the repository
git clone <your-repository-url>
cd angular-assessment

# 2. Install dependencies
npm install

# 3. Start the app
ng serve
```

Open `http://localhost:4200` in your browser.

If `ng` is not recognized, use `npx ng serve`.

---

## Build and Deploy

```bash
ng build
```

The output goes to `dist/angular-assessment/browser`.

### Deploy on Vercel

| Setting          | Value                             |
| ---------------- | --------------------------------- |
| Framework Preset | Angular                           |
| Build Command    | `ng build`                        |
| Output Directory | `dist/angular-assessment/browser` |

The `vercel.json` file sends all URLs to `index.html`, so refreshing on `/home` or `/summary` does not give a 404 error:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## Test Checklist

| Test                                                    | Expected result           |
| ------------------------------------------------------- | ------------------------- |
| Open `/home` without login                              | Redirected to `/login`    |
| Login with a wrong password                             | Error message             |
| Login as `user1@localhost`                              | Goes to `/home`           |
| Member opens `/summary`                                 | Redirected to `/home`     |
| Member opens Home a few times, then admin opens Summary | Count and times are shown |
| Admin visits                                            | Not counted               |
| Refresh `/summary` on the live site                     | Works, no 404             |

---

## Limitations

- **Passwords are stored as plain text in localStorage.** This is only for the assessment. A real app needs a backend, hashed passwords, and a JWT token.
- **Guards protect only the frontend.** Real security needs backend checks.
- **A page refresh counts as a new visit**, because a reload also fires `NavigationEnd`.
- **Data is stored per browser.** The same user on another browser or device has separate data.

---

## Key Concepts Used

| Concept                           | Where it is used                 |
| --------------------------------- | -------------------------------- |
| Standalone components             | All pages                        |
| Routing                           | `app.routes.ts`                  |
| Route guards (`CanActivateFn`)    | `authGuard`, `adminGuard`        |
| Services and dependency injection | `AuthService`, `VisitService`    |
| Router events (RxJS)              | Visit tracking in `AppComponent` |
| Two-way binding (`ngModel`)       | Login form                       |
| Control flow (`@if`, `@for`)      | Templates                        |
| Pipes                             | `date` pipe on the Summary page  |
| localStorage                      | Users, session, visits           |
