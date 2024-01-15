"use client";

import { Card, CardActions, CardHeader } from '@mui/material';
import type { FC } from 'react';
import { useCallback } from 'react';
import type { NodeProps } from 'reactflow';
import { Handle, Position, useReactFlow } from 'reactflow';

import { ShieldCheck } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import type { GuardConfigSchema } from './Config/page';
import GuardConfigPanel from './Config/page';

interface DataProp {
  label: string;
  inputBoundId: string;
  outputBoundId: string;
  params: Record<string, any>;
  exec: string;
  execTs: string;
}

const GuardTask: FC<NodeProps<DataProp>> = ({ data, id }) => {
  const { setNodes, getNode } = useReactFlow();

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((curNode) => curNode.id !== id));
  }, [id, setNodes]);

  const changeValues = useCallback(
    (value: GuardConfigSchema) => {
      const currentNode = getNode(id);
      if (currentNode) {
        const newData = {
          ...currentNode.data,
          ...value,
        };
        setNodes((nodes) =>
          nodes.map((curNode) =>
            curNode.id == id
              ? {
                  ...curNode,
                  data: newData,
                }
              : curNode
          )
        );
      }
    },
    [getNode, id, setNodes]
  );

  return (
    <Card>
      <Handle type="target" position={Position.Top} id={data?.inputBoundId} />
      <CardHeader
        title={data?.label ?? ''}
        subheader={'Guard'}
        action={
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <ShieldCheck width="15" height="15" />
              </TooltipTrigger>
              <TooltipContent side="bottom">
                  {['ID', id].join(' : ')}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        }
      />
      <CardActions>
        <GuardConfigPanel id={id} initialValue={data} deleteNode={deleteNode} onSubmit={changeValues} />
      </CardActions>

      <Handle type="source" position={Position.Bottom} id={data?.outputBoundId} />
    </Card>
  );
};

export default GuardTask;
