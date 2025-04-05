import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apple Watch | iTribe",
  description: "Apple Watch chính hãng Apple tại iTribe",
};

export default function AppleWatchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
} 