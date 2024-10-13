"use client";
import React from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
interface InputOTPProps {
  getOTP: (otp: string) => void;
}
export default function InputOTPPattern({ getOTP }: InputOTPProps) {
  const handleChangeOTP = (otp: string) => {
    getOTP(otp);
    console.log(otp);
  };
  return (
    <InputOTP
      maxLength={6}
      onChange={handleChangeOTP}
      pattern={REGEXP_ONLY_DIGITS}
    >
      <InputOTPGroup>
        {Array.from({ length: 6 }, (_, i) => (
          <InputOTPSlot
            key={i}
            index={i}
            className="text-gray-500 border-gray-400 focus:outline-none w-10"
          />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
