"use client";

import { useEffect } from "react";
// components

import { useRouter } from "next/navigation";
import { useClientContext } from "@/store/me";

export default function Dashboard() {

  const {client,loading} = useClientContext()

  const router = useRouter();

  useEffect(() => {
    if(!loading && client && client.businesses?.length) {

      const idBussinesFirst = client.businesses[0].id
      router.push(`/local/${idBussinesFirst}/floors`)
    }
  },[client,loading])
  if(loading) return  <><p>loading...</p></>
 
}
