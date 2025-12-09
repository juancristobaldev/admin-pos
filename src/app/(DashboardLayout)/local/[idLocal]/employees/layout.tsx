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
import { useBusiness } from "@/store/bussines";

interface Props {
  children: React.ReactElement;
}

const Employees = (props: Props) => {
  const location = usePathname();
  const [value, setValue] = useState(location);

  const { business } = useBusiness();

  const ProfileTabs = [
    {
      label: "Lista",
      icon: <IconUserCircle size="20" />,
      to: `/local/${business?.id}/employees`,
    },
    {
      label: "Crear empleado",
      icon: <IconHeart size="20" />,
      to: `/local/${business?.id}/employees/create`,
    },
    {
      label: "Editar empleado",
      icon: <IconUserCircle size="20" />,
      to: `/local/${business?.id}/employees/edit`,
    },
  ];
  const handleChange = () => {};

  return (
    <PageContainer title="Horizontal Form" description="Empleados">
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        allowScrollButtonsMobile
        aria-label="scrollable prevent tabs example"
      >
        {ProfileTabs.map((tab) => {
          return (
            <Tab
              iconPosition="start"
              label={tab.label}
              sx={{ minHeight: "50px" }}
              icon={tab.icon}
              component={Link}
              href={tab.to}
              value={tab.to}
              key={tab.label}
            />
          );
        })}
      </Tabs>
      {props.children}
    </PageContainer>
  );
};

export default Employees;
