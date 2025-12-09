"use client";

import { BusinessProvider } from "@/store/bussines";
import { useParams } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

const Bussines = (props: Props) => {
  return <BusinessProvider>{props.children}</BusinessProvider>;
};

export default Bussines;
