"use client";

import { Box, Typography } from '@mui/material';
import { useEffect, type FC } from 'react';

import { ReactFlowProvider } from 'reactflow';

import WorkflowEdit from './components/WorkflowEdit';
import WorkflowDefinitionContextProvider from '@/app/contexts/WorkflowDefinitionContext';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getDefinitionSingle } from "@/actions/workflows/get-definition-single";

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
    <Box
      sx={{
        height: '80vh',
        padding: 3,
      }}
    >
      {isLoading && <Typography>Loading ...</Typography>}
      {!isLoading && data && (
        <ReactFlowProvider>
          <WorkflowDefinitionContextProvider>
            <WorkflowEdit data={data} />
          </WorkflowDefinitionContextProvider>
        </ReactFlowProvider>
      )}
    </Box>
  );
};

export default WorkflowDefinitionEditPage;
