"use client";
import UpdateProductForm from "@/app/components/forms/UpdateProduct";
import { gql } from "@apollo/client";



import { useSearchParams } from "next/navigation";

const EditProduct = () => {
  const params = useSearchParams();

  return  (
    <UpdateProductForm productId={params.get('id')}></UpdateProductForm>
  )

};

export default EditProduct;
