import React, { Suspense } from "react";
import Container from "../components/ui/Container";
import SuspenseLoading from "@/components/loadings/suspense";
import { getAllCrmData } from "@/actions/crm/get-crm-data";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import EmployeesView from "./components/EmployeesView";
import { getEmployee } from "@/actions/get-empoloyee";

const CrmPage = async (props: any) => {
  const crmData = await getAllCrmData();
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  const employee = await getEmployee();

  return (
    <Container
      title="Employees"
      description={"Everything you need to know about Employee"}
    >
      <Suspense fallback={<SuspenseLoading />}>
        <div className="pt-2 space-y-3 ">
          <EmployeesView crmData={crmData} data={employee} />
        </div>
      </Suspense>
    </Container>
  );
};

export default CrmPage;
