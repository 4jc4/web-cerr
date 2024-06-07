"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import EventForm from "./EventForm";
import { useState } from "react";
import { type Event } from "~/types/Event.types";

const Events = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
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
        {/* {isFetching && <span>Loading</span>}
        {!isFetching && <DataTable data={bankAccounts} columns={columns} />} */}
      </CardContent>
    </Card>
  );
};

export default Events;
