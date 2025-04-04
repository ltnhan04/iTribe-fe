import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "iPad | iTribe",
  description: "iPad chính hãng Apple tại iTribe",
};

export default function IPadLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
} 