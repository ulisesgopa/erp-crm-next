"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadingModal from "./modals/loading-modal";

const languages = [
  { label: "Español", value: "es" },
  { label: "English", value: "en" },
] as const;

const FormSchema = z.object({
  language: z.string({
    required_error: "Selecciona un idioma.",
  }),
});

type Props = {
  userId: string;
};

export function SetLanguage({ userId }: Props) {
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    try {
      await axios.put(`/api/user/${userId}/set-language`, data);
      toast({
        title: "Completado",
        description: "Cambiaste el idioma a: " + data.language,
      });
    } catch (e) {
      console.log(e, "error");
      toast({
        title: "Error",
        description: "Algo salió mal.",
        variant: "destructive",
      });
    } finally {
      router.refresh();
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <LoadingModal isOpen={isLoading} description="Cambiando idioma" />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="hidden lg:block space-y-6"
      >
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? languages.find(
                            (language) => language.value === field.value
                          )?.label
                        : "Seleccionar idioma"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Buscar idioma ..." />
                    <CommandEmpty>Idioma no encontrado.</CommandEmpty>
                    <CommandGroup>
                      {languages.map((language) => (
                        <CommandItem
                          value={language.value}
                          key={language.value}
                          onSelect={(value) => {
                            form.setValue("language", value);
                            onSubmit(form.getValues());
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              language.value === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {language.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
