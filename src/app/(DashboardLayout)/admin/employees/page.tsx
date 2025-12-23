"use client";

// components

import PageContainer from "@/app/components/container/PageContainer";

import EmployeesCard from "@/app/components/tables/EmployeesTable";



const Employees = () => {

  return (
    <PageContainer title="Horizontal Form" description="Empleados">
      <EmployeesCard></EmployeesCard>
    </PageContainer>
  );
};

export default Employees;
