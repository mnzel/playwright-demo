# Spec: Register and Login

## Purpose
Verify a new user can create an account, log out, and log back in with those credentials. Also covers negative login cases.

---

## Test: Register a new account and log back in

**Preconditions:** `localStorage` is cleared; app is at `/register`.

| Step | Action | Expected result |
|------|--------|-----------------|
| 1 | Navigate to `/register` | "Create an account" heading visible |
| 2 | Fill `[data-testid=register-name]` with a unique full name | — |
| 3 | Fill `[data-testid=register-email]` with a unique email | — |
| 4 | Fill `[data-testid=register-password]` with a valid password | — |
| 5 | Fill `[data-testid=register-confirm]` with the same password | — |
| 6 | Click `[data-testid=register-submit]` | Redirected to `/`; "Account created!" toast shown |
| 7 | Verify `[data-testid=account-menu]` contains the registered name | User is authenticated |
| 8 | Verify `ec_users_v1` in localStorage contains the registered email | Credentials persisted |
| 9 | Click `[data-testid=account-menu]` then `[data-testid=account-menu-logout]` | Redirected to `/`; account menu shows "Account" |
| 10 | Click `[data-testid=account-menu]` then `[data-testid=account-menu-login]` | Navigated to `/login` |
| 11 | Fill login form with the previously registered email and password | — |
| 12 | Click `[data-testid=login-submit]` | Redirected to `/`; "Welcome back!" toast; account menu shows name |

---

## Test: Login with invalid credentials shows error

| Step | Action | Expected result |
|------|--------|-----------------|
| 1 | Navigate to `/login` | Login form visible |
| 2 | Fill email with `wrong@example.com`, password with `badpass` | — |
| 3 | Click `[data-testid=login-submit]` | `[data-testid=login-error]` is visible with text matching `/invalid/i` |
| 4 | Verify URL remains `/login` | User not redirected |

---

## Test: Registration fails with mismatched passwords

| Step | Action | Expected result |
|------|--------|-----------------|
| 1 | Navigate to `/register` | — |
| 2 | Fill all fields; set confirm password to something different | — |
| 3 | Click `[data-testid=register-submit]` | Field-level error `[data-testid=register-confirm-error]` visible with "Passwords do not match"; user stays on `/register` |

> **Note:** Mismatched passwords render as a field-level inline error on the confirm input, not as the form-level `register-error` banner. The form-level banner only appears for business errors (e.g. duplicate email).

---

## Test: Registration fails for duplicate email

| Step | Action | Expected result |
|------|--------|-----------------|
| 1 | Navigate to `/register` | — |
| 2 | Fill form using `test@example.com` (the seeded demo user) | — |
| 3 | Click `[data-testid=register-submit]` | `[data-testid=register-error]` visible; message contains "already exists" |

---

## Data notes
- Unique test emails: generate with timestamp to avoid cross-test collision.
- Credentials read from `process.env.DEMO_EMAIL` / `process.env.DEMO_PASSWORD` for the seeded user.
