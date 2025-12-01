import type { User } from '../types/auth';

/**
 * Check if user is authenticated by verifying stored credentials
 */
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('cine-user-details');
}

/**
 * Get stored user details from localStorage
 */
export function getStoredUser(): User | null {
  try {
    const userDetails = localStorage.getItem('cine-user-details');
    return userDetails ? JSON.parse(userDetails) : null;
  } catch {
    return null;
  }
}

/**
 * Get authorization headers for API requests
 * Matches dashboard implementation exactly
 */
export function getAuthHeaders(): Record<string, string> {
  const userDetails = localStorage.getItem('cine-user-details');
  let accessToken: string | null = null;

  try {
    accessToken = userDetails ? JSON.parse(userDetails).accessToken : null;
  } catch {
    accessToken = null;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return headers;
}


export function storeUser(user: User): void {
  localStorage.setItem('cine-user-details', JSON.stringify(user));
}

export function clearUser(): void {
  localStorage.removeItem('cine-user-details');
}

/**
 * Get access token from stored user
 */
export function getAccessToken(): string | null {
  const user = getStoredUser();
  return user?.accessToken || null;
}
