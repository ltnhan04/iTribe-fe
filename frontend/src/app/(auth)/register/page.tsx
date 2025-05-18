import React from "react";
import Link from "next/link";
import RegisterForm from "@/app/(auth)/register/register-form";
import Image from "next/image";

export default function Register() {
  return (
    <div className="h-screen flex items-center justify-center bg-[#f3f4f6]">
      <div className="max-w-4xl w-full mx-auto p-8 md:p-12 bg-white border-[#d1d5db] rounded-xl shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex items-center justify-center">
            <Image
              src={"https://www.allen.ac.in/ace2324/assets/images/register.png"}
              width={400}
              height={400}
              alt="Image"
              quality={100}
              priority={true}
              className="w-1/2 md:w-full"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-center text-primary mb-3">
              Đăng Ký
            </h1>
            <p className="text-center text-gray-600 font-medium mb-6">
              Tạo tài khoản của bạn ngay hôm nay!
            </p>
            <div>
              <RegisterForm />
              <h1 className="text-sm text-center mt-5 font-semibold text-gray">
                Bạn đã có tài khoản?
                <Link
                  className="text-primary ml-1 hover:underline transition-colors duration-200 ease-out"
                  href="/login"
                >
                  Đăng nhập
                </Link>
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
