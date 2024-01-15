import { Card, CardHeader, CardActions } from '@mui/material';
import type { FC } from 'react';
import { useCallback } from 'react';
import type { NodeProps } from 'reactflow';
import { Handle, Position, useReactFlow } from 'reactflow';
import type { ListenConfigSchema } from './Config/ListenConfigPanel';
import ListenConfigPanel from './Config/ListenConfigPanel';
import { Webhook } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent} from "@/components/ui/tooltip";

interface DataProps {
  label: string;
  params: { apiKey: string };
  inputBoundId: string;
  outputBoundId: string;
}

const ListenTask: FC<NodeProps<DataProps>> = ({ data, id }) => {
  const { setNodes, getNode } = useReactFlow();

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((curNode) => curNode.id !== id));
  }, [id, setNodes]);

  const changeValues = useCallback(
    (value: ListenConfigSchema) => {
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
        subheader={'Listen'}
        action={
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Webhook width="15" height="15" />
              </TooltipTrigger>
              <TooltipContent side="bottom">
                  {['ID', id].join(' : ')}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        }
      />
      <CardActions>
        <ListenConfigPanel id={id} initialValue={data} deleteNode={deleteNode} onSubmit={changeValues} />
      </CardActions>

      <Handle type="source" position={Position.Bottom} id={data?.outputBoundId} />
    </Card>
  );
};

export default ListenTask;
