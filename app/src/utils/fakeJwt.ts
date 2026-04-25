// Fake JWT — base64-encoded payload, not signed. Demo only.
// Do not use this for anything resembling real authentication.

export interface JwtPayload {
  sub: string;
  name: string;
  iat: number;
  exp: number;
}

function base64Encode(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

function base64Decode(str: string): string | null {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch {
    return null;
  }
}

export function createFakeJwt(payload: { sub: string; name: string }): string {
  const header = base64Encode(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const body = base64Encode(
    JSON.stringify({
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24h
    })
  );
  return `${header}.${body}.fake-signature`;
}

export function decodeFakeJwt(token: string | null | undefined): JwtPayload | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const decoded = base64Decode(parts[1]!);
  if (!decoded) return null;
  try {
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

export function isJwtExpired(token: string | null | undefined): boolean {
  const payload = decodeFakeJwt(token);
  if (!payload || !payload.exp) return true;
  return Date.now() / 1000 > payload.exp;
}
