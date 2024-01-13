"use client";

import { Box } from '@radix-ui/themes';
import { Suspense, type FC } from 'react';

import { ReactFlowProvider } from 'reactflow';

import WorkflowCreate from './components/WorkflowCreate';
import WorkflowDefinitionContextProvider from '@/app/contexts/WorkflowDefinitionContext';
import Loading from '../loading';

interface Props {}

const WorkflowDefinitionCreatePage: FC<Props> = () => (
  <Box className="height: 80vh padding: 3">
    <ReactFlowProvider>
      <WorkflowDefinitionContextProvider>
        <Suspense fallback={<Loading />}>
          <WorkflowCreate />
        </Suspense>
      </WorkflowDefinitionContextProvider>
    </ReactFlowProvider>
  </Box>
);

export default WorkflowDefinitionCreatePage;
