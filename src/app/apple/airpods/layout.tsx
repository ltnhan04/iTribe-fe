import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AirPods | iTribe",
  description: "AirPods chính hãng Apple tại iTribe",
};

export default function AirPodsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
} 