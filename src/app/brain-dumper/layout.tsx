// @ts-nocheck
import * as React from "react";
import { Toaster } from "@/components/ui/toaster";

export default function BrainDumperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
} 