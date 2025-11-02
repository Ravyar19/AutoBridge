"use client";

import { type NodeProps, Position } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { memo, type ReactNode } from "react";
import {
  BaseNode,
  BaseNodeContent,
} from "../../../components/react-flow/base-node";
import { BaseHandle } from "../../../components/react-flow/base-handle";
import { WorkflowNode } from "../../../components/workflow-node";

interface BaseExecutionNodeProps extends NodeProps {
  Icon: LucideIcon | string;
  name: string;
  description?: string;
  children?: ReactNode;
  onSettings?: () => void;
  onDoubleClick?: () => void;
  // status:NodeStatus;
}

export const BaseExecutionNode = memo(function BaseExecutionNode({
  id,
  Icon,
  name,
  description,
  children,
  onSettings,
  onDoubleClick,
  ...props
}: BaseExecutionNodeProps) {
  const onDelete = () => {};

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
    <WorkflowNode name={name} description={description} onSettings={onSettings}>
      <BaseNode onClick={onDoubleClick} {...domProps}>
        <BaseNodeContent>
          {typeof Icon === "string" ? (
            <Image src={Icon} alt={name} width={16} height={16} />
          ) : (
            <Icon className="size-4 text-muted-foreground" />
          )}
          {children}
          <BaseHandle id="target-1" type="target" position={Position.Left} />
          <BaseHandle id="source-1" type="source" position={Position.Right} />
        </BaseNodeContent>
      </BaseNode>
    </WorkflowNode>
  );
});

BaseExecutionNode.displayName = "BaseExecutionNode";
