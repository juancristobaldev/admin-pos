"use client";

import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Inventory",
  },
];

const InventoryPage = () => {
  return (
    <PageContainer title="Inventory Page" description="this is Inventory Page">
      <Breadcrumb title="Inventory Page" items={BCrumb} />
    </PageContainer>
  );
};

export default InventoryPage;
