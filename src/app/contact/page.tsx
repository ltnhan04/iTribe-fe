"use client";
import { useEffect } from "react";

export default function Contact() {
  useEffect(() => {
    const link = document.createElement("a");
    link.href = "/assets/images/CV_Frontend_Intern_Luong_Tu_Nhan.pdf";
    link.download = "CV_Frontend_Intern_Luong_Tu_Nhan.pdf";
    link.click();
  }, []);

  return (
    <div className="text-center mt-4 text-white">
      <p>My CV</p>
    </div>
  );
}
