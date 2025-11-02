"use client";

import { createId } from "@paralleldrive/cuid2";
import { useReactFlow } from "@xyflow/react";
import { GlobeIcon, MousePointerIcon } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NodeType } from "@/generated/prisma";
import { Separator } from "./ui/separator";

export type NodeTypeOption = {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }> | string;
};

const triggerNodeOptions: NodeTypeOption[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    label: "Trigger manually",
    description: "Trigger the workflow manually",
    icon: MousePointerIcon,
  },
];

const executeNodeOptions: NodeTypeOption[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTP Request",
    description: "Execute a HTTP request",
    icon: GlobeIcon,
  },
];

interface NodeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function NodeSelector({
  open,
  onOpenChange,
  children,
}: NodeSelectorProps) {
  const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();

  const handleNodeSelect = useCallback(
    (selection: NodeTypeOption) => {
      if (selection.type === NodeType.MANUAL_TRIGGER) {
        const nodes = getNodes();
        const hasManualTrigger = nodes.some(
          (node) => node.type === NodeType.MANUAL_TRIGGER
        );
        if (hasManualTrigger) {
          toast.error("You can only have one manual trigger");
          return;
        }
      }
      setNodes((nodes) => {
        const hasInitialTrigger = nodes.some(
          (node) => node.type === NodeType.initial
        );
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const flowPosition = screenToFlowPosition({
          x: centerX + (Math.random() - 0.5) * 200,
          y: centerY + (Math.random() - 0.5) * 200,
        });

        const newNode = {
          id: createId(),
          data: {},
          position: flowPosition,
          type: selection.type,
        };
        if (hasInitialTrigger) {
          return [newNode];
        }
        return [...nodes, newNode];
      });
      onOpenChange(false);
    },
    [getNodes, screenToFlowPosition, setNodes, onOpenChange]
  );
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto" side="right">
        <SheetHeader>
          <SheetTitle>What triggers this workflow?</SheetTitle>
          <SheetDescription>
            A trigger is a step that starts your workflow
          </SheetDescription>
        </SheetHeader>
        <div>
          {triggerNodeOptions.map((NodeType) => {
            const Icon = NodeType.icon;
            return (
              <div
                key={NodeType.type}
                onClick={() => handleNodeSelect(NodeType)}
                className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-primary"
              >
                <div className="flex items-center gap-6 w-full overflow-hidden">
                  {typeof Icon === "string" ? (
                    <img
                      src={Icon}
                      alt={NodeType.label}
                      className="size-5 object-contain rounded-sm"
                    />
                  ) : (
                    <Icon className="size-5" />
                  )}
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-medium">
                      {NodeType.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {NodeType.description}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <Separator />
        <div>
          {executeNodeOptions.map((NodeType) => {
            const Icon = NodeType.icon;
            return (
              <div
                key={NodeType.type}
                onClick={() => handleNodeSelect(NodeType)}
                className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-primary"
              >
                <div className="flex items-center gap-6 w-full overflow-hidden">
                  {typeof Icon === "string" ? (
                    <img
                      src={Icon}
                      alt={NodeType.label}
                      className="size-5 object-contain rounded-sm"
                    />
                  ) : (
                    <Icon className="size-5" />
                  )}
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-medium">
                      {NodeType.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {NodeType.description}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
