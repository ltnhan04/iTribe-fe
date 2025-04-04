import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apple Products | iTribe",
  description: "Khám phá các sản phẩm Apple chính hãng tại iTribe",
};

export default function AppleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="px-44 bg-white">{children}</div>
    </>
  );
}
