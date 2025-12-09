"use client";

import React, { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <p>layout admin </p>
      {children}
    </div>
  );
}
