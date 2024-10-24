"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TransactionType } from "@/lib/type";
import { cn } from "@/lib/utils";
import {
  CreateTransactionSchema,
  CreateTransactionShemaType,
} from "@/schema/transaction";
import { ReactNode, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CategoryPicker } from "./CategoryPicker";
import { Popover } from "@/components/ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateTransaction } from "../_actions/transactions";
import { toast } from "sonner";
import { DateToUTCDate } from "@/lib/helpers";
import { DevTool } from "@hookform/devtools"; // Import the DevTool component

interface Props {
  trigger: ReactNode;
  type: TransactionType;
}

export function CreateTransactionDialog({ trigger, type }: Props) {
  const [open, setOpen] = useState(false);
  const form = useForm<CreateTransactionShemaType>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      type,
      // date: new Date(),
    },
  });

  const handleCategoryChange = useCallback(
    (value: string) => {
      form.setValue("category", value);
    },
    [form]
  );

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: CreateTransaction,
    onSuccess: () => {
      toast.success("Transaction created", { id: "create-transaction" });
      form.reset({
        type,
        description: "",
        amount: 0,
        date: new Date(),
        category: undefined,
      });

      // refresh the dashboard
      queryClient.invalidateQueries({
        queryKey: ["overview"],
      });
      setOpen((prev) => prev);
    },
  });

  const onSubmit = useCallback(
    (values: CreateTransactionShemaType) => {
      const selectedDate = values.date;
      const normalizedDate = new Date(
        Date.UTC(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          0,
          0,
          0,
          0
        )
      );
      console.log(
        `values.date ===${values.date}`,
        `selectedDate ===${selectedDate}`,
        `normalized date === ${normalizedDate}`
      );
      toast.loading(
        `Creating transactions...,
        `,
        { id: "create-transaction" }
      );
      mutate({
        ...values,
        date: normalizedDate,
      });
    },
    [mutate]
  );
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader className="flex flex-row">
            <DialogTitle>
              Create a new
              <span
                className={cn(
                  "m-2 ",
                  type === "income" ? "text-emerald-500" : "text-rose-500"
                )}
              >
                {type}
              </span>
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Description</FormLabel> */}
                    <FormControl>
                      <Input
                        autoFocus
                        placeholder={`${type} description...`}
                        defaultValue={""}
                        {...field}
                      />
                    </FormControl>
                    {/* <FormDescription>
                    Transaction description (optional)
                  </FormDescription> */}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Transaction description (required)
                    </FormDescription>
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between gap-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <CategoryPicker
                          type={type}
                          onChange={handleCategoryChange}
                        />
                      </FormControl>
                      {/* <FormDescription>
                      Select a category for this transaction
                    </FormDescription> */}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[200px] pl-3 text-left font-normal ",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                          />
                        </PopoverContent>
                      </Popover>
                      {/* <FormDescription>
                      Select a date for this transaction
                    </FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
          <DevTool control={form.control} />

          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant={"secondary"}
                onClick={() => {
                  form.reset();
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
              {!isPending && "Create"}
              {isPending && <Loader2 className="animate-spin" />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
