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
              <Link className="w-full"
                key={item.id}
                href={`/workflows/detail/${item.id}`}
              >
                <Card className="w-full hover:bg-slate-100">
                  <CardContent>
                    <div className="w-full flex flex-row justify-between items-center">
                      <span>{item.name}</span>
                      <Badge color={item.definitionStatus === 'active' ? 'primary' : 'error'}>{item.definitionStatus}</Badge>
                    </div>
                    <span className="pt-2 w-full">
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
              <span className="flex flex-row justify-center">
                No workflow definitions found!
              </span>
            ) : null}
          </div>
        )}
        {isLoading && (
          <div className="justify-start items-start gap-y-0.5">
            <Card className="w-full hover:bg-slate-100">
              <CardContent>
                <div className="w-full flex flex-row justify-between iteeems-center">
                  <Skeleton className="w-[100px]" />
                  <Skeleton className="h-[30px] w-[75px]" />
                </div>
                <Skeleton />
                <div className="w-full flex flex-row justify-between items-center">
                  <Skeleton className="w-[100px]" />
                  <Skeleton className="w-[100px]" />
                </div>
              </CardContent>
            </Card>
            <Card className="w-full hover:bg-slate-100">
              <CardContent>
                <div className="w-full flex flex-row juuustify-between items-center">
                  <Skeleton className="w-[100px]" />
                  <Skeleton className="h-[30px] w-[75px]" />
                </div>
                <Skeleton />
                <div  className="w-full flex flex-row justify-between items-center">
                  <Skeleton className="w-[100px]" />
                  <Skeleton className="w-[100px]" />
                </div>
              </CardContent>
            </Card>
            <Card className="w-full hover:bg-slate-100">
              <CardContent>
                <div className="w-full flex flex-row justify-between items-center">
                  <Skeleton className="w-[100px]" />
                  <Skeleton className="h-[30px] w-[75px]" />
                </div>
                <Skeleton />
                <div className="w-full flex flex-row justify-between items-center">
                  <Skeleton className="w-[100px]" />
                  <Skeleton className="w-[100px]" />
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
