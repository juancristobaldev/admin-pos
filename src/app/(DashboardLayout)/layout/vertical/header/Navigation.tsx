import { useState } from "react";
import { Box, Menu, Typography, Button, Divider, Grid } from "@mui/material";
import Link from "next/link";
import { IconChevronDown, IconHelp } from "@tabler/icons-react";
import AppLinks from "./AppLinks";
import QuickLinks from "./QuickLinks";
import { useParams, usePathname, useSearchParams } from "next/navigation";

const AppDD = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);

  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const pathname = usePathname();

  const params2 = useParams();

  console.log({ params2 });
  const businessMenu = [
    {
      title: "Plano de Mesas",
      href: `/local/${params2.idLocal}/floors`,
      active: pathname.includes("/tables") && pathname.includes("/local"),
    },
    {
      title: "Inventario",
      href: `/local/${params2.idLocal}/inventory`,
      active: pathname.includes("/inventory") && pathname.includes("/local"),
    },
    {
      title: "Empleados",
      href: `/local/${params2.idLocal}/employees`,
      active: pathname.includes("/employees") && pathname.includes("/local"),
    },
    {
      title: "Productos",
      href: `/local/${params2.idLocal}/products`,
      active: pathname.includes("/products") && pathname.includes("/local"),
    },
    {
      title: "Métricas",
      href: `/local/${params2.idLocal}/metrics`,
      active: pathname.includes("/metrics") && pathname.includes("/local"),
    },
  ];

  // const localsMenu = map de locales

  if (pathname.includes("/local/"))
    return businessMenu.map((item, index) => (
      <Button
        key={index}
        color={item.active ? "primary" : "inherit"}
        sx={{ color: (theme) => theme.palette.text.secondary }}
        variant="text"
        href={item.href}
        component={Link}
      >
        {item.title}
      </Button>
    ));

  return null;
};
/*

        <Menu
          id="msgs-menu"
          anchorEl={anchorEl2}
          keepMounted
          open={Boolean(anchorEl2)}
          onClose={handleClose2}
          anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
          transformOrigin={{ horizontal: "left", vertical: "top" }}
          sx={{
            "& .MuiMenu-paper": {
              width: "850px",
            },
            "& .MuiMenu-paper ul": {
              p: 0,
            },
          }}
        >
          <Grid container>
            <Grid item sm={8} display="flex">
              <Box p={4} pr={0} pb={3}>
                <AppLinks />
                <Divider />
                <Box
                  sx={{
                    display: {
                      xs: "none",
                      sm: "flex",
                    },
                  }}
                  alignItems="center"
                  justifyContent="space-between"
                  pt={2}
                  pr={4}
                >
                  <Link href="/faq">
                    <Typography
                      variant="subtitle2"
                      fontWeight="600"
                      color="textPrimary"
                      display="flex"
                      alignItems="center"
                      gap="4px"
                    >
                      <IconHelp width={24} />
                      Frequently Asked Questions
                    </Typography>
                  </Link>
                  <Button variant="contained" color="primary">
                    Check
                  </Button>
                </Box>
              </Box>
              <Divider orientation="vertical" />
            </Grid>
            <Grid item sm={4}>
              <Box p={4}>
                <QuickLinks />
              </Box>
            </Grid>
          </Grid>
        </Menu>
      </Box>
      <Button
        color="inherit"
        sx={{ color: (theme) => theme.palette.text.secondary }}
        variant="text"
        href="/apps/chats"
        component={Link}
      >
        Chat
      </Button>
      <Button
        color="inherit"
        sx={{ color: (theme) => theme.palette.text.secondary }}
        variant="text"
        href="/apps/calendar"
        component={Link}
      >
        Calendar
      </Button>
      <Button
        color="inherit"
        sx={{ color: (theme) => theme.palette.text.secondary }}
        variant="text"
        href="/apps/email"
        component={Link}
      >
        Email
      </Button>
    </>
  );
*/
export default AppDD;
