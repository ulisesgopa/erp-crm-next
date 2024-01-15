import { Card, CardHeader, CardActions } from "@mui/material";
import type { FC } from "react";
import { useCallback } from "react";
import type { NodeProps } from "reactflow";
import { Handle, Position, useReactFlow } from "reactflow";
import { CircleOff } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent} from "@/components/ui/tooltip";

import type { EndConfigSchema } from "./Config/EndConfigPanel";
import EndConfigPanel from "./Config/EndConfigPanel";

interface DataProps {
  label: string;
  inputBoundId: string;
}

const EndTask: FC<NodeProps<DataProps>> = ({ data, id }) => {
  const { setNodes, getNode } = useReactFlow();

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((curNode) => curNode.id !== id));
  }, [id, setNodes]);

  const changeValues = useCallback(
    (value: EndConfigSchema) => {
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
      <Handle type="target" position={Position.Top} id={data.inputBoundId} />
      <CardHeader
        title={data.label}
        subheader={'End'}
        action={
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <CircleOff width="15" height="15" />
              </TooltipTrigger>
              <TooltipContent side="bottom">
                  {['ID', id].join(' : ')}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        }
      />
      <CardActions>
        <EndConfigPanel id={id} initialValue={data} deleteNode={deleteNode} onSubmit={changeValues} />
      </CardActions>
    </Card>
  );
};

export default EndTask;
