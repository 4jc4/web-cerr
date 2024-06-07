"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import EventForm from "./EventForm";
import { type Event } from "~/types/Event.types";
import { api } from "~/trpc/react";
import { getEventsColumns } from "./eventsColumns";
import DataTable from "~/components/DataTable/DataTable";
import { useCallback, useMemo, useState } from "react";
import { useToast } from "~/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const Events = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: events, isFetching } = api.event.getAll.useQuery();

  const deleteMutation = api.event.delete.useMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["fetchEvent"],
      });
    },
  });

  const onDelete = useCallback(
    (event: Event) => {
      return deleteMutation.mutate(
        { id: event.id },
        {
          onSuccess: () => {
            toast({ description: "Event was deleted successfully." });
          },
          onError: () => {
            toast({
              variant: "destructive",
              title: "Uh Oh! Something went wrong!",
              description: "There was a problem with your request.",
            });
          },
        },
      );
    },
    [deleteMutation, toast],
  );

  const onEdit = useCallback((event: Event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  }, []);

  const columns = useMemo(() => getEventsColumns({ onEdit, onDelete }), []);
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
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isFetching ? (
          <span>Loading</span>
        ) : events && events.length > 0 ? (
          <DataTable data={events} columns={columns} />
        ) : (
          <span>No events available</span>
        )}
      </CardContent>
    </Card>
  );
};

export default Events;
