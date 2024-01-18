import { Box, Card, CardActions, CardContent, CardHeader, Chip, Stack, Typography } from '@mui/material';
import { getDefinitionDetail } from "@/actions/workflows/get-definition-detail";
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { type FC } from 'react';
import Link from "next/link";
import { useParams } from "next/navigation"; 
import { Pencil } from 'lucide-react';
import { Button } from "@/components/ui/button";

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
    <Box
      sx={{
        padding: { sm: 3, xs: 1 },
      }}
    >
      {isLoading && <Typography>Loading...</Typography>}
      {!isLoading && data && (
        <Stack
          justifyContent={'flex-start'}
          alignItems={'flex-start'}
          rowGap={2}
          sx={{
            width: '100%',
          }}
        >
          <Typography variant="h4">Workflow Definition</Typography>
          <Card
            elevation={0}
            sx={{
              border: (theme) => `1px solid ${theme.palette.grey['A200']}`,
              width: '100%',
            }}
          >
            <CardHeader
              title={<Typography variant="h4">{data?.name}</Typography>}
              action={
                <Chip color={data?.definitionStatus === 'active' ? 'success' : 'error'} label={data?.definitionStatus?.toUpperCase()} />
              }
            />
            <CardContent>
              <Stack rowGap={2}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: (theme) => theme.palette.grey['A700'],
                  }}
                >
                  {data?.description}
                </Typography>
                <Stack
                  direction={{ sm: 'row', xs: 'column' }}
                  columnGap={2}
                  rowGap={2}
                  justifyContent={'space-between'}
                  alignItems={{ sm: 'center', xs: 'flex-start' }}
                >
                  <Typography>Last Updated: {format(new Date(data?.updatedAt as any), 'dd MMM yyyy, hh:mm aa')}</Typography>
                  <Typography>Created: {format(new Date(data?.createdAt as any), 'dd MMM yyyy, hh:mm aa')}</Typography>
                </Stack>
              </Stack>
            </CardContent>
            <CardActions
              sx={{
                columnGap: 2,
              }}
            >
              <Link href={`/edit/${data.id}`}>
                <Button variant="outline">
                  Edit&nbsp;
                  <Pencil />
                </Button>
              </Link>
              <StartNowDialog refetch={refetch} workflowDefinitionId={data.id} />
            </CardActions>
          </Card>
          <Typography variant="h4">Workflow Runtimes</Typography>
          {data.runtimes.map((runtime) => (
            <Link style={{ width: '100%' }} key={runtime.id} href={`/runtime/${runtime.id}`}>
              <Card
                elevation={0}
                sx={{
                  border: (theme) => `1px solid ${theme.palette.grey['A200']}`,
                  width: '100%',
                  ':hover': {
                    backgroundColor: (theme) => theme.palette.grey['100'],
                  },
                }}
              >
                <CardHeader
                  title={<Typography>{runtime.id}</Typography>}
                  action={
                    <Chip
                      color={runtime.workflowStatus === 'completed' ? 'success' : undefined}
                      label={runtime.workflowStatus.toUpperCase()}
                    />
                  }
                />
                <CardContent>
                  <Stack
                    direction={{ sm: 'row', xs: 'column' }}
                    columnGap={2}
                    rowGap={2}
                    justifyContent={'space-between'}
                    alignItems={{ sm: 'center', xs: 'flex-start' }}
                  >
                    <Typography>
                      Last Updated: {format(new Date(runtime.updatedAt as any), 'dd MMM yyyy, hh:mm aa')}
                    </Typography>
                    <Typography>Created: {format(new Date(runtime.createdAt as any), 'dd MMM yyyy, hh:mm aa')}</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Link>
          ))}
          {data.runtimes?.length < 1 ? (
            <Typography
              sx={{
                textAlign: 'center',
                width: '100%',
              }}
            >
              No runtime found!
            </Typography>
          ) : null}
        </Stack>
      )}
    </Box>
  );
};

export default WorkflowDetailPage;