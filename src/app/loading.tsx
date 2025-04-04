"use client";
import React, { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="absolute inset-0 z-50 bg-black  flex items-center justify-center">
      <Spinner className="text-white" size="large" />
    </div>
  );
}
