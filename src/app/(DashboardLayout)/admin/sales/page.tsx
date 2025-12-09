"use client";

import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Sales",
  },
];

const SalesPage = () => {
  return (
    <PageContainer title="Sales Page" description="this is Sales Page">
      <Breadcrumb title="Sales Page" items={BCrumb} />
    </PageContainer>
  );
};

export default SalesPage;
