"use client";

import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Ticket } from "lucide-react";
import { formatTime, formatEventDate } from "@/lib/utils/date-utils";
import { Event } from "@/lib/types";
import TodayEventHighlight from "./TodayEventHighlight";
import Link from "next/link";

interface VAEventsListProps {
  events: Event[];
  contextType: 'artist' | 'venue';
  onSelectEvent: (event: Event) => void;
}

export default function VAEventsList({ 
  events, 
  contextType,
  onSelectEvent 
}: VAEventsListProps) {
  const [selectedTab, setSelectedTab] = useState("upcoming");

  // Memoize today's date at midnight
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  // Get current day of week (0 = Sunday, 1 = Monday, etc.)
  const dayOfWeek = today.getDay();

  // Memoize weekend dates calculations based on today and dayOfWeek
  const { fridayDate, saturdayDate, sundayDate } = useMemo(() => {
    let startDay = 5 - dayOfWeek; // Days until Friday
    if (startDay <= 0) startDay = 0; // Today or past Friday

    const fridayDate = new Date(today);
    fridayDate.setDate(today.getDate() + startDay);

    const saturdayDate = new Date(fridayDate);
    saturdayDate.setDate(fridayDate.getDate() + 1);

    const sundayDate = new Date(fridayDate);
    sundayDate.setDate(fridayDate.getDate() + 2);

    return { fridayDate, saturdayDate, sundayDate };
  }, [today, dayOfWeek]);

  // Filter events for today
  const todayEvents = useMemo(() => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === today.getTime();
    });
  }, [events, today]);

  // For this weekend tab (remaining days of current weekend)
  const weekendEvents = useMemo(() => {
    return events.filter(event => {
      if (dayOfWeek === 0) return false;
      
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      
      if (eventDate.getTime() === today.getTime()) return false;
      
      return (
        (dayOfWeek < 5 && (
          eventDate.getTime() === fridayDate.getTime() ||
          eventDate.getTime() === saturdayDate.getTime() ||
          eventDate.getTime() === sundayDate.getTime()
        )) ||
        (dayOfWeek === 5 && (
          eventDate.getTime() === saturdayDate.getTime() ||
          eventDate.getTime() === sundayDate.getTime()
        )) ||
        (dayOfWeek === 6 && (
          eventDate.getTime() === sundayDate.getTime()
        ))
      );
    });
  }, [events, dayOfWeek, fridayDate, saturdayDate, sundayDate, today]);

  // For upcoming events (all future events except today)
  const upcomingEvents = useMemo(() => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate > today;
    });
  }, [events, today]);

  // Define an EventRow component to render an event row.
  const EventRow = ({ event }: { event: Event }) => {
    const eventDate = new Date(event.date);
    const formattedDate = formatEventDate(eventDate);

    return (
      <Card
        className="p-4 mb-3 cursor-pointer hover:shadow-md transition-all border-l-0 hover:border-l-4 hover:border-l-[var(--primary)]"
        onClick={() => onSelectEvent(event)}
      >
        <div className="grid grid-cols-12 gap-2">
          {/* Date/Time Column */}
          <div className="col-span-3 sm:col-span-2">
            <div className="text-sm font-medium">{formattedDate}</div>
            <div className="text-xs text-[var(--foreground)]/70">{formatTime(event.startTime)}</div>
          </div>
          
          {/* Event Name Column */}
          <div className="col-span-7 sm:col-span-8">
            <div className="font-semibold text-[var(--primary)]">{event.name}</div>
            {contextType === 'artist' ? (
              <div className="text-xs text-[var(--foreground)]/70">
                <Link 
                  href={`/venues/${event.venueId}`}
                  className="hover:text-[var(--secondary)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {event.venueName}
                </Link>
              </div>
            ) : (
              event.artistIds && event.artistIds.length > 0 && (
                <div className="text-xs text-[var(--foreground)]/70">
                  <Link 
                    href={`/artists/${event.artistIds[0]}`}
                    className="hover:text-[var(--primary)]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Featured Artist
                  </Link>
                </div>
              )
            )}
          </div>
          
          {/* Ticket Column */}
          <div className="col-span-2 flex justify-end items-center">
            {event.ticketed ? (
              <div className="flex items-center text-xs">
                <Ticket className="w-3 h-3 mr-1 text-[var(--primary)]" />
                <span>{event.ticketinformation || "Ticketed"}</span>
              </div>
            ) : (
              <span className="text-xs font-medium text-[var(--secondary)]">
                £ree
              </span>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="mt-4">
      {/* Today's Event Highlight */}
      {todayEvents.length > 0 && (
        <div className="mb-6">
          <TodayEventHighlight 
            event={todayEvents[0]} 
            contextType={contextType}
            onSelectEvent={onSelectEvent} 
          />
          {todayEvents.length > 1 && (
            <div className="mt-2 text-sm text-[var(--foreground)]/70 text-center">
              +{todayEvents.length - 1} more event{todayEvents.length > 2 ? 's' : ''} today
            </div>
          )}
        </div>
      )}

      {/* Tabs for other events */}
      <Tabs defaultValue="upcoming" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-4">
          {weekendEvents.length > 0 && (
            <TabsTrigger value="weekend">This Weekend ({weekendEvents.length})</TabsTrigger>
          )}
          <TabsTrigger value="upcoming">All Upcoming Events ({upcomingEvents.length})</TabsTrigger>
        </TabsList>
        
        {weekendEvents.length > 0 && (
          <TabsContent value="weekend">
            <div className="space-y-1">
              {weekendEvents.length > 0 ? (
                weekendEvents.map(event => (
                  <EventRow key={event.id} event={event} />
                ))
              ) : (
                <div className="py-8 text-center text-[var(--foreground)]/50">
                  No events scheduled for this weekend.
                </div>
              )}
            </div>
          </TabsContent>
        )}
        
        <TabsContent value="upcoming">
          <div className="space-y-1">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map(event => (
                <EventRow key={event.id} event={event} />
              ))
            ) : (
              <div className="py-8 text-center text-[var(--foreground)]/50">
                No upcoming events scheduled.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
