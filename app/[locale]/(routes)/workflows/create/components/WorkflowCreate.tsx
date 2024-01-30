"use client";

import 'reactflow/dist/style.css';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Box } from "@radix-ui/themes";
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
  Cog
} from "lucide-react";
import type { MouseEvent } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Connection, Edge, Node } from 'reactflow';
import ReactFlow, {
  Background,
  Controls,
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
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import WorkflowGlobalMonaco from '../../components/WorkflowGlobalMonaco';
import { Separator } from '@/components/ui/separator';

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
  const [isLoading] = useState<boolean>(false);
  const { setConfig } = useWorkflowDefinitionContext();
  const [menuEl, setMenuEl] = useState<null | HTMLElement>(null);

  const router = useRouter();
  const [formLoading, setFormLoading] = useState<boolean>(false);

  const [nodes, _, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { addNodes } = useReactFlow();

  const [globalEditorError, setGlobalEditorError] = useState<string | null>(null);
  
  const { setValue, watch, handleSubmit, formState } = useForm<WorkflowMetadataFormSchema>({
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

  const form = useForm<WorkflowMetadataFormSchema>({
    resolver: zodResolver(workflowMetadataFormSchema),
  });

  useEffect(() => {
    setConfig(globalObjectValue);
  }, [globalObjectValue, setConfig]);

  const handleGlobalEditorError = (error: string | null) => {
    setGlobalEditorError(() => error);
  };

  const definitionStatus = [
    { name: "Active", id: "Active" },
    { name: "Inactive", id: "Inactive" },
  ];  

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

    console.log("Hello");

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

    // await axios
    //   .post(
    //     `/definition/create`,
    //     {
    //       workflowData,
    //       key: 'react',
    //       ui: {
    //         nodes,
    //         edges,
    //       },
    //     },
    //   )
    //   .then(() => {
    //     enqueueSnackbar('Workflow added successfully', {
    //       variant: 'success',
    //       autoHideDuration: 2 * 1000,
    //     });
    //     router.push('/workflows');
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //     enqueueSnackbar('Workflow addition failed', {
    //       variant: 'error',
    //       autoHideDuration: 2 * 1000,
    //     });
    //   })
    //   .finally(() => {
    //     setFormLoading(() => false);
    //   });
  });  
  
  return (
    <Box>
      <div className="w-full h-[80vh] justify-start items-start gap-y-1">
        <div className="flex flex-row justify-between items-center gap-x-0.5 w-full">
          <div className="flex flex-row justify-start items-center gap-x-2">
            <Badge variant="destructive"> 
              {Object.keys(formState?.errors).length}
            </Badge>
            <Sheet>
              <Form {...form}>
                <SheetTrigger asChild>
                  <Button variant="secondary">Configure Definition&nbsp; <Cog width="15" height="15" /></Button>
                </SheetTrigger>
                <SheetContent className="sm:max-w-[540px]">
                  <SheetHeader>
                    <SheetTitle>Create Definition</SheetTitle>
                    <SheetDescription>
                      Make changes to your workflow definition here. Your work remains intact when this panel is closed.
                    </SheetDescription>
                  </SheetHeader>
                  <Separator className="mt-6" />
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2 w-full">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input
                                disabled={isLoading}
                                placeholder="Definition name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage>{!!fieldState?.error?.message}</FormMessage>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-2 w-full">
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                disabled={isLoading}
                                placeholder="Definition description"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-2 w-full">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="SelectTrigger">
                                  <SelectValue placeholder="Choose definition status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="flex overflow-y-auto">
                                {definitionStatus.map((status) => (
                                  <SelectItem key={status.id} value={status.id}>
                                    {status.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="w-1/2 space-y-5">
                      <FormLabel>Global Editor</FormLabel>
                      {globalEditorError && (
                        <div className="flex gap-2">
                          <FormLabel className="text-red-600">{globalEditorError}</FormLabel>
                        </div>
                      )}
                      <WorkflowGlobalMonaco
                        initialValue={JSON.stringify(globalObjectValue, undefined, 4)}
                        setValue={setValue}
                        setError={handleGlobalEditorError}
                      />
                    </div>
                  </div>  
                </SheetContent>
              </Form>
            </Sheet>         
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
          </div>
          <LoadingButton loading={formLoading} onClick={() => {submitHandle}}>
            Submit
          </LoadingButton>
        </div>
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
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </Box>
  );
};

export default WorkflowCreate;