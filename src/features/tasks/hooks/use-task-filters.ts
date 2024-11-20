import {
  parseAsIsoDate,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs"

export enum LabelEnum {
  Bug = "bug",
  Feature = "feature",
  Enhancement = "enhancement",
  Documentation = "documentation",
}

export enum StatusEnum {
  Backlog = "backlog",
  Todo = "todo",
  InProgress = "in-progress",
  InReview = "in-review",
  Done = "done",
  Canceled = "canceled",
}

export enum PriorityEnum {
  Low = "low",
  Medium = "medium",
  High = "high",
}

export const useTaskFilters = () => {
  return useQueryStates({
    projectId: parseAsString,
    assigneeId: parseAsString,
    label: parseAsStringEnum(Object.values(LabelEnum)),
    status: parseAsStringEnum(Object.values(StatusEnum)),
    priority: parseAsStringEnum(Object.values(PriorityEnum)),
    title: parseAsString,
    dueDate: parseAsIsoDate,
  })
}
