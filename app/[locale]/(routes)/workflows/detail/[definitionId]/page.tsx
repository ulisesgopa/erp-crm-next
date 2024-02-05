"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getDefinitionDetail } from "@/actions/workflows/get-definition-detail";
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { type FC } from 'react';
import Link from "next/link";
import { useParams } from "next/navigation"; 
import { Heading4, Pencil } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Box } from "@radix-ui/themes";

import StartNowDialog from './components/StartNowDialog';

interface Props {}

const WorkflowDetailPage: FC<Props> = () => {
  const params = useParams<{ id: string }>();

  const { data, isLoading, refetch } = useQuery({
    queryKey: [params?.id],
    queryFn: async () => {
      if (params?.id) {
        return getDefinitionDetail(params.id);
      }
      return null;
    },
  });

  return (
    <Box className="p-3">
      {isLoading && <Label>Loading...</Label>}
      {!isLoading && data && (
        <div className="justify-start items-start gap-y-0.5 w-full">
          <Heading4>Workflow Definition</Heading4>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>={<Heading4>{data?.name}</Heading4>}</CardTitle>
              <Badge color={data?.definitionStatus === 'active' ? 'success' : 'error'}>
                {data?.definitionStatus?.toUpperCase()}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="gap-y-0.5">
                <CardDescription>
                  {data?.description}
                </CardDescription>
                <div className="grid grid-flow-row auto-rows-auto grid-flow auto-cols-auto gap-y-0.5 gap-x-0.5 justify-between items-center"> 
                  <Label>Last Updated: {format(new Date(data?.updatedAt as any), 'dd MMM yyyy, hh:mm aa')}</Label>
                  <Label>Created: {format(new Date(data?.createdAt as any), 'dd MMM yyyy, hh:mm aa')}</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="gap-y-0.5">
              <Link href={`/edit/${data.id}`}>
                <Button variant="outline">
                  Edit&nbsp;
                  <Pencil />
                </Button>
              </Link>
              <StartNowDialog refetch={refetch} workflowDefinitionId={data.id} />
            </CardFooter>
          </Card>
          <Heading4>Workflow Runtimes</Heading4>
          {data.runtimes.map((runtime) => (
            <Link style={{ width: '100%' }} key={runtime.id} href={`/runtime/${runtime.id}`}>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>{<Label>{runtime.id}</Label>}</CardTitle>
                  <Badge color={runtime.workflowStatus === 'completed' ? 'success' : undefined}>
                    label={runtime.workflowStatus.toUpperCase()}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-flow-row auto-rows-auto grid-flow auto-cols-auto gap-y-0.5 gap-x-0.5 justify-between items-center"> 
                    <Label>
                      Last Updated: {format(new Date(runtime.updatedAt as any), 'dd MMM yyyy, hh:mm aa')}
                    </Label>
                    <Label>Created: {format(new Date(runtime.createdAt as any), 'dd MMM yyyy, hh:mm aa')}</Label>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {data.runtimes?.length < 1 ? (
            <Label className="text-center w-full">
              No runtime found!
            </Label>
          ) : null}
        </div>
      )}
    </Box>
  );
};

export default WorkflowDetailPage;