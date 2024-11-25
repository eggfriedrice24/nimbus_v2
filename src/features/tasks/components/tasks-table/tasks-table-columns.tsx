"use client"

import * as React from "react"

import { type ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { tasks, type Task } from "@/server/db/schema/tasks"

import { DataTableColumnHeader } from "../../../../components/data-table/data-table-column-header"
import {
  getLabelBadgeVariantAndIcon,
  getPriorityIcon,
  getStatusIcon,
} from "../../lib/utils"
import { TaskActionsDropdown } from "../task-actions-dropdown"

export function getColumns(): ColumnDef<Task>[] {
  return [
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
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "code",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Task" />
      ),
      cell: ({ row }) => <div className="w-20">{row.getValue("code")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => {
        const label = tasks.label.enumValues.find(
          (label) => label === row.original.label
        )

        if (!label) {
          return null
        }

        const { icon: Icon, variant } = getLabelBadgeVariantAndIcon(label)

        return (
          <div className="flex space-x-2">
            {label && (
              <Badge variant={variant}>
                <Icon className={cn("mr-2 size-4")} />
                {label}
              </Badge>
            )}
            <span className="max-w-[31.25rem] truncate font-medium">
              {row.getValue("title")}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = tasks.status.enumValues.find(
          (status) => status === row.original.status
        )

        if (!status) return null

        const { icon: Icon, color } = getStatusIcon(status)

        return (
          <div className="flex w-[6.25rem] items-center">
            <Icon className={cn("mr-2 size-4", color)} />
            <span className="capitalize">{status}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "priority",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Priority" />
      ),
      cell: ({ row }) => {
        const priority = tasks.priority.enumValues.find(
          (priority) => priority === row.original.priority
        )

        if (!priority) return null

        const { icon: Icon, color } = getPriorityIcon(priority)

        return (
          <div className="flex items-center">
            <Icon className={cn("mr-2 size-4", color)} />
            <span className="capitalize">{priority}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ cell }) => format(cell.row.original.createdAt, "dd, MMM yyyy"),
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        return <TaskActionsDropdown task={row.original} view="table" />
      },
    },
  ]
}
