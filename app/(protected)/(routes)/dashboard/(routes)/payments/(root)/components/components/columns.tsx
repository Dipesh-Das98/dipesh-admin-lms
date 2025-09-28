"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { dateFormat } from "@/lib/format";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { Payment, PaymentStatus } from "@/types";
import CellAction from "./cell-action";
import {
  CheckCircle2,
  CircleOff,
  Clock,
  HelpCircle,
  Undo2,
  XCircle,
} from "lucide-react";

type StatusConfig = {
  [key in PaymentStatus]: {
    icon: React.ElementType;
    variant: "default" | "secondary" | "destructive" | "outline";
    text: string;
  };
};

const statusConfig: StatusConfig = {
  COMPLETED: {
    icon: CheckCircle2,
    variant: "default",
    text: "Completed",
  },
  PENDING: {
    icon: Clock,
    variant: "secondary",
    text: "Pending",
  },
  FAILED: {
    icon: XCircle,
    variant: "destructive",
    text: "Failed",
  },
  REFUNDED: {
    icon: Undo2,
    variant: "outline",
    text: "Refunded",
  },
  CANCELLED: {
    icon: CircleOff,
    variant: "destructive",
    text: "Cancelled",
  },
};

export const paymentColumns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "transactionId",
    header: () => <div className="text-start">Transaction ID</div>,
    cell: ({ row }) => (
      <div
        className="w-fit max-w-[140px] truncate rounded-md bg-muted px-2 py-1 font-mono text-xs"
        title={row.original.transactionId}
      >
        {row.original.transactionId}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "parentId",
    header: () => <div className="text-center">Parent ID</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <span className="w-fit max-w-[320px]  truncate rounded-md bg-muted px-2 py-1 font-mono text-xs" title={row.original.parentId}>
          {row.original.parentId}
        </span>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <div className="text-center font-semibold">
        ${row.original.amount.toFixed(2)}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const config = statusConfig[status];
      const Icon = config ? config.icon : HelpCircle;
      return (
        <div className="text-center">
          <Badge variant={config ? config.variant : "outline"}>
            <Icon className="mr-2 h-4 w-4" />
            {config ? config.text : "Unknown"}
          </Badge>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.createdAt
          ? dateFormat(new Date(row.original.createdAt), "dd MMM yyyy")
          : "-"}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const payment = row.original;

      return <CellAction payment={payment} />;
    },
    enableSorting: false,
    enableHiding: false,
  },
];
