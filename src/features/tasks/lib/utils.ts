import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  Pencil2Icon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons"

import { type Task } from "@/server/db/schema/tasks"

export function getStatusIcon(status: Task["status"]): {
  icon: React.ElementType
  color: string
} {
  const statusIcons = {
    canceled: { icon: CrossCircledIcon, color: "stroke-destructive" },
    done: { icon: CheckCircledIcon, color: "stroke-chart-2" },
    "in-progress": { icon: StopwatchIcon, color: "stroke-chart-1" },
    backlog: { icon: Pencil2Icon, color: "stroke-muted-foreground" },
    "in-review": { icon: Pencil2Icon, color: "stroke-chart-4" },
    todo: { icon: QuestionMarkCircledIcon, color: "stroke-chart-3" },
  }

  return (
    statusIcons[status] || {
      icon: CircleIcon,
      color: "stroke-muted-foreground",
    }
  )
}

export function getPriorityIcon(priority: Task["priority"]): {
  icon: React.ElementType
  color: string
} {
  const priorityIcons = {
    high: { icon: ArrowUpIcon, color: "stroke-destructive" },
    low: { icon: ArrowDownIcon, color: "stroke-chart-2" },
    medium: { icon: ArrowRightIcon, color: "stroke-chart-3" },
  }

  return (
    priorityIcons[priority] || {
      icon: CircleIcon,
      color: "stroke-muted-foreground",
    }
  )
}

export function getLabelBadgeVariant(
  label: Task["label"]
): "default" | "secondary" | "destructive" | "outline" | null | undefined {
  const variants = {
    bug: "destructive",
    enhancement: "default",
    feature: "outline",
    documentation: "secondary",
  }

  return (
    (variants[label] as
      | "default"
      | "secondary"
      | "destructive"
      | "outline"
      | null
      | undefined) ?? "outline"
  )
}
