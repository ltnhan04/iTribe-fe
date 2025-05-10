/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "@/types/common";

const withAuth = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    const router = useRouter();
    const accessToken = useAppSelector((state) => state.auth.accessToken);

    useEffect(() => {
      if (!accessToken) {
        router.replace("/login");
        return;
      }

      try {
        const decoded: JwtPayload = jwtDecode<JwtPayload>(accessToken);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded.exp < currentTime) {
          router.replace("/login");
        }
      } catch (error) {
        console.error("Invalid token", error);
        router.replace("/login");
      }
    }, [accessToken, router]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
