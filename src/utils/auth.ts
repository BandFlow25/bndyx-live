// src/utils/auth.ts
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  uid: string;
  email: string;
  roles?: string[];
  displayName?: string;
  photoURL?: string;
  exp: number;
}

/**
 * Type definition for the BndyUser
 */
export interface BndyUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  roles: string[];
}

/**
 * Check if user is authenticated by validating JWT token
 * @returns User object or null if not authenticated
 */
export function getAuthenticatedUser(): BndyUser | null {
  try {
    if (typeof window === 'undefined') return null;
    
    const token = localStorage.getItem('bndyAuthToken');
    if (!token) return null;
    
    const decoded = jwtDecode<TokenPayload>(token);
    
    // Check if token is expired
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('bndyAuthToken');
      return null;
    }
    
    return {
      uid: decoded.uid,
      email: decoded.email || null,
      displayName: decoded.displayName || null,
      photoURL: decoded.photoURL || null,
      roles: decoded.roles || ['user'],
    };
  } catch (error) {
    console.error('Token validation error:', error);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bndyAuthToken');
    }
    return null;
  }
}

/**
 * Get the authentication token
 * @returns JWT token or null if not authenticated
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('bndyAuthToken');
}

/**
 * Check if user has a specific role
 * @param role Role to check
 * @returns true if user has the role, false otherwise
 */
export function hasRole(role: string): boolean {
  const user = getAuthenticatedUser();
  if (!user || !user.roles) return false;
  return user.roles.includes(role);
}

/**
 * Get authenticated request headers including auth token
 * @returns Headers object with Authorization header
 */
export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

/**
 * Fetch with authentication headers
 * @param url URL to fetch
 * @param options Fetch options
 * @returns Response from fetch
 */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = getAuthHeaders();
  
  return fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  });
}

/**
 * Create URL to the auth service for login, signup, etc.
 * @param path Path within the auth service (e.g., /login)
 * @param params Additional query parameters
 * @returns Full URL to the auth service
 */
export function createAuthUrl(path: string, params: Record<string, string> = {}): string {
  const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://bndy.co.uk';
  const url = new URL(`${AUTH_URL}${path}`);
  
  // Store current path for redirect back after auth
  if (typeof window !== 'undefined') {
    localStorage.setItem('authRedirectTo', window.location.pathname);
  }
  
  // Add redirect parameter pointing to this app's callback URL
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
  params.redirect = `${APP_URL}/auth/callback`;
  
  // Add all params to URL
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  
  return url.toString();
}

/**
 * Redirect to login page on auth service
 * @param action Optional action to perform after successful login
 * @param id Optional ID related to the action
 */
export function redirectToLogin(action?: string, id?: string): void {
  const params: Record<string, string> = {};
  if (action) params.action = action;
  if (id) params.id = id;
  
  window.location.href = createAuthUrl('/login', params);
}

/**
 * Sign out the user both locally and on the auth service
 */
export async function signOut(): Promise<void> {
  const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://bndy.co.uk';
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
  
  try {
    // Remove token from localStorage
    localStorage.removeItem('bndyAuthToken');
    
    // Call auth service logout endpoint
    await fetch(`${AUTH_URL}/api/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ returnTo: APP_URL }),
    });
    
    // Redirect to home page
    window.location.href = '/';
  } catch (error) {
    console.error('Logout error:', error);
    // Even if the server logout fails, clear local storage and redirect
    window.location.href = '/';
  }
}