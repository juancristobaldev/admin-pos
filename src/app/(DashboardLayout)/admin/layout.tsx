"use client";

import { BusinessProvider } from "@/store/bussines";
import { useClientContext } from "@/store/me";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams()
  const idBusiness = searchParams.get('idBusiness');
  const router = useRouter()
  const {businesses} = useClientContext()

  const pathname = usePathname()

  useEffect(() => {
    if(!idBusiness) router.push(`${pathname}?businessId=${businesses[0]?.id}`)
  },[pathname])


  return (
    <BusinessProvider>
    
      {children}
    </BusinessProvider>
  );
}
