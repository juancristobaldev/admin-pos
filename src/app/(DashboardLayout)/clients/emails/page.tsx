"use client";

import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Client Emails",
  },
];

const ClientEmailsPage = () => {
  return (
    <PageContainer
      title="Client Emails Page"
      description="this is Client Emails Page"
    >
      <Breadcrumb title="Client Emails Page" items={BCrumb} />
    </PageContainer>
  );
};

export default ClientEmailsPage;
