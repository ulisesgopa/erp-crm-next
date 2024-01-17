"use client";

import { useState } from "react";
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

import useDebounce from "@/hooks/useDebounce";

//TODO: fix all the types
type NewTaskFormProps = {
  users: any[];
};

export function NewConfigureDefinitionForm({ users }: NewTaskFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");

  const debounceSearchTerm = useDebounce(searchTerm, 1000);

  const filteredData = users.filter((item) =>
    item.name.toLowerCase().includes(debounceSearchTerm.toLowerCase())
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formSchema = z.object({
    name: z.string(),
    description: z.string(),
    status: z.string(),
    global: z.string(),
    assigned_to: z.string(),
  });

  type NewConfigureDefinitionFormValues = z.infer<typeof formSchema>;

  const definitionStatus = [
    { name: "Active", id: "Active" },
    { name: "Inactive", id: "Inactive" },
  ];

  const form = useForm<NewConfigureDefinitionFormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: NewConfigureDefinitionFormValues) => {
    setIsLoading(true);
    try {
      await axios.post("/api/workflow", data);
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
        status: "",
        global: "",
        assigned_to: "",
      });      
      router.refresh();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full px-10">
        <div className="w-[800px] pb-5 space-y-2">
          <div className="flex gap-5 pb-5">
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
                      <SelectContent className="flex overflow-y-auto h-56">
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
            <div className="w-1/2 space-y-2">
              <FormField
                control={form.control}
                name="assigned_to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned user</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a user " />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="h-96 overflow-y-auto">
                        <Input
                          type="text"
                          placeholder="Search in users ..."
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {filteredData?.map((item, index) => (
                          <SelectItem key={index} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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