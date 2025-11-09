"use client";

import { type NodeProps, Position, useReactFlow } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { memo, type ReactNode } from "react";
import {
  BaseNode,
  BaseNodeContent,
} from "../../../components/react-flow/base-node";
import { BaseHandle } from "../../../components/react-flow/base-handle";
import { WorkflowNode } from "../../../components/workflow-node";
import {
  type NodeStatus,
  NodeStatusIndicator,
} from "@/components/react-flow/node-status-indicator";

interface BaseTriggerNodeProps extends NodeProps {
  Icon: LucideIcon | string;
  name: string;
  description?: string;
  children?: ReactNode;
  onSettings?: () => void;
  onDoubleClick?: () => void;
  status?: NodeStatus;
}

export const BaseTriggerNode = memo(function BaseTriggerNode({
  id,
  Icon,
  name,
  description,
  children,
  onSettings,
  onDoubleClick,
  status = "initial",
  ...props
}: BaseTriggerNodeProps) {
  const { setNodes, setEdges } = useReactFlow();
  const handleDelete = () => {
    setNodes((currentNodes) => {
      const updatedNodes = currentNodes.filter((node) => node.id !== id);
      return updatedNodes;
    });
    setEdges((currentEdges) => {
      const updatedEdges = currentEdges.filter(
        (edge) => edge.source !== id && edge.target !== id
      );
      return updatedEdges;
    });
  };

  // Filter out React Flow-specific props that shouldn't be passed to DOM elements
  const {
    positionAbsoluteX,
    positionAbsoluteY,
    selectable,
    deletable,
    isConnectable,
    sourcePosition,
    targetPosition,
    dragging,
    dragHandle,
    zIndex,
    parentId,
    data,
    selected,
    type,
    ...domProps
  } = props;

  return (
    <WorkflowNode
      name={name}
      description={description}
      onSettings={onSettings}
      onDelete={handleDelete}
    >
      <NodeStatusIndicator
        className="rounded-l-2xl"
        status={status}
        variant="border"
      >
        <BaseNode
          className="rounded-l-2xl relative group"
          onClick={onDoubleClick}
          {...domProps}
          status={status}
        >
          <BaseNodeContent>
            {typeof Icon === "string" ? (
              <Image src={Icon} alt={name} width={16} height={16} />
            ) : (
              <Icon className="size-4 text-muted-foreground" />
            )}
            {children}
            <BaseHandle id="source-1" type="source" position={Position.Right} />
          </BaseNodeContent>
        </BaseNode>
      </NodeStatusIndicator>
    </WorkflowNode>
  );
});

BaseTriggerNode.displayName = "BaseTriggerNode";
