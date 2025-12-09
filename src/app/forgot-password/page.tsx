"use client";

import { Grid, Box, Typography } from "@mui/material";
import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";
import PageContainer from "@/app/components/container/PageContainer";
import Image from "next/image";
import AuthForgotPassword from "../auth/authForms/AuthForgotPassword";

export default function ForgotPassword() {
  return (
    <PageContainer
      title="Forgot Password Page"
      description="this is Sample page"
    >
      <Grid
        container
        justifyContent="center"
        spacing={0}
        sx={{ overflowX: "hidden" }}
      >
        <Grid
          item
          xs={12}
          sm={12}
          lg={4}
          xl={3}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Box p={4}>
            <Typography variant="h4" fontWeight="700">
              Forgot your password?
            </Typography>

            <Typography
              color="textSecondary"
              variant="subtitle2"
              fontWeight="400"
              mt={2}
            >
              Please enter the email address associated with your account and We
              will email you a link to reset your password.
            </Typography>
            <AuthForgotPassword />
          </Box>
        </Grid>
      </Grid>
    </PageContainer>
  );
}
