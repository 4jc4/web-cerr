import { api } from "~/trpc/server";

import { type Event, type CreateEventDto } from "~/types/Event.types";

export const getEvents = async (): Promise<Event[]> => {
  const data = await api.event.getAll();
  return data;
};

export const createEvent = async (event: CreateEventDto): Promise<Event> => {
  const data = await api.event.create(event);
  return data;
};

export const updateEvent = async (
  id: number,
  event: CreateEventDto,
): Promise<Event> => {
  const data = await api.event.update({
    id,
    code: event.code,
    name: event.name,
  });
  return data;
};

export const deleteEvent = async (id: number) => {
  return await api.event.delete({ id });
};
