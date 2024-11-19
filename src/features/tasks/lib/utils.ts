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
import { customAlphabet } from "nanoid"

import { type Task } from "@/server/db/schema/tasks"

export function getStatusIcon(status: Task["status"]) {
  const statusIcons = {
    canceled: CrossCircledIcon,
    done: CheckCircledIcon,
    "in-progress": StopwatchIcon,
    backlog: Pencil2Icon,
    "in-review": Pencil2Icon,
    todo: QuestionMarkCircledIcon,
  }

  return statusIcons[status] || CircleIcon
}

export function getPriorityIcon(priority: Task["priority"]) {
  const priorityIcons = {
    high: ArrowUpIcon,
    low: ArrowDownIcon,
    medium: ArrowRightIcon,
  }

  return priorityIcons[priority] || CircleIcon
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

const prefixes = {
  task: "tsk",
}

interface GenerateIdOptions {
  length?: number
  separator?: string
}

export function generateId(
  prefix?: keyof typeof prefixes,
  { length = 12, separator = "_" }: GenerateIdOptions = {}
) {
  const id = customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    length
  )()
  return prefix ? `${prefixes[prefix]}${separator}${id}` : id
}
