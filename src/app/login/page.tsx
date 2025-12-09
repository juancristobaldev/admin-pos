"use client";
import Link from "next/link";
import { Grid, Box, Stack, Typography } from "@mui/material";
import PageContainer from "@/app/components/container/PageContainer";
import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";

import Image from "next/image";
import AuthLogin from "@/app/auth/authForms/AuthLogin";

export default function Login() {
  return (
    <PageContainer title="Login Page" description="this is Sample page">
      <Grid
        container
        spacing={0}
        justifyContent="center"
        sx={{ height: "100vh" }}
      >
        <Grid
          item
          xs={12}
          sm={12}
          lg={5}
          xl={4}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Box p={4}>
            <AuthLogin
              title="Bienvenido a Modernize"
              subtext={
                <Typography
                  className="text-center"
                  variant="subtitle1"
                  color="textSecondary"
                  mb={1}
                >
                  Sección Administrador
                </Typography>
              }
              subtitle={
                <Stack direction="row" spacing={1} mt={3}>
                  <Typography
                    className="text-center"
                    color="textSecondary"
                    variant="h6"
                    fontWeight="500"
                  >
                    ¿Eres nuevo?
                  </Typography>
                  <Typography
                    component={Link}
                    href="/register"
                    fontWeight="500"
                    sx={{
                      textDecoration: "none",
                      color: "primary.main",
                    }}
                  >
                    Crear una cuenta
                  </Typography>
                </Stack>
              }
            />
          </Box>
        </Grid>
      </Grid>
    </PageContainer>
  );
}
