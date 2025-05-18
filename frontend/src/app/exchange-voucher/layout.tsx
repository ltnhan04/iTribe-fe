import React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="bg-white">
        <div className="container max-w-7xl mx-auto sm:px-10">
          <div className="w-full px-5 sm:px-0 py-5">{children}</div>
        </div>
      </div>
    </>
  );
}
