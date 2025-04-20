// src/components/Header.tsx
"use client";

import { usePathname } from "next/navigation";
import BndyLogo from "@/components/ui/bndylogo";
import { Sun, Moon, Map as MapIcon, List as ListIcon, Building, Calendar, User, LogOut } from "lucide-react";
import { useViewToggle } from "@/context/ViewToggleContext";
import { useAuth } from "@/context/AuthContext";
import { ROLE_DISPLAY } from "@/lib/config/auth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const { activeView, setActiveView, mapMode, setMapMode, isDarkMode, toggleTheme } = useViewToggle();
  const { isAuthenticated, redirectToLogin, profile, getHighestRole, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Only show the map/list toggle if we are on the home page ("/")
  const showViewToggle = pathname === "/";

  // Only show the map mode toggle when in map view and on home page
  const showMapModeToggle = showViewToggle && activeView === "map";

  const handleViewToggle = () => {
    setActiveView((prev) => (prev === "map" ? "list" : "map"));
  };

  const handleMapModeToggle = () => {
    setMapMode((prev) => (prev === "events" ? "venues" : "events"));
  };

  const toggleUserMenu = () => {
    if (isAuthenticated) {
      setShowUserMenu(!showUserMenu);
    } else {
      redirectToLogin();
    }
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: 'var(--background)',
        boxShadow: 'none',
        borderBottom: 'none'
      }}
    >
      <div className="relative container mx-auto">
        {/* Toggles in top-right corner */}
        <div className="absolute top-0 right-0 mt-2 mr-2 flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center focus:outline-none"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-[var(--foreground)]" />
            ) : (
              <Moon className="w-5 h-5 text-[var(--foreground)]" />
            )}
          </button>

          {/* Map Mode Toggle (only visible in map view) */}
          {showMapModeToggle && (
            <button
              onClick={handleMapModeToggle}
              className="flex items-center focus:outline-none"
              aria-label={mapMode === "events" ? "Switch to venues view" : "Switch to events view"}
            >
              {mapMode === "events" ? (
                <Building className="w-5 h-5 text-[var(--foreground)]" />
              ) : (
                <Calendar className="w-5 h-5 calendar-icon-pulse" />
              )}
            </button>
          )}

          {/* Map/List Toggle */}
          {showViewToggle && (
            <button
              onClick={handleViewToggle}
              className="flex items-center focus:outline-none"
              aria-label={activeView === "map" ? "Switch to list view" : "Switch to map view"}
            >
              {activeView === "map" ? (
                <ListIcon className="w-5 h-5 text-[var(--foreground)]" />
              ) : (
                <MapIcon className="w-5 h-5 text-[var(--foreground)]" />
              )}
            </button>
          )}

          {/* Login/User Icon with Dropdown */}
          <div className="relative">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center focus:outline-none transition-colors"
                    aria-label={isAuthenticated ? "Your account" : "Login"}
                  >
                    {isAuthenticated ? (
                      <User
                        size={22}
                        className="filter drop-shadow-sm"
                        style={{
                          fill: ROLE_DISPLAY[getHighestRole() || 'live_giggoer'].color,
                          color: ROLE_DISPLAY[getHighestRole() || 'live_giggoer'].color
                        }}
                      />
                    ) : (
                      <User size={22} className="text-[var(--foreground)]" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {isAuthenticated
                    ? `Logged in as ${profile?.email} (${ROLE_DISPLAY[getHighestRole() || 'live_giggoer'].label})`
                    : "Login"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* User dropdown menu */}
            {showUserMenu && isAuthenticated && (
              <div className="absolute right-0 mt-2 w-48 py-2 bg-background border border-border rounded-md shadow-lg z-50">
                <div className="px-4 py-2 border-b border-border">
                  <p className="text-sm font-medium">{profile?.displayName || profile?.email}</p>
                  <p className="text-xs text-muted-foreground">{ROLE_DISPLAY[getHighestRole() || 'live_giggoer'].label}</p>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-sm text-left hover:bg-accent transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Centered logo and tagline */}
        <div className="text-center">
          <div className="flex justify-center">
            <BndyLogo />
          </div>
          <p className="mt-0 text-lg">
            Keeping{" "}
            <span className="font-extrabold text-[var(--secondary)]">LIVE</span>{" "}
            music{" "}
            <span className="font-extrabold text-[var(--primary)]">ALIVE</span>
          </p>
        </div>
      </div>
    </header>
  );
}