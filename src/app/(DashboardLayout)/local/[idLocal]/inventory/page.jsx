"use client";
import { useParams, usePathname } from "next/navigation";

import ProductTable from "@/app/components/tables/ProductTable";

const TablesPlane = () => {
  const params = useParams();
  const location = usePathname();

  return <ProductTable businessId={params.idLocal} />;
};

export default TablesPlane;
