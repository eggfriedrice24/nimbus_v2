import * as React from "react"

import { useRouter } from "next/navigation"

import { DotsHorizontalIcon, DotsVerticalIcon } from "@radix-ui/react-icons"
import { Edit, SearchCode } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { tasks, type Task } from "@/server/db/schema/tasks"

import { DeleteTaskAlert } from "./delete-task-dialog"
import { UpdateTaskModal } from "./update-task-modal"

export function TaskActionsDropdown({
  task,
  view,
}: {
  task: Task
  view: "kanban" | "table"
}) {
  const router = useRouter()

  const [deleteAlertOpen, setDeleteAlertOpen] = React.useState(false)
  const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false)

  const navigateToTaskDetails = () =>
    router.push(
      `/workspaces/${task.workspaceId}/projects/${task.project.id}/tasks/${task.id}`
    )

  return (
    <>
      <UpdateTaskModal
        initialValues={task}
        updateDialogOpen={updateDialogOpen}
        setUpdateDialogOpen={setUpdateDialogOpen}
      />

      <DeleteTaskAlert
        task={task}
        open={deleteAlertOpen}
        onOpenChange={setDeleteAlertOpen}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Open menu"
            variant="ghost"
            className="flex size-8 p-0 data-[state=open]:bg-muted"
          >
            {view === "table" ? (
              <DotsHorizontalIcon className="size-4" aria-hidden="true" />
            ) : (
              <DotsVerticalIcon className="size-4" aria-hidden="true" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            className="flex items-center justify-between"
            onClick={() => setUpdateDialogOpen(true)}
          >
            Edit
            <Edit />
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup>
                {tasks.label.enumValues.map((label) => (
                  <DropdownMenuRadioItem
                    key={label}
                    value={label}
                    className="capitalize"
                  >
                    {label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuItem
            className="flex items-center justify-between"
            onClick={navigateToTaskDetails}
          >
            Details <SearchCode />
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDeleteAlertOpen(true)}>
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
