"use client";
import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const BreadCrumb = () => {
  return (
    <nav className="flex items-center space-x-2 mb-6 text-sm">
      <Link href="/" className="text-gray-500 hover:text-gray-800">
        Trang chủ
      </Link>
      <ChevronRight className="h-4 w-4 text-gray-400" />
      <Link href="/apple" className="text-gray-500 hover:text-gray-800">
        Apple
      </Link>
      <ChevronRight className="h-4 w-4 text-gray-400" />
      <span className="text-gray-800 font-medium">Apple Watch</span>
    </nav>
  );
};

export default BreadCrumb;
