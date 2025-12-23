"use client";

import { Grid, Typography } from "@mui/material";

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { IconHeart, IconPhoto, IconUserCircle } from "@tabler/icons-react";
// components

import PageContainer from "@/app/components/container/PageContainer";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

import { useBusiness } from "@/store/bussines";

const TablesPlane = ({ children }: { children: React.ReactElement }) => {
  const { business } = useBusiness();

  const location = usePathname();
  const [value, setValue] = useState(location);



  const ProfileTabs = [
    {
      label: "Lista",
      icon: <IconUserCircle size="20" />,
      to: `/local/${business?.id}/inventory`,
      disabled: false,
    },
    {
      label: "Crear producto",
      icon: <IconHeart size="20" />,
      to: `/local/${business?.id}/inventory/create`,
      disabled: false,
    },
/**
 * 
 *     {
      label: "Editar producto",
      icon: <IconHeart size="20" />,
      to: `/local/${business?.id}/inventory/edit`,
      disabled: false,
    },
 */
  ];

  return (
    <PageContainer title="Horizontal Form" description="Inventario">
      {!location.includes("edit") ? (
        <Tabs
          value={value}
         
          variant="scrollable"
          allowScrollButtonsMobile
          aria-label="scrollable prevent tabs example"
        >
          {ProfileTabs.map((tab) => {
            return (
              <Tab
                onClick={( ) => {
                  console.log(tab)
                  setValue(tab.to)
                }
                }
                iconPosition="start"
                label={tab.label}
                sx={{ minHeight: "50px" }}
                icon={tab.icon}
                component={Link}
                disabled={tab.disabled}
                href={tab.to}
                value={tab.to}
                key={tab.label}
              />
            );
          })}
        </Tabs>
      ) : (
        <></>
      )}
      {children}
    </PageContainer>
  );
};

export default TablesPlane;
