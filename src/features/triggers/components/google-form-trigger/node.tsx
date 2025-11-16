import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { GoogleFormTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";
import { fetchGoogleFormTriggerToken } from "./actions";

export const GoogleFormTrigger = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: googleFormTriggerChannel().name,
    topic: "status",
    refreshToken: fetchGoogleFormTriggerToken,
  });
  const handleOpenSettings = () => {
    setDialogOpen(true);
  };
  return (
    <>
      <GoogleFormTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      <BaseTriggerNode
        Icon="/googleform.svg"
        name="Google Form"
        description="When a form is submitted"
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        status={nodeStatus}
        {...props}
      />
    </>
  );
});
