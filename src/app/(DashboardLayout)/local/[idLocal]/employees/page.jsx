"use client";

import { Grid, Typography } from "@mui/material";

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { IconHeart, IconPhoto, IconUserCircle } from "@tabler/icons-react";
// components

import PageContainer from "@/app/components/container/PageContainer";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import EmployeesCard from "@/app/components/tables/EmployeesTable";
import BlankCard from "@/app/components/shared/BlankCard";

const ProfileTabs = [
  {
    label: "Lista",
    icon: <IconUserCircle size="20" />,
    to: "/employees/list",
  },
  {
    label: "Crear empleado",
    icon: <IconHeart size="20" />,
    to: "/employees/create-employee",
  },
  {
    label: "Editar empleado",
    icon: <IconUserCircle size="20" />,
    to: "/employees/edit-employee",
  },
];

const Employees = () => {


  return (
    <BlankCard className="mt-4">
      <EmployeesCard />
    </BlankCard>
  );
};

export default Employees;
