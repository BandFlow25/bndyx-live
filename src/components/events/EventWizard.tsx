'use client';

import React, { useState } from 'react';
import { EventWizard as BndyEventWizard } from 'bndy-ui/src/components/wizard/EventWizard';
import { searchVenues } from '@/lib/services/venue-service';
import { searchArtists } from '@/lib/services/artist-service';
import { checkEventConflicts } from '@/lib/services/event-service';
import { createEvent } from '@/lib/services/event-service';
import { createVenue } from '@/lib/services/venue-service';
import { useToast } from '@/components/ui/use-toast';
import { Artist, Venue } from '@/lib/types';

interface EventWizardProps {
  map?: google.maps.Map | null;
  onSuccess: () => void;
  initialArtist?: Artist;
  initialVenue?: Venue;
  skipArtistStep?: boolean;
  skipVenueStep?: boolean;
}

/**
 * EventWizard component integrates the bndy-ui EventWizard with bndy-live services.
 * It provides a multi-step form for creating events with venue, artist, date, time, and details.
 */
export function EventWizard({
  map,
  onSuccess,
  initialArtist,
  initialVenue,
  skipArtistStep = false,
  skipVenueStep = false,
}: EventWizardProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Handle successful event creation
  const handleEventCreated = async (data: any) => {
    setLoading(true);
    try {
      let venueId = data.venue.id;
      if (!venueId) {
        const newVenue = await createVenue({
          name: data.venue.name,
          address: data.venue.address || "",
          location: data.venue.location,
          googlePlaceId: data.venue.googlePlaceId,
          validated: false,
        });
        venueId = newVenue.id;
        data.venue = newVenue;
      }

      if (data.recurring) {
        // Handle recurring events
        const startDate = new Date(data.date);
        const endDate = new Date(data.recurring.endDate);
        const frequency = data.recurring.frequency;
        
        const dates = generateRecurringDates(startDate, endDate, frequency);
        
        await Promise.all(
          dates.map(async (generatedDate) => {
            const eventData = {
              ...data,
              date: generatedDate.toISOString().split('T')[0],
              venueId,
              venueName: data.venue.name,
              artistIds: data.artists.map((a: any) => a.id),
              location: data.venue.location,
              ticketed: data.ticketed || false,
              ...(data.ticketed && data.ticketinformation ? { ticketinformation: data.ticketinformation } : {}),
              ...(data.ticketed && data.ticketUrl ? { ticketUrl: data.ticketUrl } : {}),
              status: "approved" as const,
              source: "bndy.live" as const,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              ...(data.endTime ? { endTime: data.endTime } : {}),
            };
            await createEvent(eventData);
          })
        );
      } else {
        // Handle single event
        const eventData = {
          ...data,
          venueId,
          venueName: data.venue.name,
          artistIds: data.artists.map((a: any) => a.id),
          location: data.venue.location,
          ticketed: data.ticketed || false,
          ...(data.ticketed && data.ticketinformation ? { ticketinformation: data.ticketinformation } : {}),
          ...(data.ticketed && data.ticketUrl ? { ticketUrl: data.ticketUrl } : {}),
          status: "approved" as const,
          source: "bndy.live" as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...(data.endTime ? { endTime: data.endTime } : {}),
        };
        await createEvent(eventData);
      }

      toast({
        title: data.recurring ? "Recurring Events Created!" : "Event Created!",
        description: "Successfully added to the calendar.",
      });

      if (map && data.venue.location) {
        setTimeout(() => {
          map.panTo(data.venue.location);
          map.setZoom(15);
        }, 500);
      }

      onSuccess();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "There was a problem creating your event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Service adapters for the wizard
  const venueSearchAdapter = async (term: string) => {
    const results = await searchVenues(term);
    return results;
  };

  const artistSearchAdapter = async (term: string) => {
    const results = await searchArtists(term);
    return results;
  };

  const conflictCheckAdapter = async (data: any) => {
    return await checkEventConflicts(data);
  };

  return (
    <BndyEventWizard
      initialArtist={initialArtist}
      initialVenue={initialVenue}
      skipArtistStep={skipArtistStep}
      skipVenueStep={skipVenueStep}
      onSuccess={handleEventCreated}
    />
  );
}

// Helper function to generate recurring dates
function generateRecurringDates(startDate: Date, endDate: Date, frequency: string): Date[] {
  const dates: Date[] = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    
    if (frequency === 'weekly') {
      currentDate.setDate(currentDate.getDate() + 7);
    } else if (frequency === 'monthly') {
      currentDate.setMonth(currentDate.getMonth() + 1);
    } else {
      // For custom frequency, default to weekly
      currentDate.setDate(currentDate.getDate() + 7);
    }
  }
  
  return dates;
}
