"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ConfirmDialogProps {
  title: string
  description: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void> | void
  isLoading?: boolean
}

export function ConfirmDialog({
  title,
  description,
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: ConfirmDialogProps) {
  const [isPending, setIsPending] = useState(false)

  const handleConfirm = async () => {
    try {
      setIsPending(true)
      await onConfirm()
    } finally {
      setIsPending(false)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending || isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isPending || isLoading}>
            {isPending || isLoading ? "Processing..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
