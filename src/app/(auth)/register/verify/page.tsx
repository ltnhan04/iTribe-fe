"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import InputOTPPattern from "@/components/common/input-otp";

export default function VerifyRegister() {
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [counter, setCounter] = useState<number>(60);
  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      setEmail(email);
    }
  }, []);
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (otp.length === 6) {
      timer = setInterval(() => {
        setCounter((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otp]);

  const handleChangeOTP = (otp: string) => {
    setOtp(otp);
  };

  const handleResendOTP = () => {
    setCounter(60);
    setOtp("");
    //Call API
  };
  return (
    <div className="h-screen flex items-center justify-center bg-[#f3f4f6]">
      <div className="max-w-4xl w-full mx-auto p-8 md:p-12 bg-white border-[#d1d5db] rounded-xl shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex items-center justify-center">
            <Image
              src={"/assets/images/two-factor-authentication.jpg"}
              width={400}
              height={400}
              alt="Image"
              quality={100}
              priority={true}
            />
          </div>
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold text-center text-primary mb-3">
              Xác thực tài khoản
            </h1>
            <p className="text-center text-gray-600 font-medium mb-6">
              Mã OTP đã được gửi đến{" "}
              <span className="text-[#0D99FF]">{email}</span>
            </p>
            <InputOTPPattern getOTP={handleChangeOTP} />

            {otp.length === 6 && (
              <p className="text-center text-gray-600 mt-4">
                Mã OTP sẽ hết hạn sau{" "}
                <span className="text-[#0D99FF] font-bold">{counter}s</span>
              </p>
            )}
            {counter === 0 && (
              <div
                onClick={handleResendOTP}
                className="text-sm w-full max-w-60 cursor-pointer text-right py-2 text-primary hover:underline transition-colors duration-300 ease-in-out font-normal"
              >
                Gửi lại mã OTP
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
