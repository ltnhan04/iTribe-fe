import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "iPhone | iTribe",
  description: "iPhone chính hãng Apple tại iTribe",
};

export default function IPhoneLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
} 