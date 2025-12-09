"use client";

import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Client Reviews",
  },
];

const ClientReviewsPage = () => {
  return (
    <PageContainer
      title="Client Reviews Page"
      description="this is Client Reviews Page"
    >
      <Breadcrumb title="Client Review Page" items={BCrumb} />
    </PageContainer>
  );
};

export default ClientReviewsPage;
