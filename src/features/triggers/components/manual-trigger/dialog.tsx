"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ManualTriggerDialog = ({ open, onOpenChange }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manual Trigger</DialogTitle>
          <DialogDescription>Trigger the workflow manually</DialogDescription>
        </DialogHeader>
        <div className="py-4 ">
          <p className="text-sm text-muted-foreground">
            Used to manually trigger the workflow.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
