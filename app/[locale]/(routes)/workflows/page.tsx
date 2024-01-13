import React, { Suspense } from "react";
import Container from "../components/ui/Container";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Session } from "next-auth";

import WorkflowListPage from "./components/WorkflowList";
import SuspenseLoading from "@/components/loadings/suspense";

import { getWorkflows } from "@/actions/workflows/get-workflows";

export const maxDuration = 300;

const WorkflowsPage = async () => {
  const workflows = await getWorkflows();
  const session: Session | null = await getServerSession(authOptions);

  if (!session) return redirect("/sign-in");

  return (
    <Container
      title="Workflows"
      description={"Everything you need to know about workflows"}
    >
      <Suspense fallback={<SuspenseLoading />}>
        <WorkflowListPage data={workflows} />
      </Suspense>
    </Container>
  );
};

export default WorkflowsPage;
