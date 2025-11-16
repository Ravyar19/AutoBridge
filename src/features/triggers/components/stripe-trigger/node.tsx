import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { StripeTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { fetchStripeTriggerToken } from "./actions";
import { StripeTriggerChannel } from "@/inngest/channels/stripe-trigger";

export const StripeTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: StripeTriggerChannel().name,
    topic: "status",
    refreshToken: fetchStripeTriggerToken,
  });
  const handleOpenSettings = () => {
    setDialogOpen(true);
  };
  return (
    <>
      <StripeTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      <BaseTriggerNode
        Icon="/stripe.svg"
        name="Stripe"
        description="When a Stripe event is received"
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        status={nodeStatus}
        {...props}
      />
    </>
  );
});
