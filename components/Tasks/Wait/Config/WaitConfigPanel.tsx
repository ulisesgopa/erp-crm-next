import { zodResolver } from '@hookform/resolvers/zod';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { useReactFlow } from 'reactflow';
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
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
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';

const waitConfigSchema = z.object({
  label: z
    .string({
      required_error: 'Label is required',
    })
    .min(1, 'Label is required'),
  params: z.object({
    taskNames: z.array(z.string()),
  }),
});

export type WaitConfigSchema = z.infer<typeof waitConfigSchema>;

interface Props {
  onSubmit: (value: WaitConfigSchema) => void;
  initialValue: WaitConfigSchema;
  deleteNode: Function;
  id: string;
}

const WaitConfigPanel: FC<Props> = ({ onSubmit, initialValue, deleteNode, id }) => {
  const [isLoading] = useState<boolean>(false);
  const { toast } = useToast();  
  const { getNodes } = useReactFlow();
  const [openConfigPanel, setOpenConfigPanel] = useState<boolean>(false);
  const [labelUniqueError, setLabelUniqueError] = useState<string | null>(null);
  const [taskNamesUnknownError, setTaskNamesUnknownError] = useState<string | null>(null);

  const { watch } = useForm<WaitConfigSchema>({
    resolver: zodResolver(waitConfigSchema),
    values: {
      label: initialValue?.label ?? '',
      params: initialValue?.params ?? {
        taskNames: [],
      },
    },
  });

  const taskNamesValue = watch('params.taskNames');
  const labelValue = watch('label');

  const form = useForm<WaitConfigSchema>({
    resolver: zodResolver(waitConfigSchema),
  });

   useEffect(() => {
    const timeout = setTimeout(() => {
      const nodes = getNodes();

      if (
        nodes
          .filter((node) => node.id !== id)
          .map((node) => node?.data?.label)
          .includes(labelValue)
      ) {
        setLabelUniqueError(() => 'Task name already exist');
      } else {
        setLabelUniqueError(() => null);
      }
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [getNodes, id, labelValue]);

  useEffect(() => {
    const nodes = getNodes().map((node) => node.data?.label);

    const unknownNodes = taskNamesValue.filter((item) => !nodes.includes(item));

    if (unknownNodes && unknownNodes.length > 0) {
      setTaskNamesUnknownError(() => `${unknownNodes.join(', ')} is/are unknown Tasks`);
    } else {
      setTaskNamesUnknownError(() => null);
    }
  }, [getNodes, taskNamesValue]);

  useEffect(() => {
    const nodes = getNodes().filter((node) => node.id !== id).map((node) => node?.data?.label);
    const delimitNodes = [...nodes.values()].flat().join('&');

    const opts = delimitNodes.split('&');

    console.log("Option:", opts);

  }, [getNodes, id]); 

  return (
    <>
      {/* <Badge variant="descructive">
          Object.keys(formState.errors).length + (labelUniqueError ? 1 : 0) + (taskNamesUnknownError ? 1 : 0)
      </Badge> */}
      <Sheet>
        <Form {...form}>
          <SheetTrigger asChild>
            <Button variant="outline">Configure</Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-[540px]">
            <SheetHeader>
              <SheetTitle>{[initialValue?.label, 'Configuration'].join(' ')}</SheetTitle>
                <SheetDescription>
                  Make changes to Wait Configuration panel.
                </SheetDescription>
              </SheetHeader>
            <Separator className="mt-6" />
            <div className="grid gap-4 py-4">
              <div className="w-1/2 space-y-2">
                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Label</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="Name of the Task"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-1/2 space-y-2">
                <FormField
                  control={form.control}
                  name="params.taskNames"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tasks</FormLabel>
                      <FormControl>
                        <MultipleSelector
                          onChange={field.onChange}
                          placeholder="Select tasks to wait on..."
                          emptyIndicator={
                            <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                              no results found.
                            </p>
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>                              
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button 
                  type="submit"
                  onClick={() => {
                    toast({
                      title: "Success",
                      description: "Task changed successfully."
                    });
                  }}                  
                >
                  Submit
                </Button>
              </SheetClose>
              <Button
                variant="destructive"
                onClick={() => {
                  deleteNode();
                }}
              >
                Delete Task
              </Button>
            </SheetFooter>
          </SheetContent>
        </Form>
      </Sheet>
    </>
  );
};

export default WaitConfigPanel;
