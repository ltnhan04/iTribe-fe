"use client";

import React, { useEffect } from "react";
import HighLights from "@/components/common/highlights";
import Model from "@/components/common/model";
import Features from "@/components/common/features";
import Camera from "@/components/common/camera";
import Chip from "@/components/common/chip";
import Hero from "@/components/common/hero";
import { useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { updateGoogleAuth } from "@/lib/features/authentication/authSlice";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const name = searchParams.get("name");
    const email = searchParams.get("email");

    if (accessToken && name && email) {
      console.log("Google Auth Data:", { accessToken, name, email });
      dispatch(updateGoogleAuth({ accessToken, name, email }));
      toast({
        title: "Đăng nhập thành công",
        description: `Xin chào ${name}!`,
        variant: "default",
      });
      window.history.replaceState({}, "", "/");
    }
  }, [dispatch, searchParams, toast]);

  return (
    <>
      <Hero />
      <HighLights />
      <Model />
      <Features />
      <Camera />
      <Chip />
    </>
  );
}
