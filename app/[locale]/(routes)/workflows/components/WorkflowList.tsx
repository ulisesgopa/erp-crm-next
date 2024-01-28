"use client";

import React, { useState } from "react";

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
    <Box>
      <div className="gap-y-1">
        <div className="flex flex-row justify-end items-center">
          <Link href={`/workflows/create`}>
            <Button className="mb-5">
              Create&nbsp; +
            </Button>
          </Link>
        </div>
        {!isLoading && data && (
          <div className="justify-start items-start gap-y-0.5">
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
                    <div className="w-full flex flex-row justify-between items-center">
                      <span>{item.name}</span>
                      <Badge color={item.status === 'active' ? 'primary' : 'error'}>{item.status.toUpperCase()}</Badge>
                    </div>
                    <span style={{paddingTop:2, width:'100%'}}>
                      {item.description}
                    </span>
                    <div className="w-full flex flex-row justify-between items-center">
                      <span>
                        Created at: {format(new Date(item.createdAt), 'dd MMM, yyyy')}
                      </span>
                      <span>
                        Updated at: {format(new Date(item.updatedAt), 'dd MMM, yyyy')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            {data?.length < 1 ? (
              <span style={{textAlign: "center", width: "100%"}}>
                No workflow definitions found!
              </span>
            ) : null}
          </div>
        )}
        {isLoading && (
          <div className="justify-start items-start gap-y-0.5">
            <Card className="width: 100%, :hover:(backgroundColor: theme.palette.grey['100'])">
              <CardContent>
                <div className="w-full flex flex-row justify-between iteeems-center">
                  <Skeleton className="width=100px" />
                  <Skeleton className="height=30px width=75px" />
                </div>
                <Skeleton />
                <div className="w-full flex flex-row justify-between items-center">
                  <Skeleton className="width=100px" />
                  <Skeleton className="width=100px" />
                </div>
              </CardContent>
            </Card>
            <Card className="width: 100%, :hover:(backgroundColor: theme.palette.grey['100'])">
              <CardContent>
                <div className="w-full flex flex-row juuustify-between items-center">
                  <Skeleton className="width=100px" />
                  <Skeleton className="height=30px width=75px" />
                </div>
                <Skeleton />
                <div  className="w-full flex flex-row justify-between items-center">
                  <Skeleton className="width=100px" />
                  <Skeleton className="width=100px" />
                </div>
              </CardContent>
            </Card>
            <Card className="width: 100%, :hover:(backgroundColor: theme.palette.grey['100'])">
              <CardContent>
                <div className="w-full flex flex-row justify-between items-center">
                  <Skeleton className="width=100px" />
                  <Skeleton className="height=30px width=75px" />
                </div>
                <Skeleton />
                <div className="w-full flex flex-row justify-between items-center">
                  <Skeleton className="width=100px" />
                  <Skeleton className="width=100px" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Box>
  );
};

export default WorkflowListView;
