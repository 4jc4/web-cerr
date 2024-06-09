"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import EventForm from "./EventForm";
import { type Event } from "~/types/Event.types";
import { api } from "~/trpc/react";
import { getEventsColumns } from "./eventsColumns";
import DataTable from "~/components/DataTable/DataTable";
import { useCallback, useMemo, useState, useEffect } from "react";
import { useToast } from "~/components/ui/use-toast";

const Events = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [localEvents, setLocalEvents] = useState<Event[]>([]);
  const { toast } = useToast();

  const { data: events, isFetching } = api.event.getAll.useQuery();

  useEffect(() => {
    if (events) {
      setLocalEvents(events);
    }
  }, [events]);

  const deleteMutation = api.event.delete.useMutation({
    onSuccess: () => {
      setLocalEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== selectedEvent?.id),
      );
      toast({ description: "Event was deleted successfully." });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Uh Oh! Something went wrong!",
        description: "There was a problem with your request.",
      });
    },
  });

  const onDelete = useCallback(
    (event: Event) => {
      setSelectedEvent(event);
      deleteMutation.mutate({ id: event.id });
    },
    [deleteMutation],
  );

  const onEdit = useCallback((event: Event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  }, []);

  const columns = useMemo(
    () => getEventsColumns({ onEdit, onDelete }),
    [onEdit, onDelete],
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Events</CardTitle>
        <div className="flex justify-between">
          <div />
          <div className="flex-nowrap">
            <EventForm
              isOpen={isDialogOpen}
              event={selectedEvent}
              onOpenChange={(value) => {
                setIsDialogOpen(value);
                if (!value) {
                  setSelectedEvent(null);
                }
              }}
              onSubmit={(data) => {
                setLocalEvents((prevEvents) =>
                  prevEvents.map((event) =>
                    event.id === data.id ? { ...event, ...data } : event,
                  ),
                );
              }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isFetching ? (
          <span>Loading...</span>
        ) : localEvents && localEvents.length > 0 ? (
          <DataTable data={localEvents} columns={columns} />
        ) : (
          <span>No events available</span>
        )}
      </CardContent>
    </Card>
  );
};

export default Events;
