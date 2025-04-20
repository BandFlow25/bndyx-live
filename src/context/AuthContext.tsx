// src/context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { db } from "@/lib/config/firebase";
import { AUTH_BASE_URL, AUTH_TOKEN_KEY } from "@/lib/config/auth";
import { DecodedToken, UserProfile, UserRole } from "@/lib/types";

interface AuthContextType {
  isAuthenticated: boolean;
  profile: UserProfile | null;
  isLoading: boolean;
  redirectToLogin: () => void;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  hasRole: (role: UserRole) => boolean;
  getHighestRole: () => UserRole | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Redirect to bndy-landing login page
  const redirectToLogin = () => {
    const returnUrl = encodeURIComponent(window.location.origin);
    window.location.href = `${AUTH_BASE_URL}/login?returnTo=${returnUrl}`;
  };

  // Log out the user
  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setToken(null);
    setIsAuthenticated(false);
    setProfile(null);
    
    // Redirect to logout page on bndy-landing
    const returnUrl = encodeURIComponent(window.location.origin);
    window.location.href = `${AUTH_BASE_URL}/auth/logout?returnTo=${returnUrl}`;
  };

  // Refresh the token
  const refreshToken = async (): Promise<boolean> => {
    try {
      const currentToken = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!currentToken) return false;
      
      const response = await fetch(`${AUTH_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: currentToken }),
        credentials: 'include', // Important for cookies
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem(AUTH_TOKEN_KEY, data.token);
          setToken(data.token);
          await loadUserProfile(data.token);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return false;
    }
  };

  // Check if user has a specific role
  const hasRole = (role: UserRole): boolean => {
    console.log(`Checking for role: ${role}, user roles:`, profile?.roles);
    
    if (!profile || !profile.roles) return false;
    
    // GODMODE users have access to everything
    if (profile.roles.includes('GODMODE')) return true;
    
    // Check for specific role permissions
    if (role === 'live_giggoer') {
      // Any of these roles grants giggoer permissions
      return profile.roles.some(r => ['live_giggoer', 'live_builder', 'live_admin'].includes(r));
    } else if (role === 'live_builder') {
      // Builder and admin roles grant builder permissions
      return profile.roles.some(r => ['live_builder', 'live_admin'].includes(r));
    } else if (role === 'live_admin') {
      // Only admin grants admin permissions
      return profile.roles.includes('live_admin');
    }
    
    // Direct role check
    return profile.roles.includes(role);
  };

  // Get the highest role a user has
  const getHighestRole = (): UserRole | null => {
    console.log("getHighestRole called. Profile:", profile);
    console.log("Roles:", profile?.roles);
    
    if (!profile || !profile.roles || profile.roles.length === 0) {
      console.log("No roles found");
      return null;
    }
    
    if (profile.roles.includes('GODMODE')) {
      console.log("User has GODMODE role");
      return 'GODMODE';
    }
    if (profile.roles.includes('live_admin')) {
      console.log("User has live_admin role");
      return 'live_admin';
    }
    if (profile.roles.includes('live_builder')) {
      console.log("User has live_builder role");
      return 'live_builder';
    }
    if (profile.roles.includes('live_giggoer')) {
      console.log("User has live_giggoer role");
      return 'live_giggoer';
    }
    
    console.log("No matching role found");
    return null;
  };

  // Load user profile from token
  const loadUserProfile = async (authToken: string) => {
    try {
      console.log("Loading user profile from token");
      const decoded = jwtDecode<DecodedToken>(authToken);
      console.log("Decoded token:", decoded);
      
      // Check if token is expired
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        throw new Error('Token expired');
      }
      
      // Create user profile from token data
      const userProfile: UserProfile = {
        uid: decoded.sub,  // Always use sub as the primary ID
        email: decoded.email,
        displayName: decoded.name,  // Use name as the primary display name field
        roles: decoded.roles || ['live_giggoer'], // Default to basic user role
      };
      
      console.log("Created user profile:", userProfile);
      setProfile(userProfile);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to load profile:', error);
      setIsAuthenticated(false);
      setProfile(null);
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }

  // Effect to initialize authentication
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      
      try {
        // First check URL for token parameter
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          const urlToken = urlParams.get('token');
          
          console.log("URL token check:", urlToken ? "Found token in URL" : "No token in URL");
          
          if (urlToken) {
            // Store token from URL
            localStorage.setItem(AUTH_TOKEN_KEY, urlToken);
            setToken(urlToken);
            await loadUserProfile(urlToken);
            
            // Clean up URL
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
            
            setIsLoading(false);
            return;
          }
        }
        
        // Check for token in local storage
        const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
        
        if (storedToken) {
          console.log("Found token in localStorage");
          setToken(storedToken);
          await loadUserProfile(storedToken);
        } else {
          console.log("No token found in localStorage");
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setIsAuthenticated(false);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        profile,
        isLoading,
        redirectToLogin,
        logout,
        refreshToken,
        hasRole,
        getHighestRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};