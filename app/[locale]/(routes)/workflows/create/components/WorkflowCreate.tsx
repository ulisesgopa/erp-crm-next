"use client";

import 'reactflow/dist/style.css';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Container,
  MenuItem,
  Slide,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";
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
  Webhook
} from "lucide-react";
import { Cross1Icon } from "@radix-ui/react-icons";
import type { TransitionProps } from '@mui/material/transitions';
import type { MouseEvent, ReactElement, Ref } from 'react';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
import { X } from "lucide-react";
import { z } from 'zod';
import WorkflowGlobalMonaco from '../../components/WorkflowGlobalMonaco';
import { Error } from '@mui/icons-material';
import { httpClient } from '@/lib/http/httpClient';
import { enqueueSnackbar } from 'notistack';
import { useWorkflowDefinitionContext } from '@/app/contexts/WorkflowDefinitionContext';
import { useRouter } from 'next/navigation';
import { nodeTypes, taskCreator } from '@/lib/creators/task';

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

    await httpClient
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
        {
          headers: {
            //Authorization: ['Bearer', token].join(' '),
          },
        }
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
            <Dialog.Root open={definitionDialog}>
              <Dialog.Trigger asChild>
                <Button variant="secondary" onClick={openDefinitionDialog}>Configure Definition</Button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="data-[state=open]:animate-[dialog-overlay-show_1000ms] data-[state=closed]:animate-[dialog-overlay-hide_1000ms] fixed inset-0 bg-black/50" />
                <Dialog.Content
                  className={
                    "data-[state=open]:animate-[dialog-content-show_1000ms] data-[state=closed]:animate-[dialog-content-hide_1000ms] fixed top-0 right-0 rounded-md border h-full bg-white dark:bg-slate-900 shadow-md overflow-hidden"
                  }
                >
                  <div className="flex flex-col h-full w-[300]">
                    <div className="flex justify-between w-full">
                      <Dialog.Title className="font-semibold p-3 w-full">
                        <span className="scroll-m-20 text-xl font-semibold tracking-tight">
                          Configure Definition
                        </span>
                      </Dialog.Title>
                      <Dialog.Close className="flex justify-end text-right w-full pr-5 pt-5">
                        <Cross1Icon className="w-5 h-5 opacity-50 hover:opacity-100" />
                      </Dialog.Close>
                    </div>
                    <Dialog.Description className="text-slate-400 p-3 overflow-auto opacity-75">
                      Workflow Setup
                    </Dialog.Description>                                
                    <Container>
                      <Stack
                        sx={{
                          padding: 2,
                        }}
                        justifyContent={'flex-start'}
                        alignItems={'flex-start'}
                        rowGap={4}
                      >
                        <Controller
                          control={control}
                          name="name"
                          render={({ field, fieldState }) => (
                            <TextField
                              {...field}
                              label="Name"
                              placeholder="Name of the definition"
                              error={!!fieldState?.error?.message}
                              helperText={fieldState?.error?.message}
                              fullWidth
                            />
                          )}
                        />
                        <Controller
                          control={control}
                          name="description"
                          render={({ field, fieldState }) => (
                            <TextField
                              {...field}
                              label="Description"
                              placeholder="Description of the definition"
                              error={!!fieldState?.error?.message}
                              helperText={fieldState?.error?.message}
                              multiline
                              fullWidth
                              minRows={4}
                            />
                          )}
                        />
                        <Controller
                          control={control}
                          name="status"
                          render={({ field, fieldState }) => (
                            <TextField
                              {...field}
                              label="Status"
                              placeholder="Status of the definition"
                              error={!!fieldState?.error?.message}
                              helperText={fieldState?.error?.message}
                              select
                              fullWidth
                            >
                              <MenuItem value={'active'}>Active</MenuItem>
                              <MenuItem value={'inactive'}>Inactive</MenuItem>
                            </TextField>
                          )}
                        />
                        <Typography>Global:</Typography>
                        {globalEditorError && (
                          <Stack direction={'row'} justifyContent={'flex-start'} alignItems={'center'} columnGap={2}>
                            <Error color="error" />
                            <Typography>{globalEditorError}</Typography>
                          </Stack>
                        )}
                        <WorkflowGlobalMonaco
                          initialValue={JSON.stringify(globalObjectValue, undefined, 4)}
                          setValue={setValue}
                          setError={handleGlobalEditorError}
                        />
                      </Stack>
                    </Container>
                    <div className="flex justify-end w-full p-3">
                      {" "}
                      <Dialog.Close asChild>
                        <Button variant={"destructive"} onClick={() => setDefinitionDialog(false)}>
                          Close
                        </Button>
                      </Dialog.Close>
                    </div>      
                  </div>
                </Dialog.Content>
              </Dialog.Portal>                
            </Dialog.Root>
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