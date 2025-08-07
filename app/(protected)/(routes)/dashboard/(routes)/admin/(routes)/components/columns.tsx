"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { dateFormat } from "@/lib/format";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { Admin } from "@/types";
import CellAction from "./cell-action";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export const adminColumns: ColumnDef<Admin>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<div className="flex justify-center">
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && "indeterminate")
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
				/>
			</div>
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
		accessorKey: "name",
		header:"Name",
		cell: ({ row }) => (
			<div
				className={cn(
					"flex items-center justify-center gap-2 font-medium",
					row.original.isBlocked && "text-muted-foreground"
				)}
			>
				{row.original.name}
				{row.original.isBlocked && (
					<Badge
						variant="destructive"
						className="ml-2 text-xs"
					>
						Blocked
					</Badge>
				)}
			</div>
		),
		enableSorting: true,
	},
	{
		accessorKey: "email",
    header:"Email",
		cell: ({ row }) => (
			<div
				className={cn(
					"text-sm flex justify-center",
					row.original.isBlocked && "text-muted-foreground"
				)}
			>
				{row.original.email}
			</div>
		),
		enableSorting: true,
	},
	{
		accessorKey: "role",
    header:"Role",
		cell: ({ row }) => (
			<div className="flex justify-center">
				<Badge
					variant={
						row.original.role === "SUPER_ADMIN"
							? "default"
							: "secondary"
					}
					className="font-medium"
				>
					{row.original.role.replace("_", " ")}
				</Badge>
			</div>
		),
		enableSorting: true,
	},
	{
		accessorKey: "isBlocked",
    header: "Status",
		cell: ({ row }) => (
			<div className="flex items-center justify-center">
				{row.original.isBlocked ? (
					<div className="flex items-center text-red-500">
						<AlertCircle className="mr-2 h-4 w-4" />
						<span>Blocked</span>
					</div>
				) : (
					<div className="flex items-center text-green-500">
						<CheckCircle2 className="mr-2 h-4 w-4" />
						<span>Active</span>
					</div>
				)}
			</div>
		),
		enableSorting: true,
	},
	{
		accessorKey: "createdAt",
    header: "Created At",
		cell: ({ row }) => (
			<div className="text-sm text-muted-foreground flex justify-center">
				{dateFormat(new Date(row.original.createdAt), "dd MMM yyyy")}
			</div>
		),
		enableSorting: true,
	},
	{
		id: "actions",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Actions" />
		),
		cell: ({ row }) => {
			const admin = row.original;

			return <CellAction admin={admin} />;
		},
		enableSorting: false,
		enableHiding: false,
	},
];
