"use client";
import Link from "next/link";
import { Grid, Box, Typography, Stack } from "@mui/material";
import PageContainer from "@/app/components/container/PageContainer";
import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";

import Image from "next/image";
import AuthRegister from "../auth/authForms/AuthRegister";
import { gql, useMutation } from "@apollo/client";
/*
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
              title="Welcome to Modernize"
              subtext={
                <Typography
                  className="text-center"
                  variant="subtitle1"
                  color="textSecondary"
                  mb={1}
                >
                  Your Admin Dashboard
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
                    New to Modernize?
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
                    Create an account
                  </Typography>
                </Stack>
              }
            />
          </Box>
        </Grid>
      </Grid>




      */

export default function Register() {
  return (
    <PageContainer title="Register Page" description="this is Sample page">
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
            <AuthRegister
              title="Welcome to Modernize"
              subtext={
                <Typography variant="subtitle1" color="textSecondary" mb={1}>
                  Your Admin Dashboard
                </Typography>
              }
              subtitle={
                <Stack direction="row" spacing={1} mt={3}>
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    fontWeight="400"
                  >
                    Already have an Account?
                  </Typography>
                  <Typography
                    component={Link}
                    href="/login"
                    fontWeight="500"
                    sx={{
                      textDecoration: "none",
                      color: "primary.main",
                    }}
                  >
                    Sign In
                  </Typography>
                </Stack>
              }
            />
          </Box>
        </Grid>
      </Grid>
      {/*
      <Box className="max-w-[600px] mx-auto" p={4}>
  
      </Box>
 */}
    </PageContainer>
  );
}
