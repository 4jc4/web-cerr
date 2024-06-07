import DataTableColumnHeader from "~/components/DataTable/DataTableColumnHeader";
import DataTableRowActions from "~/components/DataTable/DataTableRowActions";
import { type Event } from "~/types/Event.types";
import { type ColumnDef } from "@tanstack/react-table";

interface EventsColumnsProps {
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
}

export const getEventsColumns = ({
  onEdit,
  onDelete,
}: EventsColumnsProps): ColumnDef<Event>[] => [
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-right"
        column={column}
        title="Name"
      />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} />
    ),
    size: 50,
  },
];
