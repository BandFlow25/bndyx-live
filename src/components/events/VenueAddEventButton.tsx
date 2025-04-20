// src/components/events/VenueAddEventButton.tsx
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
import type { Venue } from '@/lib/types';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface VenueAddEventButtonProps {
  venue: Venue;
  className?: string;
}

export function VenueAddEventButton({ venue, className }: VenueAddEventButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { hasRole, profile } = useAuth();
  const [canEdit, setCanEdit] = useState(false);

  // Check permission to add event at this venue
  useEffect(() => {
    const checkPermission = () => {
      // GODMODE or live_admin users can edit any venue
      if (hasRole('GODMODE') || hasRole('live_admin')) {
        setCanEdit(true);
        return;
      }
      
      // Builders can edit venues they manage
      if (hasRole('live_builder') && venue?.id) {
        // For now, assume builders can edit all venues
        // In a real implementation, you would check if this venue is managed by the current user
        setCanEdit(true);
        return;
      }
      
      setCanEdit(false);
    };
    
    checkPermission();
  }, [venue?.id, hasRole, profile]);

  // Only show the button if the user can edit this venue
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
              Create a new event at {venue.name}
            </SheetDescription>
          </SheetHeader>
        </VisuallyHidden>
        <EventWizard 
          initialVenue={venue}
          skipVenueStep={true}
          onSuccess={() => setIsOpen(false)} 
        />
      </SheetContent>
    </Sheet>
  );
}