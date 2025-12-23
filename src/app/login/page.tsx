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
              title="Bienvenido a Easy Flow"
              subtext={
             <></>
              }
              subtitle={
                <></>
              }
            />
          </Box>
        </Grid>
      </Grid>
    </PageContainer>
  );
}
