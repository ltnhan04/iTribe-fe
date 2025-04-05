import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MacBook | iTribe",
  description: "MacBook chính hãng Apple tại iTribe",
};

export default function MacBookLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
} 