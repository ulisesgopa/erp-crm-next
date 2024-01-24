import { zodResolver } from '@hookform/resolvers/zod';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { ToastAction } from "@/components/ui/toast"

const endConfigSchema = z.object({
  label: z
    .string({
      required_error: 'Label is required',
    })
    .min(1, 'Label is required'),
});

export type EndConfigSchema = z.infer<typeof endConfigSchema>;

interface Props {
  onSubmit: (value: EndConfigSchema) => void;
  initialValue: EndConfigSchema;
  deleteNode: Function;
  id: string;
}

const EndConfigPanel: FC<Props> = ({ onSubmit, initialValue, deleteNode, id }) => {
  const [isLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { getNodes } = useReactFlow();
  const [labelUniqueError, setLabelUniqueError] = useState<string | null>(null);
  
  const { watch } = useForm<EndConfigSchema>({
    resolver: zodResolver(endConfigSchema),
    values: {
      label: initialValue?.label ?? '',
    },
  });

  const labelValue = watch('label');

  const form = useForm<EndConfigSchema>({
    resolver: zodResolver(endConfigSchema),
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
        setLabelUniqueError(() => 'Task name already exists');
      } else {
        setLabelUniqueError(() => null);
      }
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [getNodes, id, labelValue]);

  return (
    <>
      {/*<Badge variant="destructive">
        {Object.keys(formState.errors).length + (labelUniqueError ? 1 : 0)}
      </Badge>*/}
      <Sheet>
        <Form {...form}>
          <SheetTrigger asChild>
            <Button variant="outline">Configure</Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-[540px]">
            <SheetHeader>
              <SheetTitle>{[initialValue?.label, 'Configuration'].join(' ')}</SheetTitle>
                <SheetDescription>
                  Make changes to End Configuration panel.
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
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button 
                  type="submit"
                  onClick={() => {
                    toast({
                      title: "Success",
                      description: "Task changed successfully."
                    })
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

export default EndConfigPanel;
