import React from "react";
import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <div className="bg-[#f3f4f6]">{children}</div>
      <Footer />
    </>
  );
}
