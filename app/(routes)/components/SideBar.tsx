import { getModules } from "@/actions/get-modules";
import { useState } from "react";
import ModuleMenu from "./ModuleMenu";

type Props = {
  foo: number;
};

const SideBar = (async ({}: Props) => {
  const modules = await getModules();

  return (<ModuleMenu modules={modules} />);
}) as unknown as (props: Props) => JSX.Element;

export default SideBar;

