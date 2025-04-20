// src/app/auth/callback/page.tsx in bndy-live
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AUTH_TOKEN_KEY } from "@/lib/config/auth";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshToken } = useAuth();
  
  useEffect(() => {
    const processCallback = async () => {
      // Check if there's a token in the URL parameters (returned from bndy-landing)
      const token = searchParams.get("token");
      const error = searchParams.get("error");
      const redirectTo = searchParams.get("redirect_to") || "/";
      
      console.log("Auth callback processing:", token ? "Token received" : "No token");
      
      if (token) {
        // Store the token
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        console.log("Token stored in localStorage");
        
        // Refresh the token to update context
        const refreshResult = await refreshToken();
        console.log("Token refresh result:", refreshResult);
        
        // Redirect to the specified path (or home)
        router.push(redirectTo);
      } else if (error) {
        // Handle authentication errors
        console.error("Authentication error:", error);
        
        // Redirect to home
        router.push("/");
      } else {
        // No token or error, just redirect to home
        router.push("/");
      }
    };
    
    processCallback();
  }, [searchParams, router, refreshToken]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Processing your login...</h1>
        <p>Please wait while we securely log you in.</p>
      </div>
    </div>
  );
}