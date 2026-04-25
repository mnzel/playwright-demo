import { createContext, useContext, useEffect, useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import { createFakeJwt, isJwtExpired } from '../utils/fakeJwt.ts';
import { readFromStorage, writeToStorage } from '../hooks/useLocalStorage.ts';
import type { AuthState, StoredUser, User } from '../types.ts';

interface AuthResult {
  ok: boolean;
  error?: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => AuthResult;
  register: (name: string, email: string, password: string) => AuthResult;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'ec_auth_v1';
const USERS_KEY = 'ec_users_v1';
const SESSION_MIRROR_KEY = 'ec_session_token';

// Demo user — auto-seeded so the app is usable on first load.
const DEFAULT_USERS: StoredUser[] = [
  {
    email: 'test@example.com',
    password: 'Password123!',
    name: 'Test Customer',
  },
];

function ensureSeededUsers(): StoredUser[] {
  const existing = readFromStorage<StoredUser[] | null>(USERS_KEY, null);
  if (!existing || !Array.isArray(existing) || existing.length === 0) {
    writeToStorage(USERS_KEY, DEFAULT_USERS);
    return DEFAULT_USERS;
  }
  if (!existing.some((u) => u.email === DEFAULT_USERS[0]!.email)) {
    const merged = [...existing, ...DEFAULT_USERS];
    writeToStorage(USERS_KEY, merged);
    return merged;
  }
  return existing;
}

function readUsers(): StoredUser[] {
  return readFromStorage<StoredUser[]>(USERS_KEY, DEFAULT_USERS);
}

const EMPTY_AUTH: AuthState = { user: null, token: null };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(() => {
    ensureSeededUsers();
    const stored = readFromStorage<AuthState | null>(STORAGE_KEY, null);
    if (!stored || !stored.token || isJwtExpired(stored.token)) {
      return EMPTY_AUTH;
    }
    return stored;
  });

  useEffect(() => {
    if (authState.token) {
      writeToStorage(STORAGE_KEY, authState);
      try {
        window.sessionStorage.setItem(SESSION_MIRROR_KEY, authState.token);
      } catch {
        /* ignore */
      }
    } else {
      writeToStorage(STORAGE_KEY, null);
    }
  }, [authState]);

  const login = useCallback((email: string, password: string): AuthResult => {
    const users = readUsers();
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) {
      return { ok: false, error: 'Invalid email or password' };
    }
    const token = createFakeJwt({ sub: user.email, name: user.name });
    setAuthState({ user: { email: user.email, name: user.name }, token });
    return { ok: true };
  }, []);

  const register = useCallback((name: string, email: string, password: string): AuthResult => {
    const users = readUsers();
    if (users.some((u) => u.email === email)) {
      return { ok: false, error: 'An account with that email already exists' };
    }
    const newUser: StoredUser = { name, email, password };
    const updated = [...users, newUser];
    writeToStorage(USERS_KEY, updated);
    const token = createFakeJwt({ sub: email, name });
    setAuthState({ user: { email, name }, token });
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    setAuthState(EMPTY_AUTH);
  }, []);

  const value: AuthContextValue = {
    user: authState.user,
    token: authState.token,
    isAuthenticated: Boolean(authState.token && !isJwtExpired(authState.token)),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
