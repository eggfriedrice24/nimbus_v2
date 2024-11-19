import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs"

export const useTaskFilters = () => {
  return useQueryStates({
    projectId: parseAsString,
    assigneeId: parseAsString,
    label: parseAsStringEnum([
      "bug",
      "feature",
      "enhancement",
      "documentation",
    ]),
    status: parseAsStringEnum([
      "backlog",
      "todo",
      "in-progress",
      "in-review",
      "done",
      "canceled",
    ]),
    priority: parseAsStringEnum(["low", "medium", "high"]),
    search: parseAsString,
    dueDate: parseAsString,
  })
}
