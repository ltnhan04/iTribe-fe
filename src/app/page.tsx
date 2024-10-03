import React from "react";
import Footer from "@/components/common/footer";
import Navbar from "@/components/common/navbar";
import Hero from "@/components/common/hero";

export default function Home() {
  return (
    <div className="container max-w-7xl mx-auto sm:px-5">
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
}
