"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "@/types/common";
import { useProfile } from "./useProfile";

export const useAuth = () => {
  const router = useRouter();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { profile, isLoading: isLoadingProfile } = useProfile();

  useEffect(() => {
    const validateToken = () => {
      if (!accessToken) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const decoded: JwtPayload = jwtDecode<JwtPayload>(accessToken);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded.exp < currentTime) {
          setIsAuthenticated(false);
          router.replace("/login");
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Invalid token", error);
        setIsAuthenticated(false);
        router.replace("/login");
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [accessToken, router]);

  const logout = () => {
    // Implement logout logic here
    setIsAuthenticated(false);
    router.replace("/login");
  };

  return {
    user: profile,
    isAuthenticated,
    isLoading: isLoading || isLoadingProfile,
    logout,
  };
};
