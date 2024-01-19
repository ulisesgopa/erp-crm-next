"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

import useDebounce from "@/hooks/useDebounce";
import { useWorkflowDefinitionContext } from "@/app/contexts/WorkflowDefinitionContext";
import { Grid } from "@radix-ui/themes";

//TODO: fix all the types
//type NewTaskFormProps = {
//  users: any[];
//};

export function NewConfigureDefinitionForm() {
  const { setConfig } = useWorkflowDefinitionContext();  
  const router = useRouter();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");

  const debounceSearchTerm = useDebounce(searchTerm, 1000);

  //const filteredData = users.filter((item) =>
  //  item.name.toLowerCase().includes(debounceSearchTerm.toLowerCase())
  //);

  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    
  const definitionStatus = [
    { name: "Active", id: "Active" },
    { name: "Inactive", id: "Inactive" },
  ];

  const form = useForm<WorkflowMetadataFormSchema>({
    resolver: zodResolver(workflowMetadataFormSchema),
  });

  const onSubmit = async (data: WorkflowMetadataFormSchema) => {
    setIsLoading(true);
    try {
      await axios.post("/api/definition/create", data);
      toast({
        title: "Success",
        description: "Definition created successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data,
      });
    } finally {
      setIsLoading(false);
      form.reset({
        name: "",
        description: "",
        status: undefined,
        global: {},
      });      
      router.refresh();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full px-10">
        <div className="w-[800px] pb-5 space-y-2">
          <div className="grid grid-rows-1 grid-flow-col gap-4">
            <div className="w-1/2 space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Name of the definition"
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isLoading}
                        placeholder="Desciption of the definition"
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose definition status " />
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
            <h5>Global Editor</h5>
              {globalEditorError && (
                <div className="flex gap-2">
                  <h5 className="text-red-600">{globalEditorError}</h5>
                </div>
              )}
              <WorkflowGlobalMonaco
                initialValue={JSON.stringify(globalObjectValue, undefined, 4)}
                setValue={setValue}
                setError={handleGlobalEditorError}
              />
          </div>
        </div>
        <div className="grid gap-2 py-5">
          <Button disabled={isLoading} type="submit">
            {isLoading ? (
              <span className="flex items-center animate-pulse">
                Saving data ...
              </span>
            ) : (
              "Create definition"
            )}
          </Button>
        </div>          
      </form>
    </Form>
  );
}