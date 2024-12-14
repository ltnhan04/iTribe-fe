import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer";
import { Suspense } from "react";
import Loading from "../loading";

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <Suspense fallback={<Loading />}>{children}</Suspense>
      <Footer />
    </>
  );
}
