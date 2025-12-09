"use client";

import Grid from "@mui/material/Grid";
import PageContainer from "@/app/components/container/PageContainer";

import ProfileBanner from "@/app/components/apps/userprofile/profile/ProfileBanner";
import IntroCard from "@/app/components/apps/userprofile/profile/IntroCard";
import PhotosCard from "@/app/components/apps/userprofile/profile/PhotosCard";
import Post from "@/app/components/apps/userprofile/profile/Post";
import FormHorizontal from "../forms/form-horizontal/page";

const Bussines = () => {
  return (
    <PageContainer title="Profile" description="this is Profile">
      <FormHorizontal />
    </PageContainer>
  );
};

export default Bussines;
