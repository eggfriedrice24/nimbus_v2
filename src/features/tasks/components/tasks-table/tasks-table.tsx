"use client"

import * as React from "react"

import { useDataTable } from "@/hooks/use-data-table"
import { type Task } from "@/server/db/schema/tasks"

import { DataTable } from "../../../../components/data-table/data-table"
import { getColumns } from "./tasks-table-columns"

interface TasksTableProps {
  tasks: Task[]
}

export function TasksTable({ tasks }: TasksTableProps) {
  const columns = React.useMemo(() => getColumns(), [])

  const { table } = useDataTable({
    data: tasks,
    columns,
  })

  return <DataTable table={table} />
}
