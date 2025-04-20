// src/components/events/ArtistAddEventButton.tsx
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
  SheetHeader,
} from "@/components/ui/sheet";
import { useState, useEffect } from 'react';
import { EventWizard } from './EventWizard';
import { useAuth } from '@/context/AuthContext';
import type { Artist } from '@/lib/types';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface ArtistAddEventButtonProps {
  artist: Artist;
  className?: string;
}

export function ArtistAddEventButton({ artist, className }: ArtistAddEventButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { hasRole, profile } = useAuth();
  const [canEdit, setCanEdit] = useState(false);

  // Check permission to add event for this artist
  useEffect(() => {
    const checkPermission = () => {
      // GODMODE or live_admin users can edit any artist
      if (hasRole('GODMODE') || hasRole('live_admin')) {
        setCanEdit(true);
        return;
      }
      
      // Builders can edit artists they manage
      if (hasRole('live_builder') && artist?.id) {
        // For now, assume builders can edit all artists
        // In a real implementation, you would check if this artist is managed by the current user
        setCanEdit(true);
        return;
      }
      
      setCanEdit(false);
    };
    
    checkPermission();
  }, [artist?.id, hasRole, profile]);

  // Only show the button if the user can edit this artist
  if (!canEdit) return null;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
      <Button 
  className={`bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white font-medium ${className || ""}`}
>
  <Plus className="w-4 h-4 mr-2" />
  Add Event
</Button>
      </SheetTrigger>
      <SheetContent 
  side="left" 
  className="w-[400px] sm:w-[540px] bg-background border-r border-border safari-modal"
>
        <VisuallyHidden>
          <SheetHeader>
            <SheetTitle>Create New Event</SheetTitle>
            <SheetDescription>
              Create a new event for {artist.name}
            </SheetDescription>
          </SheetHeader>
        </VisuallyHidden>
        <EventWizard 
          initialArtist={artist}
          skipArtistStep={true}
          onSuccess={() => setIsOpen(false)} 
        />
      </SheetContent>
    </Sheet>
  );
}