"use client";

import PageContainer from "@/app/components/container/PageContainer";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { useClientContext } from "@/store/me";
import { useBusiness } from "@/store/bussines";
import ProductTable from "@/app/components/tables/ProductTable";



const Employees = () => {
  const {business} = useBusiness()


  return (
<ProductTable businessId={business?.id} />
  );
};

export default Employees;
