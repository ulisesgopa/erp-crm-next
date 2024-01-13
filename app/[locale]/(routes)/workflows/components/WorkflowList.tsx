"use client";

import React, { useEffect, useState } from "react";

import { Stack } from '@mui/material';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Box } from '@radix-ui/themes';
import Link from 'next/link';
import { format } from 'date-fns';

const WorkflowListView = ({ data }: any) => {
  const [isLoading] = useState(false);

  return (
    <Box className="height: 100%, width: 100%, padding: 3px">
      <Stack rowGap={4}>
        <Stack direction={'row'} justifyContent={'flex-end'} alignItems={'center'}>
          <Link href={`/workflows/create`}>
            <Button className="mb-5">
              Create +
            </Button>
          </Link>
        </Stack>
        {!isLoading && data && (
          <Stack justifyContent={'flex-start'} alignItems={'flex-start'} rowGap={2}>
            {data.map((item: any) => (
              <Link
                style={{
                  width: '100%',
                }}
                key={item.id}
                href={`/workflows/${item.id}`}
              >
                <Card className="width: 100%, :hover:(backgroundColor: theme.palette.grey['100'])">
                  <CardContent>
                    <Stack
                      sx={{
                        width: '100%',
                      }}
                      direction={'row'}
                      justifyContent={'space-between'}
                      alignItems={'center'}
                    >
                      <span>{item.name}</span>
                      <Badge color={item.status === 'active' ? 'primary' : 'error'}>{item.status.toUpperCase()}</Badge>
                    </Stack>
                    <span style={{paddingTop:2, width:'100%'}}>
                      {item.description}
                    </span>
                    <Stack
                      sx={{
                        width: '100%',
                      }}
                      direction={'row'}
                      justifyContent={'space-between'}
                      alignItems={'center'}
                    >
                      <span>
                        Created at: {format(new Date(item.createdAt), 'dd MMM, yyyy')}
                      </span>
                      <span>
                        Updated at: {format(new Date(item.updatedAt), 'dd MMM, yyyy')}
                      </span>
                    </Stack>
                  </CardContent>
                </Card>
              </Link>
            ))}
            {data?.length < 1 ? (
              <span style={{textAlign: "center", width: "100%"}}>
                No workflow definitions found!
              </span>
            ) : null}
          </Stack>
        )}
        {isLoading && (
          <Stack justifyContent={'flex-start'} alignItems={'flex-start'} rowGap={2}>
            <Card className="width: 100%, :hover:(backgroundColor: theme.palette.grey['100'])">
              <CardContent>
                <Stack
                  sx={{
                    width: '100%',
                  }}
                  direction={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Skeleton className="width=100px" />
                  <Skeleton className="height=30px width=75px" />
                </Stack>
                <Skeleton />
                <Stack
                  sx={{
                    width: '100%',
                  }}
                  direction={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Skeleton className="width=100px" />
                  <Skeleton className="width=100px" />
                </Stack>
              </CardContent>
            </Card>
            <Card className="width: 100%, :hover:(backgroundColor: theme.palette.grey['100'])">
              <CardContent>
                <Stack
                  sx={{
                    width: '100%',
                  }}
                  direction={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Skeleton className="width=100px" />
                  <Skeleton className="height=30px width=75px" />
                </Stack>
                <Skeleton />
                <Stack
                  sx={{
                    width: '100%',
                  }}
                  direction={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Skeleton className="width=100px" />
                  <Skeleton className="width=100px" />
                </Stack>
              </CardContent>
            </Card>
            <Card className="width: 100%, :hover:(backgroundColor: theme.palette.grey['100'])">
              <CardContent>
                <Stack
                  sx={{
                    width: '100%',
                  }}
                  direction={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Skeleton className="width=100px" />
                  <Skeleton className="height=30px width=75px" />
                </Stack>
                <Skeleton />
                <Stack
                  sx={{
                    width: '100%',
                  }}
                  direction={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Skeleton className="width=100px" />
                  <Skeleton className="width=100px" />
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default WorkflowListView;
