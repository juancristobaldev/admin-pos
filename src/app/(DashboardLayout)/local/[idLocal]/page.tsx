'use client'

import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const BCrumb = [
  { to: "/", title: "Inicio" },
  { to: "/local", title: "Locales" },
  { title: "Local" },
];

const LocalId = () => {
  const router = useRouter()
  const params = useParams<{ idLocal: string }>()
  const pathname = usePathname()

  useEffect(() => {

    if(pathname === `/local/${params.idLocal}`)
      router.push(`/local/${params.idLocal}/floors`)
  }, [params])

  return (
    <PageContainer title="Id Local" description="this is Id Local">
      <Breadcrumb title="Id Local" items={BCrumb} />
    </PageContainer>
  );
};

export default LocalId;