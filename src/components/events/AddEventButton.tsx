// src/components/events/AddEventButton.tsx
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
import { useState } from 'react';
import { EventWizard } from './EventWizard';
import { useAuth } from '@/context/AuthContext';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';


interface AddEventButtonProps {
  map?: google.maps.Map | null;
}

export function AddEventButton({ map }: AddEventButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { hasRole, isAuthenticated, redirectToLogin } = useAuth();
  
  // Only show the button if user has builder privileges or higher
  const canAddEvents = isAuthenticated && 
    (hasRole('live_builder') || hasRole('live_admin') || hasRole('GODMODE'));

  if (!canAddEvents) return null;

  const handleAddEventClick = () => {
    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }
    
    // Otherwise continue with opening the sheet
    setIsOpen(true);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          className="add-event-button bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white rounded-full px-6 py-3 shadow-lg flex items-center"
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            zIndex: 50,
            pointerEvents: 'auto'
          }}
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
              Create a new event by selecting a venue, artists, and event details
            </SheetDescription>
          </SheetHeader>
        </VisuallyHidden>
        <EventWizard map={map} onSuccess={() => setIsOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}