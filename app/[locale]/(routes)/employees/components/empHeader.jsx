"use client"

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { NewEmployeeForm } from "./NewEmployeeForm";

const EmployeeHeader = ( {crmData}) => {
  const { users, accounts } = crmData;
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="flex justify-between">
        <div>
          <CardTitle className="cursor-pointer">Employee</CardTitle>
          <CardDescription></CardDescription>
        </div>
        <div className="flex space-x-2">
          <Sheet open={open} onOpenChange={() => setOpen(false)}>
            <Button
              className="m-2 cursor-pointer"
              onClick={() => setOpen(true)}
            >
              +
            </Button>
            <SheetContent className="min-w-[1000px] space-y-2">
              <SheetHeader>
                <SheetTitle>Create new employee</SheetTitle>
              </SheetHeader>
              <div className="h-full overflow-y-auto">
                <NewEmployeeForm
                  // industries={industries}
                   users={users}
                  onFinish={() => setOpen(false)}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
};

export default EmployeeHeader;
