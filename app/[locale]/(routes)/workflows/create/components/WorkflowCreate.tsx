"use client";

import 'reactflow/dist/style.css';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Slide,
  Stack,
} from '@mui/material';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingButton } from "@/components/ui/loading-button";
import { 
  ChevronDown,
  Sigma,
  PlayCircle,
  CircleOff,
  ShieldCheck, 
  Hand,
  Webhook,
  Code2
} from "lucide-react";
import type { TransitionProps } from '@mui/material/transitions';
import type { MouseEvent, ReactElement, Ref } from 'react';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Connection, Edge, Node } from 'reactflow';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from 'reactflow';
import { z } from 'zod';
import { enqueueSnackbar } from 'notistack';
import { useWorkflowDefinitionContext } from '@/app/contexts/WorkflowDefinitionContext';
import { useRouter } from 'next/navigation';
import { nodeTypes, taskCreator } from '@/lib/creators/task';
import axios from 'axios';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const workflowMetadataFormSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
    })
    .min(1, 'Name is required'),
  description: z
    .string({
      required_error: 'Description is required',
    })
    .min(1, 'Description is required'),
  global: z.record(z.string(), z.any()).refine((val) => !Object.keys(val).includes(''), 'Empty keys is not valid'),
  status: z.enum(['active', 'inactive']),
});

type WorkflowMetadataFormSchema = z.infer<typeof workflowMetadataFormSchema>;

const initialNodes: Node[] = [
  {
    id: 'a8c86331-880f-43d1-8bdb-906f5b2715b0',
    data: {
      label: 'Test Task',
      params: {
        token: 'abc',
      },
      inputBoundId: '23c1b944-0d73-4e32-b901-37ac2c21c05d',
      outputBoundId: '6e61e128-1d27-4cad-b597-653990a9ca67',
      execTs: `
      /**
       * @see {@link https://workflow-engine-docs.pages.dev/docs/tasks/function_task}
      */
      async function handler() {
        return {"hello":"world"};
      }
            `,
      exec: `
            /**
             * @see {@link https://workflow-engine-docs.pages.dev/docs/tasks/function_task}
             */
            async function handler() {
              return {"hello":"world"};
            }
            `,
    },
    position: {
      x: 638.7184283607929,
      y: 271.17332897421414,
    },
    type: 'function',
    selected: false,
    positionAbsolute: {
      x: 638.7184283607929,
      y: 271.17332897421414,
    },
    dragging: false,
  },
  {
    id: '24a7188e-d17b-4a5f-94a0-89286edc8b9f',
    data: {
      label: 'End Task',
      inputBoundId: '4b05ea04-ecbc-4f4f-80ef-9f0d4ae21d53',
    },
    position: {
      x: 640.7336773039084,
      y: 510.40481776943034,
    },
    type: 'end',
    selected: true,
    positionAbsolute: {
      x: 640.7336773039084,
      y: 510.40481776943034,
    },
    dragging: false,
  },
  {
    id: '2f8f2520-46be-4199-b85e-e889a29c2f01',
    data: {
      label: 'Start Task',
      outputBoundId: '6fcf0614-e0d1-4fb8-9446-0026bad0b481',
    },
    position: {
      x: 635.7063180445617,
      y: 29.03410258347799,
    },
    type: 'start',
    selected: false,
    positionAbsolute: {
      x: 635.7063180445617,
      y: 29.03410258347799,
    },
    dragging: false,
  },
];

const initialEdges: Edge[] = [
  {
    source: '2f8f2520-46be-4199-b85e-e889a29c2f01',
    sourceHandle: '6fcf0614-e0d1-4fb8-9446-0026bad0b481',
    target: 'a8c86331-880f-43d1-8bdb-906f5b2715b0',
    targetHandle: '23c1b944-0d73-4e32-b901-37ac2c21c05d',
    animated: true,
    id: 'reactflow__edge-2f8f2520-46be-4199-b85e-e889a29c2f016fcf0614-e0d1-4fb8-9446-0026bad0b481-a8c86331-880f-43d1-8bdb-906f5b2715b023c1b944-0d73-4e32-b901-37ac2c21c05d',
  },
  {
    source: 'a8c86331-880f-43d1-8bdb-906f5b2715b0',
    sourceHandle: '6e61e128-1d27-4cad-b597-653990a9ca67',
    target: '24a7188e-d17b-4a5f-94a0-89286edc8b9f',
    targetHandle: '4b05ea04-ecbc-4f4f-80ef-9f0d4ae21d53',
    animated: true,
    id: 'reactflow__edge-a8c86331-880f-43d1-8bdb-906f5b2715b06e61e128-1d27-4cad-b597-653990a9ca67-24a7188e-d17b-4a5f-94a0-89286edc8b9f4b05ea04-ecbc-4f4f-80ef-9f0d4ae21d53',
  },
];

type Props = {}

