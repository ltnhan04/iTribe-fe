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
      <Navbar isFixed={true} />
      <div className="bg-white mt-[88px]">
        <div className="container max-w-7xl mx-auto sm:px-10">
          <div className="w-full px-5 sm:px-0 py-5">{children}</div>
        </div>
      </div>
      <Footer />
    </>
  );
}
