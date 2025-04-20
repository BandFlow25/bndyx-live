// src/components/BndyThinFooter.tsx
'use client';

import { ThinFooter } from 'bndy-ui';
import { useViewToggle } from "@/context/ViewToggleContext";

export default function BndyThinFooter() {
  const { isDarkMode } = useViewToggle();
  
  return (
    <div className={`sticky bottom-0 w-full z-40 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
      {/* Override the ThinFooter's background to be transparent */}
      <style jsx global>{`
        .bndy-thin-footer {
          background-color: transparent !important;
        }
      `}</style>
      
      <div className="bndy-thin-footer">
        <ThinFooter 
          badgePath="/assets/images/BndyBeatBadge.png"
        />
      </div>
    </div>
  );
}