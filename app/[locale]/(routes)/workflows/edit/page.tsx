"use client";

import { useEffect, type FC } from 'react';

import { ReactFlowProvider } from 'reactflow';

import WorkflowEdit from './components/WorkflowEdit';
import WorkflowDefinitionContextProvider from '@/app/contexts/WorkflowDefinitionContext';
import { useQuery } from '@tanstack/react-query';
import { useParams } from "next/navigation";
import { getDefinitionSingle } from "@/actions/workflows/get-definition-single";
import { Box } from "@radix-ui/themes";
import { Label } from "@/components/ui/label";

interface Props {}

const WorkflowDefinitionEditPage: FC<Props> = () => {
  const params = useParams<{ id: string }>();

  const { data, isLoading } = useQuery({
    queryKey: [params?.id],
    queryFn: async () => {
      if (params?.id) {
        return getDefinitionSingle(params.id);
      }
      return null;
    },
  });

  return (
    <Box className="h=[80vh] p-3">
      {isLoading && <Label>Loading ...</Label>}
      {!isLoading && data && (
        <ReactFlowProvider>
          <WorkflowDefinitionContextProvider>
            <WorkflowEdit definition={data} />
          </WorkflowDefinitionContextProvider>
        </ReactFlowProvider>
      )}
    </Box>
  );
};

export default WorkflowDefinitionEditPage;
