import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { type SubmitHandler, useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { type CreateEventDto, type Event } from "~/types/Event.types";
import { useToast } from "~/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { api } from "~/trpc/react";

const formSchema = z.object({
  code: z
    .string()
    .min(1, { message: "code is empty" })
    .max(4, { message: "code should be shorter than 4 characters" }),
  name: z.string().min(1, { message: "name is empty" }),
});

interface EventFormProps {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  event: Event | null;
}

const EventForm = ({ isOpen, onOpenChange, event }: EventFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
    },
    mode: "onChange",
  });

  const onCreateSuccess = async (newEvent: Event) => {
    await queryClient.setQueryData(["fetchEvent"], (oldData?: Event[]) => {
      if (oldData) {
        return [newEvent, ...oldData];
      }
      return [newEvent];
    });
    toast({
      description: "Event was added successfully.",
    });
    onOpenChange(false);
  };

  const onUpdateSuccess = async (updatedEvent: Event) => {
    await queryClient.setQueryData(["fetchEvent"], (oldData?: Event[]) => {
      if (oldData) {
        return oldData.map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event,
        );
      }
      return [updatedEvent];
    });
    toast({
      description: "Event was updated successfully.",
    });
    onOpenChange(false);
  };

  const onRequestError = () => {
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description: "There was a problem with your request.",
    });
  };

  const createMutation = api.event.create.useMutation({
    onSuccess: onCreateSuccess,
    onError: onRequestError,
  });

  const updateMutation = api.event.update.useMutation({
    onSuccess: onUpdateSuccess,
    onError: onRequestError,
  });

  useEffect(() => {
    form.reset(event ? { code: event.code, name: event.name } : {});
  }, [isOpen, event, form]);

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (values) => {
    const createDto: CreateEventDto = {
      code: values.code,
      name: values.name,
    };
    if (!event) {
      createMutation.mutate(createDto);
    } else {
      updateMutation.mutate({ ...createDto, id: event.id });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">Add</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {event ? "Update the event" : "Create new event"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input placeholder="1234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="name here..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                disabled={
                  !form.formState.isValid ||
                  createMutation.isPending ||
                  updateMutation.isPending
                }
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Confirm
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EventForm;
