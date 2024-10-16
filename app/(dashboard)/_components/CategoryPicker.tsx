"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { TransactionType } from "@/lib/type";
import { Category } from "@prisma/client";
import { PopoverContent } from "@radix-ui/react-popover";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { CreateCategoryDialog } from "./CreateCategoryDialog";
import { CommandGroup, CommandItem } from "cmdk";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  type: TransactionType;
  onChange: (value: string) => void;
}

export function CategoryPicker({ type, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!value) return;
    onChange(value);
  }, [value, onChange]);

  const categories = useQuery({
    queryKey: ["categories", type], // if type changes the query gets refetched
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  const selectedCategory = categories.data?.find(
    (category: Category) => category.name === value
  );
  const successCallback = useCallback(
    (category: Category) => {
      setValue(category.name);
      setOpen((prev) => !prev);
    },
    [setValue, setOpen]
  );
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {selectedCategory ? (
              <CategoryRow category={selectedCategory} />
            ) : (
              "Select category"
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <CommandInput placeholder="Search category..." />
            <CreateCategoryDialog
              type={type}
              onSuccessCallback={successCallback}
            />
            <CommandEmpty>
              <p>Category not found</p>
              <p className="text-xs text-muted-foreground">
                Tip: Create a new category
              </p>
            </CommandEmpty>
            <CommandGroup>
              <CommandList>
                {categories.data &&
                  categories.data.map((category: Category) => (
                    <CommandItem
                      className="flex justify-between items-center"
                      key={category.name}
                      onSelect={() => {
                        setValue(category.name);
                        setOpen((prev) => !prev);
                      }}
                    >
                      <CategoryRow category={category} />
                      <Check
                        className={cn(
                          "mr-2 w-4 h-4 opacity-0 ",
                          value === category.name && "opacity-100"
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}

function CategoryRow({ category }: { category: Category }) {
  return (
    <div className="flex items-center gap-2 p-2">
      <span role="img"> {category.icon}</span>
      <span>{category.name}</span>
    </div>
  );
}
