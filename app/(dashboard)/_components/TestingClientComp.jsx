"use client";

import Picker from "@emoji-mart/react";

import data from "@emoji-mart/data";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function TestingClientComponent() {
  return (
    <>
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <SheetDescription>
              <Picker
                navPosition="bottom"
                autofocus
                dynamicWhith
                className="z-50"
                data={data}
                onEmojiSelect={(emoji) => {
                  console.log(emoji.native);
                }}
              />
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
}
