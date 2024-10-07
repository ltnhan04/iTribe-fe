import React from "react";
import Footer from "@/components/common/footer";
import Navbar from "@/components/common/navbar";
import Hero from "@/components/common/hero";
import HighLights from "@/components/common/highlights";
import Model from "@/components/common/model";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <HighLights />
      <Model />
      <Footer />
    </div>
  );
}
