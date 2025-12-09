"use client";
import { useSearchParams } from "next/navigation";

const EditProduct = () => {
  const params = useSearchParams();
  return <>{params.get("id")}</>;
};

export default EditProduct;
