"use client";

import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Admin",
  },
];

const AdminPage = () => {
  return (
    <PageContainer title="Admin" description="this is Admin">
      <Breadcrumb title="Admin" items={BCrumb} />
    </PageContainer>
  );
};

export default AdminPage;
