import React from "react"

import { type LucideIcon } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"

interface ReusableModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  icon?: LucideIcon
  children: React.ReactNode
  className?: string
}

export default function ResponsiveModal({
  open,
  onOpenChange,
  title,
  description,
  icon,
  children,
  className = "",
}: ReusableModalProps) {
  const isMobile = useIsMobile()

  const HeaderContent = () => (
    <div className="flex items-start justify-between">
      <div>
        {isMobile ? (
          <DrawerTitle className="text-3xl font-bold">{title}</DrawerTitle>
        ) : (
          <DialogTitle className="text-3xl font-bold">{title}</DialogTitle>
        )}
        {description &&
          (isMobile ? (
            <DrawerDescription>{description}</DrawerDescription>
          ) : (
            <DialogDescription className="text-sm text-muted-foreground">
              {description}
            </DialogDescription>
          ))}
      </div>
      {icon && <>{icon}</>}
    </div>
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className={`p-4 ${className}`}>
          <DrawerHeader className="text-left">
            <HeaderContent />
          </DrawerHeader>
          <div className="p-4">{children}</div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-[500px] ${className}`}>
        <DialogHeader>
          <HeaderContent />
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
