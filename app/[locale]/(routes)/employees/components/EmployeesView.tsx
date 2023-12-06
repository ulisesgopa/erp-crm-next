"use client";

import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { EmployeeDataTable } from "../table-components/data-table";
import EmployeeHeader from "./empHeader";
import { columns } from "../table-components/columns";

const EmployeesView = ({ data, crmData }: any) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }



  return (
    <Card>
      <div className="p-8 pb-0">
        <EmployeeHeader crmData={crmData} />
      </div>
      <CardContent>
        {!data || data.length === 0 ? (
          "No assigned employee found"
        ) : (
          <EmployeeDataTable data={data} columns={columns} />
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeesView;