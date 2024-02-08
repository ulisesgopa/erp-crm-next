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
          <div className="hidden items-start justify-center gap-6 rounded-lg p-8 md:grid lg:grid-cols-2 xl:grid-cols-3">
            {data.map((item: any) => (
              <Link className="w-full"
                key={item.id}
                href={`/workflows/detail/${item.id}`}
              >
                <Card className="hover:bg-slate-100">
                  <CardContent className="grid gap-6">
                    <div className="w-full flex flex-row items-end">
                      <span className="text-xl ml-10 mt-10">{item.name}</span>
                      <div>
                        { item.definitionStatus === 'active' ?  
                          <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">{item.definitionStatus}</span> :
                          <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">{item.definitionStatus}</span>
                        }
                      </div>
                    </div>    
                    <span className="text-lg pt-2 w-full">
                      {item.description}
                    </span>
                    <div className="w-full flex flex-row justify-between items-center">
                      <span>
                        <span className="font-medium">Created at: {format(new Date(item.createdAt), 'dd MMM, yyyy')}</span>
                      </span>
                      <span>
                      <span className="font-medium">Updated at: {format(new Date(item.updatedAt), 'dd MMM, yyyy')}</span>
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
