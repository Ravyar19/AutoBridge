import type { NodeExecutor } from "@/features/executions/types";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";

type ManualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    manualTriggerChannel().status({
      nodeId,
      status: "loading",
    })
  );
  try {
    const result = await step.run("manual-trigger", async () => context);
    await publish(
      manualTriggerChannel().status({
        nodeId,
        status: "success",
      })
    );
    return result;
  } catch (error) {
    // Publish error status for any errors that occur during execution
    await publish(
      manualTriggerChannel().status({
        nodeId,
        status: "error",
      })
    );
    // Re-throw the error so Inngest can handle it
    throw error;
  }
};
