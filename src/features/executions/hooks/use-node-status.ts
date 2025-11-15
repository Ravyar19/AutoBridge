import type { Realtime } from "@inngest/realtime";
import { useInngestSubscription } from "@inngest/realtime/hooks";
import { useEffect, useState } from "react";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";

interface UseNodeStatusOptions {
  nodeId: string;
  channel: string;
  topic: string;
  refreshToken: () => Promise<Realtime.Subscribe.Token>;
}

export function useNodeStatus({
  nodeId,
  channel,
  topic,
  refreshToken,
}: UseNodeStatusOptions) {
  const [status, setStatus] = useState<NodeStatus>("initial");

  const { data } = useInngestSubscription({
    refreshToken,
    enabled: true,
  });

  useEffect(() => {
    if (!data.length) return;

    const filteredMessages = data.filter(
      (msg) =>
        msg.kind === "data" &&
        msg.channel === channel &&
        msg.topic === topic &&
        msg.data?.nodeId === nodeId
    );

    if (!filteredMessages.length) return;

    const latestMessage = filteredMessages.sort((a, b) => {
      if (a.kind === "data" && b.kind === "data") {
        // Handle createdAt - it might be in data.createdAt or at the message level
        const aTime =
          a.data?.createdAt || (a as any).createdAt
            ? new Date(a.data?.createdAt || (a as any).createdAt).getTime()
            : 0;
        const bTime =
          b.data?.createdAt || (b as any).createdAt
            ? new Date(b.data?.createdAt || (b as any).createdAt).getTime()
            : 0;
        return bTime - aTime;
      }
      return 0;
    })[0];

    if (latestMessage?.kind === "data" && latestMessage.data?.status) {
      setStatus(latestMessage.data.status as NodeStatus);
    }
  }, [data, channel, topic, nodeId]);

  return status;
}
