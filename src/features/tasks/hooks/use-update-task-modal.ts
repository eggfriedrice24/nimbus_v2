import { parseAsBoolean, useQueryState } from "nuqs"

export function useUpdateTaskModal() {
  const [isOpen, setIsOpen] = useQueryState(
    "update-task",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  )

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return {
    open,
    close,
    isOpen,
    setIsOpen,
  }
}
