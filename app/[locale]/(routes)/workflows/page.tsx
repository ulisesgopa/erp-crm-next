import { Suspense } from "react";
import Container from "../components/ui/Container";
import SuspenseLoading from "@/components/loadings/suspense";

const WorkflowPage = async () => {
  return (
    <Container
      title="Workflows"
      description={"Manage all your workflows here"}
    >
      {/*
      TODO: Think about how to handle the loading of the data to make better UX with suspense
      */}
      <Suspense fallback={<SuspenseLoading />}>
      </Suspense>
    </Container>
  );
};

export default WorkflowPage;