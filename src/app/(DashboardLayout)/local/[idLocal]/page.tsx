"use client";

import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";

const BCrumb = [
  {
    to: "/",
    title: "Inicio",
  },
  {
    to: "/local",
    title: "Locales",
  },
  {
    title: "Local",
  },
];

const LocalId = () => {
  return (
    <PageContainer title="Id Local" description="this is Id Local">
      <Breadcrumb title="Id Local" items={BCrumb} />
    </PageContainer>
  );
};

export default LocalId;