const WorkflowCreate: React.FC<Props> = () => {

  const { setConfig } = useWorkflowDefinitionContext();
  const [menuEl, setMenuEl] = useState<null | HTMLElement>(null);
  const open = Boolean(menuEl);

  const router = useRouter();
  const [formLoading, setFormLoading] = useState<boolean>(false);

  const [nodes, _, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { addNodes } = useReactFlow();

  const [definitionDialog, setDefinitionDialog] = useState<boolean>(false);

  const [globalEditorError, setGlobalEditorError] = useState<string | null>(null);
  
  const { control, setValue, watch, handleSubmit, formState } = useForm<WorkflowMetadataFormSchema>({
    resolver: zodResolver(workflowMetadataFormSchema),
    mode: 'all',
    values: {
      name: '',
      description: '',
      global: {},
      status: 'active',
    },
  });

  const globalObjectValue = watch('global');

  useEffect(() => {
    setConfig(globalObjectValue);
  }, [globalObjectValue, setConfig]);

  const handleGlobalEditorError = (error: string | null) => {
    setGlobalEditorError(() => error);
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const deleteEdge = useCallback(
    (edge: Edge) => {
      setEdges((edges) => edges.filter((curEdge) => curEdge.id !== edge.id));
    },
    [setEdges]
  );

  const openDefinitionDialog = () => {
    setDefinitionDialog(() => true);
  };

  const closeDefinitionDialog = () => {
    setDefinitionDialog(() => false);
  };

  const handleMenuOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setMenuEl(() => event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuEl(() => null);
  };

  const addNewTask = (type: keyof typeof taskCreator) => {
    addNodes(taskCreator[type]());
    handleMenuClose();
  };

  const submitHandle = handleSubmit(async (values) => {
    setFormLoading(() => true);

    const parsedTask = nodes.map((item) => ({
      id: item?.id,
      name: item.data?.label,
      type: item.type?.toUpperCase(),
      params: item?.data?.params ?? {},
      next: edges
        .filter((val) => val?.sourceHandle === item?.data?.outputBoundId)
        .map((edge) => nodes.find((node) => node.id === edge.target)?.data?.label)
        .filter((v) => !!v),
      previous: edges
        .filter((val) => val?.targetHandle === item?.data?.inputBoundId)
        .map((edge) => nodes.find((node) => node.id === edge.source)?.data?.label)
        .filter((v) => !!v),
      ...(item?.data?.exec && {
        exec: item?.data?.exec,
      }),
      ...(item?.data?.execTs && {
        execTs: item?.data?.execTs,
      }),
    }));

    const workflowData = {
      name: values.name,
      description: values.description,
      global: values.global,
      tasks: parsedTask,
      status: values.status,
    };

    await axios
      .post(
        '/definition/create',
        {
          workflowData,
          key: 'react',
          ui: {
            nodes,
            edges,
          },
        },
      )
      .then(() => {
        enqueueSnackbar('Workflow added successfully', {
          variant: 'success',
          autoHideDuration: 2 * 1000,
        });
        router.push('/workflows');
      })
      .catch((error) => {
        console.error(error);
        enqueueSnackbar('Workflow addition failed', {
          variant: 'error',
          autoHideDuration: 2 * 1000,
        });
      })
      .finally(() => {
        setFormLoading(() => false);
      });
  });  
  
  return (
    <Box>
      <Stack
        sx={{
          height: '80vh',
          width: '100%',
        }}
        justifyContent={'flex-start'}
        alignItems={'flex-start'}
        rowGap={4}
      >
        <Stack
          sx={{
            width: '100%',
          }}
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          columnGap={2}
        >
          <Stack direction={'row'} justifyContent={'flex-start'} alignItems={'center'} columnGap={2}>
            <Badge variant="destructive">
              {Object.keys(formState?.errors).length}
            </Badge>
            <Button variant="secondary" onClick={handleMenuOpen}>
              Configure Definition&nbsp;
              <Code2 width="16" height="16" />
            </Button>            
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="secondary" onClick={handleMenuOpen}>
                  New Task&nbsp;
                  <ChevronDown width="16" height="16" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[125px]">              
                <DropdownMenuItem onClick={() => addNewTask('function')}>
                  <Sigma width="18" height="18" />
                  <span className="pl-4"> Function </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addNewTask('start')}>
                  <PlayCircle width="18" height="18" />
                  <span className="pl-4"> Start </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addNewTask('end')}>
                  <CircleOff width="18" height="18" />
                  <span className="pl-4"> End </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addNewTask('guard')}>
                  <ShieldCheck width="18" height="18" />
                  <span className="pl-4"> Guard </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addNewTask('wait')}>
                  <Hand width="18" height="18" />
                  <span className="pl-4"> Wait </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addNewTask('listen')}>
                  <Webhook width="18" height="18" />
                  <span className="pl-4"> Listen </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Stack>
          <LoadingButton loading={formLoading} onClick={submitHandle}>
            Submit
          </LoadingButton>
        </Stack>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onEdgeDoubleClick={(e, edge) => {
            e.preventDefault();
            e.stopPropagation();
            deleteEdge(edge);
          }}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </Stack>
    </Box>
  );
};

export default WorkflowCreate;