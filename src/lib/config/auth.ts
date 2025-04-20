// src/lib/config/auth.ts

// Base URL for bndy-landing (auth hub)
export const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://bndy.co.uk';

// Local storage key for storing the auth token
export const AUTH_TOKEN_KEY = 'bndy_auth_token';

// Map roles to display properties
export const ROLE_DISPLAY = {
  'GODMODE': {
    color: '#FFD700',  // Gold
    label: 'Admin'
  },
  'live_admin': {
    color: '#C0C0C0',  // Silver
    label: 'Staff'
  },
  'live_builder': {
    color: '#CD7F32',  // Bronze
    label: 'Builder'
  },
  'live_giggoer': {
    color: '#0EA5E9',  // Blue
    label: 'GigGoer'
  }
};