"use client";

import React, { useEffect, useState } from "react";

import ProjectModuleMenu from "./menu-items/Projects";
import SecondBrainModuleMenu from "./menu-items/SecondBrain";
import InvoicesModuleMenu from "./menu-items/Invoices";
import ReportsModuleMenu from "./menu-items/Reports";
import DocumentsModuleMenu from "./menu-items/Documents";
import ChatGPTModuleMenu from "./menu-items/ChatGPT";
import EmployeesModuleMenu from "./menu-items/Employees";
import DataboxModuleMenu from "./menu-items/Databoxes";
import CrmModuleMenu from "./menu-items/Crm";

import AdministrationMenu from "./menu-items/Administration";
import DashboardMenu from "./menu-items/Dashboard";

type Props = {
  modules: any;
};

const ModuleMenu = ({ modules }: Props) => {
  const [open, setOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }  

  //Console logs
  //console.log(modules, "modules");

  return (
    <div className="flex">
      <div
        className={` ${
          open ? "w-72" : "w-20 "
        }  h-screen p-5  pt-8 relative duration-300`}
      >
        <div className="flex gap-x-4 items-center">
          <div
            className={`cursor-pointer duration-500 border rounded-full px-4 py-2 ${
              open && "rotate-[360deg]"
            }`}
            onClick={() => setOpen(!open)}
          >
            HQ
          </div>

          <h1
            className={` origin-left font-medium text-xl duration-200 ${
              !open && "scale-0"
            }`}
          >
            {process.env.NEXT_PUBLIC_APP_NAME}
          </h1>
        </div>
        <div className="pt-6">
          <DashboardMenu open={open} />
          {modules.find(
            (menuItem: any) => menuItem.name === "crm" && menuItem.enabled
          ) ? (
            <CrmModuleMenu open={open} />
          ) : null}
          {modules.find(
            (menuItem: any) => menuItem.name === "projects" && menuItem.enabled
          ) ? (
            <ProjectModuleMenu open={open} />
          ) : null}
          {modules.find(
            (menuItem: any) =>
              menuItem.name === "secondBrain" && menuItem.enabled
          ) ? (
            <SecondBrainModuleMenu open={open} />
          ) : null}
          {modules.find(
            (menuItem: any) => menuItem.name === "employee" && menuItem.enabled
          ) ? (
            <EmployeesModuleMenu open={open} />
          ) : null}
          {modules.find(
            (menuItem: any) => menuItem.name === "invoice" && menuItem.enabled
          ) ? (
            <InvoicesModuleMenu open={open} />
          ) : null}
          {modules.find(
            (menuItem: any) => menuItem.name === "reports" && menuItem.enabled
          ) ? (
            <ReportsModuleMenu open={open} />
          ) : null}
          {modules.find(
            (menuItem: any) => menuItem.name === "documents" && menuItem.enabled
          ) ? (
            <DocumentsModuleMenu open={open} />
          ) : null}
          {modules.find(
            (menuItem: any) => menuItem.name === "databox" && menuItem.enabled
          ) ? (
            <DataboxModuleMenu open={open} />
          ) : null}
          {modules.find(
            (menuItem: any) => menuItem.name === "openai" && menuItem.enabled
          ) ? (
            <ChatGPTModuleMenu open={open} />
          ) : null}
          <AdministrationMenu open={open} />
        </div>
      </div>
    </div>
  );
};

export default ModuleMenu;
