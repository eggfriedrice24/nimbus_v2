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
import { AlertCircle, ArrowRightCircle, FileText, Zap } from "lucide-react"

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

type BadgeVariants =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "success"

export const labelIcons = {
  bug: AlertCircle,
  feature: Zap,
  enhancement: ArrowRightCircle,
  documentation: FileText,
}

export function getLabelBadgeVariantAndIcon(label: Task["label"]): {
  variant: BadgeVariants
  icon: React.ElementType
} {
  const variants = {
    bug: "destructive",
    enhancement: "default",
    feature: "success",
    documentation: "secondary",
  }

  return {
    variant: (variants[label] as BadgeVariants) ?? ("outline" as BadgeVariants),
    icon: labelIcons[label] ?? null,
  }
}
