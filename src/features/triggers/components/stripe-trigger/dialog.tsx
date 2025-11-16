"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StripeTriggerDialog = ({ open, onOpenChange }: Props) => {
  const params = useParams();
  const workflowId = params.workflowId as string;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const webhookUrl = `${baseUrl}/api/webhooks/stripe?workflowId=${workflowId}`;
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      toast.success("Webhook URL copied to clipboard");
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Stripe Trigger Configuration</DialogTitle>
          <DialogDescription>
            Configure this webhook URL in your Stripe dashboard to trigger this
            workflow on payment events.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhookUrl">Webhook URL</Label>
            <div className="flex gap-2">
              <Input
                id="webhookUrl"
                value={webhookUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={copyToClipboard}
              >
                <CopyIcon className="size-4" />
              </Button>
            </div>
          </div>
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-sm ">Setup instructions</h4>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Open your Stripe dashboard</li>
              <li>Go to the "Developers" section and click on "Webhooks"</li>
              <li>Click on "Add endpoint"</li>
              <li>Paste the webhook URL above</li>
              <li>
                Select the events you want to trigger the workflow on for (e.g.,
                payment_intent.succeeded, charge.succeeded, etc.)
              </li>

              <li>Save and copy the signing secret</li>
            </ol>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-sm ">Available Variables</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li className="bg-background px-1 py-0.5 rounded">
                <code>{"{{stripe.amount}}"}</code> - Payment Amount
              </li>
              <li className="bg-background px-1 py-0.5 rounded">
                <code>{"{{stripe.currency}}"}</code> - Payment Currency
              </li>
              <li className="bg-background px-1 py-0.5 rounded">
                <code>{"{{stripe.customerEmail}}"}</code> - Customer Email
              </li>
              <li className="bg-background px-1 py-0.5 rounded">
                <code>{"{{stripe.customerName}}"}</code> - Customer Name
              </li>
              <li className="bg-background px-1 py-0.5 rounded">
                <code>{"{{stripe.customerPhone}}"}</code> - Customer Phone
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
